<?php

namespace App\Services\Google;

use App\Models\GscSetting;
use App\Models\GscIndexingLog;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Exception;

class GoogleIndexingService
{
    protected GoogleAuthService $authService;

    public function __construct(GoogleAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Normalize URL to ensure it matches the verified Google Search Console property.
     * Prevents localhost, http/https mismatch, and missing domain.
     */
    public function normalizeUrl(string $url): string
    {
        $url = trim($url);
        if (empty($url)) {
            return $url;
        }

        // Get configured property base or default to live domain
        $defaultDomain = 'https://coachingsinsikar.com';
        try {
            $settings = GscSetting::instance();
            $prop = trim($settings->property_id ?? '');
            if (!empty($prop)) {
                if (str_starts_with($prop, 'sc-domain:')) {
                    $domain = substr($prop, 10);
                    $defaultDomain = 'https://' . trim($domain, '/');
                } elseif (preg_match('#^https?://#i', $prop)) {
                    $defaultDomain = rtrim($prop, '/');
                }
            }
        } catch (\Throwable $e) {}

        // 1. Relative paths like /blog/my-post
        if (str_starts_with($url, '/')) {
            return $defaultDomain . $url;
        }

        // 2. Replace localhost or 127.0.0.1 with canonical live domain
        $url = preg_replace('#^https?://(localhost|127\.0\.0\.1)(:\d+)?#i', $defaultDomain, $url);

        // 3. If coachingsinsikar.com is used with http, upgrade to https
        $url = preg_replace('#^http://(www\.)?coachingsinsikar\.com#i', 'https://coachingsinsikar.com', $url);

        // 4. Missing scheme (e.g. coachingsinsikar.com/blog/test)
        if (!preg_match('#^https?://#i', $url)) {
            $url = 'https://' . ltrim($url, '/');
        }

        return $url;
    }

    /**
     * Check if a URL has already been successfully pushed within the cooldown period (default: 24h).
     */
    public function isRecentlySubmitted(string $url, string $action = 'URL_UPDATED', int $hours = 24): bool
    {
        $normalized = $this->normalizeUrl($url);
        $altUrl = str_ends_with($normalized, '/') ? rtrim($normalized, '/') : $normalized . '/';

        return GscIndexingLog::whereIn('url', [$normalized, $altUrl])
            ->where('action', $action)
            ->where('status', 'success')
            ->where('created_at', '>=', Carbon::now()->subHours($hours))
            ->exists();
    }

    /**
     * Get Google Indexing API daily quota statistics (limit: 200/day).
     */
    public function getDailyQuotaStats(): array
    {
        $todaySuccessCount = GscIndexingLog::where('status', 'success')
            ->whereDate('created_at', Carbon::today())
            ->count();

        $limit = 200;
        return [
            'used' => $todaySuccessCount,
            'limit' => $limit,
            'remaining' => max(0, $limit - $todaySuccessCount),
            'resets_at' => Carbon::tomorrow()->toIso8601String(),
        ];
    }

    /**
     * Submit a single URL to Google Instant Indexing API (URL_UPDATED or URL_DELETED).
     * Prevents duplicate pushes and respects 24h cooldown unless $force = true.
     */
    public function publishUrl(string $url, string $action = 'URL_UPDATED', string $triggeredBy = 'manual', bool $force = false): array
    {
        $url = $this->normalizeUrl($url);
        if (empty($url)) {
            return [
                'success' => false,
                'status' => 'failed',
                'http_code' => 400,
                'message' => 'Empty or invalid URL provided.',
            ];
        }

        // 1. Duplicate & Cooldown Protection (Skip if pushed successfully in last 24h)
        if (!$force && $action === 'URL_UPDATED') {
            $altUrl = str_ends_with($url, '/') ? rtrim($url, '/') : $url . '/';
            $recentLog = GscIndexingLog::whereIn('url', [$url, $altUrl])
                ->where('action', 'URL_UPDATED')
                ->where('status', 'success')
                ->where('created_at', '>=', Carbon::now()->subHours(24))
                ->latest('id')
                ->first();

            if ($recentLog) {
                $pushedAgo = $recentLog->created_at->diffForHumans();
                $hoursLeft = max(1, 24 - $recentLog->created_at->diffInHours(Carbon::now()));
                return [
                    'success' => true,
                    'status' => 'skipped',
                    'http_code' => 200,
                    'skipped' => true,
                    'message' => "Skipped: URL was already pushed successfully to Googlebot {$pushedAgo} (24h cooldown active, ~{$hoursLeft}h remaining to protect quota).",
                    'url' => $url,
                    'last_pushed_at' => $recentLog->created_at->toIso8601String(),
                    'cooldown_remaining_hours' => $hoursLeft,
                ];
            }
        }

        // 2. Google 200/day Quota Protection
        $quota = $this->getDailyQuotaStats();
        if ($quota['remaining'] <= 0 && !$force) {
            return [
                'success' => false,
                'status' => 'quota_exceeded',
                'http_code' => 429,
                'message' => 'Daily Google Indexing API quota (200 URLs/day) reached for today. Cooldown will reset at midnight.',
                'url' => $url,
            ];
        }

        $token = $this->authService->getAccessToken();
        if (empty($token)) {
            return [
                'success' => false,
                'status' => 'failed',
                'http_code' => 401,
                'message' => 'Unable to generate Google Access Token. Check your Search Console connection or Service Account JSON in Settings.',
                'url' => $url,
            ];
        }

        $payload = [
            'url' => $url,
            'type' => $action,
        ];

        try {
            $response = Http::withoutVerifying()->withToken($token)
                ->timeout(30)
                ->post('https://indexing.googleapis.com/v3/urlNotifications:publish', $payload);

            $status = $response->successful() ? 'success' : 'failed';
            $httpCode = $response->status();
            $rawMessage = $response->json('error.message') ?: $response->body();

            if ($response->successful()) {
                $message = 'URL successfully submitted for instant crawling';
            } else {
                if ($httpCode === 403) {
                    if (stripos($rawMessage, 'ownership') !== false || stripos($rawMessage, 'permission') !== false) {
                        $message = "403 Forbidden: Ownership verification failed. Your Service Account email (or connected Google user) is NOT added as an 'Owner' in Google Search Console for this site. Go to Search Console > Settings > Users & permissions and add your Service Account email as an 'Owner' (not Full/Restricted). Google error: " . $rawMessage;
                    } elseif (stripos($rawMessage, 'disabled') !== false || stripos($rawMessage, 'has not been used') !== false) {
                        $message = "403 Forbidden: Google Web Search Indexing API is disabled. Enable 'Web Search Indexing API' in Google Cloud Console (console.cloud.google.com/apis/library/indexing.googleapis.com). Google error: " . $rawMessage;
                    } else {
                        $message = "403 Forbidden: Access denied by Google Indexing API. Ensure your account is an Owner in Search Console. Google error: " . $rawMessage;
                    }
                } elseif ($httpCode === 429) {
                    $message = "429 Too Many Requests: Google Indexing API daily quota exceeded (200 URLs/day limit).";
                } else {
                    $message = $rawMessage ?: "HTTP {$httpCode} error from Google Indexing API";
                }
            }

            GscIndexingLog::create([
                'url' => $url,
                'action' => $action,
                'status' => $status,
                'http_code' => $httpCode,
                'response_message' => $message,
                'triggered_by' => $triggeredBy,
            ]);

            return [
                'success' => $response->successful(),
                'status' => $status,
                'http_code' => $httpCode,
                'message' => $message,
                'raw_error' => $rawMessage,
                'urlNotificationMetadata' => $response->json('urlNotificationMetadata'),
            ];
        } catch (\Throwable $e) {
            $errMessage = $e->getMessage();
            GscIndexingLog::create([
                'url' => $url,
                'action' => $action,
                'status' => 'failed',
                'http_code' => 500,
                'response_message' => $errMessage,
                'triggered_by' => $triggeredBy,
            ]);

            return [
                'success' => false,
                'status' => 'failed',
                'http_code' => 500,
                'message' => $errMessage,
            ];
        }
    }

    /**
     * Submit batch of URLs for instant indexing. Deduplicates input and respects cooldown & daily quota.
     */
    public function batchPublish(array $urls, string $action = 'URL_UPDATED', string $triggeredBy = 'manual', bool $force = false): array
    {
        // Deduplicate and trim input URLs
        $urls = array_values(array_unique(array_filter(array_map('trim', $urls))));
        $results = [];

        foreach ($urls as $url) {
            if (!empty($url)) {
                $res = $this->publishUrl($url, $action, $triggeredBy, $force);
                $results[] = $res;

                // Stop further processing if daily quota is exhausted
                if (($res['status'] ?? '') === 'quota_exceeded') {
                    break;
                }
            }
        }
        return $results;
    }

    /**
     * Get the latest indexing notification status for a URL.
     */
    public function getUrlMetadata(string $url): array
    {
        $url = $this->normalizeUrl($url);
        $token = $this->authService->getAccessToken();
        $encodedUrl = urlencode($url);

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(30)
            ->get("https://indexing.googleapis.com/v3/urlNotifications/metadata?url={$encodedUrl}");

        if (!$response->successful()) {
            throw new Exception("Failed to get indexing status: " . $response->body());
        }

        return $response->json();
    }

    /**
     * Test Instant Indexing API connectivity & permissions with Google.
     */
    public function testConnection(): array
    {
        $testUrl = $this->normalizeUrl('https://coachingsinsikar.com/');
        try {
            $token = $this->authService->getAccessToken();
            if (empty($token)) {
                return [
                    'success' => false,
                    'error' => 'Unable to generate Google Access Token. Check your Search Console credentials or Service Account JSON in Settings.',
                ];
            }

            $encodedUrl = urlencode($testUrl);
            $response = Http::withoutVerifying()->withToken($token)
                ->timeout(20)
                ->get("https://indexing.googleapis.com/v3/urlNotifications/metadata?url={$encodedUrl}");

            if ($response->successful()) {
                return [
                    'success' => true,
                    'http_code' => 200,
                    'message' => 'Google Indexing API is fully connected and authorized! Googlebot will accept crawl requests.',
                    'metadata' => $response->json(),
                ];
            }

            $code = $response->status();
            $raw = $response->json('error.message') ?: $response->body();

            if ($code === 403) {
                if (stripos($raw, 'disabled') !== false || stripos($raw, 'has not been used') !== false) {
                    return [
                        'success' => false,
                        'http_code' => 403,
                        'type' => 'api_disabled',
                        'error' => 'Web Search Indexing API is DISABLED in your Google Cloud project.',
                        'solution' => 'Open Google Cloud Console > APIs & Services > Enable "Web Search Indexing API".',
                        'link' => 'https://console.cloud.google.com/apis/library/indexing.googleapis.com',
                        'raw' => $raw,
                    ];
                }

                return [
                    'success' => false,
                    'http_code' => 403,
                    'type' => 'permission_denied',
                    'error' => 'Ownership Verification Failed (403): Account is not verified as an Owner in Google Search Console.',
                    'solution' => 'Go to Google Search Console > Settings > Users and permissions, and add your Service Account email as an "Owner" (Full/Restricted access will not work).',
                    'link' => 'https://search.google.com/search-console/users',
                    'raw' => $raw,
                ];
            }

            return [
                'success' => false,
                'http_code' => $code,
                'error' => $raw,
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }
}
