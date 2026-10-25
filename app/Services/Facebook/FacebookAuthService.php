<?php

namespace App\Services\Facebook;

use App\Models\FacebookAccount;
use App\Models\FacebookPage;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookAuthService
{
    public const SCOPES = [
        'public_profile',
        'email',
        'pages_show_list',
        'pages_read_engagement',
        'pages_manage_posts',
        'pages_read_user_content',
    ];

    protected string $clientId;
    protected string $clientSecret;
    protected string $redirectUri;
    protected string $graphVersion;

    public function __construct()
    {
        $this->clientId = (string) config('services.facebook.client_id');
        $this->clientSecret = (string) config('services.facebook.client_secret');
        $this->redirectUri = (string) (config('services.facebook.redirect_uri') ?: url('/auth/facebook/callback'));
        $this->graphVersion = (string) config('services.facebook.graph_version', 'v20.0');
    }

    public function isConfigured(): bool
    {
        return !empty($this->clientId) && !empty($this->clientSecret);
    }

    /**
     * Generate the Meta OAuth 2.0 authorization URL.
     */
    public function getAuthorizationUrl(?string $redirectUri = null, ?string $stateParam = null): string
    {
        if (!$this->isConfigured()) {
            throw new Exception("Facebook App ID or App Secret is not configured in services.facebook.");
        }

        $redirect = $redirectUri ?: $this->redirectUri;
        $state = $stateParam ?: ('fb_auth:' . (auth()->check() ? encrypt(auth()->id()) : csrf_token()));

        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $redirect,
            'state' => $state,
            'scope' => implode(',', self::SCOPES),
            'response_type' => 'code',
            'auth_type' => 'rerequest',
        ];

        return "https://www.facebook.com/{$this->graphVersion}/dialog/oauth?" . http_build_query($params);
    }

    /**
     * Exchange OAuth code for long-lived user token and store account & pages.
     */
    public function handleCallback(string $code, ?string $redirectUri = null, ?User $user = null): FacebookAccount
    {
        $redirect = $redirectUri ?: $this->redirectUri;

        // 1. Get short-lived user access token
        $tokenResponse = Http::withoutVerifying()
            ->timeout(20)
            ->get("https://graph.facebook.com/{$this->graphVersion}/oauth/access_token", [
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'redirect_uri' => $redirect,
                'code' => $code,
            ]);

        if (!$tokenResponse->successful()) {
            $err = $tokenResponse->json('error.message') ?: $tokenResponse->body();
            Log::error('Facebook OAuth Code Exchange Failed: ' . $err);
            throw new Exception("Facebook OAuth exchange failed: {$err}");
        }

        $shortLivedToken = $tokenResponse->json('access_token');

        // 2. Upgrade to 60-day long-lived token
        $longLivedToken = $this->exchangeForLongLivedToken($shortLivedToken);

        // 3. Fetch User Profile
        $meResponse = Http::withoutVerifying()
            ->timeout(20)
            ->get("https://graph.facebook.com/{$this->graphVersion}/me", [
                'fields' => 'id,name,email,picture.type(large)',
                'access_token' => $longLivedToken['access_token'],
            ]);

        if (!$meResponse->successful()) {
            throw new Exception("Failed to fetch Facebook user profile: " . $meResponse->body());
        }

        $me = $meResponse->json();
        $fbUserId = $me['id'];
        $name = $me['name'] ?? 'Facebook User';
        $email = $me['email'] ?? null;
        $avatar = $me['picture']['data']['url'] ?? null;

        $targetUser = $user ?: auth()->user();

        // 4. Update or Create FacebookAccount
        $account = FacebookAccount::updateOrCreate(
            ['fb_user_id' => $fbUserId],
            [
                'user_id' => $targetUser?->id,
                'name' => $name,
                'email' => $email,
                'avatar' => $avatar,
                'user_access_token' => $longLivedToken['access_token'],
                'token_expires_at' => $longLivedToken['expires_at'],
                'is_active' => true,
            ]
        );

        // 5. Synchronize all managed Facebook Pages with permanent page tokens
        $this->syncManagedPages($account);

        return $account;
    }

    /**
     * Exchange short-lived token for long-lived 60-day token.
     */
    public function exchangeForLongLivedToken(string $shortLivedToken): array
    {
        $response = Http::withoutVerifying()
            ->timeout(20)
            ->get("https://graph.facebook.com/{$this->graphVersion}/oauth/access_token", [
                'grant_type' => 'fb_exchange_token',
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
                'fb_exchange_token' => $shortLivedToken,
            ]);

        if ($response->successful()) {
            $data = $response->json();
            $expiresIn = $data['expires_in'] ?? (60 * 86400); // Default 60 days
            return [
                'access_token' => $data['access_token'],
                'expires_at' => Carbon::now()->addSeconds($expiresIn),
            ];
        }

        // Fallback to short-lived if exchange is denied
        return [
            'access_token' => $shortLivedToken,
            'expires_at' => Carbon::now()->addHours(2),
        ];
    }

    /**
     * Fetch all pages managed by this Facebook Account and store them.
     */
    public function syncManagedPages(FacebookAccount $account): array
    {
        $response = Http::withoutVerifying()
            ->timeout(25)
            ->get("https://graph.facebook.com/{$this->graphVersion}/me/accounts", [
                'fields' => 'id,name,category,access_token,picture{url},fan_count,followers_count',
                'access_token' => $account->user_access_token,
                'limit' => 100,
            ]);

        if (!$response->successful()) {
            Log::warning("Failed to sync Facebook Pages for account {$account->id}: " . $response->body());
            return [];
        }

        $pagesData = $response->json('data') ?? [];
        $syncedPages = [];

        foreach ($pagesData as $index => $page) {
            $pageId = (string) $page['id'];
            $pageName = (string) $page['name'];
            $pageAccessToken = (string) ($page['access_token'] ?? '');
            $category = $page['category'] ?? 'Education';
            $pictureUrl = $page['picture']['data']['url'] ?? null;
            $fanCount = (int) ($page['fan_count'] ?? 0);
            $followersCount = (int) ($page['followers_count'] ?? 0);

            // Is there already a default page?
            $hasExistingDefault = FacebookPage::where('facebook_account_id', $account->id)
                ->where('is_default', true)
                ->exists();

            $fbPage = FacebookPage::updateOrCreate(
                ['page_id' => $pageId],
                [
                    'facebook_account_id' => $account->id,
                    'name' => $pageName,
                    'category' => $category,
                    'page_access_token' => $pageAccessToken,
                    'picture_url' => $pictureUrl,
                    'fan_count' => $fanCount,
                    'followers_count' => $followersCount,
                    'is_default' => !$hasExistingDefault && $index === 0,
                    'auto_publish_enabled' => true,
                ]
            );

            $syncedPages[] = $fbPage;
        }

        return $syncedPages;
    }
}
