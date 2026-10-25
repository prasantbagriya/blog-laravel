<?php

namespace Tests\Feature;

use App\Models\PinterestAccount;
use App\Models\PinterestBoard;
use App\Models\PinterestPinShare;
use App\Models\Post;
use App\Models\User;
use App\Services\Pinterest\PinterestAuthService;
use App\Services\Pinterest\PinterestCaptionGeneratorService;
use App\Services\Pinterest\PinterestService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PinterestIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.pinterest.client_id', 'test_pin_client_id_123');
        Config::set('services.pinterest.client_secret', 'test_pin_client_secret_456');
        Config::set('services.pinterest.redirect_uri', 'https://coachingsinsikar.com/auth/pinterest/callback');
    }

    public function test_auth_service_generates_correct_pinterest_pkce_url()
    {
        $service = app(PinterestAuthService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertStringContainsString('https://www.pinterest.com/oauth/', $url);
        $this->assertStringContainsString('client_id=test_pin_client_id_123', $url);
        $this->assertStringContainsString('scope=', $url);
        $this->assertStringContainsString('boards%3Aread', $url);
        $this->assertStringContainsString('pins%3Awrite', $url);
    }

    public function test_caption_generator_respects_pinterest_constraints()
    {
        $post = Post::create([
            'title' => 'Complete Comprehensive Guide to NEET Coaching in Piprali Road Sikar 2027 Admissions Fees Faculty and Selection Ratio',
            'slug' => 'neet-coaching-piprali-road-sikar-guide',
            'content' => 'Comprehensive information on faculty, batch sizes, test series, hostel facilities, and scholarship exams in Piprali Road Sikar.',
            'category' => 'Medical',
            'published' => true,
        ]);

        $service = app(PinterestCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['title']);
        $this->assertLessThanOrEqual(100, mb_strlen($draft['title']));
        $this->assertNotEmpty($draft['description']);
        $this->assertLessThanOrEqual(500, mb_strlen($draft['description']));
        $this->assertStringContainsString('utm_source=pinterest', $draft['description']);
        $this->assertStringContainsString('#', $draft['description']);
    }

    public function test_pinterest_service_creates_pin_successfully()
    {
        Http::fake([
            'https://api.pinterest.com/v5/pins' => Http::response([
                'id' => '1122334455667788',
                'title' => 'Top Sikar Coaching Institutes',
                'description' => 'Pin description with insights',
                'board_id' => 'board_998877',
            ], 201),
        ]);

        $account = PinterestAccount::create([
            'pinterest_user_id' => 'pin_user_99',
            'username' => 'sikarcoaching',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_pinterest_token_abc',
            'is_active' => true,
        ]);

        $board = PinterestBoard::create([
            'pinterest_account_id' => $account->id,
            'board_id' => 'board_998877',
            'name' => 'Best Coachings in Sikar',
            'is_default' => true,
        ]);

        $service = app(PinterestService::class);
        $result = $service->createPin(
            $account,
            $board,
            'Top Sikar Coaching Institutes',
            'Pin description with insights',
            'https://coachingsinsikar.com/uploads/social/test.webp',
            'https://coachingsinsikar.com/blog/test'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('1122334455667788', $result['pin_id']);
        $this->assertEquals('https://www.pinterest.com/pin/1122334455667788/', $result['pin_url']);
    }

    public function test_admin_pinterest_hub_dashboard_accessible()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/pinterest');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Pinterest/Index'));
    }

    public function test_admin_can_generate_pin_draft_for_post()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $post = Post::create([
            'title' => 'Best JEE Advanced Preparation Strategy in Sikar for Top 100 Ranks',
            'slug' => 'best-jee-advanced-prep-strategy-sikar',
            'content' => 'Step-by-step guidance, revision timetables, and mock test tips from Sikar experts.',
            'category' => 'Engineering',
            'published' => true,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/admin/pinterest/draft/{$post->id}");
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'share_id',
            'draft' => ['title', 'description', 'target_link', 'hashtags'],
        ]);

        $this->assertDatabaseHas('pinterest_pin_shares', [
            'post_id' => $post->id,
            'status' => 'pending_approval',
        ]);
    }

    public function test_admin_can_approve_and_publish_pin()
    {
        Http::fake([
            'https://api.pinterest.com/v5/pins' => Http::response([
                'id' => '9988776655443322',
                'title' => 'Approved Pin for Sikar Students',
                'description' => 'Approved description with links',
                'board_id' => 'board_123',
            ], 201),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = PinterestAccount::create([
            'pinterest_user_id' => 'pin_user_123',
            'username' => 'coachingsinsikar',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_pin_token_xyz',
            'is_active' => true,
        ]);

        $board = PinterestBoard::create([
            'pinterest_account_id' => $account->id,
            'board_id' => 'board_123',
            'name' => 'Sikar Coaching Hub',
            'is_default' => true,
        ]);

        $share = PinterestPinShare::create([
            'pinterest_account_id' => $account->id,
            'pinterest_board_id' => $board->id,
            'title' => 'Approved Pin for Sikar Students',
            'description' => 'Approved description with links',
            'image_url' => 'https://coachingsinsikar.com/uploads/social/cover.webp',
            'target_link' => 'https://coachingsinsikar.com/blog/sample',
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/pinterest/approve-publish', [
            'share_id' => $share->id,
            'title' => 'Approved Pin for Sikar Students',
            'description' => 'Approved description with links',
            'image_url' => 'https://coachingsinsikar.com/uploads/social/cover.webp',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'pin_id' => '9988776655443322',
        ]);

        $this->assertDatabaseHas('pinterest_pin_shares', [
            'id' => $share->id,
            'status' => 'published',
            'pin_id' => '9988776655443322',
        ]);
    }
}
