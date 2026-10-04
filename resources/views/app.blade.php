<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta http-equiv="content-language" content="{{ str_replace('_', '-', app()->getLocale()) ?? 'en' }}">
        
        <title inertia>{{ $page['props']['meta']['title'] ?? config('app.name', 'Coachinginsikar') }}</title>
        <meta inertia head-key="description" name="description" content="{{ $page['props']['meta']['description'] ?? 'Latest education news, exam results, and coaching updates from Sikar.' }}">
        <meta inertia head-key="robots" name="robots" content="{{ $page['props']['meta']['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }}" />
        <link inertia head-key="canonical" rel="canonical" href="{{ $page['props']['meta']['url'] ?? url()->current() }}" />

        <meta inertia head-key="og:locale" property="og:locale" content="{{ str_replace('-', '_', app()->getLocale()) ?? 'en_US' }}" />
        <meta inertia head-key="og:title" property="og:title" content="{{ $page['props']['meta']['og_title'] ?? $page['props']['meta']['title'] ?? config('app.name', 'Coachinginsikar') }}" />
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
        <meta inertia head-key="twitter:title" name="twitter:title" content="{{ $page['props']['meta']['twitter_title'] ?? $page['props']['meta']['title'] ?? config('app.name', 'Coachinginsikar') }}" />
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
            body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#ffffff;color:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
            .dark body{background:#09090b;color:#fafafa;}
            img,video{max-width:100%;height:auto;display:block}
            h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2}
            a{color:inherit;text-decoration:none}
            /* Basic skeleton for navbar to avoid shifting */
            nav { width: 100%; display: block; border-bottom: 1px solid #f1f5f9; }
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
        
        {{-- SEO H1 for crawlers: rendered in server HTML before JS hydrates.
             Visually hidden but fully readable by Bingbot / Googlebot. --}}
        @php
            $crawlerH1 = $page['props']['meta']['h1']
                ?? $page['props']['meta']['title']
                ?? config('app.name', 'CoachinginSikar');
        @endphp
        <h1 style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border-width:0;" aria-hidden="true">{{ $crawlerH1 }}</h1>

        @inertia

    </body>
</html>

