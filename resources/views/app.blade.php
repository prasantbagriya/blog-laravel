<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="robots" content="max-image-preview:large">

        <!-- Google tag (gtag.js) -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NRXEX23V4X"></script>
        <script>
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NRXEX23V4X');
        </script>
        
        <meta name="google-site-verification" content="HcrL5h0jDeKpvNkKKIjIAUm-bR_AY0bu07aJsU4qLuQ" />

        <link rel="canonical" href="{{ str_replace('http://', 'https://', url()->current()) }}" />
        
        <title inertia>{{ $page['props']['meta']['title'] ?? 'cochinginsikar - Home' }}</title>

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" media="print" onload="this.media='all'" />
        <noscript>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" />
        </noscript>

        <!-- Scripts -->
        @if(request()->is('admin*') || request()->is('api/admin*'))
            @routes
        @else
            @routes('public')
        @endif
        <script>
            window.BASE_PATH = "{{ url('') }}";
            // Strip scheme/host if needed, but relative works best for fetch
            window.BASE_PATH = new URL(window.BASE_PATH).pathname === '/' ? '' : new URL(window.BASE_PATH).pathname;
        </script>
        @viteReactRefresh
        @php
            $pageComponentJsx = "resources/js/Pages/{$page['component']}.jsx";
            $pageComponentTsx = "resources/js/Pages/{$page['component']}.tsx";
            $vitePage = file_exists(base_path($pageComponentTsx)) ? $pageComponentTsx : $pageComponentJsx;
        @endphp
        @vite(['resources/js/app.jsx', $vitePage])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
