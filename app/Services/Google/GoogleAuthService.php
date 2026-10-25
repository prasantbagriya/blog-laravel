<?php

namespace App\Services\Google;

use App\Models\GscSetting;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Carbon\Carbon;
use Exception;

class GoogleAuthService
{
    public const SCOPES = [
        'https://www.googleapis.com/auth/webmasters',
        'https://www.googleapis.com/auth/webmasters.readonly',
        'https://www.googleapis.com/auth/indexing',
    ];

    /**
     * Generate the Google OAuth 2.0 Authorization URL for admin consent.
     */
    public function getAuthorizationUrl(?string $redirectUri = null): string
    {
        $settings = GscSetting::instance();
        
        $clientId = $settings->client_id ?: config('services.google.client_id');
        $redirect = $redirectUri ?: (config('services.google.redirect_uri') ?: ($settings->redirect_uri ?: url('/auth/callback')));

        if (empty($clientId)) {
            throw new Exception("Google Client ID is not configured in Search Console settings.");
        }

        $adminToken = auth()->check() ? encrypt(auth()->id()) : csrf_token();
        $state = 'gsc_connect:' . $adminToken;

        $params = [
            'client_id' => $clientId,
            'redirect_uri' => $redirect,
            'response_type' => 'code',
            'scope' => implode(' ', self::SCOPES),
            'access_type' => 'offline',
            'prompt' => 'consent select_account',
            'include_granted_scopes' => 'true',
            'state' => $state,
        ];

        return 'https://accounts.google.com/o/oauth2/auth?' . http_build_query($params);
    }

    /**
     * Exchange the authorization code for an Access Token & Refresh Token.
     */
    public function handleCallback(string $code, ?string $redirectUri = null): array
    {
        $settings = GscSetting::instance();
        $clientId = $settings->client_id ?: config('services.google.client_id');
        $clientSecret = $settings->client_secret ?: config('services.google.client_secret');
        $redirect = $redirectUri ?: (config('services.google.redirect_uri') ?: ($settings->redirect_uri ?: url('/auth/callback')));

        if (empty($clientId) || empty($clientSecret)) {
            throw new Exception("Google Client ID or Client Secret is missing.");
        }

        $response = Http::withoutVerifying()->asForm()->timeout(30)->post('https://oauth2.googleapis.com/token', [
            'code' => $code,
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'redirect_uri' => $redirect,
            'grant_type' => 'authorization_code',
        ]);

        if (!$response->successful()) {
            $err = $response->json('error_description') ?: $response->json('error') ?: $response->body();
            $settings->update([
                'is_connected' => false,
                'last_error' => "OAuth Exchange Error: {$err}",
            ]);
            throw new Exception("Failed to exchange Google OAuth code: {$err}");
        }

        $data = $response->json();
        $accessToken = $data['access_token'] ?? null;
        $refreshToken = $data['refresh_token'] ?? $settings->refresh_token;
        $expiresIn = $data['expires_in'] ?? 3600;

        $settings->update([
            'access_token' => $accessToken,
            'refresh_token' => $refreshToken,
            'token_expires_at' => Carbon::now()->addSeconds($expiresIn - 60),
            'is_connected' => !empty($accessToken) && !empty($refreshToken),
            'auth_mode' => 'oauth',
            'last_error' => null,
        ]);

        Cache::put('gsc_active_access_token', $accessToken, $expiresIn - 120);

        return $data;
    }

    /**
     * Get a valid, non-expired Access Token (auto-refreshes if needed).
     */
    public function getAccessToken(): string
    {
        $cached = Cache::get('gsc_active_access_token');
        if ($cached) {
            return $cached;
        }

        $settings = GscSetting::instance();

        // 1. If Service Account mode is configured
        if ($settings->auth_mode === 'service_account' && !empty($settings->service_account_json)) {
            return $this->getServiceAccountToken($settings);
        }

        // 2. OAuth Mode: Check if current token in DB is still unexpired
        if (!empty($settings->access_token) && $settings->token_expires_at && $settings->token_expires_at->isFuture()) {
            Cache::put('gsc_active_access_token', $settings->access_token, $settings->token_expires_at->diffInSeconds(now()));
            return $settings->access_token;
        }

        // 3. Refresh OAuth token via refresh_token
        $refreshToken = $settings->refresh_token ?: config('services.google.refresh_token');
        if (empty($refreshToken)) {
            throw new Exception("Google Search Console is not connected. Please authorize or upload service account JSON.");
        }

        $clientId = $settings->client_id ?: config('services.google.client_id');
        $clientSecret = $settings->client_secret ?: config('services.google.client_secret');

        $response = Http::withoutVerifying()->asForm()->timeout(30)->post('https://oauth2.googleapis.com/token', [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'refresh_token' => $refreshToken,
            'grant_type' => 'refresh_token',
        ]);

        if (!$response->successful()) {
            $err = $response->json('error_description') ?: $response->body();
            $settings->update([
                'is_connected' => false,
                'last_error' => "Token Refresh Failed: {$err}",
            ]);
            throw new Exception("Google Search Console token refresh failed: {$err}");
        }

        $data = $response->json();
        $newAccessToken = $data['access_token'];
        $expiresIn = $data['expires_in'] ?? 3600;

        $settings->update([
            'access_token' => $newAccessToken,
            'token_expires_at' => Carbon::now()->addSeconds($expiresIn - 60),
            'is_connected' => true,
            'last_error' => null,
        ]);

        Cache::put('gsc_active_access_token', $newAccessToken, $expiresIn - 120);

        return $newAccessToken;
    }

    /**
     * Mint a Bearer token via Service Account JSON with native OpenSSL JWT.
     */
    protected function getServiceAccountToken(GscSetting $settings): string
    {
        $json = is_array($settings->service_account_json) 
            ? $settings->service_account_json 
            : json_decode($settings->service_account_json, true);

        if (!$json || empty($json['client_email']) || empty($json['private_key'])) {
            throw new Exception("Invalid Google Service Account JSON configuration.");
        }

        $header = ['alg' => 'RS256', 'typ' => 'JWT'];
        $now = time();
        $claim = [
            'iss' => $json['client_email'],
            'scope' => implode(' ', self::SCOPES),
            'aud' => 'https://oauth2.googleapis.com/token',
            'exp' => $now + 3600,
            'iat' => $now,
        ];

        $encodedHeader = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
        $encodedClaim = rtrim(strtr(base64_encode(json_encode($claim)), '+/', '-_'), '=');
        $signingInput = "{$encodedHeader}.{$encodedClaim}";

        $privateKey = openssl_pkey_get_private($json['private_key']);
        if (!$privateKey) {
            throw new Exception("Failed to parse Service Account private key.");
        }

        $signature = '';
        openssl_sign($signingInput, $signature, $privateKey, OPENSSL_ALGO_SHA256);
        $encodedSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
        $jwt = "{$signingInput}.{$encodedSignature}";

        $response = Http::withoutVerifying()->asForm()->timeout(30)->post('https://oauth2.googleapis.com/token', [
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $jwt,
        ]);

        if (!$response->successful()) {
            throw new Exception("Service Account Token Exchange Failed: " . $response->body());
        }

        $token = $response->json('access_token');
        Cache::put('gsc_active_access_token', $token, 3500);

        $settings->update([
            'access_token' => $token,
            'token_expires_at' => Carbon::now()->addSeconds(3500),
            'is_connected' => true,
            'last_error' => null,
        ]);

        return $token;
    }
}
