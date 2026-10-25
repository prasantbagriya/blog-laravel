<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GscSetting extends Model
{
    protected $guarded = [];

    protected $casts = [
        'client_secret' => 'encrypted',
        'refresh_token' => 'encrypted',
        'access_token' => 'encrypted',
        'service_account_json' => 'encrypted',
        'is_connected' => 'boolean',
        'auto_index_posts' => 'boolean',
        'auto_index_businesses' => 'boolean',
        'auto_index_stories' => 'boolean',
        'token_expires_at' => 'datetime',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Retrieve or instantiate the singleton settings record.
     */
    public static function instance(): self
    {
        $setting = self::firstOrCreate(
            ['id' => 1],
            [
                'property_id' => config('services.google.site_url', 'https://coachingsinsikar.com/'),
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'redirect_uri' => config('services.google.redirect_uri', 'https://coachingsinsikar.com/auth/callback'),
                'auth_mode' => 'oauth',
                'auto_index_posts' => true,
                'auto_index_businesses' => true,
                'auto_index_stories' => true,
                'is_connected' => false,
            ]
        );

        $updates = [];

        if (empty($setting->client_id) && config('services.google.client_id')) {
            $updates['client_id'] = config('services.google.client_id');
            $updates['client_secret'] = config('services.google.client_secret');
            $updates['redirect_uri'] = config('services.google.redirect_uri');
            $updates['property_id'] = $setting->property_id ?: config('services.google.site_url', 'https://coachingsinsikar.com/');
        }

        $configRefreshToken = config('services.google.refresh_token');
        if (!empty($configRefreshToken) && (empty($setting->refresh_token) || !$setting->is_connected)) {
            $updates['refresh_token'] = $configRefreshToken;
            $updates['is_connected'] = true;
            $updates['auth_mode'] = 'oauth';
            $updates['last_error'] = null;
        }

        if (!empty($updates)) {
            $setting->update($updates);
        }

        return $setting;
    }
}
