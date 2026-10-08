<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta http-equiv="content-language" content="{{ str_replace('_', '-', app()->getLocale()) }}">

    <title>{{ $meta['title'] ?? config('app.name', 'CoachingsinSikar') }}</title>
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
    <link rel="icon" type="image/webp" href="/uploads/logo.webp">
    <link rel="apple-touch-icon" href="/uploads/logo.webp">



    <script>
        window.BASE_PATH = "{{ url('') }}";
        window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    </script>
    {{-- Critical CSS: only the minimum needed to paint the above-the-fold hero skeleton
         without any render-blocking external request. --}}
    <style>
        *,*::before,*::after{box-sizing:border-box;padding:0;margin:0}
        html{overflow-x:clip;overflow-y:scroll;font-size:16px;-webkit-text-size-adjust:100%;text-size-adjust:100%;scroll-behavior:smooth}
        body{max-width:100vw;overflow-x:clip;font-family:'Outfit',system-ui,-apple-system,sans-serif;background:#fff;color:#0f172a;line-height:1.6;-webkit-font-smoothing:antialiased}
        img,video{max-width:100%;height:auto;display:block}
        h1,h2,h3,h4,h5,h6{font-weight:700;line-height:1.2;margin-bottom:1rem}
        a{color:inherit;text-decoration:none}
        .btn-amber{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:9999px;background:#ff642d;color:#1a1a1a;font-weight:800;font-size:.875rem;box-shadow:0 10px 15px -3px rgba(255,100,45,.2);transition:all .15s;border:none;cursor:pointer}
    </style>

    {{-- Non-blocking CSS: load the full home stylesheet without blocking rendering.
         The media="print" trick causes browsers to fetch at low priority;
         onload swaps it to media="all" so all styles apply after first paint. --}}
    @php
        $homeCssHref = null;
        try {
            $manifestPath = public_path('build/manifest.json');
            if (file_exists($manifestPath)) {
                $manifest = json_decode(file_get_contents($manifestPath), true);
                // home.pcss is a top-level Vite entry; 'file' is the hashed CSS filename
                $pcssEntry = $manifest['resources/css/home.pcss'] ?? null;
                if ($pcssEntry && !empty($pcssEntry['file'])) {
                    $homeCssHref = asset('build/' . $pcssEntry['file']);
                }
            }
        } catch (\Throwable $e) {}
    @endphp
    @if($homeCssHref)
    <link rel="preload" href="{{ $homeCssHref }}" as="style" fetchpriority="low">
    <link rel="stylesheet" href="{{ $homeCssHref }}" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="{{ $homeCssHref }}"></noscript>
    @endif

    {{-- Vite JS entry only (CSS is handled above; Vite emits the <script type="module"> tag which is non-blocking by spec) --}}
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

</head>
<body class="font-sans antialiased">
    <!-- Static Background Image for LCP - Placed outside React root so it survives hydration -->
    @if(!empty($meta['preload_image']))
    <div style="position:fixed; top:0; left:0; width:100vw; height:600px; z-index:-1; overflow:hidden;">
        <img src="{{ $meta['preload_image'] }}" width="1280" height="600" style="width:100%; height:100%; object-fit:cover;" fetchpriority="high" loading="eager" alt="Top coaching institutes and schools in Sikar, Rajasthan" />
        <div style="position:absolute; inset:0; background-color:rgba(15,23,42,0.8);"></div>
    </div>
    @endif
    <div id="home-app">
        <section style="position:relative; width:100%; min-height:500px; display:flex; align-items:center; background-color:transparent; overflow:hidden;">
            <div style="position:relative; z-index:10; width:100%; max-width:1280px; margin:0 auto; padding:6rem 1rem 2.5rem; text-align:left;">
                <p style="color:#fbbf24; font-size:0.75rem; font-weight:700; letter-spacing:0.12em; margin-bottom:1rem; text-transform:uppercase;">Coaching and School Discovery Platform</p>
                <h1 style="color:#ffffff; font-size:clamp(2.25rem, 5vw, 4rem); font-weight:800; line-height:1.1; margin-bottom:1.5rem; letter-spacing:-0.025em; margin-top:0;">Find the Best CoachinginSikar</h1>
                <p style="color:rgba(255,255,255,0.8); font-size:1.125rem; max-width:36rem; margin-bottom:2rem;">Compare coaching institutes, courses, fees, results and student reviews — all in one place.</p>
                <div style="max-width:36rem; background:#ffffff; border-radius:9999px; padding:0.5rem; display:flex; align-items:center; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                    <div style="flex:1; padding:0.5rem 1rem; color:#94a3b8;">Search coaching, courses, exams or institutes...</div>
                    <div style="background:#e11d48; color:#ffffff; font-weight:600; padding:0.625rem 1.5rem; border-radius:9999px;">Search</div>
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
        'featuredBusinesses' => $featuredBusinesses ?? [],
        'feedPosts' => $feedPosts ?? [],
        'topCommunities' => $topCommunities ?? [],
        'global_nav' => $global_nav ?? [],
    ], JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP | JSON_HEX_QUOT) !!}</script>
<!-- ChatWizs Widget -->
<script src="https://chatwizs.com/sdk/widget.js" data-id="wdg_8db35291" async></script>
<!-- End ChatWizs Widget -->
</body>
</html>
