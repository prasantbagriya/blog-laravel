<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;

class BingWebmasterSetting extends Model
{
    use HasFactory;

    protected $table = 'bing_webmaster_settings';

    protected $guarded = [];

    protected $casts = [
        'is_connected' => 'boolean',
        'auto_index_posts' => 'boolean',
        'daily_quota_remaining' => 'integer',
        'token_expires_at' => 'datetime',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Auto-heal database schema if table is missing in live MySQL.
     */
    public static function ensureSchema(): void
    {
        try {
            if (!Schema::hasTable('bing_webmaster_settings') || !Schema::hasTable('bing_submission_logs')) {
                Artisan::call('migrate', ['--force' => true]);
            }
        } catch (\Throwable $e) {}
    }

    /**
     * Get or create the active singleton settings row.
     */
    public static function current(): self
    {
        self::ensureSchema();

        $defaultSiteUrl = config('services.bing.site_url', 'https://coachingsinsikar.com/');
        $defaultClientId = config('services.bing.client_id', '1a80c581602a4b3abd3071232d170f6f');
        $defaultClientSecret = config('services.bing.client_secret');
        $defaultApiKey = config('services.bing.api_key');

        $setting = self::first();
        if (!$setting) {
            $setting = self::create([
                'site_url' => $defaultSiteUrl,
                'client_id' => $defaultClientId,
                'client_secret' => $defaultClientSecret,
                'api_key' => $defaultApiKey,
                'is_connected' => false,
                'auto_index_posts' => true,
                'daily_quota_remaining' => 10000,
            ]);
        } else {
            // Keep env fallbacks if missing in DB
            $updated = false;
            if (empty($setting->client_id) && !empty($defaultClientId)) {
                $setting->client_id = $defaultClientId;
                $updated = true;
            }
            if (empty($setting->client_secret) && !empty($defaultClientSecret)) {
                $setting->client_secret = $defaultClientSecret;
                $updated = true;
            }
            if (empty($setting->api_key) && !empty($defaultApiKey)) {
                $setting->api_key = $defaultApiKey;
                $updated = true;
            }
            if ($updated) {
                $setting->save();
            }
        }

        return $setting;
    }
}
