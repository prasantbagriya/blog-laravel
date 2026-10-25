<?php

namespace App\Services\X;

use App\Models\XAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Str;

class XAuthService
{
    protected ?string $consumerKey;
    protected ?string $consumerSecret;
    protected ?string $clientId;
    protected ?string $clientSecret;
    protected ?string $bearerToken;
    protected ?string $redirectUri;

    public function __construct()
    {
        $this->consumerKey = config('services.x.consumer_key');
        $this->consumerSecret = config('services.x.consumer_secret');
        $this->clientId = config('services.x.client_id') ?: $this->consumerKey;
        $this->clientSecret = config('services.x.client_secret') ?: $this->consumerSecret;
        $this->bearerToken = config('services.x.bearer_token');
        $this->redirectUri = config('services.x.redirect_uri', url('/auth/x/callback'));
    }

    /**
     * Check if minimum X credentials are configured in .env / services.php
     */
    public function isConfigured(): bool
    {
        return !empty($this->consumerKey) && !empty($this->consumerSecret);
    }

    /**
     * Generate OAuth 2.0 PKCE Authorization URL for "Connect with X"
     */
    public function getAuthorizationUrl(): string
    {
        if (!$this->isConfigured()) {
            throw new Exception("X (Twitter) Consumer Key or Consumer Secret is not configured.");
        }

        $state = Str::random(40);
        $codeVerifier = Str::random(128);
        $codeChallenge = rtrim(strtr(base64_encode(hash('sha256', $codeVerifier, true)), '+/', '-_'), '=');

        Session::put('x_oauth_state', $state);
        Session::put('x_code_verifier', $codeVerifier);

        $params = [
            'response_type' => 'code',
            'client_id' => $this->clientId,
            'redirect_uri' => $this->redirectUri,
            'scope' => 'tweet.read tweet.write users.read offline.access',
            'state' => $state,
            'code_challenge' => $codeChallenge,
            'code_challenge_method' => 'S256',
        ];

        return 'https://twitter.com/i/oauth2/authorize?' . http_build_query($params);
    }

    /**
     * Handle OAuth 2.0 PKCE Callback and Exchange Code for Access & Refresh Tokens.
     */
    public function handleCallback(string $code, string $state): XAccount
    {
        $savedState = Session::pull('x_oauth_state');
        $codeVerifier = Session::pull('x_code_verifier');

        if (!$codeVerifier || ($savedState && $savedState !== $state)) {
            Log::warning('X OAuth state/verifier validation mismatch, proceeding with available verifier.');
        }

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post('https://api.twitter.com/2/oauth2/token', [
                'code' => $code,
                'grant_type' => 'authorization_code',
                'client_id' => $this->clientId,
                'redirect_uri' => $this->redirectUri,
                'code_verifier' => $codeVerifier ?: $state,
            ]);

        if (!$response->successful()) {
            $err = $response->json('error_description') ?: $response->body();
            Log::error('X Token exchange failed: ' . $err);
            throw new Exception("Failed to exchange authorization code with X: " . $err);
        }

        $tokenData = $response->json();
        $accessToken = $tokenData['access_token'] ?? null;
        $refreshToken = $tokenData['refresh_token'] ?? null;
        $expiresIn = $tokenData['expires_in'] ?? 7200;

        return $this->syncUserFromToken($accessToken, $refreshToken, $expiresIn, 'oauth2');
    }

    /**
     * Refresh OAuth 2.0 Access Token if expired.
     */
    public function refreshToken(XAccount $account): string
    {
        if (empty($account->refresh_token)) {
            return (string) $account->access_token;
        }

        $response = Http::asForm()
            ->withBasicAuth($this->clientId, $this->clientSecret)
            ->post('https://api.twitter.com/2/oauth2/token', [
                'refresh_token' => $account->refresh_token,
                'grant_type' => 'refresh_token',
                'client_id' => $this->clientId,
            ]);

        if (!$response->successful()) {
            Log::error('X Refresh Token exchange failed: ' . $response->body());
            return (string) $account->access_token;
        }

        $tokenData = $response->json();
        $newAccessToken = $tokenData['access_token'] ?? $account->access_token;
        $newRefreshToken = $tokenData['refresh_token'] ?? $account->refresh_token;
        $expiresIn = $tokenData['expires_in'] ?? 7200;

        $account->update([
            'access_token' => $newAccessToken,
            'refresh_token' => $newRefreshToken,
            'token_expires_at' => now()->addSeconds($expiresIn),
        ]);

        return (string) $newAccessToken;
    }

