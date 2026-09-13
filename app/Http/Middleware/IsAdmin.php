<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = auth()->user();
        if (!$user || ($user->role !== 'super_admin' && $user->role !== 'admin' && !$user->is_admin)) {
            abort(403, 'Unauthorized Access. Role: ' . ($user ? $user->role : 'none'));
        }

        return $next($request);
    }
}
