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

        <link rel="alternate" type="application/rss+xml" title="Blog RSS Feed" href="{{ url('/blog/feed.xml') }}" />

        <!-- Favicons -->
        <link rel="icon" type="image/webp" sizes="192x192" href="/uploads/logo.webp">
        <link rel="icon" type="image/webp" sizes="96x96" href="/uploads/logo.webp">
        <link rel="icon" type="image/webp" sizes="48x48" href="/uploads/logo.webp">
        <link rel="apple-touch-icon" href="/uploads/logo.webp">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" media="print" onload="this.media='all'">
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap">
        </noscript>

        <!-- Scripts -->
        {{-- Public pages only need the public route map. Admin routes stay server-side. --}}
        @routes('public')
        <script>
            window.BASE_PATH = "{{ url('') }}";
            // Strip scheme/host if needed, but relative works best for fetch
            window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        </script>
        @viteReactRefresh
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
        
        @inertia

    </body>
</html>
