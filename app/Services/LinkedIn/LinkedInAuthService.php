<?php

namespace App\Services\LinkedIn;

use App\Models\LinkedInAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class LinkedInAuthService
{
    protected ?string $clientId;
    protected ?string $clientSecret;
    protected ?string $redirectUri;

    public function __construct()
    {
        $this->clientId = config('services.linkedin.client_id');
        $this->clientSecret = config('services.linkedin.client_secret');
        $this->redirectUri = config('services.linkedin.redirect_uri', url('/auth/linkedin/callback'));
    }

    /**
     * Check if LinkedIn App credentials are configured.
     */
    public function isConfigured(): bool
    {
        return !empty($this->clientId) && !empty($this->clientSecret);
    }

    /**
     * Generate OAuth 2.0 Authorization URL requesting OpenID and Sharing permissions.
     */
    public function getAuthorizationUrl(): string
    {
        if (!$this->isConfigured()) {
            throw new Exception("LinkedIn Client ID or Client Secret is not configured.");
        }

        $state = Str::random(40);
        Session::put('linkedin_oauth_state', $state);

        $params = [
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'state' => $state,
            'scope' => 'openid profile email w_member_social w_organization_social r_organization_social',
        ];

        return 'https://www.linkedin.com/oauth/v2/authorization?' . http_build_query($params);
    }

    /**
     * Exchange authorization code for access token and fetch user profile.
     */
    public function handleCallback(string $code, string $state): LinkedInAccount
    {
        $savedState = Session::pull('linkedin_oauth_state');

        $response = Http::asForm()
            ->timeout(15)
            ->post('https://www.linkedin.com/oauth/v2/accessToken', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $this->redirectUri,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]);

        if (!$response->successful()) {
            $err = $response->json('error_description') ?: ($response->json('error') ?: $response->body());
            Log::error('LinkedIn token exchange error: ' . $err);
            throw new Exception("LinkedIn token exchange failed: " . $err);
        }

        $tokenData = $response->json();
        $accessToken = $tokenData['access_token'];
        $expiresIn = $tokenData['expires_in'] ?? 5184000; // 60 days
        $refreshToken = $tokenData['refresh_token'] ?? null;

        return $this->syncUserFromToken($accessToken, $refreshToken, $expiresIn);
    }

    /**
     * Sync authenticated LinkedIn member profile via /v2/userinfo (OpenID Connect).
     */
    public function syncUserFromToken(string $accessToken, ?string $refreshToken = null, int $expiresIn = 5184000): LinkedInAccount
    {
        $response = Http::withToken($accessToken)
            ->timeout(15)
            ->get('https://api.linkedin.com/v2/userinfo');

        if (!$response->successful()) {
            $err = $response->json('message') ?: $response->body();
            Log::error('LinkedIn userinfo fetch failed: ' . $err);
            throw new Exception("Failed to retrieve LinkedIn member info: " . $err);
        }

        $user = $response->json();
        $sub = $user['sub'] ?? '';
        $personUrn = str_starts_with($sub, 'urn:li:person:') ? $sub : "urn:li:person:{$sub}";
        $name = $user['name'] ?? trim(($user['given_name'] ?? '') . ' ' . ($user['family_name'] ?? ''));

        $account = LinkedInAccount::updateOrCreate(
            ['linkedin_person_id' => $personUrn],
            [
                'user_id' => auth()->id(),
                'name' => $name ?: 'LinkedIn Member',
                'given_name' => $user['given_name'] ?? null,
                'family_name' => $user['family_name'] ?? null,
                'email' => $user['email'] ?? null,
                'profile_picture_url' => $user['picture'] ?? null,
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'token_expires_at' => now()->addSeconds($expiresIn),
                'is_active' => true,
            ]
        );

        // Preserve permanently saved organization settings if configured
        $savedOrgId = config('services.linkedin.organization_id') ?: env('LINKEDIN_ORGANIZATION_ID');
        $savedOrgName = config('services.linkedin.organization_name', 'Coachings in Sikar');
        if (!empty($savedOrgId)) {
            $account->update([
                'organization_id' => $savedOrgId,
                'organization_name' => $savedOrgName,
                'post_as' => 'organization',
            ]);
        }

        // Auto-discover managed LinkedIn Organization / Company Pages
        try {
            $orgResponse = Http::withToken($accessToken)
                ->timeout(10)
                ->withHeaders(['X-Restli-Protocol-Version' => '2.0.0'])
                ->get('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee');

            if ($orgResponse->successful()) {
                $elements = $orgResponse->json('elements', []);
                foreach ($elements as $el) {
                    $targetUrn = $el['organizationalTarget'] ?? '';
                    if (!empty($targetUrn) && str_contains($targetUrn, 'urn:li:organization:')) {
                        $orgId = str_replace('urn:li:organization:', '', $targetUrn);
                        $detailsRes = Http::withToken($accessToken)
                            ->timeout(10)
                            ->get("https://api.linkedin.com/v2/organizations/{$orgId}");

                        if ($detailsRes->successful()) {
                            $orgData = $detailsRes->json();
                            $account->update([
                                'organization_id' => $targetUrn,
                                'organization_name' => $orgData['localizedName'] ?? 'LinkedIn Company Page',
                                'organization_vanity_name' => $orgData['vanityName'] ?? null,
                                'post_as' => 'organization',
                            ]);
                            break;
                        }
                    }
                }
            }
        } catch (\Throwable $e) {
            Log::warning('LinkedIn organization discovery skipped: ' . $e->getMessage());
        }

        return $account;
    }

    /**
     * Refresh OAuth token if refresh token is present.
     */
    public function refreshToken(LinkedInAccount $account): string
    {
        if (empty($account->refresh_token)) {
            return (string) $account->access_token;
        }

        $response = Http::asForm()
            ->timeout(15)
            ->post('https://www.linkedin.com/oauth/v2/accessToken', [
                'grant_type' => 'refresh_token',
                'refresh_token' => $account->refresh_token,
                'client_id' => $this->clientId,
                'client_secret' => $this->clientSecret,
            ]);

        if ($response->successful()) {
            $tokenData = $response->json();
            $newAccessToken = $tokenData['access_token'] ?? $account->access_token;
            $newRefreshToken = $tokenData['refresh_token'] ?? $account->refresh_token;
            $expiresIn = $tokenData['expires_in'] ?? 5184000;

            $account->update([
                'access_token' => $newAccessToken,
                'refresh_token' => $newRefreshToken,
                'token_expires_at' => now()->addSeconds($expiresIn),
            ]);

            return (string) $newAccessToken;
        }

        return (string) $account->access_token;
    }
}
