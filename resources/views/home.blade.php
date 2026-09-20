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
    <link rel="alternate" type="application/rss+xml" title="Blog RSS Feed" href="{{ url('/blog/feed.xml') }}">
    <link rel="icon" type="image/webp" sizes="192x192" href="/uploads/logo.webp">
    <link rel="icon" type="image/webp" sizes="96x96" href="/uploads/logo.webp">
    <link rel="icon" type="image/webp" sizes="48x48" href="/uploads/logo.webp">
    <link rel="apple-touch-icon" href="/uploads/logo.webp">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap"></noscript>

    <script>
        window.BASE_PATH = "{{ url('') }}";
        window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
        }
    </script>
    @viteReactRefresh
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
</head>
<body class="font-sans antialiased">
    <div id="home-app"></div>
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
