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
                    ['label' => 'Homepage', 'url' => url('/')],
                    ['label' => 'Blog Feed', 'url' => url('/blog')],
                    ['label' => 'Top NEET Article', 'url' => url('/blog/5-best-neet-coachings-in-sikar-based-on-google-reviews')],
                    ['label' => 'Business Directory', 'url' => url('/category/coaching-institutes')],
                ],
            ],
            'initialTab' => $request->is('admin/pagespeed*') ? 'pagespeed' : $request->get('tab', 'performance'),
            'localSitemaps' => $localSitemaps,
            'initialSitemaps' => $initialSitemaps,
            'cachedQueries' => $cachedTopQueries,
            'recentLogs' => $indexingLogs,
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
        $startDate = $request->get('start_date', Carbon::now()->subDays(2 + $days)->format('Y-m-d'));
        $endDate = $request->get('end_date', Carbon::now()->subDays(2)->format('Y-m-d'));
        $searchType = $request->get('type', 'web');

        try {
            // Live query to GSC API
            $queries = $this->gscService->querySearchAnalytics($startDate, $endDate, ['query'], 200, 0, $searchType);
            $pages = $this->gscService->querySearchAnalytics($startDate, $endDate, ['page'], 200, 0, $searchType);
            $dates = $this->gscService->querySearchAnalytics($startDate, $endDate, ['date'], 100, 0, $searchType);
            $devices = $this->gscService->querySearchAnalytics($startDate, $endDate, ['device'], 10, 0, $searchType);
            $countries = $this->gscService->querySearchAnalytics($startDate, $endDate, ['country'], 20, 0, $searchType);

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
            ]);
        } catch (\Throwable $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
                'fallback_queries' => GscSearchAnalytic::orderBy('clicks', 'desc')->take(50)->get(),
            ], 500);
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
        ]);

        $action = $request->input('action', 'URL_UPDATED');
        $urls = $request->input('urls') ?: [$request->input('url')];
        $urls = array_filter(array_map('trim', (array) $urls));

        if (empty($urls)) {
            return response()->json(['success' => false, 'error' => 'No valid URLs provided.'], 422);
        }

        try {
            $results = $this->indexingService->batchPublish($urls, $action, 'manual_admin');
            return response()->json(['success' => true, 'results' => $results]);
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
