<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CachePublicResponse
{
    /**
     * Increment cache version to instantly invalidate all cached public pages.
     */
    public static function purge(): void
    {
        try {
            Cache::increment('public_page_cache_version');
        } catch (\Throwable $e) {
            try {
                Cache::forever('public_page_cache_version', time());
            } catch (\Throwable $e2) {}
        }
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, int $ttl = 86400): Response
    {
        // Do not cache if user is logged in or if it is not a GET request
        if (auth()->check() || !$request->isMethod('GET')) {
            return $next($request);
        }

        // Differentiate between full HTML page load and Inertia XHR requests
        $isInertia = $request->header('X-Inertia') ? '1' : '0';
        $version = 3;
        try {
            $version = (int) Cache::get('public_page_cache_version', 3);
        } catch (\Throwable $e) {}

        $key = 'public_page_cache_v' . $version . '_' . md5($request->fullUrl() . '_' . $isInertia);

        try {
            if (Cache::has($key)) {
                $cached = Cache::get($key);
                if (is_array($cached) && isset($cached['content'], $cached['headers'])) {
                    $headers = $cached['headers'];
                    $headers['X-Cache'] = 'HIT';
                    $headers['Cache-Control'] = 'public, max-age=3600, stale-while-revalidate=86400';
                    return response($cached['content'], 200, $headers);
                }
            }
        } catch (\Throwable $e) {
            // Fallback gracefully if cache read fails
        }

        $response = $next($request);
        
        // Only cache successful 200 OK responses
        if ($response->isSuccessful()) {
            $headers = ['Content-Type' => $response->headers->get('Content-Type')];
            if ($response->headers->has('X-Inertia')) {
                $headers['X-Inertia'] = $response->headers->get('X-Inertia');
            }
            $response->headers->set('X-Cache', 'MISS');
            $response->headers->set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
            
            try {
                Cache::put($key, [
                    'content' => $response->getContent(),
                    'headers' => $headers
                ], $ttl);
            } catch (\Throwable $e) {
                // Fallback gracefully if cache write fails
            }
        }
        
        return $response;
    }
}
