<?php

namespace Tests\Feature;

use App\Models\FacebookAccount;
use App\Models\FacebookPage;
use App\Models\FacebookPostShare;
use App\Models\Post;
use App\Models\User;
use App\Services\Facebook\FacebookAuthService;
use App\Services\Facebook\FacebookCaptionGeneratorService;
use App\Services\Facebook\FacebookGraphService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class FacebookIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.facebook.client_id', '1234567890');
        Config::set('services.facebook.client_secret', 'test_secret_abc123');
        Config::set('services.facebook.redirect_uri', 'https://coachingsinsikar.com/auth/facebook/callback');
        Config::set('services.facebook.graph_version', 'v20.0');
    }

    public function test_auth_service_generates_correct_meta_oauth_url()
    {
        $service = app(FacebookAuthService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertStringContainsString('https://www.facebook.com/v20.0/dialog/oauth', $url);
        $this->assertStringContainsString('client_id=1234567890', $url);
        $this->assertStringContainsString('redirect_uri=' . urlencode('https://coachingsinsikar.com/auth/facebook/callback'), $url);
        $this->assertStringContainsString('pages_manage_posts', $url);
    }

    public function test_auth_service_handles_callback_and_syncs_pages()
    {
        Http::fake([
            'https://graph.facebook.com/v20.0/oauth/access_token*' => Http::sequence()
                ->push(['access_token' => 'short_token_123', 'expires_in' => 3600])
                ->push(['access_token' => 'long_token_456', 'expires_in' => 5184000]),
            'https://graph.facebook.com/v20.0/me?*' => Http::response([
                'id' => 'fb_user_999',
                'name' => 'Sikar Admin',
                'email' => 'admin@coachingsinsikar.com',
                'picture' => ['data' => ['url' => 'https://example.com/avatar.jpg']],
            ], 200),
            'https://graph.facebook.com/v20.0/me/accounts*' => Http::response([
                'data' => [
                    [
                        'id' => '100200300',
                        'name' => 'Coachings in Sikar Official',
                        'category' => 'Education',
                        'access_token' => 'permanent_page_token_xyz',
                        'fan_count' => 12500,
                        'followers_count' => 15000,
                        'picture' => ['data' => ['url' => 'https://example.com/page.jpg']],
                    ]
                ]
            ], 200),
        ]);

        $service = app(FacebookAuthService::class);
        $account = $service->handleCallback('test_auth_code_123');

        $this->assertNotNull($account);
        $this->assertEquals('fb_user_999', $account->fb_user_id);
        $this->assertEquals('Sikar Admin', $account->name);
        $this->assertEquals('long_token_456', $account->user_access_token);

        $this->assertDatabaseHas('facebook_pages', [
            'page_id' => '100200300',
            'name' => 'Coachings in Sikar Official',
            'is_default' => 1,
        ]);
    }

    public function test_caption_generator_creates_hook_summary_hashtags_and_link()
    {
        $post = Post::factory()->create([
            'title' => 'JEE Mains 2027 Registration Eligibility & Exam Dates',
            'slug' => 'jee-mains-2027-registration',
            'excerpt' => 'Complete guide on eligibility criteria, exam patterns, and top coaching institutes in Sikar for JEE 2027.',
            'category' => 'Engineering',
            'coverImage' => '/uploads/jee-exam.webp',
        ]);

        $generator = app(FacebookCaptionGeneratorService::class);
        $draft = $generator->generateForPost($post);

        $this->assertStringContainsString('📢 JEE Mains 2027 Registration Eligibility & Exam Dates', $draft['caption']);
        $this->assertStringContainsString('👉 Read complete details here:', $draft['caption']);
        $this->assertStringContainsString('#CoachingsinSikar', $draft['caption']);
        $this->assertStringContainsString('#JEEMains', $draft['caption']);
        $this->assertStringContainsString('utm_source=facebook', $draft['target_link']);
        $this->assertEquals(url('/uploads/jee-exam.webp'), $draft['image_url']);
    }

    public function test_graph_service_publishes_photo_post_to_facebook_page()
    {
        Http::fake([
            'https://graph.facebook.com/v20.0/100200300/photos' => Http::response([
                'id' => 'photo_id_777',
                'post_id' => '100200300_photo_id_777',
            ], 200),
        ]);

        $account = FacebookAccount::create([
            'fb_user_id' => 'fb_user_1',
            'name' => 'Admin',
            'user_access_token' => 'token_1',
        ]);

        $page = FacebookPage::create([
            'facebook_account_id' => $account->id,
            'page_id' => '100200300',
            'name' => 'Coachings in Sikar Official',
            'page_access_token' => 'page_token_valid',
            'is_default' => true,
        ]);

        $graphService = app(FacebookGraphService::class);
        $result = $graphService->publishPhotoPost(
            $page,
            'https://coachingsinsikar.com/uploads/sample.webp',
            'Test Facebook Caption with #Sikar',
            'https://coachingsinsikar.com/blog/sample-post'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('100200300_photo_id_777', $result['post_id']);
        $this->assertEquals('https://www.facebook.com/100200300_photo_id_777', $result['permalink']);
    }

    public function test_admin_can_approve_and_publish_post_share()
    {
        Http::fake([
            'https://graph.facebook.com/v20.0/100200300/photos' => Http::response([
                'id' => 'photo_999',
                'post_id' => '100200300_999',
            ], 200),
        ]);

        $admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'admin',
        ]);

        $account = FacebookAccount::create([
            'fb_user_id' => 'fb_user_2',
            'name' => 'Admin Two',
            'user_access_token' => 'token_2',
        ]);

        $page = FacebookPage::create([
            'facebook_account_id' => $account->id,
            'page_id' => '100200300',
            'name' => 'Coachings in Sikar Official',
            'page_access_token' => 'page_token_valid',
            'is_default' => true,
        ]);

        $post = Post::factory()->create([
            'title' => 'Breaking Sikar NEET News',
            'slug' => 'breaking-sikar-neet-news',
        ]);

        $share = FacebookPostShare::create([
            'post_id' => (string) $post->id,
            'facebook_page_id' => $page->id,
            'caption' => 'Exclusive NEET Announcement',
            'image_url' => 'https://coachingsinsikar.com/uploads/neet.webp',
            'target_link' => 'https://coachingsinsikar.com/news/neet',
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/facebook/approve-publish', [
            'share_id' => $share->id,
            'post_id' => (string) $post->id,
            'facebook_page_id' => $page->id,
            'caption' => 'Exclusive NEET Announcement Approved',
            'image_url' => 'https://coachingsinsikar.com/uploads/neet.webp',
            'target_link' => 'https://coachingsinsikar.com/news/neet',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'post_id' => '100200300_999',
            'permalink' => 'https://www.facebook.com/100200300_999',
        ]);

        $this->assertDatabaseHas('facebook_post_shares', [
            'id' => $share->id,
            'status' => 'published',
            'fb_post_id' => '100200300_999',
        ]);
    }

    public function test_admin_can_access_facebook_hub()
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/facebook');
        $response->assertStatus(200);
    }
}
