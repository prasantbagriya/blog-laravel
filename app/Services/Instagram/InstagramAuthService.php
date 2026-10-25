<?php

namespace App\Services\Instagram;

use App\Models\InstagramAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class InstagramAuthService
{
    protected ?string $appId;
    protected ?string $appSecret;
    protected ?string $redirectUri;
    protected string $graphVersion;

    public function __construct()
    {
        $this->appId = config('services.instagram.client_id');
        $this->appSecret = config('services.instagram.client_secret');
        $this->redirectUri = config('services.instagram.redirect_uri', url('/auth/instagram/callback'));
        $this->graphVersion = config('services.instagram.graph_version', 'v21.0');
    }

    /**
     * Check if Meta/Instagram app is configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->appId) && !empty($this->appSecret);
    }

    /**
     * Check if we are using Direct Instagram App ID (e.g. 1672247183936194)
     */
    public function isDirectInstagramApp(): bool
    {
        return !empty($this->appId) && ($this->appId === '1672247183936194' || !empty(env('INSTAGRAM_APP_SECRET')));
    }

    /**
     * Generate OAuth Login URL requesting Instagram Business permissions.
     */
    public function getAuthorizationUrl(): string
    {
        if (!$this->isConfigured()) {
            throw new Exception("Meta/Facebook App ID or Secret is not configured.");
        }

        $state = Str::random(40);
        Session::put('instagram_oauth_state', $state);

        // When using Instagram App ID directly (e.g. PCP Sikar - IG: 1672247183936194)
        if ($this->isDirectInstagramApp()) {
            $params = [
                'enable_fb_login' => '0',
                'force_authentication' => '1',
                'client_id' => $this->appId,
                'redirect_uri' => $this->redirectUri,
                'response_type' => 'code',
                'scope' => 'instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish',
                'state' => $state,
            ];

            return "https://www.instagram.com/oauth/authorize?" . http_build_query($params);
        }

        // Facebook Dialog OAuth (Uses Facebook/Meta App ID)
        $fbAppId = config('services.facebook.client_id') ?: $this->appId;
        $params = [
            'client_id' => $fbAppId,
            'redirect_uri' => $this->redirectUri,
            'state' => $state,
            'response_type' => 'code',
            'scope' => 'instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement',
        ];

        return "https://www.facebook.com/{$this->graphVersion}/dialog/oauth?" . http_build_query($params);
    }

    /**
     * Handle OAuth callback: exchange code, fetch linked Instagram Business account and save.
     */
    public function handleCallback(string $code, string $state): InstagramAccount
    {
        $savedState = Session::pull('instagram_oauth_state');

        // Mode 1: Direct Instagram OAuth (api.instagram.com)
        if ($this->isDirectInstagramApp()) {
            try {
                $tokenResponse = Http::asForm()->timeout(15)->post("https://api.instagram.com/oauth/access_token", [
                    'client_id' => $this->appId,
                    'client_secret' => $this->appSecret,
                    'grant_type' => 'authorization_code',
                    'redirect_uri' => $this->redirectUri,
                    'code' => $code,
                ]);

                if ($tokenResponse->successful()) {
                    $shortUserToken = $tokenResponse->json('access_token');
                    $userId = (string) $tokenResponse->json('user_id');

                    // Exchange for 60-day Long-Lived Token
                    $longTokenResponse = Http::timeout(15)->get("https://graph.instagram.com/access_token", [
                        'grant_type' => 'ig_exchange_token',
                        'client_secret' => $this->appSecret,
                        'access_token' => $shortUserToken,
                    ]);

                    $longUserToken = $longTokenResponse->successful()
                        ? ($longTokenResponse->json('access_token') ?: $shortUserToken)
                        : $shortUserToken;

                    // Query Instagram profile info
                    $meResponse = Http::timeout(15)->get("https://graph.instagram.com/v21.0/me", [
                        'fields' => 'user_id,username,name,profile_picture_url',
                        'access_token' => $longUserToken,
                    ]);

                    $me = $meResponse->successful() ? $meResponse->json() : [];

                    return InstagramAccount::updateOrCreate(
                        ['instagram_business_id' => (string) ($me['user_id'] ?? ($me['id'] ?? $userId))],
                        [
                            'user_id' => auth()->id(),
                            'username' => $me['username'] ?? 'pcp_sikar',
                            'name' => $me['name'] ?? ($me['username'] ?? 'PCP Sikar - IG'),
                            'profile_picture_url' => $me['profile_picture_url'] ?? null,
                            'access_token' => $longUserToken,
                            'token_expires_at' => now()->addDays(60),
                            'is_active' => true,
                        ]
                    );
                }
            } catch (\Throwable $e) {
                Log::warning('Direct Instagram token exchange failed, falling back to Facebook Graph: ' . $e->getMessage());
            }
        }

        // Mode 2: Facebook Graph API exchange
        $fbAppId = config('services.facebook.client_id') ?: $this->appId;
        $fbAppSecret = config('services.facebook.client_secret') ?: $this->appSecret;

        $tokenResponse = Http::timeout(15)->get("https://graph.facebook.com/{$this->graphVersion}/oauth/access_token", [
            'client_id' => $fbAppId,
            'client_secret' => $fbAppSecret,
            'redirect_uri' => $this->redirectUri,
            'code' => $code,
        ]);

        if (!$tokenResponse->successful()) {
            $err = $tokenResponse->json('error.message') ?: $tokenResponse->body();
            Log::error('Instagram OAuth token exchange failed: ' . $err);
            throw new Exception("Token exchange failed: " . $err);
        }

        $shortUserToken = $tokenResponse->json('access_token');

        // 2. Exchange for 60-day Long-Lived User Token
        $longTokenResponse = Http::timeout(15)->get("https://graph.facebook.com/{$this->graphVersion}/oauth/access_token", [
            'grant_type' => 'fb_exchange_token',
            'client_id' => $fbAppId,
            'client_secret' => $fbAppSecret,
            'fb_exchange_token' => $shortUserToken,
        ]);

        $longUserToken = $longTokenResponse->successful()
            ? ($longTokenResponse->json('access_token') ?: $shortUserToken)
            : $shortUserToken;

        // 3. Query Facebook Pages to find linked Instagram Business Accounts
        $accountsResponse = Http::timeout(15)->get("https://graph.facebook.com/{$this->graphVersion}/me/accounts", [
            'fields' => 'id,name,access_token,instagram_business_account{id,username,name,profile_picture_url,biography,followers_count,media_count}',
            'access_token' => $longUserToken,
        ]);

        if (!$accountsResponse->successful()) {
            $err = $accountsResponse->json('error.message') ?: $accountsResponse->body();
            throw new Exception("Failed to fetch connected accounts from Meta: " . $err);
        }

        $pages = $accountsResponse->json('data', []);
        $foundAccount = null;

        foreach ($pages as $page) {
            if (!empty($page['instagram_business_account'])) {
                $ig = $page['instagram_business_account'];
                $pageAccessToken = $page['access_token'] ?? $longUserToken;

                $foundAccount = InstagramAccount::updateOrCreate(
                    ['instagram_business_id' => $ig['id']],
                    [
                        'user_id' => auth()->id(),
                        'facebook_page_id' => $page['id'],
                        'username' => $ig['username'] ?? 'instagram_business',
                        'name' => $ig['name'] ?? ($ig['username'] ?? 'Instagram Business'),
                        'profile_picture_url' => $ig['profile_picture_url'] ?? null,
                        'bio' => $ig['biography'] ?? null,
                        'followers_count' => (int) ($ig['followers_count'] ?? 0),
                        'media_count' => (int) ($ig['media_count'] ?? 0),
                        'access_token' => $pageAccessToken,
                        'token_expires_at' => now()->addDays(60),
                        'is_active' => true,
                    ]
                );
                break;
            }
        }

        if (!$foundAccount) {
            throw new Exception("No Instagram Professional/Business account found linked to your Facebook Pages. Please link your Instagram account to your Facebook Page first.");
        }

        return $foundAccount;
    }

    /**
     * Refresh Instagram profile metrics (followers, bio, avatar).
     */
    public function syncProfile(InstagramAccount $account): InstagramAccount
    {
        $response = Http::timeout(15)->get("https://graph.facebook.com/{$this->graphVersion}/{$account->instagram_business_id}", [
            'fields' => 'id,username,name,profile_picture_url,biography,followers_count,media_count',
            'access_token' => $account->access_token,
        ]);

        if ($response->successful()) {
            $data = $response->json();
            $account->update([
                'username' => $data['username'] ?? $account->username,
                'name' => $data['name'] ?? $account->name,
                'profile_picture_url' => $data['profile_picture_url'] ?? $account->profile_picture_url,
                'bio' => $data['biography'] ?? $account->bio,
                'followers_count' => (int) ($data['followers_count'] ?? $account->followers_count),
                'media_count' => (int) ($data['media_count'] ?? $account->media_count),
            ]);
        }

        return $account;
    }
}
