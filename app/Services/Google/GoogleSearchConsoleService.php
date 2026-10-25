<?php

namespace App\Services\Google;

use App\Models\GscSetting;
use App\Models\GscSearchAnalytic;
use App\Models\GscInspection;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;
use Exception;

class GoogleSearchConsoleService
{
    protected GoogleAuthService $authService;

    public function __construct(GoogleAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Get the configured site/property URL.
     */
    public function getPropertyId(): string
    {
        $settings = GscSetting::instance();
        return $settings->property_id ?: 'https://coachingsinsikar.com/';
    }

    /**
     * Query Google Search Console Search Analytics API.
     */
    public function querySearchAnalytics(
        string $startDate,
        string $endDate,
        array $dimensions = ['query'],
        int $rowLimit = 250,
        int $startRow = 0,
        string $searchType = 'web'
    ): array {
        $token = $this->authService->getAccessToken();
        $siteUrl = urlencode($this->getPropertyId());

        $payload = [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'dimensions' => $dimensions,
            'rowLimit' => min($rowLimit, 5000),
            'startRow' => $startRow,
            'type' => $searchType,
        ];

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(45)
            ->post("https://www.googleapis.com/webmasters/v3/sites/{$siteUrl}/searchAnalytics/query", $payload);

        if (!$response->successful()) {
            throw new Exception("GSC Search Analytics API Error ({$response->status()}): " . $response->body());
        }

        return $response->json();
    }

    /**
     * Inspect any URL using Google URL Inspection API.
     */
    public function inspectUrl(string $inspectionUrl): array
    {
        $token = $this->authService->getAccessToken();
        $siteUrl = $this->getPropertyId();

        $payload = [
            'inspectionUrl' => $inspectionUrl,
            'siteUrl' => $siteUrl,
            'languageCode' => 'en-US',
        ];

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(45)
            ->post("https://searchconsole.googleapis.com/v1/urlInspection/index:inspect", $payload);

        if (!$response->successful()) {
            throw new Exception("URL Inspection API Error ({$response->status()}): " . $response->body());
        }

        $data = $response->json();
        $inspectionResult = $data['inspectionResult'] ?? [];
        $indexStatusResult = $inspectionResult['indexStatusResult'] ?? [];
        $mobileUsabilityResult = $inspectionResult['mobileUsabilityResult'] ?? [];
        $richResultsResult = $inspectionResult['richResultsResult'] ?? [];

        // Cache inspection result locally
        GscInspection::updateOrCreate(
            ['url' => $inspectionUrl],
            [
                'verdict' => $indexStatusResult['verdict'] ?? 'UNKNOWN',
                'coverage_state' => $indexStatusResult['coverageState'] ?? 'UNKNOWN',
                'crawled_as' => $indexStatusResult['crawledAs'] ?? 'UNKNOWN',
                'last_crawl_time' => !empty($indexStatusResult['lastCrawlTime']) ? Carbon::parse($indexStatusResult['lastCrawlTime']) : null,
                'mobile_usability' => $mobileUsabilityResult['verdict'] ?? 'UNKNOWN',
                'rich_results' => $richResultsResult['detectedItems'] ?? [],
                'raw_response' => $data,
            ]
        );

        return $data;
    }

    /**
     * List all submitted sitemaps in Search Console.
     */
    public function listSitemaps(): array
    {
        $token = $this->authService->getAccessToken();
        $siteUrl = urlencode($this->getPropertyId());

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(30)
            ->get("https://www.googleapis.com/webmasters/v3/sites/{$siteUrl}/sitemaps");

        if (!$response->successful()) {
            throw new Exception("GSC Sitemaps API Error ({$response->status()}): " . $response->body());
        }

        return $response->json('sitemap') ?: [];
    }

    /**
     * Submit a sitemap to Google Search Console.
     */
    public function submitSitemap(string $feedpath): bool
    {
        $token = $this->authService->getAccessToken();
        $siteUrl = urlencode($this->getPropertyId());
        $encodedFeedpath = urlencode($feedpath);

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(30)
            ->put("https://www.googleapis.com/webmasters/v3/sites/{$siteUrl}/sitemaps/{$encodedFeedpath}");

        if (!$response->successful() && $response->status() !== 204) {
            throw new Exception("Failed to submit sitemap ({$response->status()}): " . $response->body());
        }

        return true;
    }

    /**
     * Delete a sitemap from Google Search Console.
     */
    public function deleteSitemap(string $feedpath): bool
    {
        $token = $this->authService->getAccessToken();
        $siteUrl = urlencode($this->getPropertyId());
        $encodedFeedpath = urlencode($feedpath);

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(30)
            ->delete("https://www.googleapis.com/webmasters/v3/sites/{$siteUrl}/sitemaps/{$encodedFeedpath}");

        if (!$response->successful() && $response->status() !== 204) {
            throw new Exception("Failed to delete sitemap ({$response->status()}): " . $response->body());
        }

        return true;
    }

    /**
     * List all verified sites in user's GSC account.
     */
    public function listVerifiedSites(): array
    {
        $token = $this->authService->getAccessToken();

        $response = Http::withoutVerifying()->withToken($token)
            ->timeout(30)
            ->get("https://www.googleapis.com/webmasters/v3/sites");

        if (!$response->successful()) {
            throw new Exception("Failed to list verified sites: " . $response->body());
        }

        return $response->json('siteEntry') ?: [];
    }

    /**
     * Sync and cache the last 28 days of queries & pages into local database.
     */
    public function syncAnalyticsData(int $days = 28): array
    {
        $endDate = Carbon::now()->subDays(2)->format('Y-m-d'); // GSC data has a 2-day lag
        $startDate = Carbon::now()->subDays(2 + $days)->format('Y-m-d');

        // 1. Fetch by Date (for trend chart)
        $dateData = $this->querySearchAnalytics($startDate, $endDate, ['date'], 100);

        // 2. Fetch by Query (for top keywords)
        $queryData = $this->querySearchAnalytics($startDate, $endDate, ['query'], 250);

        // 3. Fetch by Page (for top landing pages)
        $pageData = $this->querySearchAnalytics($startDate, $endDate, ['page'], 250);

        // Store / update in database
        if (!empty($queryData['rows'])) {
            foreach ($queryData['rows'] as $row) {
                GscSearchAnalytic::updateOrCreate(
                    [
                        'date' => $endDate,
                        'query' => $row['keys'][0] ?? '',
                    ],
                    [
                        'clicks' => intval($row['clicks'] ?? 0),
                        'impressions' => intval($row['impressions'] ?? 0),
                        'ctr' => floatval($row['ctr'] ?? 0),
                        'position' => round(floatval($row['position'] ?? 0), 2),
                    ]
                );
            }
        }

        GscSetting::instance()->update([
            'last_synced_at' => now(),
            'last_error' => null,
        ]);

        return [
            'date_rows' => $dateData['rows'] ?? [],
            'query_rows' => $queryData['rows'] ?? [],
            'page_rows' => $pageData['rows'] ?? [],
            'start_date' => $startDate,
            'end_date' => $endDate,
        ];
    }
}
