<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\BingWebmasterSetting;
use App\Models\BingSubmissionLog;
use App\Services\Bing\BingWebmasterService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Carbon\Carbon;

class BingWebmasterIntegrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        BingWebmasterSetting::ensureSchema();
        BingSubmissionLog::ensureSchema();
    }

    public function test_bing_settings_singleton_initializes_with_defaults()
    {
        $setting = BingWebmasterSetting::current();
        $this->assertNotNull($setting);
        $this->assertNotEmpty($setting->client_id);
        $this->assertEquals(10000, $setting->daily_quota_remaining);
    }

    public function test_authorization_url_generation()
    {
        $service = app(BingWebmasterService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertStringContainsString('https://www.bing.com/webmasters/oauth/authorize', $url);
        $this->assertStringContainsString('client_id=1a80c581602a4b3abd3071232d170f6f', $url);
        $this->assertStringContainsString('response_type=code', $url);
    }

    public function test_token_exchange_and_callback_handling()
    {
        Http::fake([
            'https://www.bing.com/webmasters/oauth/token' => Http::response([
                'access_token' => 'mock_bing_access_token_xyz',
                'refresh_token' => 'mock_bing_refresh_token_abc',
                'expires_in' => 3600,
            ], 200),
        ]);

        $service = app(BingWebmasterService::class);
        $res = $service->handleCallback('mock_auth_code_123');

        $this->assertTrue($res['success']);
        
        $setting = BingWebmasterSetting::current();
        $this->assertTrue($setting->is_connected);
        $this->assertEquals('mock_bing_access_token_xyz', $setting->access_token);
        $this->assertEquals('mock_bing_refresh_token_abc', $setting->refresh_token);
    }

    public function test_submit_url_records_log_and_decrements_quota()
    {
        Http::fake([
            'https://ssl.bing.com/webmaster/api.svc/json/SubmitUrl*' => Http::response(null, 200),
        ]);

        $setting = BingWebmasterSetting::current();
        $setting->update([
            'is_connected' => true,
            'access_token' => 'valid_token',
            'daily_quota_remaining' => 10000,
        ]);

        $service = app(BingWebmasterService::class);
        $targetUrl = 'https://coachingsinsikar.com/blog/best-neet-coaching';
        $res = $service->submitUrl($targetUrl);

        $this->assertTrue($res['success']);
        $this->assertEquals(9999, $res['remaining_quota']);

        $this->assertDatabaseHas('bing_submission_logs', [
            'url' => $targetUrl,
            'status' => 'success',
        ]);
    }

    public function test_admin_bing_hub_route_is_accessible_to_admins()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/bing');
        $response->assertStatus(200);
    }

    public function test_submit_sitemap_uses_submit_feed_endpoint()
    {
        Http::fake([
            'https://ssl.bing.com/webmaster/api.svc/json/SubmitFeed*' => Http::response(null, 200),
            'https://ssl.bing.com/webmaster/api.svc/json/GetUserSites*' => Http::response([
                'd' => [
                    ['Url' => 'https://coachingsinsikar.com', 'IsVerified' => true]
                ]
            ], 200),
        ]);

        $setting = BingWebmasterSetting::current();
        $setting->update([
            'is_connected' => true,
            'access_token' => 'valid_token',
        ]);

        $service = app(BingWebmasterService::class);
        $res = $service->submitSitemap('https://coachingsinsikar.com/sitemap.xml');

        $this->assertTrue($res['success']);
        $this->assertStringContainsString('submitted to Bing successfully', $res['message']);
    }

    public function test_get_sitemaps_uses_get_feeds_endpoint()
    {
        Http::fake([
            'https://ssl.bing.com/webmaster/api.svc/json/GetFeeds*' => Http::response([
                'd' => [
                    [
                        'Url' => 'https://coachingsinsikar.com/sitemap.xml',
                        'Status' => 1,
                        'SubmittedUrlsCount' => 120,
                        'LastDownloadDate' => '/Date(1718016840000)/',
                        'LastSubmissionDate' => '/Date(1717930400000)/',
                    ]
                ]
            ], 200),
            'https://ssl.bing.com/webmaster/api.svc/json/GetUserSites*' => Http::response([
                'd' => [
                    ['Url' => 'https://coachingsinsikar.com', 'IsVerified' => true]
                ]
            ], 200),
        ]);

        $setting = BingWebmasterSetting::current();
        $setting->update([
            'is_connected' => true,
            'access_token' => 'valid_token',
        ]);

        $service = app(BingWebmasterService::class);
        $res = $service->getSitemaps();

        $this->assertTrue($res['success']);
        $this->assertCount(1, $res['sitemaps']);
        $this->assertEquals('https://coachingsinsikar.com/sitemap.xml', $res['sitemaps'][0]['Url']);
        $this->assertEquals('Active', $res['sitemaps'][0]['Status']);
    }
}
