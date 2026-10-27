<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\Schema::defaultStringLength(191);

        $rawAppUrl = (string) config('app.url', '');
        // Clean any malformed, duplicated, or corrupted schemes (e.g. "http:https://", "http://https://", "coachingsinsikar.com")
        $cleanHost = preg_replace('#^https?://#i', '', $rawAppUrl);
        $cleanHost = preg_replace('#^(https?:/?/?)+#i', '', $cleanHost);
        $cleanHost = trim($cleanHost, '/');

        $isProduction = config('app.env') === 'production'
            || (!empty($cleanHost) && !str_contains($cleanHost, 'localhost') && !str_contains($cleanHost, '127.0.0.1'));

        if ($isProduction && !empty($cleanHost)) {
            $canonicalUrl = 'https://' . $cleanHost;
            config(['app.url' => $canonicalUrl]);
            \Illuminate\Support\Facades\URL::forceScheme('https');
            \Illuminate\Support\Facades\URL::forceRootUrl($canonicalUrl);
        } elseif (config('app.env') === 'production' || str_contains($rawAppUrl, 'https://')) {
            \Illuminate\Support\Facades\URL::forceScheme('https');
            if (!empty($cleanHost)) {
                \Illuminate\Support\Facades\URL::forceRootUrl('https://' . $cleanHost);
            }
        }
        Vite::usePreloadTagAttributes(fn () => false);
    }
}
