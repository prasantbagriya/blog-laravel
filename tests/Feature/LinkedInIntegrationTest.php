<?php

namespace Tests\Feature;

use App\Models\LinkedInAccount;
use App\Models\LinkedInPostShare;
use App\Models\Post;
use App\Models\User;
use App\Services\LinkedIn\LinkedInAuthService;
use App\Services\LinkedIn\LinkedInCaptionGeneratorService;
use App\Services\LinkedIn\LinkedInPublishService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class LinkedInIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        Config::set('services.linkedin.client_id', 'test_linkedin_client_123');
        Config::set('services.linkedin.client_secret', 'test_linkedin_secret_456');
        Config::set('services.linkedin.redirect_uri', 'https://coachingsinsikar.com/auth/linkedin/callback');
    }

    public function test_auth_service_generates_correct_linkedin_oauth_url()
    {
        $service = app(LinkedInAuthService::class);
        $url = $service->getAuthorizationUrl();

        $this->assertStringContainsString('https://www.linkedin.com/oauth/v2/authorization', $url);
        $this->assertStringContainsString('client_id=test_linkedin_client_123', $url);
        $this->assertStringContainsString('response_type=code', $url);
        $this->assertStringContainsString('openid', $url);
        $this->assertStringContainsString('profile', $url);
        $this->assertStringContainsString('w_member_social', $url);
    }

    public function test_caption_generator_creates_professional_linkedin_copy()
    {
        $post = Post::create([
            'title' => 'Comparative Analysis of IIT JEE Coaching Institutes in Piprali Road Sikar 2027',
            'slug' => 'comparative-analysis-iit-jee-coaching-piprali-road-sikar',
            'content' => 'Comprehensive evaluation of faculty pedigree, test series rigor, batch sizes and historical selection rates for engineering aspirants.',
            'category' => 'Engineering',
            'published' => true,
        ]);

        $service = app(LinkedInCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['commentary']);
        $this->assertLessThanOrEqual(3000, mb_strlen($draft['commentary']));
        $this->assertStringContainsString('Key Takeaways for Students & Parents', $draft['commentary']);
        $this->assertStringContainsString('#Education', $draft['commentary']);
        $this->assertStringContainsString('#CareerGuidance', $draft['commentary']);
        $this->assertNotEmpty($draft['hashtags']);
    }

    public function test_publish_service_publishes_ugc_post_successfully()
    {
        Http::fake([
            'https://api.linkedin.com/v2/ugcPosts' => Http::response([
                'id' => 'urn:li:share:7122334455667788',
            ], 201),
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:abc123xyz',
            'name' => 'Coachings in Sikar',
            'email' => 'admin@coachingsinsikar.com',
            'access_token' => 'valid_bearer_token_linkedin',
            'is_active' => true,
        ]);

        $publishService = app(LinkedInPublishService::class);
        $result = $publishService->publishPost(
            $account,
            'Authoritative educational insights for Sikar aspirants.',
            null,
            'https://coachingsinsikar.com/blog/sample',
            'Comparative Analysis'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('urn:li:share:7122334455667788', $result['share_urn']);
        $this->assertEquals('https://www.linkedin.com/feed/update/urn:li:share:7122334455667788/', $result['permalink']);
    }

    public function test_admin_linkedin_hub_accessible()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->get('/admin/linkedin');
        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/LinkedIn/Index'));
    }

    public function test_admin_can_generate_linkedin_draft_for_post()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $post = Post::create([
            'title' => 'Top Medical Colleges and Coaching Centers in Sikar 2027',
            'slug' => 'top-medical-colleges-coaching-centers-sikar',
            'content' => 'Reviewing the best medical faculties and admission deadlines in Sikar education district.',
            'category' => 'Medical',
            'published' => true,
        ]);

        $response = $this->actingAs($admin)->getJson("/api/admin/linkedin/draft/{$post->id}");
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'draft' => ['commentary', 'image_url', 'target_link', 'hashtags'],
        ]);
    }

    public function test_admin_can_approve_and_publish_linkedin_post()
    {
        Http::fake([
            'https://api.linkedin.com/v2/ugcPosts' => Http::response([
                'id' => 'urn:li:share:98877665544',
            ], 201),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:user9988',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_token_linkedin_abc',
            'is_active' => true,
        ]);

        $share = LinkedInPostShare::create([
            'linkedin_account_id' => $account->id,
            'commentary' => 'Approved LinkedIn post for students & parents!',
            'status' => 'pending_approval',
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/linkedin/approve-publish', [
            'share_id' => $share->id,
            'commentary' => 'Approved LinkedIn post for students & parents!',
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'share_urn' => 'urn:li:share:98877665544',
            'permalink' => 'https://www.linkedin.com/feed/update/urn:li:share:98877665544/',
        ]);

        $this->assertDatabaseHas('linkedin_post_shares', [
            'id' => $share->id,
            'status' => 'published',
            'share_urn' => 'urn:li:share:98877665544',
        ]);
    }

    public function test_admin_can_save_page_settings()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:user112233',
            'name' => 'Admin User',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/linkedin/page-settings', [
            'organization_id' => '12345678',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('linkedin_accounts', [
            'id' => $account->id,
            'organization_id' => 'urn:li:organization:12345678',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
        ]);
    }

    public function test_publish_service_publishes_as_organization_page()
    {
        Http::fake([
            'https://api.linkedin.com/v2/ugcPosts' => function ($request) {
                $body = $request->data();
                if ($body['author'] === 'urn:li:organization:99887766') {
                    return Http::response([
                        'id' => 'urn:li:share:org_post_112233',
                    ], 201);
                }
                return Http::response(['message' => 'Unexpected author URN'], 400);
            },
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:person123',
            'organization_id' => 'urn:li:organization:99887766',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
            'name' => 'Coachings in Sikar',
            'access_token' => 'mock_token_org',
            'is_active' => true,
        ]);

        $this->assertEquals('urn:li:organization:99887766', $account->effective_author_urn);
        $this->assertEquals('Coachings in Sikar', $account->effective_name);

        $publishService = app(LinkedInPublishService::class);
        $result = $publishService->publishPost(
            $account,
            'Authoritative educational insights from Coachings in Sikar Organization Page.',
            null,
            'https://coachingsinsikar.com/blog/jee-analysis',
            'JEE Analysis 2027'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('urn:li:share:org_post_112233', $result['share_urn']);
        $this->assertEquals('https://www.linkedin.com/feed/update/urn:li:share:org_post_112233/', $result['permalink']);
    }

    public function test_save_page_settings_auto_extracts_numeric_id_from_full_linkedin_url()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:user998877',
            'name' => 'Admin User',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/linkedin/page-settings', [
            'organization_id' => 'https://www.linkedin.com/company/88776655/admin/',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('linkedin_accounts', [
            'id' => $account->id,
            'organization_id' => 'urn:li:organization:88776655',
            'organization_name' => 'Coachings in Sikar',
        ]);
    }

    public function test_admin_can_auto_fetch_managed_pages_via_api()
    {
        Http::fake([
            'https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee' => Http::response([
                'elements' => [
                    [
                        'role' => 'ADMINISTRATOR',
                        'organizationalTarget' => 'urn:li:organization:55443322',
                    ],
                ],
            ], 200),
            'https://api.linkedin.com/v2/organizations/55443322' => Http::response([
                'id' => 55443322,
                'localizedName' => 'Coachings in Sikar Official',
                'vanityName' => 'coachings-in-sikar',
            ], 200),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:admin55',
            'name' => 'Admin Sikar',
            'access_token' => 'mock_token_sync_pages',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/linkedin/fetch-pages');

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'selected' => [
                'urn' => 'urn:li:organization:55443322',
                'name' => 'Coachings in Sikar Official',
            ],
        ]);

        $this->assertDatabaseHas('linkedin_accounts', [
            'id' => $account->id,
            'organization_id' => 'urn:li:organization:55443322',
            'organization_name' => 'Coachings in Sikar Official',
            'post_as' => 'organization',
        ]);
    }

    public function test_creating_post_auto_generates_linkedin_and_pinterest_drafts()
    {
        $post = Post::create([
            'title' => 'Top NEET Coaching Institutes in Piprali Road Sikar 2027',
            'slug' => 'top-neet-coaching-piprali-road-sikar-2027',
            'content' => 'Complete ranking and analysis of medical faculties, test series and success rates.',
            'coverImage' => 'https://coachingsinsikar.com/uploads/neet-2027.webp',
            'category' => 'Medical',
            'published' => true,
        ]);

        $this->assertDatabaseHas('linkedin_post_shares', [
            'post_id' => $post->id,
            'status' => 'pending_approval',
            'media_url' => 'https://coachingsinsikar.com/uploads/neet-2027.webp',
        ]);

        $this->assertDatabaseHas('pinterest_pin_shares', [
            'post_id' => $post->id,
            'status' => 'pending_approval',
            'image_url' => 'https://coachingsinsikar.com/uploads/neet-2027.webp',
        ]);

        $liShare = \App\Models\LinkedInPostShare::where('post_id', $post->id)->first();
        $this->assertNotNull($liShare);
        $this->assertStringContainsString('Top NEET Coaching Institutes in Piprali Road Sikar 2027', $liShare->commentary);

        $pinShare = \App\Models\PinterestPinShare::where('post_id', $post->id)->first();
        $this->assertNotNull($pinShare);
        $this->assertEquals('Top NEET Coaching Institutes in Piprali Road Sikar 2027', $pinShare->title);
    }

    public function test_admin_can_save_page_settings_successfully()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:admin_save_page',
            'name' => 'Admin Test',
            'is_active' => true,
        ]);

        $response = $this->actingAs($admin)->post('/admin/linkedin/page-settings', [
            'organization_id' => '144851335',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('linkedin_accounts', [
            'id' => $account->id,
            'organization_id' => 'urn:li:organization:144851335',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
        ]);
    }

    public function test_publish_post_falls_back_to_person_if_organization_author_rejected()
    {
        Http::fake([
            'https://api.linkedin.com/v2/ugcPosts' => function ($request) {
                $body = $request->data();
                if ($body['author'] === 'urn:li:organization:invalid_org_123') {
                    return Http::response([
                        'message' => 'Field Value validation failed in REQUEST_BODY: Data Processing Exception while processing fields [/author]'
                    ], 400);
                }
                if ($body['author'] === 'urn:li:person:fallback_member_456') {
                    return Http::response([
                        'id' => 'urn:li:share:fallback_success_789',
                    ], 201);
                }
                return Http::response(['message' => 'Unexpected author URN'], 400);
            },
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:fallback_member_456',
            'organization_id' => 'urn:li:organization:invalid_org_123',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
            'name' => 'Test Member',
            'access_token' => 'mock_token_fallback',
            'is_active' => true,
        ]);

        $publishService = app(LinkedInPublishService::class);
        $result = $publishService->publishPost(
            $account,
            'Educational insights with automatic member fallback.',
            null,
            'https://coachingsinsikar.com/blog/sample',
            'Test Fallback'
        );

        $this->assertTrue($result['success']);
        $this->assertEquals('urn:li:share:fallback_success_789', $result['share_urn']);
        $this->assertEquals('person_fallback', $result['published_as']);
    }

    public function test_publish_post_reregisters_image_asset_when_falling_back_to_person()
    {
        $uploadedAssets = [];
        Http::fake([
            'https://api.linkedin.com/v2/assets?action=registerUpload' => function ($request) use (&$uploadedAssets) {
                $owner = $request->data()['registerUploadRequest']['owner'];
                $uploadedAssets[] = $owner;
                return Http::response([
                    'value' => [
                        'asset' => "urn:li:digitalmediaAsset:asset_for_" . md5($owner),
                        'uploadMechanism' => [
                            'com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest' => [
                                'uploadUrl' => 'https://linkedin.upload.mock/s3',
                            ],
                        ],
                    ],
                ], 200);
            },
            'https://linkedin.upload.mock/s3' => Http::response('', 201),
            'https://api.linkedin.com/v2/ugcPosts' => function ($request) {
                $body = $request->data();
                $author = $body['author'];
                $media = $body['specificContent']['com.linkedin.ugc.ShareContent']['media'][0]['media'] ?? null;
                
                if ($author === 'urn:li:organization:rejected_org_888') {
                    return Http::response([
                        'message' => 'Field Value validation failed in REQUEST_BODY: Data Processing Exception while processing fields [/author]'
                    ], 400);
                }
                
                if ($author === 'urn:li:person:good_person_999') {
                    $expectedAsset = "urn:li:digitalmediaAsset:asset_for_" . md5('urn:li:person:good_person_999');
                    if ($media !== $expectedAsset) {
                        return Http::response([
                            'message' => 'One or more of the contents is not owned by the author. All contents must be owned by the author'
                        ], 400);
                    }
                    return Http::response([
                        'id' => 'urn:li:share:clean_image_share_111',
                    ], 201);
                }
                return Http::response(['message' => 'Unexpected author URN'], 400);
            },
        ]);

        $account = LinkedInAccount::create([
            'linkedin_person_id' => 'urn:li:person:good_person_999',
            'organization_id' => 'urn:li:organization:rejected_org_888',
            'organization_name' => 'Coachings in Sikar',
            'post_as' => 'organization',
            'name' => 'Good Member',
            'access_token' => 'mock_token_img_fallback',
            'is_active' => true,
        ]);

        $testImagePath = public_path('test_image_fallback.webp');
        file_put_contents($testImagePath, 'fake_image_bytes');

        try {
            $publishService = app(LinkedInPublishService::class);
            $result = $publishService->publishPost(
                $account,
                'Educational image insights with strict ownership match.',
                url('test_image_fallback.webp'),
                'https://coachingsinsikar.com/blog/sample',
                'Test Image Fallback'
            );

            $this->assertTrue($result['success']);
            $this->assertEquals('urn:li:share:clean_image_share_111', $result['share_urn']);
            $this->assertEquals('person_fallback', $result['published_as']);
        } finally {
            if (file_exists($testImagePath)) {
                unlink($testImagePath);
            }
        }
    }
}
