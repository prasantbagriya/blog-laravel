<?php

namespace App\Services\Google;

use App\Models\PageSpeedAudit;
use Exception;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GooglePageSpeedService
{
    protected string $apiBase = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

    /**
     * Get configured PageSpeed API Key or fallback to general Google API Key.
     */
    public function getApiKey(): ?string
    {
        return config('services.google.pagespeed_api_key') 
            ?: (env('PAGESPEED_API_KEY') ?: (env('GOOGLE_API_KEY') ?: null));
    }

    /**
     * Save API Key permanently to .env file.
     */
    public function saveApiKey(string $apiKey): bool
    {
        try {
            $envPath = base_path('.env');
            if (file_exists($envPath)) {
                $env = file_get_contents($envPath);
                $key = 'PAGESPEED_API_KEY';
                $val = trim($apiKey);
                if (preg_match("/^{$key}=/m", $env)) {
                    $env = preg_replace("/^{$key}=.*/m", "{$key}=\"{$val}\"", $env);
                } else {
                    $env .= "\n{$key}=\"{$val}\"";
                }
                file_put_contents($envPath, $env);
                Artisan::call('config:clear');
                return true;
            }
        } catch (\Throwable $e) {
            Log::warning('Saving PageSpeed API key to .env failed: ' . $e->getMessage());
        }
        return false;
    }

    /**
     * Run a comprehensive PageSpeed Insights audit for a URL.
     *
     * @param string $url The target URL to test.
     * @param string $strategy 'mobile' or 'desktop'
     * @param bool $forceRefresh Bypass local cache/record
     * @param int|null $userId ID of admin requesting audit
     * @return array Normalized audit result
     * @throws Exception
     */
    public function runAudit(string $url, string $strategy = 'mobile', bool $forceRefresh = false, ?int $userId = null): array
    {
        PageSpeedAudit::ensureSchema();

        $strategy = in_array(strtolower($strategy), ['desktop', 'mobile'], true) ? strtolower($strategy) : 'mobile';
        $normalizedUrl = filter_var($url, FILTER_VALIDATE_URL) ? $url : url('/' . ltrim($url, '/'));

        // Check if an audit was performed recently (within 2 hours) to conserve quota unless forced
        if (!$forceRefresh) {
            $cached = PageSpeedAudit::where('url', $normalizedUrl)
                ->where('strategy', $strategy)
                ->where('created_at', '>=', now()->subHours(2))
                ->latest()
                ->first();

            if ($cached) {
                return $this->formatAuditModel($cached, true);
            }
        }

        $apiKey = $this->getApiKey();

        $params = [
            'url' => $normalizedUrl,
            'strategy' => $strategy,
            'category' => [
                'performance',
                'accessibility',
                'best-practices',
                'seo',
            ],
            'locale' => 'en-US',
        ];

        if (!empty($apiKey)) {
            $params['key'] = $apiKey;
        }

        // Build URL query with repeated category parameters
        $queryString = http_build_query([
            'url' => $normalizedUrl,
            'strategy' => $strategy,
            'locale' => 'en-US',
        ]);
        foreach (['performance', 'accessibility', 'best-practices', 'seo'] as $cat) {
            $queryString .= "&category={$cat}";
        }
        if (!empty($apiKey)) {
            $queryString .= '&key=' . urlencode($apiKey);
        }

        $fullApiUrl = "{$this->apiBase}?{$queryString}";

        $response = Http::withoutVerifying()
            ->timeout(90) // PageSpeed can take 20-40 seconds to emulate browser load
            ->get($fullApiUrl);

        if (!$response->successful()) {
            $status = $response->status();
            $body = $response->json();
            $errorMessage = $body['error']['message'] ?? $response->body();

            if ($status === 429 || str_contains($errorMessage, 'Quota exceeded')) {
                throw new Exception("Google PageSpeed API Quota Exceeded (429). Google Cloud Console (console.cloud.google.com) me jakar 'PageSpeed Insights API' enable karein aur free API Key enter karein (25,000 requests/day free milti hain).");
            }
            if ($status === 400 && str_contains($errorMessage, 'API key not valid')) {
                throw new Exception("Invalid Google PageSpeed API Key. Kripya valid Google Cloud API key verify karein.");
            }

            throw new Exception("Google PageSpeed Insights API Error ({$status}): {$errorMessage}");
        }

        $data = $response->json();
        $parsed = $this->parseResponse($data, $normalizedUrl, $strategy, $userId);

        return $parsed;
    }

    /**
     * Parse and structure the raw Google PageSpeed Insights JSON response.
     */
    protected function parseResponse(array $data, string $url, string $strategy, ?int $userId = null): array
    {
        $lighthouse = $data['lighthouseResult'] ?? [];
        $categories = $lighthouse['categories'] ?? [];
        $audits = $lighthouse['audits'] ?? [];
        $crux = $data['loadingExperience'] ?? [];
        $originCrux = $data['originLoadingExperience'] ?? [];

        // 1. Lighthouse Scores (0 to 100)
        $scores = [
            'performance' => isset($categories['performance']['score']) ? (int) round($categories['performance']['score'] * 100) : 0,
            'accessibility' => isset($categories['accessibility']['score']) ? (int) round($categories['accessibility']['score'] * 100) : 0,
            'best_practices' => isset($categories['best-practices']['score']) ? (int) round($categories['best-practices']['score'] * 100) : 0,
            'seo' => isset($categories['seo']['score']) ? (int) round($categories['seo']['score'] * 100) : 0,
        ];

        // 2. Core Web Vitals & Lab Metrics
        $cwv = [
            'fcp' => [
                'value' => (float) ($audits['first-contentful-paint']['numericValue'] ?? 0) / 1000,
                'display' => $audits['first-contentful-paint']['displayValue'] ?? 'N/A',
                'score' => $audits['first-contentful-paint']['score'] ?? null,
                'status' => $this->classifyMetric('fcp', ($audits['first-contentful-paint']['numericValue'] ?? 0) / 1000),
            ],
            'lcp' => [
                'value' => (float) ($audits['largest-contentful-paint']['numericValue'] ?? 0) / 1000,
                'display' => $audits['largest-contentful-paint']['displayValue'] ?? 'N/A',
                'score' => $audits['largest-contentful-paint']['score'] ?? null,
                'status' => $this->classifyMetric('lcp', ($audits['largest-contentful-paint']['numericValue'] ?? 0) / 1000),
            ],
            'tbt' => [
                'value' => (float) ($audits['total-blocking-time']['numericValue'] ?? 0),
                'display' => $audits['total-blocking-time']['displayValue'] ?? 'N/A',
                'score' => $audits['total-blocking-time']['score'] ?? null,
                'status' => $this->classifyMetric('tbt', ($audits['total-blocking-time']['numericValue'] ?? 0)),
            ],
            'cls' => [
                'value' => (float) ($audits['cumulative-layout-shift']['numericValue'] ?? 0),
                'display' => $audits['cumulative-layout-shift']['displayValue'] ?? '0',
                'score' => $audits['cumulative-layout-shift']['score'] ?? null,
                'status' => $this->classifyMetric('cls', ($audits['cumulative-layout-shift']['numericValue'] ?? 0)),
            ],
            'speed_index' => [
                'value' => (float) ($audits['speed-index']['numericValue'] ?? 0) / 1000,
                'display' => $audits['speed-index']['displayValue'] ?? 'N/A',
                'score' => $audits['speed-index']['score'] ?? null,
                'status' => $this->classifyMetric('speed_index', ($audits['speed-index']['numericValue'] ?? 0) / 1000),
            ],
            'ttfb' => [
                'value' => (float) ($audits['server-response-time']['numericValue'] ?? 0),
                'display' => $audits['server-response-time']['displayValue'] ?? 'N/A',
                'score' => $audits['server-response-time']['score'] ?? null,
                'status' => $this->classifyMetric('ttfb', ($audits['server-response-time']['numericValue'] ?? 0)),
            ],
        ];

        // 3. Opportunities (Actionable Savings)
        $opportunities = [];
        $opportunityKeys = [
            'render-blocking-resources',
            'unused-javascript',
            'unused-css-rules',
            'modern-image-formats',
            'uses-optimized-images',
            'uses-responsive-images',
            'offscreen-images',
            'unminified-javascript',
            'unminified-css',
            'uses-text-compression',
            'efficient-animated-content',
            'duplicated-javascript',
            'server-response-time',
            'redirects',
        ];

        foreach ($opportunityKeys as $key) {
            if (isset($audits[$key]) && ($audits[$key]['score'] ?? 1) < 0.9) {
                $audit = $audits[$key];
                $savingsMs = $audit['details']['overallSavingsMs'] ?? 0;
                $savingsBytes = $audit['details']['overallSavingsBytes'] ?? 0;

                if ($savingsMs > 50 || $savingsBytes > 10240 || ($audit['score'] ?? 1) < 0.5) {
                    $opportunities[] = [
                        'id' => $key,
                        'title' => $audit['title'] ?? $key,
                        'description' => strip_tags($audit['description'] ?? ''),
                        'display_value' => $audit['displayValue'] ?? '',
                        'score' => $audit['score'] ?? 0,
                        'savings_ms' => round($savingsMs),
                        'savings_kib' => round($savingsBytes / 1024, 1),
                        'items_count' => count($audit['details']['items'] ?? []),
                    ];
                }
            }
        }

        // Sort opportunities by largest estimated time savings
        usort($opportunities, fn($a, $b) => $b['savings_ms'] <=> $a['savings_ms']);

        // 4. Diagnostics Highlights
        $diagnostics = [];
        $diagnosticKeys = [
            'dom-size' => 'DOM Size',
            'critical-request-chains' => 'Critical Request Chains',
            'mainthread-work-breakdown' => 'Main Thread Work',
            'bootup-time' => 'JavaScript Execution Time',
            'total-byte-weight' => 'Total Network Payload',
            'font-display' => 'Font Display Strategy',
            'uses-long-cache-ttl' => 'Static Asset Cache Lifetime',
        ];

        foreach ($diagnosticKeys as $dKey => $label) {
            if (isset($audits[$dKey])) {
                $d = $audits[$dKey];
                $diagnostics[] = [
                    'id' => $dKey,
                    'label' => $label,
                    'title' => $d['title'] ?? $label,
                    'display_value' => $d['displayValue'] ?? 'Good',
                    'score' => $d['score'] ?? 1,
                    'description' => strip_tags($d['description'] ?? ''),
                ];
            }
        }

        // 5. Chrome User Experience Report (CrUX) Field Data
        $cruxSummary = [
            'overall_category' => $crux['overall_category'] ?? ($originCrux['overall_category'] ?? 'NONE'),
            'url_data_available' => !empty($crux['metrics']),
            'origin_data_available' => !empty($originCrux['metrics']),
            'metrics' => [],
        ];

        $cruxSource = !empty($crux['metrics']) ? $crux['metrics'] : ($originCrux['metrics'] ?? []);
        foreach ($cruxSource as $metricKey => $metricData) {
            $cruxSummary['metrics'][$metricKey] = [
                'percentile' => $metricData['percentile'] ?? null,
                'category' => $metricData['category'] ?? 'AVERAGE',
                'distributions' => $metricData['distributions'] ?? [],
            ];
        }

        // 6. Persist Audit Record to Database
        $auditModel = PageSpeedAudit::create([
            'url' => $url,
            'strategy' => $strategy,
            'performance_score' => $scores['performance'],
            'accessibility_score' => $scores['accessibility'],
            'best_practices_score' => $scores['best_practices'],
            'seo_score' => $scores['seo'],
            'fcp_value' => $cwv['fcp']['value'],
            'fcp_display' => $cwv['fcp']['display'],
            'lcp_value' => $cwv['lcp']['value'],
            'lcp_display' => $cwv['lcp']['display'],
            'tbt_value' => $cwv['tbt']['value'],
            'tbt_display' => $cwv['tbt']['display'],
            'cls_value' => $cwv['cls']['value'],
            'cls_display' => $cwv['cls']['display'],
            'speed_index_value' => $cwv['speed_index']['value'],
            'speed_index_display' => $cwv['speed_index']['display'],
            'ttfb_value' => $cwv['ttfb']['value'],
            'ttfb_display' => $cwv['ttfb']['display'],
            'field_overall_category' => $cruxSummary['overall_category'],
            'field_metrics' => $cruxSummary,
            'opportunities' => $opportunities,
            'diagnostics' => $diagnostics,
            'lighthouse_version' => $lighthouse['lighthouseVersion'] ?? '12.0',
            'tested_by' => $userId ?: (auth()->check() ? auth()->id() : null),
        ]);

        return $this->formatAuditModel($auditModel, false);
    }

    /**
     * Format PageSpeedAudit model for frontend consumption.
     */
    public function formatAuditModel(PageSpeedAudit $audit, bool $fromCache = false): array
    {
        return [
            'id' => $audit->id,
            'url' => $audit->url,
            'strategy' => $audit->strategy,
            'is_cached' => $fromCache,
            'tested_at' => $audit->created_at ? $audit->created_at->format('M d, Y h:i A') : 'Just now',
            'tested_at_human' => $audit->created_at ? $audit->created_at->diffForHumans() : 'Just now',
            'scores' => [
                'performance' => $audit->performance_score,
                'accessibility' => $audit->accessibility_score,
                'best_practices' => $audit->best_practices_score,
                'seo' => $audit->seo_score,
            ],
            'core_web_vitals' => [
                'fcp' => [
                    'value' => $audit->fcp_value,
                    'display' => $audit->fcp_display ?: "{$audit->fcp_value}s",
                    'status' => $this->classifyMetric('fcp', (float) $audit->fcp_value),
                ],
                'lcp' => [
                    'value' => $audit->lcp_value,
                    'display' => $audit->lcp_display ?: "{$audit->lcp_value}s",
                    'status' => $this->classifyMetric('lcp', (float) $audit->lcp_value),
                ],
                'tbt' => [
                    'value' => $audit->tbt_value,
                    'display' => $audit->tbt_display ?: "{$audit->tbt_value} ms",
                    'status' => $this->classifyMetric('tbt', (float) $audit->tbt_value),
                ],
                'cls' => [
                    'value' => $audit->cls_value,
                    'display' => $audit->cls_display ?: (string) $audit->cls_value,
                    'status' => $this->classifyMetric('cls', (float) $audit->cls_value),
                ],
                'speed_index' => [
                    'value' => $audit->speed_index_value,
                    'display' => $audit->speed_index_display ?: "{$audit->speed_index_value}s",
                    'status' => $this->classifyMetric('speed_index', (float) $audit->speed_index_value),
                ],
                'ttfb' => [
                    'value' => $audit->ttfb_value,
                    'display' => $audit->ttfb_display ?: "{$audit->ttfb_value} ms",
                    'status' => $this->classifyMetric('ttfb', (float) $audit->ttfb_value),
                ],
            ],
            'crux' => $audit->field_metrics ?: [
                'overall_category' => $audit->field_overall_category ?: 'NONE',
            ],
            'opportunities' => $audit->opportunities ?: [],
            'diagnostics' => $audit->diagnostics ?: [],
            'lighthouse_version' => $audit->lighthouse_version,
        ];
    }

    /**
     * Get recent audit history across pages.
     */
    public function getRecentAudits(int $limit = 20): array
    {
        PageSpeedAudit::ensureSchema();

        return PageSpeedAudit::latest()
            ->take($limit)
            ->get()
            ->map(fn($a) => $this->formatAuditModel($a))
            ->toArray();
    }

    /**
     * Classify standard Google thresholds: 'good', 'needs_improvement', 'poor'.
     */
    protected function classifyMetric(string $metric, float $val): string
    {
        switch ($metric) {
            case 'lcp':
                if ($val <= 2.5) return 'good';
                if ($val <= 4.0) return 'needs_improvement';
                return 'poor';
            case 'fcp':
                if ($val <= 1.8) return 'good';
                if ($val <= 3.0) return 'needs_improvement';
                return 'poor';
            case 'tbt':
                if ($val <= 200) return 'good';
                if ($val <= 600) return 'needs_improvement';
                return 'poor';
            case 'cls':
                if ($val <= 0.1) return 'good';
                if ($val <= 0.25) return 'needs_improvement';
                return 'poor';
            case 'speed_index':
                if ($val <= 3.4) return 'good';
                if ($val <= 5.8) return 'needs_improvement';
                return 'poor';
            case 'ttfb':
                if ($val <= 800) return 'good';
                if ($val <= 1800) return 'needs_improvement';
                return 'poor';
            default:
                return 'good';
        }
    }
}
