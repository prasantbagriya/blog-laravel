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
     * Submit a single URL to Google Instant Indexing API (URL_UPDATED or URL_DELETED).
     */
    public function publishUrl(string $url, string $action = 'URL_UPDATED', string $triggeredBy = 'manual'): array
    {
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
            $message = $response->successful() 
                ? 'URL successfully submitted for instant crawling' 
                : ($response->json('error.message') ?: $response->body());

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
                'urlNotificationMetadata' => $response->json('urlNotificationMetadata'),
            ];
        } catch (\Throwable $e) {
            GscIndexingLog::create([
                'url' => $url,
                'action' => $action,
                'status' => 'failed',
                'http_code' => 500,
                'response_message' => $e->getMessage(),
                'triggered_by' => $triggeredBy,
            ]);

            return [
                'success' => false,
                'status' => 'failed',
                'http_code' => 500,
                'message' => $e->getMessage(),
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
}
