<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Models\User;
use App\Models\XAccount;
use App\Models\XPostShare;
use App\Services\X\XAuthService;
use App\Services\X\XCaptionGeneratorService;
use App\Services\X\XTweetService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class XIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.x.consumer_key', 'test_consumer_key_123');
        Config::set('services.x.consumer_secret', 'test_consumer_secret_456');
        Config::set('services.x.client_id', 'test_client_id_123');
        Config::set('services.x.client_secret', 'test_client_secret_456');
        Config::set('services.x.redirect_uri', 'https://coachingsinsikar.com/auth/x/callback');
    }

    public function test_auth_service_generates_correct_x_pkce_url()
    {
        $service = app(XAuthService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertStringContainsString('https://twitter.com/i/oauth2/authorize', $url);
        $this->assertStringContainsString('client_id=test_client_id_123', $url);
        $this->assertStringContainsString('code_challenge=', $url);
        $this->assertStringContainsString('code_challenge_method=S256', $url);
        $this->assertStringContainsString('tweet.write', $url);
    }

    public function test_caption_generator_strictly_respects_280_chars()
    {
        $post = Post::create([
            'title' => 'JEE Mains 2027 Registration Eligibility and Important Dates for Sikar Aspirants Announced by NTA',
            'slug' => 'jee-mains-2027-registration-eligibility',
            'content' => 'National Testing Agency has officially declared the online registration schedule for JEE Main 2027.',
            'category' => 'Engineering',
            'published' => true,
        ]);

        $service = app(XCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['text']);
        $this->assertLessThanOrEqual(280, mb_strlen($draft['text']));
        $this->assertStringContainsString('utm_source=twitter', $draft['text']);
        $this->assertStringContainsString('#', $draft['text']);
    }

    public function test_tweet_service_creates_tweet_successfully()
    {
        Http::fake([
            'https://api.twitter.com/2/tweets' => Http::response([
                'data' => [
                    'id' => '1899200300400',
                    'text' => 'Hello Sikar from automated tweet!',
                ],
            ], 201),
        ]);

        $account = XAccount::create([
            'x_user_id' => 'x_999888',
            'username' => 'coachingsinsikar',
            'name' => 'Coachings in Sikar',
            'access_token' => 'valid_bearer_token_xyz',
            'is_active' => true,
        ]);

        $tweetService = app(XTweetService::class);
        $result = $tweetService->createTweet(
            $account,
            'Hello Sikar from automated tweet!'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('1899200300400', $result['tweet_id']);
        $this->assertEquals('https://x.com/coachingsinsikar/status/1899200300400', $result['permalink']);
    }

    public function test_admin_x_hub_dashboard_accessible()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/x');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/X/Index'));
    }

    public function test_admin_can_generate_draft_for_post()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $post = Post::create([
            'title' => 'Top NEET Coaching Centers in Piprali Road Sikar 2027',
            'slug' => 'top-neet-coaching-piprali-road-sikar',
            'content' => 'Explore the best medical coaching institutes located in Sikar education hub.',
            'category' => 'Medical',
            'published' => true,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/admin/x/draft/{$post->id}");
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'share_id',
            'draft' => ['title', 'text', 'target_link', 'hashtags'],
        ]);

        $this->assertDatabaseHas('x_post_shares', [
            'post_id' => $post->id,
            'status' => 'pending_approval',
        ]);
    }

    public function test_admin_can_generate_draft_for_unsaved_post()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/admin/x/draft/draft?title=Top+JEE+Coaching+in+Sikar&slug=top-jee-coaching-sikar&category=Engineering");
        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
        ]);
        $response->assertJsonStructure([
            'success',
            'draft' => ['title', 'text', 'target_link'],
        ]);
        $this->assertNotEmpty($response->json('draft.text'));
        $this->assertLessThanOrEqual(280, mb_strlen($response->json('draft.text')));
    }

    public function test_admin_can_approve_and_publish_tweet()
    {
        Http::fake([
            'https://api.twitter.com/2/tweets' => Http::response([
                'data' => [
                    'id' => '190011223344',
                    'text' => 'Approved tweet for Sikar students!',
                ],
            ], 201),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = XAccount::create([
            'x_user_id' => 'x_112233',
            'username' => 'coachingsinsikar',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_token_abc',
            'is_active' => true,
        ]);

        $share = XPostShare::create([
            'x_account_id' => $account->id,
            'text' => 'Approved tweet for Sikar students!',
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/x/approve-publish', [
            'share_id' => $share->id,
            'text' => 'Approved tweet for Sikar students!',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'tweet_id' => '190011223344',
        ]);

        $this->assertDatabaseHas('x_post_shares', [
            'id' => $share->id,
            'status' => 'published',
            'tweet_id' => '190011223344',
        ]);
    }
}
