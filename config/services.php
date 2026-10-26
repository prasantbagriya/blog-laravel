<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'postmark' => [
        'key' => env('POSTMARK_API_KEY'),
    ],

    'resend' => [
        'key' => env('RESEND_API_KEY'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'slack' => [
        'notifications' => [
            'bot_user_oauth_token' => env('SLACK_BOT_USER_OAUTH_TOKEN'),
            'channel' => env('SLACK_BOT_USER_DEFAULT_CHANNEL'),
        ],
    ],

    'gemini' => [
        'api_key' => env('GEMINI_API_KEY'),
        'model' => env('GEMINI_MODEL', 'gemini-3.5-flash'),
    ],

    'google' => [
        'client_id' => env('GOOGLE_CLIENT_ID'),
        'client_secret' => env('GOOGLE_CLIENT_SECRET'),
        'redirect_uri' => env('GOOGLE_REDIRECT_URI', 'https://coachingsinsikar.com/auth/callback'),
        'site_url' => env('GOOGLE_SEARCH_CONSOLE_SITE_URL', 'https://coachingsinsikar.com/'),
        'refresh_token' => env('GOOGLE_REFRESH_TOKEN'),
        'pagespeed_api_key' => env('PAGESPEED_API_KEY', env('GOOGLE_API_KEY')),
    ],

    'facebook' => [
        'client_id' => env('FACEBOOK_APP_ID') ?: env('FACEBOOK_CLIENT_ID'),
        'client_secret' => env('FACEBOOK_APP_SECRET') ?: env('FACEBOOK_CLIENT_SECRET'),
        'redirect_uri' => env('FACEBOOK_REDIRECT_URI', 'https://coachingsinsikar.com/api/fb/callback'),
        'graph_version' => env('FACEBOOK_GRAPH_VERSION', 'v21.0'),
    ],

    'x' => [
        'consumer_key' => env('X_CONSUMER_KEY'),
        'consumer_secret' => env('X_CONSUMER_SECRET'),
        'bearer_token' => env('X_BEARER_TOKEN'),
        'client_id' => env('X_CLIENT_ID') ?: env('X_CONSUMER_KEY'),
        'client_secret' => env('X_CLIENT_SECRET') ?: env('X_CONSUMER_SECRET'),
        'redirect_uri' => env('X_REDIRECT_URI', 'https://coachingsinsikar.com/auth/x/callback'),
        'access_token' => env('X_ACCESS_TOKEN'),
        'access_token_secret' => env('X_ACCESS_TOKEN_SECRET'),
    ],

    'pinterest' => [
        'client_id' => env('PINTEREST_APP_ID') ?: env('PINTEREST_CLIENT_ID'),
        'client_secret' => env('PINTEREST_APP_SECRET') ?: env('PINTEREST_CLIENT_SECRET'),
        'redirect_uri' => env('PINTEREST_REDIRECT_URI', 'https://coachingsinsikar.com/auth/pinterest/callback'),
        'access_token' => env('PINTEREST_ACCESS_TOKEN'),
    ],

    'instagram' => [
        'client_id' => env('INSTAGRAM_APP_ID') ?: (env('FACEBOOK_APP_ID') ?: env('FACEBOOK_CLIENT_ID')),
        'client_secret' => env('INSTAGRAM_APP_SECRET') ?: (env('FACEBOOK_APP_SECRET') ?: env('FACEBOOK_CLIENT_SECRET')),
        'redirect_uri' => env('INSTAGRAM_REDIRECT_URI', 'https://coachingsinsikar.com/auth/instagram/callback'),
        'verify_token' => env('INSTAGRAM_VERIFY_TOKEN', 'sikar_instagram_verify_token_2026'),
        'graph_version' => env('FACEBOOK_GRAPH_VERSION', 'v21.0'),
    ],

    'linkedin' => [
        'client_id' => env('LINKEDIN_CLIENT_ID'),
        'client_secret' => env('LINKEDIN_CLIENT_SECRET'),
        'redirect_uri' => env('LINKEDIN_REDIRECT_URI', 'https://coachingsinsikar.com/auth/linkedin/callback'),
        'organization_id' => env('LINKEDIN_ORGANIZATION_ID'),
        'organization_name' => env('LINKEDIN_ORGANIZATION_NAME', 'Coachings in Sikar'),
    ],

];