    /**
     * Build OAuth 1.0a Authorization Header for Twitter API calls.
     */
    public function buildOAuth1Header(string $method, string $url, array $params = [], ?string $token = null, ?string $tokenSecret = null): string
    {
        $token = $token ?: (string) config('services.x.access_token');
        $tokenSecret = $tokenSecret ?: (string) config('services.x.access_token_secret');

        $oauthParams = [
            'oauth_consumer_key' => (string) $this->consumerKey,
            'oauth_nonce' => bin2hex(random_bytes(16)),
            'oauth_signature_method' => 'HMAC-SHA1',
            'oauth_timestamp' => (string) time(),
            'oauth_version' => '1.0',
        ];

        if (!empty($token)) {
            $oauthParams['oauth_token'] = $token;
        }

        $allParams = array_merge($params, $oauthParams);
        ksort($allParams);

        $paramPairs = [];
        foreach ($allParams as $k => $v) {
            $paramPairs[] = rawurlencode($k) . '=' . rawurlencode((string) $v);
        }
        $paramString = implode('&', $paramPairs);

        $normalizedUrl = strtok($url, '?');
        $baseString = strtoupper($method) . '&' . rawurlencode($normalizedUrl) . '&' . rawurlencode($paramString);
        $signingKey = rawurlencode((string) $this->consumerSecret) . '&' . rawurlencode((string) $tokenSecret);
        $signature = base64_encode(hash_hmac('sha1', $baseString, $signingKey, true));

        $oauthParams['oauth_signature'] = $signature;
        ksort($oauthParams);

        $headerParts = [];
        foreach ($oauthParams as $k => $v) {
            $headerParts[] = rawurlencode($k) . '="' . rawurlencode((string) $v) . '"';
        }

        return 'OAuth ' . implode(', ', $headerParts);
    }

    /**
     * Sync authenticated X profile using OAuth 1.0a or OAuth 2.0 Bearer Token
     */
    public function syncUserFromToken(string $accessToken, ?string $refreshToken = null, int $expiresIn = 7200, string $authMode = 'oauth2', ?string $tokenSecret = null): XAccount
    {
        // 1. If tokenSecret is provided, try OAuth 1.0a verify_credentials first
        if (!empty($tokenSecret)) {
            $authMode = 'oauth1';
            $verifyUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
            $authHeader = $this->buildOAuth1Header('GET', $verifyUrl, [], $accessToken, $tokenSecret);

            $profileResponse = Http::withHeaders(['Authorization' => $authHeader])
                ->timeout(10)
                ->get($verifyUrl);

            if ($profileResponse->successful()) {
                $user = $profileResponse->json();
                return XAccount::updateOrCreate(
                    ['x_user_id' => (string) ($user['id_str'] ?? $user['id'])],
                    [
                        'user_id' => auth()->id(),
                        'username' => (string) ($user['screen_name'] ?? 'x_user'),
                        'name' => (string) ($user['name'] ?? 'X User'),
                        'profile_image_url' => $user['profile_image_url_https'] ?? ($user['profile_image_url'] ?? null),
                        'bio' => $user['description'] ?? null,
                        'followers_count' => (int) ($user['followers_count'] ?? 0),
                        'following_count' => (int) ($user['friends_count'] ?? 0),
                        'tweet_count' => (int) ($user['statuses_count'] ?? 0),
                        'auth_mode' => 'oauth1',
                        'access_token' => $accessToken,
                        'access_token_secret' => $tokenSecret,
                        'refresh_token' => null,
                        'token_expires_at' => null, // OAuth 1.0a tokens don't expire
                        'is_active' => true,
                    ]
                );
            }
        }

        // 2. OAuth 2.0 Bearer Token fallback via /2/users/me
        $profileResponse = Http::withToken($accessToken)
            ->timeout(10)
            ->get('https://api.twitter.com/2/users/me', [
                'user.fields' => 'description,profile_image_url,public_metrics,verified',
            ]);

        if (!$profileResponse->successful()) {
            $err = $profileResponse->json('detail') ?: ($profileResponse->json('title') ?: $profileResponse->body());
            Log::error('X Fetch User Info failed: ' . $err);
            throw new Exception("Unable to retrieve X user profile: " . $err);
        }

        $userData = $profileResponse->json('data') ?? [];
        $metrics = $userData['public_metrics'] ?? [];

        return XAccount::updateOrCreate(
            ['x_user_id' => (string) ($userData['id'] ?? 'primary')],
            [
                'user_id' => auth()->id(),
                'username' => (string) ($userData['username'] ?? 'x_user'),
                'name' => (string) ($userData['name'] ?? 'X User'),
                'profile_image_url' => $userData['profile_image_url'] ?? null,
                'bio' => $userData['description'] ?? null,
                'followers_count' => (int) ($metrics['followers_count'] ?? 0),
                'following_count' => (int) ($metrics['following_count'] ?? 0),
                'tweet_count' => (int) ($metrics['tweet_count'] ?? 0),
                'auth_mode' => $authMode,
                'access_token' => $accessToken,
                'access_token_secret' => $tokenSecret,
                'refresh_token' => $refreshToken,
                'token_expires_at' => now()->addSeconds($expiresIn),
                'is_active' => true,
            ]
        );
    }
}
