<?php

namespace App\Services\Pinterest;

use App\Models\PinterestAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class PinterestAuthService
{
    protected ?string $clientId;
    protected ?string $clientSecret;
    protected ?string $redirectUri;

    public function __construct()
    {
        $this->clientId = config('services.pinterest.client_id');
        $this->clientSecret = config('services.pinterest.client_secret');
        $this->redirectUri = config('services.pinterest.redirect_uri', url('/auth/pinterest/callback'));
    }

    /**
     * Check if minimum Pinterest App credentials are configured in .env / services.php
     */
    public function isConfigured(): bool
    {
        return !empty($this->clientId) && !empty($this->clientSecret);
    }

    /**
     * Generate OAuth 2.0 Authorization URL for "Connect with Pinterest"
     */
    public function getAuthorizationUrl(): string
    {
        if (!$this->isConfigured()) {
            throw new Exception("Pinterest App ID or Secret is not configured.");
        }

        $state = Str::random(40);
        Session::put('pinterest_oauth_state', $state);

        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'response_type' => 'code',
            'scope' => 'boards:read,boards:write,pins:read,pins:write,user_accounts:read',
            'state' => $state,
        ];

        return 'https://www.pinterest.com/oauth/?' . http_build_query($params);
    }

    /**
     * Handle OAuth 2.0 Callback and Exchange Code for Access & Refresh Tokens.
     */
    public function handleCallback(string $code, string $state): PinterestAccount
    {
        $savedState = Session::pull('pinterest_oauth_state');

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post('https://api.pinterest.com/v5/oauth/token', [
                'code' => $code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => $this->redirectUri,
            ]);

        if (!$response->successful()) {
            $err = $response->json('message') ?: ($response->json('error_description') ?: $response->body());
            Log::error('Pinterest Token exchange failed: ' . $err);
            throw new Exception("Failed to exchange authorization code with Pinterest: " . $err);
        }

        $tokenData = $response->json();
        $accessToken = $tokenData['access_token'] ?? null;
        $refreshToken = $tokenData['refresh_token'] ?? null;
        $expiresIn = $tokenData['expires_in'] ?? (86400 * 30); // 30 days default

        return $this->syncUserFromToken($accessToken, $refreshToken, $expiresIn);
    }

    /**
     * Refresh OAuth 2.0 Access Token if expired.
     */
    public function refreshToken(PinterestAccount $account): string
    {
        if (empty($account->refresh_token)) {
            return (string) $account->access_token;
        }

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post('https://api.pinterest.com/v5/oauth/token', [
                'refresh_token' => $account->refresh_token,
                'grant_type' => 'refresh_token',
            ]);

        if (!$response->successful()) {
            Log::error('Pinterest Refresh Token exchange failed: ' . $response->body());
            return (string) $account->access_token;
        }

        $tokenData = $response->json();
        $newAccessToken = $tokenData['access_token'] ?? $account->access_token;
        $newRefreshToken = $tokenData['refresh_token'] ?? $account->refresh_token;
        $expiresIn = $tokenData['expires_in'] ?? (86400 * 30);

        $account->update([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_expires_at' => now()->addSeconds($expiresIn),
        ]);

        return (string) $newAccessToken;
    }

    /**
     * Sync authenticated Pinterest profile using Access Token
     */
    public function syncUserFromToken(string $accessToken, ?string $refreshToken = null, int $expiresIn = (86400 * 30)): PinterestAccount
    {
        $profileResponse = Http::withToken($accessToken)
            ->timeout(10)
            ->get('https://api.pinterest.com/v5/user_account');

        if (!$profileResponse->successful()) {
            $err = $profileResponse->json('message') ?: $profileResponse->body();
            Log::error('Pinterest Fetch User Info failed: ' . $err);
            throw new Exception("Unable to retrieve Pinterest user profile: " . $err);
        }

        $user = $profileResponse->json();
        $userId = (string) ($user['id'] ?? ($user['username'] ?? 'primary'));
        $username = (string) ($user['username'] ?? 'pinterest_user');
        $name = (string) ($user['business_name'] ?? ($user['name'] ?? $username));

        return PinterestAccount::updateOrCreate(
            ['pinterest_user_id' => $userId],
            [
                'user_id' => auth()->id(),
                'username' => $username,
                'name' => $name,
                'profile_image' => $user['profile_image'] ?? null,
                'bio' => $user['about'] ?? null,
                'follower_count' => (int) ($user['follower_count'] ?? 0),
                'pin_count' => (int) ($user['pin_count'] ?? 0),
                'board_count' => (int) ($user['board_count'] ?? 0),
                'access_token' => $accessToken,
                'refresh_token' => $refreshToken,
                'token_expires_at' => now()->addSeconds($expiresIn),
                'is_active' => true,
            ]
        );
    }
}
