<?php

namespace App\Services\Bing;

use App\Models\BingWebmasterSetting;
use App\Models\BingSubmissionLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class BingWebmasterService
{
    protected string $authBase = 'https://www.bing.com/webmasters/oauth/authorize';
    protected string $tokenBase = 'https://www.bing.com/webmasters/oauth/token';
    protected string $apiBase = 'https://ssl.bing.com/webmaster/api.svc/json';
    protected string $indexNowBase = 'https://api.indexnow.org/indexnow';

    /**
     * Get the active settings model.
     */
    public function getSetting(): BingWebmasterSetting
    {
        return BingWebmasterSetting::current();
    }

    /**
     * Build Bing OAuth Authorization URL.
     */
    public function getAuthorizationUrl(?string $redirectUri = null): string
    {
        $setting = $this->getSetting();
        $clientId = $setting->client_id ?: config('services.bing.client_id', '1a80c581602a4b3abd3071232d170f6f');
        $callback = $redirectUri ?: config('services.bing.redirect_uri', url('/auth/bing/callback'));

        $params = [
            'client_id' => $clientId,
            'redirect_uri' => $callback,
            'response_type' => 'code',
            'scope' => 'webmaster.manage',
        ];

        return "{$this->authBase}?" . http_build_query($params);
    }

    /**
     * Exchange OAuth authorization code for Access & Refresh tokens.
     */
    public function handleCallback(string $code, ?string $redirectUri = null): array
    {
        $setting = $this->getSetting();
        $clientId = $setting->client_id ?: config('services.bing.client_id', '1a80c581602a4b3abd3071232d170f6f');
        $clientSecret = $setting->client_secret ?: config('services.bing.client_secret');
        $callback = $redirectUri ?: config('services.bing.redirect_uri', url('/auth/bing/callback'));

        try {
            $response = Http::asForm()->timeout(20)->post($this->tokenBase, [
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'code' => $code,
                'grant_type' => 'authorization_code',
                'redirect_uri' => $callback,
            ]);

            $data = $response->json();

            if ($response->successful() && !empty($data['access_token'])) {
                $expiresIn = (int) ($data['expires_in'] ?? 3600);

                $setting->update([
                    'access_token' => $data['access_token'],
                    'refresh_token' => $data['refresh_token'] ?? $setting->refresh_token,
                    'token_expires_at' => Carbon::now()->addSeconds($expiresIn),
                    'is_connected' => true,
                    'last_synced_at' => Carbon::now(),
                ]);

                return [
                    'success' => true,
                    'message' => 'Successfully authenticated with Bing Webmaster Tools.',
                ];
            }

            $errorMessage = $data['error_description'] ?? ($data['error'] ?? 'OAuth token exchange failed');
            return [
                'success' => false,
                'error' => $errorMessage,
            ];
        } catch (\Throwable $e) {
            Log::error('Bing OAuth token exchange exception: ' . $e->getMessage());
            return [
                'success' => false,
                'error' => 'Network error connecting to Bing OAuth: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get valid access token, auto-refreshing if expired.
     */
    public function getValidAccessToken(): ?string
    {
        $setting = $this->getSetting();

        if (empty($setting->access_token)) {
            return null;
        }

        // If token expires in less than 90 seconds, refresh it
        $needsRefresh = empty($setting->token_expires_at) || Carbon::now()->addSeconds(90)->gte($setting->token_expires_at);

        if ($needsRefresh && !empty($setting->refresh_token)) {
            $clientId = $setting->client_id ?: config('services.bing.client_id');
            $clientSecret = $setting->client_secret ?: config('services.bing.client_secret');

            try {
                $response = Http::asForm()->timeout(20)->post($this->tokenBase, [
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'refresh_token' => $setting->refresh_token,
                    'grant_type' => 'refresh_token',
                ]);

                $data = $response->json();

                if ($response->successful() && !empty($data['access_token'])) {
                    $expiresIn = (int) ($data['expires_in'] ?? 3600);
                    $setting->update([
                        'access_token' => $data['access_token'],
                        'refresh_token' => $data['refresh_token'] ?? $setting->refresh_token,
                        'token_expires_at' => Carbon::now()->addSeconds($expiresIn),
                    ]);

                    return $data['access_token'];
                }
            } catch (\Throwable $e) {
                Log::warning('Bing token refresh error: ' . $e->getMessage());
            }
        }

        return $setting->access_token;
    }

    /**
     * Prepare HTTP client with Bearer auth or API Key query.
     */
    protected function request()
    {
        $token = $this->getValidAccessToken();
        $setting = $this->getSetting();

        $client = Http::timeout(25)->acceptJson();

        if ($token) {
            $client = $client->withToken($token);
        }

        return $client;
    }

    /**
     * Helper to append API key to URL if token is not present.
     */
    protected function buildApiUrl(string $endpoint, array $params = []): string
    {
        $setting = $this->getSetting();
        $url = "{$this->apiBase}/{$endpoint}";

        if (!empty($setting->api_key)) {
            $params['apikey'] = $setting->api_key;
        }

        if (!empty($params)) {
            $url .= '?' . http_build_query($params);
        }

        return $url;
    }

    /**
     * Get site URL configured.
     */
    public function getSiteUrl(): string
    {
        $setting = $this->getSetting();
        return rtrim($setting->site_url ?: config('services.bing.site_url', 'https://coachingsinsikar.com/'), '/') . '/';
    }

    /**
     * Fetch Bing Search Query & Keyword Performance Stats (GetQueryStats).
     */
    public function getQueryStats(?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();

        try {
            $url = $this->buildApiUrl('GetQueryStats', ['siteUrl' => $targetSite]);
            $response = $this->request()->get($url);

            if ($response->successful()) {
                $raw = $response->json();
                $rows = $raw['d'] ?? ($raw['GetQueryStatsResult'] ?? $raw);
                if (!is_array($rows)) {
                    $rows = [];
                }

                $totalClicks = 0;
                $totalImpressions = 0;
                $formattedRows = [];

                foreach ($rows as $item) {
                    $clicks = (int) ($item['Clicks'] ?? 0);
                    $impressions = (int) ($item['Impressions'] ?? 0);
                    $ctr = $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;
                    $query = $item['Query'] ?? 'Unknown Query';

                    $totalClicks += $clicks;
                    $totalImpressions += $impressions;

                    $formattedRows[] = [
                        'query' => $query,
                        'clicks' => $clicks,
                        'impressions' => $impressions,
                        'ctr' => $ctr,
                        'avg_click_position' => round((float) ($item['AvgClickPosition'] ?? 0), 1),
                        'avg_impression_position' => round((float) ($item['AvgImpressionPosition'] ?? 0), 1),
                        'date' => isset($item['Date']) ? Carbon::parse($item['Date'])->toDateString() : null,
                    ];
                }

                // Sort by clicks desc
                usort($formattedRows, fn($a, $b) => $b['clicks'] <=> $a['clicks']);

                return [
                    'success' => true,
                    'total_clicks' => $totalClicks,
                    'total_impressions' => $totalImpressions,
                    'average_ctr' => $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0,
                    'queries' => $formattedRows,
                ];
            }

            return [
                'success' => false,
                'error' => 'Bing API returned HTTP ' . $response->status() . ': ' . $response->body(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'Query stats request failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch Bing Crawl Health, InLinks, and HTTP Status Codes (GetCrawlStats).
     */
    public function getCrawlStats(?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();

        try {
            $url = $this->buildApiUrl('GetCrawlStats', ['siteUrl' => $targetSite]);
            $response = $this->request()->get($url);

            if ($response->successful()) {
                $raw = $response->json();
                $stats = $raw['d'] ?? ($raw['GetCrawlStatsResult'] ?? $raw);

                return [
                    'success' => true,
                    'stats' => is_array($stats) ? $stats : [],
                ];
            }

            return [
                'success' => false,
                'error' => 'Crawl stats returned HTTP ' . $response->status() . ': ' . $response->body(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'Crawl stats request failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Submit a single URL to Bingbot for instant crawling.
     */
    public function submitUrl(string $url, ?string $siteUrl = null, ?int $userId = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();
        $setting = $this->getSetting();

        $apiUrl = $this->buildApiUrl('SubmitUrl');

        try {
            $response = $this->request()->post($apiUrl, [
                'siteUrl' => $targetSite,
                'url' => $url,
            ]);

            $httpCode = $response->status();
            $body = $response->body();
            $isSuccess = $response->successful();

            // Record audit log
            BingSubmissionLog::create([
                'url' => $url,
                'method' => 'oauth_api',
                'status' => $isSuccess ? 'success' : 'failed',
                'http_code' => $httpCode,
                'response_message' => $body ?: ($isSuccess ? 'URL accepted by Bingbot.' : 'Submission error'),
                'submitted_by' => $userId ?: (auth()->check() ? auth()->id() : null),
            ]);

            if ($isSuccess && $setting->daily_quota_remaining > 0) {
                $setting->decrement('daily_quota_remaining');
            }

            return [
                'success' => $isSuccess,
                'status_code' => $httpCode,
                'message' => $isSuccess ? 'URL successfully submitted to Bingbot for indexing.' : 'Bing returned error: ' . $body,
                'remaining_quota' => $setting->fresh()->daily_quota_remaining,
            ];
        } catch (\Throwable $e) {
            BingSubmissionLog::create([
                'url' => $url,
                'method' => 'oauth_api',
                'status' => 'failed',
                'http_code' => 500,
                'response_message' => $e->getMessage(),
                'submitted_by' => $userId ?: (auth()->check() ? auth()->id() : null),
            ]);

            return [
                'success' => false,
                'error' => 'Submission exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Submit batch of URLs to Bingbot (SubmitUrlBatch).
     */
    public function submitUrlBatch(array $urls, ?string $siteUrl = null, ?int $userId = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();
        $urls = array_values(array_unique(array_filter($urls)));

        if (empty($urls)) {
            return ['success' => false, 'error' => 'No URLs provided for batch submission.'];
        }

        $apiUrl = $this->buildApiUrl('SubmitUrlBatch');

        try {
            $response = $this->request()->post($apiUrl, [
                'siteUrl' => $targetSite,
                'urlList' => $urls,
            ]);

            $isSuccess = $response->successful();
            $httpCode = $response->status();
            $body = $response->body();

            foreach ($urls as $u) {
                BingSubmissionLog::create([
                    'url' => $u,
                    'method' => 'oauth_api',
                    'status' => $isSuccess ? 'success' : 'failed',
                    'http_code' => $httpCode,
                    'response_message' => $body ?: ($isSuccess ? 'Batch accepted' : 'Batch failed'),
                    'submitted_by' => $userId ?: (auth()->check() ? auth()->id() : null),
                ]);
            }

            return [
                'success' => $isSuccess,
                'submitted_count' => count($urls),
                'message' => $isSuccess ? count($urls) . ' URLs submitted to Bingbot.' : 'Batch submission error: ' . $body,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'Batch submission exception: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Broadcast to IndexNow protocol (Powers Bing, Yandex, Seznam, Naver).
     */
    public function submitIndexNow(array $urls): array
    {
        $host = parse_url($this->getSiteUrl(), PHP_URL_HOST) ?: 'coachingsinsikar.com';
        $key = config('services.bing.api_key') ?: md5($host . 'indexnow_secret');

        $payload = [
            'host' => $host,
            'key' => $key,
            'urlList' => array_values(array_unique(array_filter($urls))),
        ];

        try {
            $response = Http::timeout(15)->post($this->indexNowBase, $payload);

            return [
                'success' => $response->successful() || in_array($response->status(), [200, 202]),
                'http_code' => $response->status(),
                'message' => 'IndexNow broadcast completed (HTTP ' . $response->status() . ')',
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'IndexNow broadcast failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Fetch registered Sitemaps list (GetSitemaps).
     */
    public function getSitemaps(?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();

        try {
            $url = $this->buildApiUrl('GetSitemaps', ['siteUrl' => $targetSite]);
            $response = $this->request()->get($url);

            if ($response->successful()) {
                $raw = $response->json();
                $list = $raw['d'] ?? ($raw['GetSitemapsResult'] ?? $raw);

                return [
                    'success' => true,
                    'sitemaps' => is_array($list) ? $list : [],
                ];
            }

            return [
                'success' => false,
                'error' => 'GetSitemaps returned HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'GetSitemaps failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Submit a sitemap URL to Bing (SubmitSitemap).
     */
    public function submitSitemap(string $sitemapUrl, ?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getSiteUrl();
        $apiUrl = $this->buildApiUrl('SubmitSitemap');

        try {
            $response = $this->request()->post($apiUrl, [
                'siteUrl' => $targetSite,
                'sitemapUrl' => $sitemapUrl,
            ]);

            return [
                'success' => $response->successful(),
                'message' => $response->successful() ? 'Sitemap submitted to Bing successfully.' : 'Failed to submit sitemap.',
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'SubmitSitemap error: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Disconnect Bing Webmaster Tools integration.
     */
    public function disconnect(): bool
    {
        $setting = $this->getSetting();
        return $setting->update([
            'access_token' => null,
            'refresh_token' => null,
            'token_expires_at' => null,
            'is_connected' => false,
        ]);
    }
}
