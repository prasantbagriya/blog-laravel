<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Bing\BingWebmasterService;
use App\Models\BingSubmissionLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BingWebmasterController extends Controller
{
    public function __construct(
        protected BingWebmasterService $bingService
    ) {}

    /**
     * Display the Bing Webmaster Tools & IndexNow Hub.
     */
    public function index(Request $request): Response
    {
        $setting = $this->bingService->getSetting();

        $recentLogs = BingSubmissionLog::latest()
            ->take(30)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'url' => $log->url,
                    'method' => $log->method,
                    'status' => $log->status,
                    'http_code' => $log->http_code,
                    'response_message' => $log->response_message,
                    'created_at' => $log->created_at ? $log->created_at->format('Y-m-d H:i') : null,
                    'created_at_human' => $log->created_at ? $log->created_at->diffForHumans() : null,
                ];
            });

        return Inertia::render('Admin/Bing/Index', [
            'settings' => [
                'site_url' => $setting->site_url ?: config('services.bing.site_url', 'https://coachingsinsikar.com/'),
                'client_id' => $setting->client_id ?: config('services.bing.client_id', '1a80c581602a4b3abd3071232d170f6f'),
                'has_client_secret' => !empty($setting->client_secret) || !empty(config('services.bing.client_secret')),
                'has_api_key' => !empty($setting->api_key) || !empty(config('services.bing.api_key')),
                'api_key' => $setting->api_key ?: (config('services.bing.api_key') ?: ''),
                'is_connected' => (bool) ($setting->is_connected || !empty($setting->api_key) || !empty(config('services.bing.api_key'))),
                'auto_index_posts' => (bool) $setting->auto_index_posts,
                'daily_quota_remaining' => (int) $setting->daily_quota_remaining,
                'token_expires_at' => $setting->token_expires_at ? $setting->token_expires_at->toIso8601String() : null,
                'last_synced_at' => $setting->last_synced_at ? $setting->last_synced_at->diffForHumans() : null,
            ],
            'recentLogs' => $recentLogs,
            'defaultUrls' => [
                ['label' => 'Homepage', 'url' => url('/')],
                ['label' => 'Blog Feed', 'url' => url('/blog')],
                ['label' => 'Top NEET Article', 'url' => url('/blog/5-best-neet-coachings-in-sikar-based-on-google-reviews')],
                ['label' => 'Coaching Directory', 'url' => url('/category/coaching-institutes')],
            ],
            'callbackSuccess' => $request->boolean('connected'),
            'callbackError' => $request->get('error'),
            'initialTab' => $request->get('tab', 'performance'),
        ]);
    }

    /**
     * Redirect to Bing OAuth consent dialog.
     */
    public function redirectToBing()
    {
        $url = $this->bingService->getAuthorizationUrl();
        return redirect()->away($url);
    }

    /**
     * Handle OAuth Callback from Bing.
     */
    public function handleCallback(Request $request)
    {
        if ($request->has('error')) {
            return redirect()->route('admin.bing.index', [
                'error' => $request->get('error_description') ?: $request->get('error'),
            ]);
        }

        $code = $request->get('code');
        if (empty($code)) {
            return redirect()->route('admin.bing.index', ['error' => 'No authorization code received from Bing.']);
        }

        $result = $this->bingService->handleCallback($code);

        if ($result['success']) {
            return redirect()->route('admin.bing.index', ['connected' => 1]);
        }

        return redirect()->route('admin.bing.index', ['error' => $result['error'] ?? 'Authentication failed.']);
    }

    /**
     * API: Get Search Analytics.
     */
    public function getAnalytics(Request $request)
    {
        $days = $request->has('days') ? intval($request->get('days')) : null;
        $startDate = $request->get('start_date');
        $endDate = $request->get('end_date');
        $res = $this->bingService->getQueryStats(null, $startDate, $endDate, $days);
        return response()->json($res);
    }

    /**
     * API: Get Crawl Stats.
     */
    public function getCrawlStats()
    {
        $res = $this->bingService->getCrawlStats();
        return response()->json($res);
    }

    /**
     * API: Submit Single URL for instant indexing.
     */
    public function submitUrl(Request $request)
    {
        $request->validate([
            'url' => 'required|url',
        ]);

        $res = $this->bingService->submitUrl($request->input('url'));
        return response()->json($res);
    }

    /**
     * API: Submit Batch URLs.
     */
    public function submitBatch(Request $request)
    {
        $request->validate([
            'urls' => 'required|array|min:1',
            'urls.*' => 'required|url',
        ]);

        $res = $this->bingService->submitUrlBatch($request->input('urls'));
        return response()->json($res);
    }

    /**
     * API: Get Sitemaps.
     */
    public function getSitemaps()
    {
        $res = $this->bingService->getSitemaps();
        return response()->json($res);
    }

    /**
     * API: Submit Sitemap.
     */
    public function submitSitemap(Request $request)
    {
        $request->validate([
            'sitemap_url' => 'required|url',
        ]);

        $res = $this->bingService->submitSitemap($request->input('sitemap_url'));
        return response()->json($res);
    }

    /**
     * API: Save Credentials & Automation Settings.
     */
    public function saveSettings(Request $request)
    {
        $setting = $this->bingService->getSetting();

        $data = $request->validate([
            'client_id' => 'nullable|string',
            'client_secret' => 'nullable|string',
            'site_url' => 'nullable|url',
            'api_key' => 'nullable|string',
            'auto_index_posts' => 'nullable|boolean',
        ]);

        if (empty($data['client_secret'])) {
            unset($data['client_secret']);
        }

        $setting->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Bing Webmaster settings saved successfully.',
        ]);
    }

    /**
     * API: Disconnect Bing Webmaster Tools.
     */
    public function disconnect()
    {
        $this->bingService->disconnect();

        return response()->json([
            'success' => true,
            'message' => 'Disconnected Bing Webmaster Tools successfully.',
        ]);
    }
}
