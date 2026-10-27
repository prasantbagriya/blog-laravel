<?php

namespace App\Services\Bing;

use App\Models\BingWebmasterSetting;
use App\Models\BingSubmissionLog;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
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

            // If token is past its expiry date and refresh failed, return null to allow API key fallback
            if (!empty($setting->token_expires_at) && Carbon::now()->gte($setting->token_expires_at)) {
                return null;
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

        $client = Http::timeout(25)->acceptJson();

        if ($token) {
            $client = $client->withToken($token);
        }

        return $client;
    }

    /**
     * Helper to append API key to URL if configured.
     */
    protected function buildApiUrl(string $endpoint, array $params = []): string
    {
        $setting = $this->getSetting();
        $apiKey = $setting->api_key ?: config('services.bing.api_key');
        $url = "{$this->apiBase}/{$endpoint}";

        if (!empty($apiKey)) {
            $params['apikey'] = $apiKey;
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
     * Fetch Bing Search Query & Keyword Performance Stats (GetQueryStats & GetRankAndTrafficStats).
     */
    public function getQueryStats(?string $siteUrl = null, ?string $startDate = null, ?string $endDate = null, ?int $days = null): array
    {
        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);

        $effectiveStartDate = $startDate;
        $effectiveEndDate = $endDate;
        if ($days === 1) {
            $effectiveStartDate = Carbon::now()->subDay()->format('Y-m-d');
            $effectiveEndDate = Carbon::now()->format('Y-m-d');
        } elseif ($days && $days > 1) {
            $effectiveStartDate = Carbon::now()->subDays($days)->format('Y-m-d');
            $effectiveEndDate = Carbon::now()->format('Y-m-d');
        }

        $totalClicks = 0;
        $totalImpressions = 0;
        $formattedRows = [];
        $lastError = null;
        $foundData = false;

        $parseItemDate = function ($rawDate) {
            if (empty($rawDate)) return null;
            if (preg_match('/\/Date\((\d+)/', $rawDate, $m)) {
                return date('Y-m-d', (int) ($m[1] / 1000));
            }
            try {
                return Carbon::parse($rawDate)->toDateString();
            } catch (\Throwable $ignore) {
                return null;
            }
        };

        // 1. Fetch site-wide traffic totals from GetRankAndTrafficStats
        foreach ($candidates as $site) {
            try {
                $url = $this->buildApiUrl('GetRankAndTrafficStats', ['siteUrl' => $site]);
                $response = $this->request()->get($url);

                if ($response->successful()) {
                    $raw = $response->json();
                    $trafficRows = $raw['d'] ?? ($raw['GetRankAndTrafficStatsResult'] ?? $raw);
                    if (is_array($trafficRows)) {
                        foreach ($trafficRows as $item) {
                            $itemDate = $parseItemDate($item['Date'] ?? null);
                            if ($effectiveStartDate && $itemDate && $itemDate < $effectiveStartDate) continue;
                            if ($effectiveEndDate && $itemDate && $itemDate > $effectiveEndDate) continue;

                            $totalClicks += (int) ($item['Clicks'] ?? 0);
                            $totalImpressions += (int) ($item['Impressions'] ?? 0);
                        }
                    }
                    $foundData = true;
                    break;
                } else {
                    $lastError = 'Bing API returned HTTP ' . $response->status() . ': ' . $response->body();
                }
            } catch (\Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        // 2. Fetch specific keyword query statistics from GetQueryStats
        foreach ($candidates as $site) {
            try {
                $url = $this->buildApiUrl('GetQueryStats', ['siteUrl' => $site]);
                $response = $this->request()->get($url);

                if ($response->successful()) {
                    $raw = $response->json();
                    $rows = $raw['d'] ?? ($raw['GetQueryStatsResult'] ?? $raw);
                    if (is_array($rows)) {
                        $queryClicks = 0;
                        $queryImpressions = 0;

                        foreach ($rows as $item) {
                            $clicks = (int) ($item['Clicks'] ?? 0);
                            $impressions = (int) ($item['Impressions'] ?? 0);
                            $ctr = $impressions > 0 ? round(($clicks / $impressions) * 100, 2) : 0;
                            $query = $item['Query'] ?? 'Unknown Query';

                            $dateStr = $parseItemDate($item['Date'] ?? null);
                            if ($effectiveStartDate && $dateStr && $dateStr < $effectiveStartDate) continue;
                            if ($effectiveEndDate && $dateStr && $dateStr > $effectiveEndDate) continue;

                            $queryClicks += $clicks;
                            $queryImpressions += $impressions;

                            $rawClickPos = (float) ($item['AvgClickPosition'] ?? 0);
                            $rawImpPos = (float) ($item['AvgImpressionPosition'] ?? 0);

                            $formattedRows[] = [
                                'query' => $query,
                                'clicks' => $clicks,
                                'impressions' => $impressions,
                                'ctr' => $ctr,
                                'avg_click_position' => round($rawClickPos > 100 ? $rawClickPos / 10 : $rawClickPos, 1),
                                'avg_impression_position' => round($rawImpPos > 100 ? $rawImpPos / 10 : $rawImpPos, 1),
                                'date' => $dateStr,
                            ];
                        }

                        if ($totalClicks === 0 && $queryClicks > 0) {
                            $totalClicks = $queryClicks;
                        }
                        if ($totalImpressions === 0 && $queryImpressions > 0) {
                            $totalImpressions = $queryImpressions;
                        }
                    }

                    $foundData = true;
                    break;
                } else {
                    if (!$lastError) {
                        $lastError = 'Bing API returned HTTP ' . $response->status() . ': ' . $response->body();
                    }
                }
            } catch (\Throwable $e) {
                if (!$lastError) {
                    $lastError = $e->getMessage();
                }
            }
        }

        if ($foundData) {
            // Sort by clicks desc
            usort($formattedRows, fn($a, $b) => $b['clicks'] <=> $a['clicks']);

            $avgCtr = $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0;

            return [
                'success' => true,
                'total_clicks' => $totalClicks,
                'total_impressions' => $totalImpressions,
                'average_ctr' => $avgCtr,
                'queries' => $formattedRows,
                'target_site' => $targetSite,
            ];
        }

        return [
            'success' => false,
            'total_clicks' => 0,
            'total_impressions' => 0,
            'average_ctr' => 0,
            'queries' => [],
            'error' => $lastError ?: 'Could not connect to Bing Webmaster search analytics.',
        ];
    }

    /**
     * Fetch Bing Crawl Health, InLinks, and HTTP Status Codes (GetCrawlStats).
     */
    public function getCrawlStats(?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);
        $lastError = null;

        foreach ($candidates as $site) {
            try {
                $url = $this->buildApiUrl('GetCrawlStats', ['siteUrl' => $site]);
                $response = $this->request()->get($url);

                if ($response->successful()) {
                    $raw = $response->json();
                    $stats = $raw['d'] ?? ($raw['GetCrawlStatsResult'] ?? $raw);

                    return [
                        'success' => true,
                        'stats' => is_array($stats) ? $stats : [],
                        'target_site' => $site,
                    ];
                }
                $lastError = 'Crawl stats returned HTTP ' . $response->status() . ': ' . $response->body();
            } catch (\Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        return [
            'success' => false,
            'stats' => [],
            'error' => $lastError ?: 'Failed to retrieve Bing crawl stats.',
        ];
    }

    /**
     * Submit a single URL to Bingbot for instant crawling.
     */
    public function submitUrl(string $url, ?string $siteUrl = null, ?int $userId = null): array
    {
        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);
        $setting = $this->getSetting();
        $apiUrl = $this->buildApiUrl('SubmitUrl');
        $lastResponse = null;
        $isSuccess = false;

        foreach ($candidates as $site) {
            try {
                $response = $this->request()->post($apiUrl, [
                    'siteUrl' => $site,
                    'url' => $url,
                ]);

                if ($response->successful()) {
                    $isSuccess = true;
                    $lastResponse = $response;
                    break;
                }
                $lastResponse = $response;
            } catch (\Throwable $e) {}
        }

        $httpCode = $lastResponse ? $lastResponse->status() : 500;
        $body = $lastResponse ? $lastResponse->body() : 'No response';

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
    }

    /**
     * Submit batch of URLs to Bingbot (SubmitUrlBatch).
     */
    public function submitUrlBatch(array $urls, ?string $siteUrl = null, ?int $userId = null): array
    {
        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);
        $urls = array_values(array_unique(array_filter($urls)));

        if (empty($urls)) {
            return ['success' => false, 'error' => 'No URLs provided for batch submission.'];
        }

        $apiUrl = $this->buildApiUrl('SubmitUrlbatch');
        $lastResponse = null;
        $isSuccess = false;

        foreach ($candidates as $site) {
            try {
                $response = $this->request()->post($apiUrl, [
                    'siteUrl' => $site,
                    'urlList' => $urls,
                ]);

                if ($response->successful()) {
                    $isSuccess = true;
                    $lastResponse = $response;
                    break;
                }
                $lastResponse = $response;
            } catch (\Throwable $e) {}
        }

        $httpCode = $lastResponse ? $lastResponse->status() : 500;
        $body = $lastResponse ? $lastResponse->body() : 'No response';

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
     * Get verified user sites from Bing (GetUserSites).
     */
    public function getUserSites(): array
    {
        try {
            $url = $this->buildApiUrl('GetUserSites');
            $response = $this->request()->get($url);

            if ($response->successful()) {
                $raw = $response->json();
                $sites = $raw['d'] ?? ($raw['GetUserSitesResult'] ?? $raw);
                return [
                    'success' => true,
                    'sites' => is_array($sites) ? $sites : [],
                ];
            }

            return [
                'success' => false,
                'error' => 'GetUserSites returned HTTP ' . $response->status(),
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => 'GetUserSites failed: ' . $e->getMessage(),
            ];
        }
    }

    /**
     * Get the exact registered site URL from Bing Webmaster Tools.
     */
    public function getRegisteredSiteUrl(?string $fallback = null): string
    {
        $base = rtrim($fallback ?: $this->getSiteUrl(), '/');
        $cacheKey = 'bing_registered_site_url_' . md5($base);
        $cached = Cache::get($cacheKey);
        if ($cached) {
            return $cached;
        }

        try {
            $userSites = $this->getUserSites();
            if (!empty($userSites['sites'])) {
                foreach ($userSites['sites'] as $site) {
                    $u = $site['Url'] ?? '';
                    if (rtrim($u, '/') === $base) {
                        Cache::put($cacheKey, $u, 3600);
                        return $u;
                    }
                }
                if (count($userSites['sites']) === 1 && !empty($userSites['sites'][0]['Url'])) {
                    $u = $userSites['sites'][0]['Url'];
                    Cache::put($cacheKey, $u, 3600);
                    return $u;
                }
            }
        } catch (\Throwable $ignore) {}

        return $base;
    }

    /**
     * Fetch registered Sitemaps list using Bing GetFeeds API.
     */
    public function getSitemaps(?string $siteUrl = null): array
    {
        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);

        foreach ($candidates as $candidate) {
            try {
                $url = $this->buildApiUrl('GetFeeds', ['siteUrl' => $candidate]);
                $response = $this->request()->get($url);

                if ($response->successful()) {
                    $raw = $response->json();
                    $list = $raw['d'] ?? ($raw['GetFeedsResult'] ?? $raw);
                    $formatted = [];

                    if (is_array($list)) {
                        foreach ($list as $item) {
                            $subDate = null;
                            if (!empty($item['LastSubmissionDate'])) {
                                if (preg_match('/\/Date\((\d+)\)\//', $item['LastSubmissionDate'], $m)) {
                                    $subDate = date('Y-m-d H:i', (int) ($m[1] / 1000));
                                } else {
                                    $subDate = $item['LastSubmissionDate'];
                                }
                            }

                            $downDate = null;
                            if (!empty($item['LastDownloadDate'])) {
                                if (preg_match('/\/Date\((\d+)\)\//', $item['LastDownloadDate'], $m)) {
                                    $downDate = date('Y-m-d H:i', (int) ($m[1] / 1000));
                                } else {
                                    $downDate = $item['LastDownloadDate'];
                                }
                            }

                            $formatted[] = [
                                'Url' => $item['Url'] ?? ($item['url'] ?? ''),
                                'LastSubmitted' => $subDate ?: 'Recently',
                                'LastCrawled' => $downDate ?: 'Pending',
                                'Status' => ($item['Status'] ?? 1) == 1 ? 'Active' : 'Error',
                                'SubmittedUrlsCount' => $item['SubmittedUrlsCount'] ?? 0,
                                'ErrorCount' => $item['ErrorCount'] ?? 0,
                            ];
                        }
                    }

                    return [
                        'success' => true,
                        'sitemaps' => $formatted,
                    ];
                }
            } catch (\Throwable $ignore) {}
        }

        return [
            'success' => false,
            'sitemaps' => [],
            'error' => 'Could not fetch sitemaps from Bing Webmaster API.',
        ];
    }

    /**
     * Submit a sitemap URL to Bing using SubmitFeed API.
     */
    public function submitSitemap(string $sitemapUrl, ?string $siteUrl = null): array
    {
        $token = $this->getValidAccessToken();
        $setting = $this->getSetting();

        if (empty($token) && empty($setting->api_key)) {
            return [
                'success' => false,
                'error' => 'Bing Webmaster is not connected. Please connect via OAuth or enter your API Key under the Settings tab.',
            ];
        }

        $targetSite = $siteUrl ?: $this->getRegisteredSiteUrl();
        $apiUrl = $this->buildApiUrl('SubmitFeed');
        $candidates = array_unique([$targetSite, rtrim($targetSite, '/'), rtrim($targetSite, '/') . '/']);
        $lastError = 'Failed to submit feed to Bing API.';

        foreach ($candidates as $candidate) {
            try {
                $response = $this->request()->post($apiUrl, [
                    'siteUrl' => $candidate,
                    'feedUrl' => $sitemapUrl,
                ]);

                if ($response->successful()) {
                    return [
                        'success' => true,
                        'message' => "Sitemap '{$sitemapUrl}' submitted to Bing successfully.",
                    ];
                }

                $raw = $response->json();
                $lastError = $raw['Message'] ?? ($raw['error']['message'] ?? ($raw['d'] ?? $response->body()));
            } catch (\Throwable $e) {
                $lastError = $e->getMessage();
            }
        }

        return [
            'success' => false,
            'error' => 'Bing API Error: ' . $lastError,
        ];
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
