<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="content-language" content="{{ str_replace('_', '-', app()->getLocale()) }}">

    <title>{{ $meta['title'] ?? config('app.name', 'Coachinginsikar') }}</title>
    <meta name="description" content="{{ $meta['description'] ?? '' }}">
    <meta name="robots" content="{{ $meta['robots'] ?? 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }}">
    <link rel="canonical" href="{{ $meta['url'] ?? url()->current() }}">
    <meta property="og:locale" content="{{ str_replace('-', '_', app()->getLocale()) }}">
    <meta property="og:title" content="{{ $meta['og_title'] ?? $meta['title'] ?? '' }}">
    <meta property="og:description" content="{{ $meta['og_description'] ?? $meta['description'] ?? '' }}">
    <meta property="og:url" content="{{ $meta['url'] ?? url()->current() }}">
    <meta property="og:type" content="{{ $meta['type'] ?? 'website' }}">
    @if(!empty($meta['og_image']))
    <meta property="og:image" content="{{ $meta['og_image'] }}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta name="twitter:image" content="{{ $meta['og_image'] }}">
    @endif
    <meta name="twitter:card" content="{{ $meta['twitter_card'] ?? 'summary_large_image' }}">
    <meta name="twitter:site" content="@coachinginsikar">
    <meta name="twitter:creator" content="@coachinginsikar">
    <meta name="twitter:title" content="{{ $meta['twitter_title'] ?? $meta['title'] ?? '' }}">
    <meta name="twitter:description" content="{{ $meta['twitter_description'] ?? $meta['description'] ?? '' }}">
    @if(!empty($meta['keywords']))
    <meta name="keywords" content="{{ $meta['keywords'] }}">
    @endif

    @foreach($meta['schemas'] ?? [] as $schema)
    <script type="application/ld+json">{!! json_encode($schema, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE) !!}</script>
    @endforeach
    @if(!empty($meta['preload_image']))
    <link rel="preload" as="image" href="{{ $meta['preload_image'] }}" fetchpriority="high">
    @endif

    <meta name="google-site-verification" content="HcrL5h0jDeKpvNkKKIjIAUm-bR_AY0bu07aJsU4qLuQ">
    <meta name="msvalidate.01" content="FB8652B2A23AAD6CEE2AF8CACF4580A9" />
    <link rel="alternate" type="application/rss+xml" title="Blog RSS Feed" href="{{ url('/blog/feed.xml') }}">
    <link rel="icon" type="image/webp" sizes="192x192" href="/uploads/logo.webp">
    <link rel="icon" type="image/webp" sizes="96x96" href="/uploads/logo.webp">
    <link rel="icon" type="image/webp" sizes="48x48" href="/uploads/logo.webp">
    <link rel="apple-touch-icon" href="/uploads/logo.webp">



    <script>
        window.BASE_PATH = "{{ url('') }}";
        window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    </script>
    @viteReactRefresh
    @php
        Vite::useStyleTagAttributes([
            'media' => 'print',
            'onload' => "this.media='all'",
        ]);
    @endphp
    @vite('resources/js/home.jsx')

    {{-- Load analytics after an interaction or an extended quiet period. --}}
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

            const swgScript = document.createElement('script');
            swgScript.async = true;
            swgScript.src = 'https://news.google.com/swg/js/v1/swg-basic.js';
            swgScript.fetchPriority = 'low';
            document.head.appendChild(swgScript);

            gtag('js', new Date());
            gtag('config', 'G-NRXEX23V4X');
        };
        const scheduleAnalytics = () => {
            if (window.__analyticsScheduled) return;
            window.__analyticsScheduled = true;
            if ('requestIdleCallback' in window) window.requestIdleCallback(loadAnalytics, { timeout: 2000 });
            else window.setTimeout(loadAnalytics, 1000);
        };
        const scheduleAfterLoad = () => {
            if (document.readyState === 'complete') scheduleAnalytics();
            else window.addEventListener('load', scheduleAnalytics, { once: true });
        };
        const engagementEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
        const onFirstEngagement = () => {
            engagementEvents.forEach((eventName) => window.removeEventListener(eventName, onFirstEngagement));
            scheduleAfterLoad();
        };
        engagementEvents.forEach((eventName) => window.addEventListener(eventName, onFirstEngagement, { passive: true, once: true }));
        window.setTimeout(scheduleAfterLoad, 8000);
    </script>

    <!-- Google Publisher SWG -->
    <script>
    (self.SWG_BASIC = self.SWG_BASIC || []).push( basicSubscriptions => {
        basicSubscriptions.init({
        type: "NewsArticle",
        isPartOfType: ["Product"],
        isPartOfProductId: "CAowxuXhCw:openaccess",
        clientOptions: { theme: "light", lang: "en" },
        });
    });
    </script>
    @php
        $font400 = glob(public_path('build/assets/outfit-latin-400-*.woff2'))[0] ?? null;
        $font700 = glob(public_path('build/assets/outfit-latin-700-*.woff2'))[0] ?? null;
        $font800 = glob(public_path('build/assets/outfit-latin-800-*.woff2'))[0] ?? null;
    @endphp
    @if($font400)
        <link rel="preload" href="{{ str_replace('\\', '/', str_replace(public_path(), '', $font400)) }}" as="font" type="font/woff2" crossorigin>
    @endif
    @if($font700)
        <link rel="preload" href="{{ str_replace('\\', '/', str_replace(public_path(), '', $font700)) }}" as="font" type="font/woff2" crossorigin>
    @endif
    @if($font800)
        <link rel="preload" href="{{ str_replace('\\', '/', str_replace(public_path(), '', $font800)) }}" as="font" type="font/woff2" crossorigin>
    @endif
