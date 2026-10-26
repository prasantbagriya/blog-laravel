<?php

namespace App\Services\Google;

use App\Models\GscSetting;
use App\Models\GscIndexingLog;
use Illuminate\Support\Facades\Http;
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
     * Submit a single URL to Google Instant Indexing API (URL_UPDATED or URL_DELETED).
     */
    public function publishUrl(string $url, string $action = 'URL_UPDATED', string $triggeredBy = 'manual'): array
    {
        $url = $this->normalizeUrl($url);
        $token = $this->authService->getAccessToken();

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
     * Submit batch of URLs for instant indexing.
     */
    public function batchPublish(array $urls, string $action = 'URL_UPDATED', string $triggeredBy = 'manual'): array
    {
        $results = [];
        foreach ($urls as $url) {
            $trimmed = trim($url);
            if (!empty($trimmed)) {
                $results[] = $this->publishUrl($trimmed, $action, $triggeredBy);
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
