<?php

namespace Tests\Feature;

use App\Models\Author;
use App\Models\Business;
use App\Models\Category;
use App\Models\Community;
use App\Models\Post;
use App\Models\Story;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ComprehensiveSystemAuditTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $normalUser;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create([
            'is_admin' => true,
            'role' => 'admin',
        ]);

        $this->normalUser = User::factory()->create([
            'is_admin' => false,
            'role' => 'visitor',
        ]);
    }

    public function test_all_public_landing_pages_render_successfully(): void
    {
        $publicUrls = [
            '/',
            '/news',
            '/blog',
            '/feed',
            '/stories',
            '/business',
            '/about',
            '/contact',
            '/privacy',
            '/terms',
            '/editorial-policy',
            '/fact-checking-policy',
        ];

        foreach ($publicUrls as $url) {
            $response = $this->get($url);
            $this->assertContains($response->getStatusCode(), [200, 301, 302], "Failed asserting that $url responds with 200/redirect");
        }
    }

    public function test_all_sitemaps_generate_valid_xml(): void
    {
        $sitemaps = [
            '/sitemap.xml',
            '/sitemap/pages.xml',
            '/sitemap/posts.xml',
            '/sitemap/community-posts.xml',
            '/sitemap/categories.xml',
            '/sitemap/communities.xml',
            '/sitemap/authors.xml',
            '/sitemap/stories.xml',
            '/sitemap/businesses.xml',
            '/news-sitemap.xml',
        ];

        foreach ($sitemaps as $url) {
            $response = $this->get($url);
            $response->assertStatus(200);
            $this->assertStringContainsString('xml', (string) $response->headers->get('content-type'));
        }
    }

    public function test_security_guards_on_admin_routes(): void
    {
        // 1. Guest redirected
        $this->get('/admin')->assertStatus(302);
        $this->get('/admin/facebook')->assertStatus(302);
        $this->get('/admin/x')->assertStatus(302);

        // 2. Normal user denied
        $this->actingAs($this->normalUser)->get('/admin')->assertStatus(403);
        $this->actingAs($this->normalUser)->get('/admin/facebook')->assertStatus(403);
        $this->actingAs($this->normalUser)->get('/admin/x')->assertStatus(403);
    }

    public function test_admin_can_access_all_management_hubs(): void
    {
        $adminHubs = [
            '/admin',
            '/admin/posts/new',
            '/admin/categories',
            '/admin/authors',
            '/admin/slider',
            '/admin/stories',
            '/admin/pages',
            '/admin/media',
            '/admin/navigation',
            '/admin/contact-messages',
            '/admin/newsletters',
            '/admin/facebook',
            '/admin/x',
            '/admin/instagram',
            '/admin/pinterest',
            '/admin/linkedin',
            '/admin/google-search',
            '/admin/pagespeed',
        ];

        foreach ($adminHubs as $hub) {
            $response = $this->actingAs($this->admin)->get($hub);
            $response->assertStatus(200);
        }
    }

    public function test_post_creation_and_social_autodraft_lifecycle(): void
    {
        $postData = [
            'title' => 'Top Engineering Coaching in Sikar 2027 Guide',
            'slug' => 'top-engineering-coaching-sikar-2027-guide',
            'content' => '<p>Comprehensive review of leading JEE institutions in Sikar.</p>',
            'category' => 'Engineering',
            'published' => true,
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/admin/posts', $postData);
        $response->assertStatus(200);

        $post = Post::where('slug', 'top-engineering-coaching-sikar-2027-guide')->first();
        $this->assertNotNull($post);
        $this->assertEquals('published', $post->status);

        // Verify public access
        $publicRes = $this->get('/blog/top-engineering-coaching-sikar-2027-guide');
        $publicRes->assertStatus(200);

        // Verify social drafts were generated without NOT NULL errors
        $this->assertDatabaseHas('x_post_shares', ['post_id' => $post->id]);
        $this->assertDatabaseHas('linkedin_post_shares', ['post_id' => $post->id]);
        $this->assertDatabaseHas('pinterest_pin_shares', ['post_id' => $post->id]);
        $this->assertDatabaseHas('instagram_post_shares', ['post_id' => $post->id]);
    }

    public function test_community_engagement_flow(): void
    {
        $community = Community::create([
            'name' => 'jee_aspirants',
            'display_name' => 'JEE Aspirants Sikar',
            'owner_id' => $this->normalUser->id,
        ]);

        // Create Community Post
        $postResponse = $this->actingAs($this->normalUser)->post(route('post.store'), [
            'community_id' => $community->id,
            'title' => 'Best study routine for JEE 2027?',
            'type' => 'TEXT',
            'content' => 'What daily study schedule worked best for you in Sikar?',
        ]);
        $postResponse->assertRedirect();

        $communityPost = Post::where('title', 'Best study routine for JEE 2027?')->first();
        $this->assertNotNull($communityPost);

        // Add Comment
        $commentResponse = $this->actingAs($this->normalUser)->post(route('post.comment.store', $communityPost->id), [
            'content' => 'Focus on physics concepts and regular mock tests.',
        ]);
        $commentResponse->assertRedirect();
        $this->assertDatabaseHas('comments', [
            'post_id' => $communityPost->id,
            'content' => 'Focus on physics concepts and regular mock tests.',
        ]);

        // Author starts with score 1
        $this->assertEquals(1, $communityPost->score);

        // A second user upvotes the post -> score becomes 2
        $voter = User::factory()->create();
        $voteResponse = $this->actingAs($voter)->postJson(route('vote'), [
            'votable_id' => $communityPost->id,
            'votable_type' => 'post',
            'value' => 1,
        ]);
        $voteResponse->assertStatus(200);
        $this->assertEquals(2, $communityPost->fresh()->score);

        // Author toggling vote (unvote) -> score decrements to 1
        $unvoteResponse = $this->actingAs($this->normalUser)->postJson(route('vote'), [
            'votable_id' => $communityPost->id,
            'votable_type' => 'post',
            'value' => 1,
        ]);
        $unvoteResponse->assertStatus(200);
        $this->assertEquals(1, $communityPost->fresh()->score);
    }
}