</head>
<body class="font-sans antialiased">
    <div id="home-app">
        <style>
            .hero-skeleton { position:relative; width:100%; min-height:500px; display:flex; align-items:center; background-color:#0f172a; overflow:hidden; }
            .hero-content { position:relative; z-index:10; width:100%; max-width:1280px; margin:0 auto; padding:6rem 1rem 2.5rem; text-align:left; }
            .hero-buttons { display:flex; flex-direction:column; gap:0.75rem; }
            .hero-btn { display:flex; align-items:center; justify-content:center; padding:0.75rem 1.5rem; text-align:center; width:100%; }
            .hero-btn-primary { background-color:#f59e0b; color:#000000; font-weight:700; border-radius:9999px; }
            .hero-btn-secondary { background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600; border-radius:0.375rem; }
            @media (min-width: 640px) {
                .hero-buttons { flex-direction:row; }
                .hero-btn { width:auto; }
            }
            @media (min-width: 768px) {
                .hero-skeleton { min-height: 600px; }
                .hero-content { padding: 8rem 2rem 3.5rem; }
            }
        </style>
        <section class="hero-skeleton">
            @if(!empty($meta['preload_image']))
                <img src="{{ $meta['preload_image'] }}" style="position:absolute; inset:0; z-index:0; height:100%; width:100%; object-fit:cover;" alt="" aria-hidden="true" fetchpriority="high" />
            @endif
            <div style="position:absolute; inset:0; z-index:0; background-color:rgba(15,23,42,0.8);"></div>
            <div class="hero-content">
                <p style="color:#fbbf24; font-size:0.75rem; font-weight:700; letter-spacing:0.12em; margin-bottom:1rem; text-transform:uppercase;">Coaching and School Discovery Platform</p>
                <h1 style="color:#ffffff; font-size:clamp(2.25rem, 5vw, 4rem); font-weight:800; line-height:1.1; margin-bottom:1.5rem; letter-spacing:-0.025em; margin-top:0;">Find the Best CoachinginSikar</h1>
                <p style="color:rgba(255,255,255,0.8); font-size:1.125rem; max-width:36rem; margin-bottom:2rem;">Compare coaching institutes, courses, fees, results and student reviews — all in one place.</p>
                <div style="max-width:36rem; background:#ffffff; border-radius:9999px; padding:0.5rem; display:flex; align-items:center; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1); margin-bottom:1.5rem;">
                    <div style="flex:1; padding:0.5rem 1rem; color:#94a3b8;">Search coaching, courses, exams or institutes...</div>
                    <div style="background:#e11d48; color:#ffffff; font-weight:600; padding:0.625rem 1.5rem; border-radius:9999px;">Search</div>
                </div>
                <div style="display:flex; flex-wrap:wrap; align-items:center; gap:0.5rem; margin-bottom:2rem; font-size:0.875rem;">
                    <span style="color:rgba(255,255,255,0.6); margin-right:0.25rem;">Popular Exams:</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">JEE</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">NEET</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">NDA</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">CLAT</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">CUET</span>
                    <span style="padding:0.375rem 1rem; border-radius:9999px; background-color:rgba(255,255,255,0.1); color:#ffffff; font-weight:600;">Foundation</span>
                </div>
                <div class="hero-buttons">
                    <span class="hero-btn hero-btn-primary">Explore Institutes</span>
                    <span class="hero-btn hero-btn-secondary">Compare Coaching</span>
                </div>
            </div>
        </section>
    </div>
    <script id="home-props" type="application/json">{!! json_encode([
        'morePosts' => $morePosts,
        'publishedStories' => $publishedStories,
        'sliders' => $sliders,
        'categories' => $categories,
        'meta' => $meta,
        'featuredBusinesses' => $featuredBusinesses,
        'feedPosts' => $feedPosts,
        'topCommunities' => $topCommunities,
    ], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!}</script>
</body>
</html>
