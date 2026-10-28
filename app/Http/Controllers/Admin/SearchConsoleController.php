<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\GscSetting;
use App\Models\GscSearchAnalytic;
use App\Models\GscIndexingLog;
use App\Models\GscInspection;
use App\Models\PageSpeedAudit;
use App\Services\Google\GoogleAuthService;
use App\Services\Google\GoogleSearchConsoleService;
use App\Services\Google\GoogleIndexingService;
use App\Services\Google\GooglePageSpeedService;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;

class SearchConsoleController extends Controller
{
    protected GoogleAuthService $authService;
    protected GoogleSearchConsoleService $gscService;
    protected GoogleIndexingService $indexingService;
    protected GooglePageSpeedService $pageSpeedService;

    public function __construct(
        GoogleAuthService $authService,
        GoogleSearchConsoleService $gscService,
        GoogleIndexingService $indexingService,
        GooglePageSpeedService $pageSpeedService
    ) {
        $this->authService = $authService;
        $this->gscService = $gscService;
        $this->indexingService = $indexingService;
        $this->pageSpeedService = $pageSpeedService;
    }

    /**
     * Display the Google Search Console Hub in Admin Panel.
     */
    public function index(Request $request)
    {
        // 1. Auto-check & auto-migrate if GSC tables are missing
        if (!\Illuminate\Support\Facades\Schema::hasTable('gsc_settings') || 
            !\Illuminate\Support\Facades\Schema::hasTable('gsc_search_analytics')) {
            try {
                \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
            } catch (\Throwable $e) {}
        }

        try {
            $settings = GscSetting::instance();
        } catch (\Throwable $e) {
            $settings = new GscSetting([
                'property_id' => config('services.google.site_url', 'https://coachingsinsikar.com/'),
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect_uri', 'https://coachingsinsikar.com/auth/callback'),
                'is_connected' => false,
            ]);
        }

        $localSitemaps = [
            ['path' => url('/sitemap.xml'), 'type' => 'Index Sitemap', 'description' => 'Main site & directory index'],
            ['path' => url('/sitemap/posts.xml'), 'type' => 'Blog Posts Sitemap', 'description' => 'All published blog articles'],
            ['path' => url('/sitemap/businesses.xml'), 'type' => 'Business Directory Sitemap', 'description' => 'All verified businesses & coaching institutes'],
            ['path' => url('/sitemap/stories.xml'), 'type' => 'Web Stories Sitemap', 'description' => 'Visual Google Web Stories'],
            ['path' => url('/sitemap/categories.xml'), 'type' => 'Categories Sitemap', 'description' => 'All blog and coaching categories'],
            ['path' => url('/sitemap/authors.xml'), 'type' => 'Authors Sitemap', 'description' => 'Editorial author profiles'],
            ['path' => url('/sitemap/communities.xml'), 'type' => 'Communities Sitemap', 'description' => 'Student communities & forums'],
            ['path' => url('/news-sitemap.xml'), 'type' => 'Google News Sitemap', 'description' => 'Fresh news & editorial articles'],
            ['path' => url('/blog/feed.xml'), 'type' => 'RSS News Feed', 'description' => 'Fast-updating RSS feed'],
        ];

        // Fetch live GSC sitemaps directly if connected
        $initialSitemaps = [];
        try {
            if ($settings->is_connected) {
                $initialSitemaps = $this->gscService->listSitemaps();
            }
        } catch (\Throwable $e) {}

        // Retrieve cached analytics summary
        $cachedTopQueries = [];
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('gsc_search_analytics')) {
                $cachedTopQueries = GscSearchAnalytic::orderBy('clicks', 'desc')
                    ->orderBy('impressions', 'desc')
                    ->take(50)
                    ->get();
            }
        } catch (\Throwable $e) {}

        $indexingLogs = [];
        try {
            if (\Illuminate\Support\Facades\Schema::hasTable('gsc_indexing_logs')) {
                $indexingLogs = GscIndexingLog::orderBy('created_at', 'desc')->take(25)->get();
            }
        } catch (\Throwable $e) {}

        $quotaStats = $this->indexingService->getDailyQuotaStats();

        $serviceAccountEmail = null;
        $projectId = null;
        if (!empty($settings->service_account_json)) {
            $sa = is_array($settings->service_account_json) 
                ? $settings->service_account_json 
                : json_decode($settings->service_account_json, true);
            $serviceAccountEmail = $sa['client_email'] ?? null;
            $projectId = $sa['project_id'] ?? null;
        }

        // Auto-heal PageSpeed schema
        PageSpeedAudit::ensureSchema();

        $pageSpeedApiKey = $this->pageSpeedService->getApiKey();
        $recentPageSpeedAudits = [];
        try {
            $recentPageSpeedAudits = $this->pageSpeedService->getRecentAudits(10);
        } catch (\Throwable $e) {}

        $siteBase = str_contains(url('/'), 'localhost') || str_contains(url('/'), '127.0.0.1')
            ? 'https://coachingsinsikar.com'
            : rtrim(url('/'), '/');

        return Inertia::render('Admin/SearchConsole/Index', [
            'settings' => [
                'property_id' => $settings->property_id,
                'client_id' => $settings->client_id,
                'has_client_secret' => !empty($settings->client_secret),
                'redirect_uri' => $settings->redirect_uri ?: config('services.google.redirect_uri', 'https://coachingsinsikar.com/auth/callback'),
                'is_connected' => (bool) $settings->is_connected,
                'auth_mode' => $settings->auth_mode,
                'service_account_email' => $serviceAccountEmail,
                'project_id' => $projectId,
                'auto_index_posts' => (bool) $settings->auto_index_posts,
                'auto_index_businesses' => (bool) $settings->auto_index_businesses,
                'auto_index_stories' => (bool) $settings->auto_index_stories,
                'last_synced_at' => $settings->last_synced_at ? $settings->last_synced_at->toIso8601String() : null,
                'last_error' => $settings->last_error,
                'suggested_redirect_uris' => [
                    'https://coachingsinsikar.com/auth/callback',
                    'https://app.coachingsinsikar.com/auth/callback',
                    url('/admin/gsc/callback'),
                ],
            ],
            'pageSpeedData' => [
                'hasApiKey' => !empty($pageSpeedApiKey),
                'apiKey' => $pageSpeedApiKey,
                'recentAudits' => $recentPageSpeedAudits,
                'defaultUrls' => [
                    ['label' => 'Homepage', 'url' => $siteBase . '/'],
                    ['label' => 'Blog Feed', 'url' => $siteBase . '/blog'],
                    ['label' => 'Top NEET Article', 'url' => $siteBase . '/blog/5-best-neet-coachings-in-sikar-based-on-google-reviews'],
                    ['label' => 'Business Directory', 'url' => $siteBase . '/business/coaching-institutes'],
                ],
            ],
            'initialTab' => $request->is('admin/pagespeed*') ? 'pagespeed' : $request->get('tab', 'performance'),
            'localSitemaps' => $localSitemaps,
            'initialSitemaps' => $initialSitemaps,
            'cachedQueries' => $cachedTopQueries,
            'recentLogs' => $indexingLogs,
            'quotaStats' => $quotaStats,
            'callbackSuccess' => $request->boolean('connected'),
            'callbackError' => $request->get('error'),
        ]);
    }

    /**
     * Resolve the effective OAuth redirect URI reliably.
     */
    protected function getEffectiveRedirectUri(?string $requestedUri = null): string
    {
        if (!empty($requestedUri)) {
            return $requestedUri;
        }
        return config('services.google.redirect_uri') ?: (GscSetting::instance()->redirect_uri ?: url('/auth/callback'));
    }

    /**
     * Redirect user to Google OAuth consent screen for website authentication.
     */
    public function redirectToGoogleLogin(Request $request)
    {
        $clientId = config('services.google.client_id') ?: GscSetting::instance()->client_id;
        $redirectUri = $this->getEffectiveRedirectUri();

        if (empty($clientId)) {
            return redirect()->route('login')->withErrors(['email' => 'Google Login is not configured yet.']);
        }

        $params = [
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'openid email profile',
            'access_type' => 'online',
            'state' => 'google_auth_login',
            'prompt' => 'select_account',
        ];

        return redirect()->away('https://accounts.google.com/o/oauth2/v2/auth?' . http_build_query($params));
    }

    /**
     * Redirect admin to Google OAuth consent screen for Search Console.
     */
    public function redirectAuth(Request $request)
    {
        try {
            $redirectUri = $this->getEffectiveRedirectUri($request->input('redirect_uri'));
            $url = $this->authService->getAuthorizationUrl($redirectUri);
            return redirect()->away($url);
        } catch (\Throwable $e) {
            return redirect()->route('admin.gsc.index', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Handle incoming Google OAuth redirect callback (Handles both Search Console connect & User Login).
     */
    public function handleCallback(Request $request)
    {
        $state = (string) $request->input('state');
        $isUserLogin = ($state === 'google_auth_login');

        // Restore admin session if token encoded in state and session was dropped during Google redirect
        if (str_starts_with($state, 'gsc_connect:')) {
            $token = substr($state, 12);
            if (!empty($token) && !auth()->check()) {
                try {
                    $userId = decrypt($token);
                    $adminUser = \App\Models\User::find($userId);
                    if ($adminUser && ($adminUser->is_admin || in_array($adminUser->role, ['admin', 'super_admin'], true))) {
                        \Illuminate\Support\Facades\Auth::login($adminUser, true);
                        $request->session()->regenerate();
                    }
                } catch (\Throwable $ignore) {}
            }
        }

        if ($request->has('error')) {
            $error = $request->input('error_description') ?: $request->input('error');
            if ($isUserLogin) {
                return redirect()->route('login')->withErrors(['email' => "Google login cancelled or failed: {$error}"]);
            }
            return redirect()->route('admin.gsc.index', ['error' => $error]);
        }

        $code = $request->input('code');
        if (empty($code)) {
            if ($isUserLogin) {
                return redirect()->route('login')->withErrors(['email' => 'No authorization code received from Google.']);
            }
            return redirect()->route('admin.gsc.index', ['error' => 'No authorization code received from Google.']);
        }

        $redirectUri = $this->getEffectiveRedirectUri();

        // FLOW 1: Website User or Admin is logging in with Google
        if ($isUserLogin) {
            return $this->handleGoogleUserLogin($code, $redirectUri);
        }

        // FLOW 2: Admin connecting Google Search Console API
        try {
            try {
                $this->authService->handleCallback($code, $redirectUri);
            } catch (\Throwable $e) {
                // Smart Fallback: If redirect_uri_mismatch, try alternating between app.coachingsinsikar.com and coachingsinsikar.com
                if (str_contains($e->getMessage(), 'redirect_uri_mismatch') || str_contains($e->getMessage(), 'mismatch')) {
                    $altUri = str_contains($redirectUri, 'app.coachingsinsikar.com')
                        ? str_replace('app.coachingsinsikar.com', 'coachingsinsikar.com', $redirectUri)
                        : str_replace('coachingsinsikar.com', 'app.coachingsinsikar.com', $redirectUri);
                    $this->authService->handleCallback($code, $altUri);
                } else {
                    throw $e;
                }
            }

            // Trigger initial sync in background / directly
            try {
                $this->gscService->syncAnalyticsData(28);
            } catch (\Throwable $ignore) {}

            return redirect()->route('admin.gsc.index', ['connected' => 1]);
        } catch (\Throwable $e) {
            return redirect()->route('admin.gsc.index', ['error' => $e->getMessage()]);
        }
    }

    /**
     * Complete User Login via Google OAuth tokens.
     */
    protected function handleGoogleUserLogin(string $code, string $redirectUri)
    {
        $clientId = config('services.google.client_id') ?: GscSetting::instance()->client_id;
        $clientSecret = config('services.google.client_secret') ?: GscSetting::instance()->client_secret;

        try {
            // 1. Exchange code for access token
            $tokenRes = \Illuminate\Support\Facades\Http::withoutVerifying()->asForm()->post('https://oauth2.googleapis.com/token', [
                'code' => $code,
                'client_id' => $clientId,
                'client_secret' => $clientSecret,
                'redirect_uri' => $redirectUri,
                'grant_type' => 'authorization_code',
            ]);

            // Smart Fallback: If redirect_uri_mismatch, try the other registered URI
            if (!$tokenRes->successful() && (str_contains($tokenRes->body(), 'redirect_uri_mismatch') || str_contains($tokenRes->body(), 'mismatch'))) {
                $altUri = str_contains($redirectUri, 'app.coachingsinsikar.com')
                    ? str_replace('app.coachingsinsikar.com', 'coachingsinsikar.com', $redirectUri)
                    : str_replace('coachingsinsikar.com', 'app.coachingsinsikar.com', $redirectUri);

                $tokenRes = \Illuminate\Support\Facades\Http::withoutVerifying()->asForm()->post('https://oauth2.googleapis.com/token', [
                    'code' => $code,
                    'client_id' => $clientId,
                    'client_secret' => $clientSecret,
                    'redirect_uri' => $altUri,
                    'grant_type' => 'authorization_code',
                ]);
            }

            if (!$tokenRes->successful()) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Google authorization exchange failed: ' . ($tokenRes->json('error_description') ?: $tokenRes->body()),
                ]);
            }

            $accessToken = $tokenRes->json('access_token');

            // 2. Fetch user profile from Google
            $userInfoRes = \Illuminate\Support\Facades\Http::withoutVerifying()->withToken($accessToken)
                ->get('https://www.googleapis.com/oauth2/v3/userinfo');

            if (!$userInfoRes->successful()) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Failed to fetch profile details from Google.',
                ]);
            }

            $profile = $userInfoRes->json();
            $email = $profile['email'] ?? null;
            $name = $profile['name'] ?? 'Google User';
            $picture = $profile['picture'] ?? null;

            if (empty($email)) {
                return redirect()->route('login')->withErrors([
                    'email' => 'Google did not return an email address.',
                ]);
            }

            // 3. Find or Create User
            $user = \App\Models\User::where('email', $email)->first();

            if (!$user) {
                $baseUsername = \Illuminate\Support\Str::slug(explode('@', $email)[0], '_');
                $username = $baseUsername;
                $counter = 1;
                while (\App\Models\User::where('username', $username)->exists()) {
                    $username = $baseUsername . '_' . $counter++;
                }

                $user = \App\Models\User::create([
                    'name' => $name,
                    'email' => $email,
                    'username' => $username,
                    'profile_picture' => $picture,
                    'password' => bcrypt(\Illuminate\Support\Str::random(32)),
                ]);
                $user->email_verified_at = now();
                $user->save();
            } else {
                if (empty($user->profile_picture) && !empty($picture)) {
                    $user->update(['profile_picture' => $picture]);
                }
                if (!$user->email_verified_at) {
                    $user->email_verified_at = now();
                    $user->save();
                }
            }

            // 4. Authenticate User session
            \Illuminate\Support\Facades\Auth::login($user, true);
            request()->session()->regenerate();

            if ($user->is_admin || in_array($user->role, ['admin', 'super_admin'], true)) {
                return redirect()->intended('/admin');
            }

            return redirect()->intended('/dashboard');
        } catch (\Throwable $e) {
            return redirect()->route('login')->withErrors([
                'email' => 'Google login error: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Connect manually using authorization code pasted in UI.
     */
    public function connectWithCode(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        try {
            $code = trim($request->input('code'));
            $redirectUri = $request->input('redirect_uri') ?: GscSetting::instance()->redirect_uri;
            $this->authService->handleCallback($code, $redirectUri);

            try {
                $this->gscService->syncAnalyticsData(28);
            } catch (\Throwable $ignore) {}

            return response()->json(['success' => true, 'message' => 'Successfully connected to Google Search Console!']);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 422);
        }
    }

    /**
     * Save configuration, credentials JSON, and settings.
     */
    public function saveSettings(Request $request)
    {
        $settings = GscSetting::instance();

        // 1. Check if user uploaded a Google credentials JSON file
        if ($request->hasFile('credentials_file')) {
            $file = $request->file('credentials_file');
            $content = json_decode(file_get_contents($file->getRealPath()), true);

            if (isset($content['web'])) {
                // OAuth 2.0 Web Client JSON
                $settings->client_id = $content['web']['client_id'] ?? $settings->client_id;
                $settings->client_secret = $content['web']['client_secret'] ?? $settings->client_secret;
                $settings->redirect_uri = $content['web']['redirect_uris'][0] ?? $settings->redirect_uri;
                $settings->auth_mode = 'oauth';
            } elseif (isset($content['type']) && $content['type'] === 'service_account') {
                // Service Account JSON
                $settings->service_account_json = $content;
                $settings->auth_mode = 'service_account';
                $settings->is_connected = true; // Service account connects immediately
            }
        }

        // 2. Direct field inputs
        if ($request->filled('client_id')) {
            $settings->client_id = trim($request->input('client_id'));
        }
        if ($request->filled('client_secret')) {
            $settings->client_secret = trim($request->input('client_secret'));
        }
        if ($request->filled('redirect_uri')) {
            $settings->redirect_uri = trim($request->input('redirect_uri'));
        }
        if ($request->filled('property_id')) {
            $settings->property_id = trim($request->input('property_id'));
        }
        if ($request->has('auto_index_posts')) {
            $settings->auto_index_posts = $request->boolean('auto_index_posts');
        }
        if ($request->has('auto_index_businesses')) {
            $settings->auto_index_businesses = $request->boolean('auto_index_businesses');
        }
        if ($request->has('auto_index_stories')) {
            $settings->auto_index_stories = $request->boolean('auto_index_stories');
        }

        $settings->save();

        return response()->json(['success' => true, 'settings' => $settings->fresh()]);
    }

    /**
     * Disconnect Google Search Console account.
     */
    public function disconnect()
    {
        $settings = GscSetting::instance();
        $settings->update([
            'access_token' => null,
            'refresh_token' => null,
            'token_expires_at' => null,
            'service_account_json' => null,
            'is_connected' => false,
            'last_error' => null,
        ]);

        \Illuminate\Support\Facades\Cache::forget('gsc_active_access_token');

        return response()->json(['success' => true]);
    }

    /**
     * Get live or cached Search Analytics.
     */
    public function getAnalytics(Request $request)
    {
        $days = intval($request->get('days', 28));
        $dataState = 'final';

        if ($days === 1 || $request->get('hours') == 24) {
            // 24H: Google preliminary/fresh data (within last 24-48 hours)
            $startDate = $request->get('start_date', Carbon::now()->subDays(1)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->format('Y-m-d'));
            $dataState = 'all';
        } else {
            $startDate = $request->get('start_date', Carbon::now()->subDays(2 + $days)->format('Y-m-d'));
            $endDate = $request->get('end_date', Carbon::now()->subDays(2)->format('Y-m-d'));
            $dataState = ($days <= 3) ? 'all' : 'final';
        }
        $searchType = $request->get('type', 'web');

        try {
            // Live query to GSC API with automatic fallback if 24H fresh data is not ready from Google
            try {
                $queries = $this->gscService->querySearchAnalytics($startDate, $endDate, ['query'], 200, 0, $searchType, $dataState);
                $pages = $this->gscService->querySearchAnalytics($startDate, $endDate, ['page'], 200, 0, $searchType, $dataState);
                $dates = $this->gscService->querySearchAnalytics($startDate, $endDate, ['date'], 100, 0, $searchType, $dataState);
                $devices = $this->gscService->querySearchAnalytics($startDate, $endDate, ['device'], 10, 0, $searchType, $dataState);
                $countries = $this->gscService->querySearchAnalytics($startDate, $endDate, ['country'], 20, 0, $searchType, $dataState);
            } catch (\Throwable $apiEx) {
                // If 24H query failed because Google hasn't published fresh hourly data yet, fall back to last available final day
                if ($days === 1 || $dataState === 'all') {
                    $fallbackStart = Carbon::now()->subDays(3)->format('Y-m-d');
                    $fallbackEnd = Carbon::now()->subDays(2)->format('Y-m-d');
                    $queries = $this->gscService->querySearchAnalytics($fallbackStart, $fallbackEnd, ['query'], 200, 0, $searchType, 'final');
                    $pages = $this->gscService->querySearchAnalytics($fallbackStart, $fallbackEnd, ['page'], 200, 0, $searchType, 'final');
                    $dates = $this->gscService->querySearchAnalytics($fallbackStart, $fallbackEnd, ['date'], 100, 0, $searchType, 'final');
                    $devices = $this->gscService->querySearchAnalytics($fallbackStart, $fallbackEnd, ['device'], 10, 0, $searchType, 'final');
                    $countries = $this->gscService->querySearchAnalytics($fallbackStart, $fallbackEnd, ['country'], 20, 0, $searchType, 'final');
                    $startDate = $fallbackStart;
                    $endDate = $fallbackEnd;
                } else {
                    throw $apiEx;
                }
            }

            // Calculate totals
            $totalClicks = array_sum(array_column($dates['rows'] ?? [], 'clicks'));
            $totalImpressions = array_sum(array_column($dates['rows'] ?? [], 'impressions'));
            $avgCtr = $totalImpressions > 0 ? round(($totalClicks / $totalImpressions) * 100, 2) : 0;
            $positions = array_filter(array_column($dates['rows'] ?? [], 'position'));
            $avgPosition = count($positions) > 0 ? round(array_sum($positions) / count($positions), 1) : 0;

            return response()->json([
                'success' => true,
                'totals' => [
                    'clicks' => $totalClicks,
                    'impressions' => $totalImpressions,
                    'ctr' => $avgCtr,
                    'position' => $avgPosition,
                ],
                'date_rows' => $dates['rows'] ?? [],
                'query_rows' => $queries['rows'] ?? [],
                'page_rows' => $pages['rows'] ?? [],
                'device_rows' => $devices['rows'] ?? [],
                'country_rows' => $countries['rows'] ?? [],
                'start_date' => $startDate,
                'end_date' => $endDate,
                'data_state' => $dataState,
            ]);
        } catch (\Throwable $e) {
            $cachedQueries = GscSearchAnalytic::orderBy('clicks', 'desc')->take(50)->get();
            return response()->json([
                'success' => true,
                'is_fallback' => true,
                'warning' => 'Google Search Console 24H data is temporarily processing on Google servers. Showing cached analytics.',
                'error' => $e->getMessage(),
                'totals' => [
                    'clicks' => $cachedQueries->sum('clicks'),
                    'impressions' => $cachedQueries->sum('impressions'),
                    'ctr' => $cachedQueries->sum('impressions') > 0 ? round(($cachedQueries->sum('clicks') / $cachedQueries->sum('impressions')) * 100, 2) : 0,
                    'position' => round($cachedQueries->avg('position') ?: 0, 1),
                ],
                'date_rows' => [],
                'query_rows' => $cachedQueries->map(fn($q) => [
                    'keys' => [$q->query],
                    'clicks' => $q->clicks,
                    'impressions' => $q->impressions,
                    'ctr' => $q->ctr,
                    'position' => $q->position,
                ]),
                'page_rows' => [],
                'device_rows' => [],
                'country_rows' => [],
                'start_date' => $startDate,
                'end_date' => $endDate,
            ]);
        }
    }

    /**
     * Trigger manual sync of Search Analytics data.
     */
    public function syncAnalytics()
    {
        try {
            $data = $this->gscService->syncAnalyticsData(28);
            return response()->json(['success' => true, 'synced' => true, 'data' => $data]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Inspect a URL using Google URL Inspection API.
     */
    public function inspectUrl(Request $request)
    {
        $request->validate(['url' => 'required|url']);
        $url = trim($request->input('url'));

        try {
            $result = $this->gscService->inspectUrl($url);
            return response()->json(['success' => true, 'inspection' => $result]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * List all sitemaps in GSC.
     */
    public function getSitemaps()
    {
        try {
            $sitemaps = $this->gscService->listSitemaps();
            return response()->json(['success' => true, 'sitemaps' => $sitemaps]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Submit a sitemap to Google Search Console.
     */
    public function submitSitemap(Request $request)
    {
        $request->validate(['feedpath' => 'required|string']);
        $feedpath = trim($request->input('feedpath'));

        try {
            $this->gscService->submitSitemap($feedpath);
            return response()->json(['success' => true, 'message' => "Sitemap {$feedpath} successfully submitted!"]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a sitemap from Google Search Console.
     */
    public function deleteSitemap(Request $request)
    {
        $request->validate(['feedpath' => 'required|string']);
        $feedpath = trim($request->input('feedpath'));

        try {
            $this->gscService->deleteSitemap($feedpath);
            return response()->json(['success' => true, 'message' => "Sitemap {$feedpath} deleted from Google Search Console."]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Instant index single or multiple URLs via Google Indexing API.
     */
    public function indexUrl(Request $request)
    {
        $request->validate([
            'urls' => 'nullable|array',
            'url' => 'nullable|string',
            'action' => 'nullable|string|in:URL_UPDATED,URL_DELETED',
            'force' => 'nullable|boolean',
        ]);

        $action = $request->input('action', 'URL_UPDATED');
        $force = $request->boolean('force');
        $urls = $request->input('urls') ?: [$request->input('url')];
        $urls = array_filter(array_map('trim', (array) $urls));

        if (empty($urls)) {
            return response()->json(['success' => false, 'error' => 'No valid URLs provided.'], 422);
        }

        try {
            $results = $this->indexingService->batchPublish($urls, $action, 'manual_admin', $force);
            return response()->json([
                'success' => true,
                'results' => $results,
                'quota' => $this->indexingService->getDailyQuotaStats(),
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Helper to fetch inventory of all site pages cross-referenced with Google Indexing logs.
     */
    public function fetchSitePagesInventory(): array
    {
        $siteBase = rtrim(config('services.google.site_url', 'https://coachingsinsikar.com'), '/');
        if (str_contains(url('/'), 'coachingsinsikar.com')) {
            $siteBase = rtrim(url('/'), '/');
        }

        // Retrieve all indexing logs grouped by normalized URL
        $indexedLogs = collect();
        if (\Illuminate\Support\Facades\Schema::hasTable('gsc_indexing_logs')) {
            $indexedLogs = GscIndexingLog::orderBy('id', 'desc')->get()->groupBy('url');
        }

        $items = [];

        // 1. Published Blog Posts (Order by ID ASC so older / bottom posts are at the start)
        try {
            $posts = \App\Models\Post::where('published', true)
                ->where(function($q) {
                    $q->where('isNoIndex', false)->orWhereNull('isNoIndex');
                })
                ->orderBy('id', 'asc')
                ->get(['id', 'title', 'slug', 'category', 'url_format', 'updated_at', 'created_at']);

            foreach ($posts as $post) {
                $url = $this->indexingService->normalizeUrl($siteBase . '/' . ltrim($post->url_path, '/'));
                $logsForUrl = $indexedLogs->get($url, collect());
                $latestLog = $logsForUrl->first();
                $lastSuccessLog = $logsForUrl->firstWhere('status', 'success');

                $isCooldownActive = $lastSuccessLog && $lastSuccessLog->created_at->isAfter(Carbon::now()->subHours(24));
                $hasEverPushed = !empty($lastSuccessLog);

                $status = 'pending';
                if ($isCooldownActive) {
                    $status = 'pushed';
                } elseif ($hasEverPushed) {
                    $status = 'eligible';
                } elseif ($latestLog && $latestLog->status === 'failed') {
                    $status = 'failed';
                }

                $cooldownHoursLeft = $isCooldownActive ? max(1, 24 - $lastSuccessLog->created_at->diffInHours(Carbon::now())) : 0;

                $items[] = [
                    'id' => 'post_' . $post->id,
                    'raw_id' => $post->id,
                    'title' => $post->title ?: 'Untitled Post',
                    'type' => 'post',
                    'type_label' => 'Blog Post',
                    'category' => $post->category,
                    'url' => $url,
                    'status' => $status,
                    'is_pushed' => $hasEverPushed,
                    'cooldown_active' => $isCooldownActive,
                    'cooldown_remaining_hours' => $cooldownHoursLeft,
                    'last_pushed_at' => $lastSuccessLog ? $lastSuccessLog->created_at->toIso8601String() : null,
                    'last_pushed_human' => $lastSuccessLog ? $lastSuccessLog->created_at->diffForHumans() : 'Never pushed',
                    'http_code' => $latestLog ? $latestLog->http_code : null,
                    'response_message' => $latestLog ? $latestLog->response_message : null,
                    'updated_at' => $post->updated_at ? $post->updated_at->toIso8601String() : null,
                    'created_at' => $post->created_at ? $post->created_at->toIso8601String() : null,
                ];
            }
        } catch (\Throwable $e) {}

        // 2. Verified Businesses
        try {
            $businesses = \App\Models\Business::where('is_verified', true)
                ->orderBy('id', 'asc')
                ->get(['id', 'name', 'slug', 'category', 'updated_at', 'created_at']);

            foreach ($businesses as $biz) {
                $cat = $biz->category ?: 'coaching-institutes';
                $bizUrl = $this->indexingService->normalizeUrl($siteBase . '/business/' . $cat . '/' . ($biz->slug ?: $biz->id));
                $logsForUrl = $indexedLogs->get($bizUrl, collect());
                $latestLog = $logsForUrl->first();
                $lastSuccessLog = $logsForUrl->firstWhere('status', 'success');

                $isCooldownActive = $lastSuccessLog && $lastSuccessLog->created_at->isAfter(Carbon::now()->subHours(24));
                $hasEverPushed = !empty($lastSuccessLog);

                $status = 'pending';
                if ($isCooldownActive) {
                    $status = 'pushed';
                } elseif ($hasEverPushed) {
                    $status = 'eligible';
                } elseif ($latestLog && $latestLog->status === 'failed') {
                    $status = 'failed';
                }

                $cooldownHoursLeft = $isCooldownActive ? max(1, 24 - $lastSuccessLog->created_at->diffInHours(Carbon::now())) : 0;

                $items[] = [
                    'id' => 'biz_' . $biz->id,
                    'raw_id' => $biz->id,
                    'title' => $biz->name ?: 'Business Listing',
                    'type' => 'business',
                    'type_label' => 'Business Listing',
                    'category' => $biz->category,
                    'url' => $bizUrl,
                    'status' => $status,
                    'is_pushed' => $hasEverPushed,
                    'cooldown_active' => $isCooldownActive,
                    'cooldown_remaining_hours' => $cooldownHoursLeft,
                    'last_pushed_at' => $lastSuccessLog ? $lastSuccessLog->created_at->toIso8601String() : null,
                    'last_pushed_human' => $lastSuccessLog ? $lastSuccessLog->created_at->diffForHumans() : 'Never pushed',
                    'http_code' => $latestLog ? $latestLog->http_code : null,
                    'response_message' => $latestLog ? $latestLog->response_message : null,
                    'updated_at' => $biz->updated_at ? $biz->updated_at->toIso8601String() : null,
                    'created_at' => $biz->created_at ? $biz->created_at->toIso8601String() : null,
                ];
            }
        } catch (\Throwable $e) {}

        // 3. Web Stories
        try {
            $stories = \App\Models\Story::where('published', true)
                ->where(function($q) {
                    $q->where('isNoIndex', false)->orWhereNull('isNoIndex');
                })
                ->orderBy('id', 'asc')
                ->get(['id', 'title', 'slug', 'updated_at', 'created_at']);

            foreach ($stories as $story) {
                $storyUrl = $this->indexingService->normalizeUrl($siteBase . '/stories/' . $story->slug);
                $logsForUrl = $indexedLogs->get($storyUrl, collect());
                $latestLog = $logsForUrl->first();
                $lastSuccessLog = $logsForUrl->firstWhere('status', 'success');

                $isCooldownActive = $lastSuccessLog && $lastSuccessLog->created_at->isAfter(Carbon::now()->subHours(24));
                $hasEverPushed = !empty($lastSuccessLog);

                $status = 'pending';
                if ($isCooldownActive) {
                    $status = 'pushed';
                } elseif ($hasEverPushed) {
                    $status = 'eligible';
                } elseif ($latestLog && $latestLog->status === 'failed') {
                    $status = 'failed';
                }

                $cooldownHoursLeft = $isCooldownActive ? max(1, 24 - $lastSuccessLog->created_at->diffInHours(Carbon::now())) : 0;

                $items[] = [
                    'id' => 'story_' . $story->id,
                    'raw_id' => $story->id,
                    'title' => $story->title ?: 'Web Story',
                    'type' => 'story',
                    'type_label' => 'Web Story',
                    'category' => 'stories',
                    'url' => $storyUrl,
                    'status' => $status,
                    'is_pushed' => $hasEverPushed,
                    'cooldown_active' => $isCooldownActive,
                    'cooldown_remaining_hours' => $cooldownHoursLeft,
                    'last_pushed_at' => $lastSuccessLog ? $lastSuccessLog->created_at->toIso8601String() : null,
                    'last_pushed_human' => $lastSuccessLog ? $lastSuccessLog->created_at->diffForHumans() : 'Never pushed',
                    'http_code' => $latestLog ? $latestLog->http_code : null,
                    'response_message' => $latestLog ? $latestLog->response_message : null,
                    'updated_at' => $story->updated_at ? $story->updated_at->toIso8601String() : null,
                    'created_at' => $story->created_at ? $story->created_at->toIso8601String() : null,
                ];
            }
        } catch (\Throwable $e) {}

        // 4. Static Pages
        try {
            $pages = \App\Models\Page::orderBy('id', 'asc')->get(['id', 'title', 'slug', 'updated_at', 'created_at']);
            foreach ($pages as $page) {
                $pageUrl = $this->indexingService->normalizeUrl($siteBase . '/' . ltrim($page->slug, '/'));
                $logsForUrl = $indexedLogs->get($pageUrl, collect());
                $latestLog = $logsForUrl->first();
                $lastSuccessLog = $logsForUrl->firstWhere('status', 'success');

                $isCooldownActive = $lastSuccessLog && $lastSuccessLog->created_at->isAfter(Carbon::now()->subHours(24));
                $hasEverPushed = !empty($lastSuccessLog);

                $status = 'pending';
                if ($isCooldownActive) {
                    $status = 'pushed';
                } elseif ($hasEverPushed) {
                    $status = 'eligible';
                } elseif ($latestLog && $latestLog->status === 'failed') {
                    $status = 'failed';
                }

                $cooldownHoursLeft = $isCooldownActive ? max(1, 24 - $lastSuccessLog->created_at->diffInHours(Carbon::now())) : 0;

                $items[] = [
                    'id' => 'page_' . $page->id,
                    'raw_id' => $page->id,
                    'title' => $page->title ?: 'Static Page',
                    'type' => 'page',
                    'type_label' => 'Static Page',
                    'category' => 'pages',
                    'url' => $pageUrl,
                    'status' => $status,
                    'is_pushed' => $hasEverPushed,
                    'cooldown_active' => $isCooldownActive,
                    'cooldown_remaining_hours' => $cooldownHoursLeft,
                    'last_pushed_at' => $lastSuccessLog ? $lastSuccessLog->created_at->toIso8601String() : null,
                    'last_pushed_human' => $lastSuccessLog ? $lastSuccessLog->created_at->diffForHumans() : 'Never pushed',
                    'http_code' => $latestLog ? $latestLog->http_code : null,
                    'response_message' => $latestLog ? $latestLog->response_message : null,
                    'updated_at' => $page->updated_at ? $page->updated_at->toIso8601String() : null,
                    'created_at' => $page->created_at ? $page->created_at->toIso8601String() : null,
                ];
            }
        } catch (\Throwable $e) {}

        $totalCount = count($items);
        $pushedCount = count(array_filter($items, fn($i) => !empty($i['cooldown_active'])));
        $eligibleCount = count(array_filter($items, fn($i) => $i['status'] === 'eligible'));
        $pendingCount = count(array_filter($items, fn($i) => $i['status'] === 'pending'));
        $failedCount = count(array_filter($items, fn($i) => $i['status'] === 'failed'));
        $pushableCount = $pendingCount + $failedCount + $eligibleCount;

        $quota = $this->indexingService->getDailyQuotaStats();

        return [
            'summary' => [
                'total_pages' => $totalCount,
                'pushed_count' => $pushedCount,
                'eligible_count' => $eligibleCount,
                'pending_count' => $pendingCount,
                'failed_count' => $failedCount,
                'pushable_count' => $pushableCount,
                'quota_used_today' => $quota['used'],
                'quota_limit' => $quota['limit'],
                'quota_remaining' => $quota['remaining'],
            ],
            'pages' => $items,
        ];
    }

    /**
     * Get inventory of all website pages/posts/businesses and their Google Indexing status.
     */
    public function getPagesIndexStatus(Request $request)
    {
        try {
            $inventory = $this->fetchSitePagesInventory();
            return response()->json([
                'success' => true,
                'summary' => $inventory['summary'],
                'pages' => $inventory['pages'],
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Smart Batch Push unindexed or pending URLs ("niche pade hue") to Google Indexing API.
     * Starts from bottom/oldest unindexed content first, respecting daily quota & cooldown.
     */
    public function pushPendingUrls(Request $request)
    {
        $limit = min(max(intval($request->input('limit', 50)), 1), 100);
        $type = $request->input('type', 'all'); // 'all', 'posts', 'businesses', 'stories', 'pages'
        $order = $request->input('order', 'bottom_first'); // 'bottom_first' or 'newest_first'
        $force = $request->boolean('force');

        try {
            $inventory = $this->fetchSitePagesInventory();
            $allPages = $inventory['pages'];

            if (empty($allPages)) {
                return response()->json(['success' => false, 'error' => 'No site pages found to push.'], 404);
            }

            // Filter by type if requested
            if ($type !== 'all') {
                $allPages = array_values(array_filter($allPages, fn($p) => $p['type'] === $type));
            }

            // Filter for pages that need pushing:
            // Either status === 'pending' (never pushed), 'failed', or 'eligible' (> 24h cooldown expired)
            $pendingPages = array_values(array_filter($allPages, function($p) use ($force) {
                if ($force) {
                    return true;
                }
                return in_array($p['status'], ['pending', 'failed', 'eligible'], true);
            }));

            if (empty($pendingPages)) {
                return response()->json([
                    'success' => true,
                    'message' => 'All eligible pages have already been pushed to Googlebot! No pending pages left.',
                    'processed' => 0,
                    'pushed' => 0,
                    'skipped' => 0,
                    'failed' => 0,
                    'results' => [],
                    'quota' => $inventory['summary'],
                ]);
            }

            // Order: bottom_first (oldest content sitting at the bottom first!)
            if ($order === 'bottom_first') {
                // already sorted by id ASC (oldest at the bottom first)
            } else {
                $pendingPages = array_reverse($pendingPages);
            }

            // Take up to $limit
            $targetSlice = array_slice($pendingPages, 0, $limit);
            $urlsToPush = array_column($targetSlice, 'url');

            // Publish via batchPublish
            $results = $this->indexingService->batchPublish($urlsToPush, 'URL_UPDATED', 'smart_batch_pending', $force);

            $pushedCount = 0;
            $skippedCount = 0;
            $failedCount = 0;

            foreach ($results as $res) {
                if (!empty($res['skipped'])) {
                    $skippedCount++;
                } elseif (!empty($res['success'])) {
                    $pushedCount++;
                } else {
                    $failedCount++;
                }
            }

            $quota = $this->indexingService->getDailyQuotaStats();

            return response()->json([
                'success' => true,
                'processed' => count($results),
                'pushed' => $pushedCount,
                'skipped' => $skippedCount,
                'failed' => $failedCount,
                'remaining_quota' => $quota['remaining'],
                'message' => "Batch completed: {$pushedCount} URL(s) pushed to Googlebot, {$skippedCount} skipped (already recent), {$failedCount} failed.",
                'results' => $results,
                'quota' => $quota,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Test Google Indexing API connectivity & permissions.
     */
    public function testIndexing()
    {
        try {
            $result = $this->indexingService->testConnection();
            return response()->json($result);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get recent indexing audit logs.
     */
    public function getIndexingLogs()
    {
        $logs = GscIndexingLog::orderBy('created_at', 'desc')->take(50)->get();
        return response()->json(['success' => true, 'logs' => $logs]);
    }

    /**
     * Get AI Keyword Opportunities (Striking distance & High impression low CTR).
     */
    public function getKeywordOpportunities()
    {
        $queries = GscSearchAnalytic::orderBy('impressions', 'desc')->take(300)->get();

        // 1. Striking Distance: position between 8 and 20
        $strikingDistance = $queries->filter(fn ($q) => $q->position >= 7.5 && $q->position <= 20 && $q->impressions >= 100)
            ->values();

        // 2. High Impression, Low CTR: impressions > 300, CTR < 2%
        $lowCtr = $queries->filter(fn ($q) => $q->impressions >= 300 && $q->ctr < 0.02)
            ->values();

        return response()->json([
            'success' => true,
            'striking_distance' => $strikingDistance,
            'low_ctr' => $lowCtr,
        ]);
    }

    /**
     * Run a live Google PageSpeed Insights & Core Web Vitals audit.
     */
    public function runPageSpeedAudit(Request $request)
    {
        $request->validate([
            'url' => 'required|string',
            'strategy' => 'nullable|string|in:mobile,desktop',
            'forceRefresh' => 'nullable|boolean',
        ]);

        $url = trim($request->input('url'));
        $strategy = $request->input('strategy', 'mobile');
        $force = $request->boolean('forceRefresh');

        try {
            $audit = $this->pageSpeedService->runAudit($url, $strategy, $force, auth()->id());
            return response()->json([
                'success' => true,
                'audit' => $audit,
                'message' => 'PageSpeed audit completed successfully!',
            ]);
        } catch (\Throwable $e) {
            Log::error('PageSpeed audit error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get recent PageSpeed audit history.
     */
    public function getPageSpeedHistory(Request $request)
    {
        try {
            $history = $this->pageSpeedService->getRecentAudits(30);
            return response()->json([
                'success' => true,
                'history' => $history,
            ]);
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Save Google PageSpeed API Key permanently to .env.
     */
    public function savePageSpeedApiKey(Request $request)
    {
        $request->validate([
            'api_key' => 'required|string|min:10',
        ]);

        $saved = $this->pageSpeedService->saveApiKey($request->input('api_key'));
        if ($saved) {
            return response()->json([
                'success' => true,
                'message' => 'Google PageSpeed Insights API Key saved successfully!',
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Failed to write API key to .env file.',
        ], 500);
    }
}
