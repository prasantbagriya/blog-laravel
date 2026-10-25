<?php

namespace Tests\Feature;

use App\Models\GscIndexingLog;
use App\Models\GscInspection;
use App\Models\GscSearchAnalytic;
use App\Models\GscSetting;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class GoogleSearchConsoleIntegrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_cannot_access_search_console_hub(): void
    {
        $response = $this->get('/admin/search-console');
        $response->assertStatus(302);
    }

    public function test_normal_user_cannot_access_search_console_hub(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $response = $this->actingAs($user)->get('/admin/search-console');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_search_console_hub(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $response = $this->actingAs($admin)->get('/admin/google-search');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/SearchConsole/Index'));
    }

    public function test_admin_can_update_gsc_settings(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $payload = [
            'property_id' => 'sc-domain:coachingsinsikar.com',
            'client_id' => 'mock-client-id-sample',
            'client_secret' => 'mock-client-secret-sample',
            'redirect_uri' => 'https://app.coachingsinsikar.com/auth/callback',
            'auto_index_posts' => true,
            'auto_index_businesses' => true,
        ];

        $response = $this->actingAs($admin)->postJson('/api/admin/gsc/settings', $payload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $settings = GscSetting::instance();
        $this->assertEquals('sc-domain:coachingsinsikar.com', $settings->property_id);
        $this->assertEquals('mock-client-id-sample', $settings->client_id);
        $this->assertEquals('mock-client-secret-sample', $settings->client_secret);
        $this->assertTrue((bool) $settings->auto_index_posts);
        $this->assertTrue((bool) $settings->auto_index_businesses);
    }

    public function test_inspect_url_validates_required_parameters(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->postJson('/api/admin/gsc/inspect', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['url']);
    }

    public function test_indexing_publish_validates_required_parameters(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->postJson('/api/admin/gsc/index-url', []);

        $response->assertStatus(422)
            ->assertJson([
                'success' => false,
                'error' => 'No valid URLs provided.',
            ]);
    }

    public function test_gsc_indexing_log_records_correctly(): void
    {
        $log = GscIndexingLog::create([
            'url' => 'https://coachingsinsikar.com/blog/test-post',
            'action' => 'URL_UPDATED',
            'status' => 'success',
            'http_code' => 200,
            'triggered_by' => 'auto_post',
            'response_message' => 'Success',
        ]);

        $this->assertDatabaseHas('gsc_indexing_logs', [
            'id' => $log->id,
            'url' => 'https://coachingsinsikar.com/blog/test-post',
            'action' => 'URL_UPDATED',
            'status' => 'success',
            'triggered_by' => 'auto_post',
        ]);

        $this->assertEquals('success', $log->status);
    }

    public function test_gsc_search_analytic_and_opportunities_calculation(): void
    {
        GscSearchAnalytic::create([
            'date' => now()->subDays(2)->toDateString(),
            'query' => 'best iit jee coaching in sikar',
            'page' => 'https://coachingsinsikar.com/business/allen-sikar',
            'country' => 'ind',
            'device' => 'MOBILE',
            'clicks' => 45,
            'impressions' => 1200,
            'ctr' => 0.0375,
            'position' => 11.2,
        ]);

        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->getJson('/api/admin/gsc/opportunities');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'success',
                'striking_distance',
                'low_ctr',
            ]);

        $data = $response->json();
        $this->assertNotEmpty($data['striking_distance']);
        $this->assertEquals('best iit jee coaching in sikar', $data['striking_distance'][0]['query']);
    }

    public function test_env_and_services_google_configuration_is_loaded(): void
    {
        $this->assertNotNull(config('services.google.client_id'));
        $this->assertNotNull(config('services.google.client_secret'));
        $this->assertEquals(
            'https://coachingsinsikar.com/auth/callback',
            config('services.google.redirect_uri')
        );
    }

    public function test_redirect_to_google_login(): void
    {
        $response = $this->get('/auth/google');
        $response->assertStatus(302);
        $target = $response->headers->get('Location');
        $this->assertStringContainsString('accounts.google.com/o/oauth2/v2/auth', $target);
        $this->assertStringContainsString('state=google_auth_login', $target);
        $this->assertStringContainsString('scope=openid+email+profile', $target);
    }

    public function test_google_login_callback_authenticates_existing_or_new_user(): void
    {
        \Illuminate\Support\Facades\Http::fake([
            'https://oauth2.googleapis.com/token' => \Illuminate\Support\Facades\Http::response([
                'access_token' => 'mock_google_access_token',
                'expires_in' => 3600,
            ], 200),
            'https://www.googleapis.com/oauth2/v3/userinfo' => \Illuminate\Support\Facades\Http::response([
                'email' => 'newuser@example.com',
                'name' => 'Demo Google User',
                'picture' => 'https://example.com/avatar.jpg',
            ], 200),
        ]);

        $response = $this->get('/auth/callback?code=mock_code&state=google_auth_login');

        $response->assertStatus(302);
        $this->assertAuthenticated();
        $this->assertDatabaseHas('users', [
            'email' => 'newuser@example.com',
            'name' => 'Demo Google User',
        ]);
    }

    public function test_run_migrate_route_executes_successfully(): void
    {
        $response = $this->get('/app-upgrade?pin=sikar2026');
        $response->assertStatus(200);
        $this->assertStringContainsString('Database & System Upgrade', $response->getContent());
        $this->assertStringContainsString('Database Migration Results', $response->getContent());
    }

    public function test_indexing_publish_hits_v3_endpoint_and_logs_success(): void
    {
        \Illuminate\Support\Facades\Http::fake([
            'https://indexing.googleapis.com/v3/urlNotifications:publish' => \Illuminate\Support\Facades\Http::response([
                'urlNotificationMetadata' => [
                    'url' => 'https://coachingsinsikar.com/news/jee-mains-2027',
                    'latestUpdate' => [
                        'type' => 'URL_UPDATED',
                        'notifyTime' => '2026-10-25T14:10:00Z',
                    ],
                ],
            ], 200),
        ]);

        \Illuminate\Support\Facades\Cache::put('gsc_active_access_token', 'mock_token', 3600);

        $admin = User::factory()->create(['is_admin' => true]);

        $response = $this->actingAs($admin)->postJson('/api/admin/gsc/index-url', [
            'url' => 'https://coachingsinsikar.com/news/jee-mains-2027',
            'action' => 'URL_UPDATED',
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
            ]);

        $this->assertDatabaseHas('gsc_indexing_logs', [
            'url' => 'https://coachingsinsikar.com/news/jee-mains-2027',
            'action' => 'URL_UPDATED',
            'status' => 'success',
            'http_code' => 200,
        ]);
    }
}
