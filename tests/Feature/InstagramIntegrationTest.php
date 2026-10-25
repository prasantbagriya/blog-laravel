<?php

namespace Tests\Feature;

use App\Models\InstagramAccount;
use App\Models\InstagramPostShare;
use App\Models\Post;
use App\Models\User;
use App\Services\Instagram\InstagramAuthService;
use App\Services\Instagram\InstagramCaptionGeneratorService;
use App\Services\Instagram\InstagramPublishService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class InstagramIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.instagram.client_id', '1464713225364837');
        Config::set('services.instagram.client_secret', 'mock_app_secret_abc123');
        Config::set('services.instagram.redirect_uri', 'https://coachingsinsikar.com/auth/instagram/callback');
        Config::set('services.instagram.graph_version', 'v21.0');
    }

    public function test_auth_service_generates_correct_meta_oauth_url()
    {
        $service = app(InstagramAuthService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertTrue(
            str_contains($url, 'https://www.instagram.com/oauth/authorize') ||
            str_contains($url, 'https://www.facebook.com/v21.0/dialog/oauth')
        );
        $this->assertStringContainsString('client_id=', $url);
        $this->assertStringContainsString('instagram_', $url);
    }

    public function test_caption_generator_creates_instagram_aesthetic_copy()
    {
        $post = Post::create([
            'title' => 'Top 10 NEET Coaching Centers in Piprali Road Sikar 2027 Admission Guide',
            'slug' => 'top-10-neet-coaching-piprali-road-sikar',
            'content' => 'Explore the best medical coaching institutes located in Sikar education hub with rankings, fee structure and selection records.',
            'category' => 'Medical',
            'published' => true,
        ]);

        $service = app(InstagramCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['caption']);
        $this->assertLessThanOrEqual(2200, mb_strlen($draft['caption']));
        $this->assertStringContainsString('Tap the link in our bio', $draft['caption']);
        $this->assertStringContainsString('#CoachingsInSikar', $draft['caption']);
        $this->assertStringContainsString('#SikarEducation', $draft['caption']);
        $this->assertNotEmpty($draft['hashtags']);
    }

    public function test_publish_service_publishes_photo_container_and_returns_permalink()
    {
        Http::fake([
            'https://graph.facebook.com/v21.0/17841400011223344/media' => Http::response([
                'id' => 'container_99887766',
            ], 200),
            'https://graph.facebook.com/v21.0/17841400011223344/media_publish' => Http::response([
                'id' => 'media_1122334455',
            ], 200),
            'https://graph.facebook.com/v21.0/media_1122334455*' => Http::response([
                'id' => 'media_1122334455',
                'permalink' => 'https://www.instagram.com/p/DB1234XYZ/',
            ], 200),
        ]);

        $account = InstagramAccount::create([
            'instagram_business_id' => '17841400011223344',
            'facebook_page_id' => 'page_55667788',
            'username' => 'coachingsinsikar',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_page_token_abc',
            'is_active' => true,
        ]);

        $publishService = app(InstagramPublishService::class);
        $result = $publishService->publishPhoto(
            $account,
            'https://coachingsinsikar.com/uploads/social/banner.webp',
            'Hello Sikar from automated Instagram feed post!'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('media_1122334455', $result['media_id']);
        $this->assertEquals('https://www.instagram.com/p/DB1234XYZ/', $result['permalink']);
    }

    public function test_admin_instagram_hub_accessible()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/instagram');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Instagram/Index'));
    }

    public function test_admin_can_generate_instagram_draft_for_post()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $post = Post::create([
            'title' => 'Top Engineering Institutes in Piprali Road Sikar 2027',
            'slug' => 'top-engineering-institutes-piprali-road-sikar',
            'content' => 'Complete review of faculty, hostel facilities, batch timings and success ratios in Sikar.',
            'category' => 'Engineering',
            'published' => true,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/admin/instagram/draft/{$post->id}");
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'draft' => ['caption', 'image_url', 'target_link', 'hashtags'],
        ]);
    }

    public function test_admin_can_approve_and_publish_instagram_post()
    {
        Http::fake([
            'https://graph.facebook.com/v21.0/17841400011223344/media' => Http::response([
                'id' => 'container_77665544',
            ], 200),
            'https://graph.facebook.com/v21.0/17841400011223344/media_publish' => Http::response([
                'id' => 'media_5544332211',
            ], 200),
            'https://graph.facebook.com/v21.0/media_5544332211*' => Http::response([
                'id' => 'media_5544332211',
                'permalink' => 'https://www.instagram.com/p/DC5544332211/',
            ], 200),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = InstagramAccount::create([
            'instagram_business_id' => '17841400011223344',
            'facebook_page_id' => 'page_999888',
            'username' => 'coachingsinsikar',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_token_xyz',
            'is_active' => true,
        ]);

        $share = InstagramPostShare::create([
            'instagram_account_id' => $account->id,
            'caption' => 'Approved Instagram caption for students!',
            'image_url' => 'https://coachingsinsikar.com/uploads/social/neet.webp',
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/instagram/approve-publish', [
            'share_id' => $share->id,
            'caption' => 'Approved Instagram caption for students!',
            'image_url' => 'https://coachingsinsikar.com/uploads/social/neet.webp',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'media_id' => 'media_5544332211',
            'permalink' => 'https://www.instagram.com/p/DC5544332211/',
        ]);

        $this->assertDatabaseHas('instagram_post_shares', [
            'id' => $share->id,
            'status' => 'published',
            'ig_media_id' => 'media_5544332211',
        ]);
    }
}
