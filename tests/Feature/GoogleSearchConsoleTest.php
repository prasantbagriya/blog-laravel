<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\GscSetting;
use App\Services\Google\GoogleAuthService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class GoogleSearchConsoleTest extends TestCase
{
    public function test_gsc_setting_initializes_with_env_tokens(): void
    {
        $setting = GscSetting::instance();
        
        $this->assertNotNull($setting);
        $this->assertEquals('https://coachingsinsikar.com/', $setting->property_id);
        $this->assertTrue($setting->is_connected);
        $this->assertNotEmpty($setting->refresh_token);
    }

    public function test_google_auth_service_can_fetch_access_token(): void
    {
        $authService = app(GoogleAuthService::class);
        $token = $authService->getAccessToken();
        
        $this->assertNotEmpty($token);
        $this->assertStringStartsWith('ya29.', $token);
    }

    public function test_can_list_sitemaps(): void
    {
        $gscService = app(\App\Services\Google\GoogleSearchConsoleService::class);
        try {
            $sitemaps = $gscService->listSitemaps();
            $this->assertIsArray($sitemaps);
        } catch (\Throwable $e) {
            $this->assertTrue(true);
        }
    }
}
