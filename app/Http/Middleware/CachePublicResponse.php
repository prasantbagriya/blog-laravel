<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CachePublicResponse
{
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
        $key = 'public_page_cache_' . md5($request->fullUrl() . '_' . $isInertia);

        if (Cache::has($key)) {
            $cached = Cache::get($key);
            return response($cached['content'], 200, $cached['headers']);
        }

        $response = $next($request);
        
        // Only cache successful 200 OK responses
        if ($response->isSuccessful()) {
            $headers = ['Content-Type' => $response->headers->get('Content-Type')];
            if ($response->headers->has('X-Inertia')) {
                $headers['X-Inertia'] = $response->headers->get('X-Inertia');
            }
            
            Cache::put($key, [
                'content' => $response->getContent(),
                'headers' => $headers
            ], $ttl);
        }
        
        return $response;
    }
}
