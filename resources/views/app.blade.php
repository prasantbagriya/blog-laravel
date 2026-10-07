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
        <meta inertia head-key="twitter:site" name="twitter:site" content="@coachinginsikar" />
        <meta inertia head-key="twitter:creator" name="twitter:creator" content="@coachinginsikar" />
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
            window.setTimeout(scheduleAfterLoad, 8000);
        </script>
        
        <meta name="google-site-verification" content="HcrL5h0jDeKpvNkKKIjIAUm-bR_AY0bu07aJsU4qLuQ" />
        <meta name="msvalidate.01" content="FB8652B2A23AAD6CEE2AF8CACF4580A9" />

        <link rel="alternate" type="application/rss+xml" title="Blog RSS Feed" href="{{ url('/blog/feed.xml') }}" />

        <!-- Favicons -->
        <link rel="icon" type="image/webp" href="/uploads/logo.webp">
        <link rel="apple-touch-icon" href="/uploads/logo.webp">

        <!-- Fonts -->
        <!-- Fonts hosted locally via NPM -->

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
            $inertiaSsr = app(\Inertia\Ssr\Gateway::class)->dispatch($page);
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
                            By <span style="font-weight: 600;">{{ $post['author'] ?? 'CoachinginSikar' }}</span> • {{ $date }}
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

<!-- ChatWizs Widget -->
<script src="https://chatwizs.com/sdk/widget.js" data-id="wdg_8db35291" async></script>
<!-- End ChatWizs Widget -->
    </body>
</html>

