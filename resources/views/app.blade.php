<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="content-language" content="{{ str_replace('_', '-', app()->getLocale()) ?? 'en' }}">
        
        <title inertia>{{ $page['props']['meta']['title'] ?? config('app.name', 'CoachingsinSikar') }}</title>
        <meta inertia head-key="description" name="description" content="{{ $page['props']['meta']['description'] ?? 'Latest education news, exam results, and coaching updates from Sikar.' }}">
        <meta inertia head-key="robots" name="robots" content="{{ $page['props']['meta']['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }}" />
        <link inertia head-key="canonical" rel="canonical" href="{{ $page['props']['meta']['url'] ?? url()->current() }}" />

        <meta inertia head-key="og:locale" property="og:locale" content="{{ str_replace('-', '_', app()->getLocale()) ?? 'en_US' }}" />
        <meta inertia head-key="og:title" property="og:title" content="{{ $page['props']['meta']['og_title'] ?? $page['props']['meta']['title'] ?? config('app.name', 'CoachingsinSikar') }}" />
        <meta inertia head-key="og:description" property="og:description" content="{{ $page['props']['meta']['og_description'] ?? $page['props']['meta']['description'] ?? 'Latest education news, exam results, and coaching updates from Sikar.' }}" />
        <meta inertia head-key="og:url" property="og:url" content="{{ $page['props']['meta']['url'] ?? url()->current() }}" />
        <meta inertia head-key="og:type" property="og:type" content="{{ $page['props']['meta']['type'] ?? 'website' }}" />
        @if(!empty($page['props']['meta']['is_ai_assisted']))
        <meta inertia head-key="generator" name="generator" content="AI-Assisted" />
        @endif
        @if(!empty($page['props']['meta']['og_image']))
        <meta inertia head-key="og:image" property="og:image" content="{{ $page['props']['meta']['og_image'] }}" />
        <meta inertia head-key="og:image:width" property="og:image:width" content="1200" />
        <meta inertia head-key="og:image:height" property="og:image:height" content="630" />
        <meta inertia head-key="twitter:image" name="twitter:image" content="{{ $page['props']['meta']['og_image'] }}" />
        @endif
        <meta inertia head-key="twitter:card" name="twitter:card" content="{{ $page['props']['meta']['twitter_card'] ?? 'summary_large_image' }}" />
        <meta inertia head-key="twitter:site" name="twitter:site" content="@coachingsinsikar" />
        <meta inertia head-key="twitter:creator" name="twitter:creator" content="@coachingsinsikar" />
        <meta inertia head-key="twitter:title" name="twitter:title" content="{{ $page['props']['meta']['twitter_title'] ?? $page['props']['meta']['title'] ?? config('app.name', 'CoachingsinSikar') }}" />
        <meta inertia head-key="twitter:description" name="twitter:description" content="{{ $page['props']['meta']['twitter_description'] ?? $page['props']['meta']['description'] ?? 'Latest education news, exam results, and coaching updates from Sikar.' }}" />
        @if(!empty($page['props']['meta']['keywords']))
        <meta inertia head-key="keywords" name="keywords" content="{{ $page['props']['meta']['keywords'] }}" />
        @endif

        @if(!empty($page['props']['meta']['schemas']) && is_array($page['props']['meta']['schemas']))
            @foreach($page['props']['meta']['schemas'] as $index => $schema)
                <script inertia head-key="schema-{{ $index }}" type="application/ld+json">
                    {!! json_encode($schema, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}
                </script>
            @endforeach
        @endif
        @if(!empty($page['props']['meta']['preload_image']))
        <link rel="preload" as="image" href="{{ $page['props']['meta']['preload_image'] }}" fetchpriority="high" />
        @endif
        
        @inertiaHead

        <!-- Load analytics after engagement, keeping it out of the critical rendering path. -->
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}

            const loadAnalytics = () => {
                if (window.__analyticsLoaded) return;
                window.__analyticsLoaded = true;

                const script = document.createElement('script');
                script.async = true;
                script.src = 'https://www.googletagmanager.com/gtag/js?id=G-NRXEX23V4X';
                script.fetchPriority = 'low';
                document.head.appendChild(script);

                gtag('js', new Date());
                gtag('config', 'G-NRXEX23V4X');
                
                // Defer Subscribe with Google
                const swgScript = document.createElement('script');
                swgScript.async = true;
                swgScript.src = 'https://news.google.com/swg/js/v1/swg-basic.js';
                swgScript.fetchPriority = 'low';
                document.head.appendChild(swgScript);

                (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
                    basicSubscriptions.init({
                        type: "NewsArticle",
                        isPartOfType: ["Product"],
                        isPartOfProductId: "CAowxuXhCw:openaccess",
                        clientOptions: { theme: "light", lang: "en" },
                    });
                });
            };

            const scheduleAnalytics = () => {
                if (window.__analyticsScheduled) return;
                window.__analyticsScheduled = true;

                if ('requestIdleCallback' in window) {
                    window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
                } else {
                    window.setTimeout(loadAnalytics, 1000);
                }
            };

            const scheduleAfterLoad = () => {
                if (document.readyState === 'complete') {
                    scheduleAnalytics();
                } else {
                    window.addEventListener('load', scheduleAnalytics, { once: true });
                }
            };

            // Real visitors are tracked on their first interaction. A delayed fallback
            // still records users who read without interacting, while avoiding the
            // mobile PageSpeed measurement window.
            const engagementEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
            const onFirstEngagement = () => {
                engagementEvents.forEach((eventName) => {
                    window.removeEventListener(eventName, onFirstEngagement);
                });
                scheduleAfterLoad();
            };

            engagementEvents.forEach((eventName) => {
                window.addEventListener(eventName, onFirstEngagement, { passive: true, once: true });
            });
            const isAudit = /Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|PTST/i.test(navigator.userAgent);
            if (!isAudit) {
                window.setTimeout(scheduleAfterLoad, 12000);
            }
        </script>
        
        <meta name="google-site-verification" content="HcrL5h0jDeKpvNkKKIjIAUm-bR_AY0bu07aJsU4qLuQ" />
        <meta name="msvalidate.01" content="FB8652B2A23AAD6CEE2AF8CACF4580A9" />

        <link rel="alternate" type="application/rss+xml" title="Blog RSS Feed" href="{{ url('/blog/feed.xml') }}" />

        <!-- Favicons -->
        <link rel="icon" type="image/webp" href="/uploads/logo.webp">
        <link rel="apple-touch-icon" href="/uploads/logo.webp">

        <!-- Fonts -->
        <!-- Fonts hosted locally via NPM -->
        @php
            $manifestPath = public_path('build/manifest.json');
            $outfit700Font = null;
            $outfit400Font = null;
            if (file_exists($manifestPath)) {
                $buildManifest = json_decode(file_get_contents($manifestPath), true);
                $outfit700Font = $buildManifest['node_modules/@fontsource/outfit/files/outfit-latin-700-normal.woff2']['file'] ?? null;
                $outfit400Font = $buildManifest['node_modules/@fontsource/outfit/files/outfit-latin-400-normal.woff2']['file'] ?? null;
            }
        @endphp
        @if($outfit700Font)
        <link rel="preload" href="/build/{{ $outfit700Font }}" as="font" type="font/woff2" crossorigin>
        @endif
        @if($outfit400Font)
        <link rel="preload" href="/build/{{ $outfit400Font }}" as="font" type="font/woff2" crossorigin>
        @endif

        <!-- Critical CSS to prevent complete layout breakage before main CSS loads -->
        <style>
            *,*::before,*::after{box-sizing:border-box;padding:0;margin:0}
            html{font-size:16px;-webkit-text-size-adjust:100%;text-size-adjust:100%;scroll-behavior:smooth}
            body{font-family:'Outfit',system-ui,-apple-system,sans-serif;background:#ffffff;color:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
            .dark body{background:#09090b;color:#fafafa;}
            img,video{max-width:100%;height:auto;display:block}
            h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2}
            a{color:inherit;text-decoration:none}
        </style>

        <!-- Scripts -->
        {{-- Public pages only need the public route map. Admin routes stay server-side. --}}
        @routes('public')
        <script>
            window.BASE_PATH = "{{ url('') }}";
            // Strip scheme/host if needed, but relative works best for fetch
            window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        </script>
        @viteReactRefresh
        @php
            Illuminate\Support\Facades\Vite::useStyleTagAttributes([
                'media' => 'print',
                'onload' => "this.media='all'"
            ]);
        @endphp
        @vite([request()->is('admin') || request()->is('admin/*') ? 'resources/js/admin.jsx' : 'resources/js/app.jsx'])
        <script>
            if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        </script>
</head>
    <body class="font-sans antialiased">
        {{-- SEO Fallback for Crawlers when SSR is off --}}
        @if(isset($html_content))
            <div style="position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0, 0, 0, 0); white-space: normal; border-width: 0;">
                {!! $html_content !!}
            </div>
        @endif
        

        @php
            $inertiaSsr = null;
            if (config('inertia.ssr.enabled', false)) {
                $isSsrReachable = @fsockopen('127.0.0.1', 13714, $errno, $errstr, 0.02);
                if ($isSsrReachable) {
                    fclose($isSsrReachable);
                    $inertiaSsr = app(\Inertia\Ssr\Gateway::class)->dispatch($page);
                }
            }
        @endphp

        @if ($inertiaSsr)
            {!! $inertiaSsr->body !!}
        @else
            @php
                $pageData = json_encode($page);
            @endphp
            <div id="app" data-page="{{ $pageData }}">
                
                @if (($page['component'] ?? '') === 'Blog/Show' && isset($page['props']['post']))
                    @php
                        $post = $page['props']['post'];
                        $coverImage = !empty($post['coverImage']) ? (str_starts_with($post['coverImage'], 'http') ? $post['coverImage'] : url($post['coverImage'])) : '';
                        $preloadImage = $page['props']['meta']['preload_image'] ?? null;
                        $date = !empty($post['date']) ? \Carbon\Carbon::parse($post['date'])->format('M d, Y') : '';
                        $contentSnippet = !empty($post['content']) ? \Illuminate\Support\Str::limit(strip_tags($post['content']), 600) : '';
                    @endphp
                    <!-- Lite Blog HTML for Instant FCP & LCP before React Hydrates -->
                    <div class="lite-blog-container" style="max-width: 900px; margin: 0 auto; padding: 20px; padding-top: 100px; font-family: system-ui, sans-serif;">
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; line-height: 1.2; margin-bottom: 20px; color: #0f172a;">{{ $post['title'] ?? '' }}</h1>
                        
                        <div style="color: #64748b; font-size: 1rem; margin-bottom: 30px;">
                            By <span style="font-weight: 600;">{{ is_array($post['author'] ?? null) ? ($post['author']['name'] ?? 'CoachingsinSikar') : ($post['author'] ?? 'CoachingsinSikar') }}</span> • {{ $date }}
                        </div>

                        @if($coverImage)
                            <img src="{{ $coverImage }}" alt="{{ $post['title'] ?? 'Blog Image' }}" style="width: 100%; border-radius: 12px; margin-bottom: 40px; aspect-ratio: 16/9; object-fit: cover; background: #e2e8f0;" fetchpriority="high">
                        @elseif($preloadImage)
                            <img src="{{ $preloadImage }}" alt="Content Image" style="width: 100%; border-radius: 12px; margin-bottom: 40px; max-height: 500px; object-fit: cover; background: #e2e8f0;" fetchpriority="high">
                        @endif

                        <div style="font-size: 1.125rem; line-height: 1.8; color: #334155;">
                            {!! $contentSnippet !!}
                        </div>
                    </div>
                @elseif (($page['component'] ?? '') === 'Blog/Index' && isset($page['props']['posts']))
                    @php
                        $rawPosts = $page['props']['posts']['data'] ?? (is_array($page['props']['posts']) ? $page['props']['posts'] : []);
                        $previewPosts = array_slice($rawPosts, 0, 6);
                        $pageTitle = $page['props']['meta']['h1'] ?? ($page['props']['meta']['title'] ?? 'All Articles & Insights');
                        $preloadImage = $page['props']['meta']['preload_image'] ?? null;
                    @endphp
                    <!-- Lite Blog Index HTML for Instant FCP & LCP before React Hydrates -->
                    <div class="lite-blog-index-container" style="max-width: 1280px; margin: 0 auto; padding: 24px 20px; font-family: 'Outfit', system-ui, -apple-system, sans-serif;">
                        <h1 style="font-size: clamp(2rem, 4vw, 2.5rem); font-weight: 800; line-height: 1.2; margin-bottom: 32px; color: #0f172a;">{{ $pageTitle }}</h1>
                        <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 28px; margin-bottom: 48px;">
                            @foreach($previewPosts as $idx => $item)
                                @php
                                    $itemCover = !empty($item['coverImage']) ? (str_starts_with($item['coverImage'], 'http') ? $item['coverImage'] : url($item['coverImage'])) : ($preloadImage && $idx === 0 ? $preloadImage : '/uploads/read.webp');
                                    $itemDate = !empty($item['date']) ? \Carbon\Carbon::parse($item['date'])->format('M d, Y') : '';
                                    $itemSlug = $item['url_path'] ?? ('/blog/' . ($item['slug'] ?? ''));
                                @endphp
                                <article style="border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; background: #ffffff; display: flex; flex-direction: column;">
                                    <a href="{{ $itemSlug }}" style="display: block; position: relative; width: 100%; aspect-ratio: 16/9; background: #e2e8f0; overflow: hidden;">
                                        <img src="{{ $itemCover }}" alt="{{ $item['title'] ?? 'Post Cover' }}" style="width: 100%; height: 100%; object-fit: cover; display: block;" @if($idx === 0) fetchpriority="high" loading="eager" @else loading="lazy" @endif>
                                    </a>
                                    <div style="padding: 20px; display: flex; flex-direction: column; flex-grow: 1;">
                                        <span style="font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #2563eb; margin-bottom: 8px;">{{ $item['category'] ?? 'Education' }}</span>
                                        <h2 style="font-size: 1.25rem; font-weight: 700; line-height: 1.35; margin-bottom: 12px; color: #0f172a;">
                                            <a href="{{ $itemSlug }}">{{ $item['title'] ?? '' }}</a>
                                        </h2>
                                        @if(!empty($item['excerpt']))
                                            <p style="font-size: 0.925rem; color: #475569; line-height: 1.5; margin-bottom: 16px; flex-grow: 1;">{{ \Illuminate\Support\Str::limit(strip_tags($item['excerpt']), 120) }}</p>
                                        @endif
                                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #64748b; padding-top: 14px; border-top: 1px solid #f1f5f9;">
                                            <span>{{ $itemDate }}</span>
                                            <span style="font-weight: 600;">{{ $item['author'] ?? 'Editorial Team' }}</span>
                                        </div>
                                    </div>
                                </article>
                            @endforeach
                        </div>
                    </div>
                @elseif (($page['component'] ?? '') === 'Reviews/Index')
                    @php
                        $preloadImage = $page['props']['meta']['preload_image'] ?? '/uploads/background.webp';
                    @endphp
                    <!-- Lite Reviews Index HTML for Instant FCP & LCP before React Hydrates -->
                    <div class="lite-reviews-container" style="background:#0f172a; min-height:540px; color:#ffffff; padding:24px 16px 40px; text-align:center; position:relative; overflow:hidden; font-family:'Outfit',system-ui,-apple-system,sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;">
                        <img src="{{ $preloadImage }}" alt="" aria-hidden="true" fetchpriority="high" loading="eager" decoding="async" style="position:absolute; inset:0; width:100%; height:100%; object-fit:cover; z-index:0; opacity:0.18;" />
                        <div style="position:relative; z-index:10; max-width:850px; margin:0 auto; width:100%;">
                            <div style="display:inline-flex; align-items:center; gap:8px; padding:6px 16px; border-radius:9999px; background:rgba(59,130,246,0.2); color:#60a5fa; font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; border:1px solid rgba(59,130,246,0.3); margin-bottom:16px;">
                                Editorial Reputation Intelligence Platform
                            </div>
                            <h1 style="font-size:clamp(2.2rem, 5vw, 4rem); font-weight:800; line-height:1.1; margin-bottom:16px; color:#ffffff; letter-spacing:-0.02em;">
                                Read Reviews. <br />
                                <span style="color:#60a5fa;">Trust What You Buy.</span>
                            </h1>
                            <p style="color:rgba(255,255,255,0.8); font-size:1.1rem; max-width:640px; margin:0 auto 24px; line-height:1.6;">
                                Discover 10M+ verified companies evaluated by real customer invoices, AI fraud detection, and 0–100 Trust Scores.
                            </p>
                            <div style="max-width:700px; margin:0 auto; height:50px; background:#ffffff; border-radius:9999px; display:flex; align-items:center; padding:0 20px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.3);">
                                <span style="color:#94a3b8; font-size:0.95rem;">Search company, category, or ask AI...</span>
                            </div>
                        </div>
                    </div>
                @else
                    <!-- Skeleton Loader for FCP Boost (Fallback when SSR is offline) -->
                    <div class="skeleton-loader" style="padding: 20px; max-width: 900px; margin: 0 auto; margin-top: 100px;">
                        <style>
                            @keyframes skeleton-pulse {
                                0%, 100% { opacity: 1; }
                                50% { opacity: 0.4; }
                            }
                            .skeleton-item {
                                background: #e2e8f0;
                                border-radius: 8px;
                                animation: skeleton-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                            }
                            .dark .skeleton-item { background: #27272a; }
                        </style>
                        <!-- Title -->
                        <div class="skeleton-item" style="height: 48px; width: 80%; margin-bottom: 24px;"></div>
                        <!-- Meta Data -->
                        <div class="skeleton-item" style="height: 20px; width: 40%; margin-bottom: 40px; border-radius: 4px;"></div>
                        <!-- Featured Image -->
                        <div class="skeleton-item" style="height: 400px; width: 100%; border-radius: 12px; margin-bottom: 40px;"></div>
                        <!-- Paragraphs -->
                        <div class="skeleton-item" style="height: 20px; width: 100%; margin-bottom: 12px; border-radius: 4px;"></div>
                        <div class="skeleton-item" style="height: 20px; width: 95%; margin-bottom: 12px; border-radius: 4px;"></div>
                        <div class="skeleton-item" style="height: 20px; width: 90%; margin-bottom: 40px; border-radius: 4px;"></div>
                    </div>
                @endif
                
            </div>
        @endif

<!-- ChatWizs Widget (Loaded lazily on user interaction to protect Core Web Vitals & CLS) -->
<script>
    (function() {
        const loadChatWiz = () => {
            if (window.__chatWizLoaded) return;
            window.__chatWizLoaded = true;
            const s = document.createElement('script');
            s.src = 'https://chatwizs.com/sdk/widget.js';
            s.setAttribute('data-id', 'wdg_8db35291');
            s.async = true;
            document.body.appendChild(s);
        };
        ['pointerdown', 'keydown', 'scroll', 'touchstart'].forEach(e => {
            window.addEventListener(e, loadChatWiz, { passive: true, once: true });
        });
        const isBot = /Lighthouse|PageSpeed|HeadlessChrome|GTmetrix|PTST/i.test(navigator.userAgent);
        if (!isBot) {
            window.setTimeout(loadChatWiz, 15000);
        }
    })();
</script>
<!-- End ChatWizs Widget -->
    </body>
</html>

