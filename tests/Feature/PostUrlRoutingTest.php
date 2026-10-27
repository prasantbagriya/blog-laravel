<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\Page;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostUrlRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_with_blog_url_format_opens_on_blog_url(): void
    {
        $post = Post::factory()->create([
            'title' => 'Sample Blog Article',
            'slug' => 'sample-blog-article',
            'url_format' => 'blog/{slug}',
            'published' => true,
        ]);

        // Opening /blog/sample-blog-article must succeed (200)
        $responseBlog = $this->get('/blog/sample-blog-article');
        $responseBlog->assertStatus(200);

        // Opening /news/sample-blog-article must 301 redirect to canonical /blog/sample-blog-article
        $responseNews = $this->get('/news/sample-blog-article');
        $responseNews->assertRedirect('/blog/sample-blog-article');

        // Opening non-existent post must return 404
        $responseNonExistent = $this->get('/blog/non-existent-slug-123');
        $responseNonExistent->assertStatus(404);
    }

    public function test_post_with_news_url_format_opens_on_news_url(): void
    {
        $post = Post::factory()->create([
            'title' => 'Breaking News Article',
            'slug' => 'breaking-news-article',
            'url_format' => 'news/{slug}',
            'published' => true,
        ]);

        // Opening /news/breaking-news-article must succeed (200)
        $responseNews = $this->get('/news/breaking-news-article');
        $responseNews->assertStatus(200);

        // Opening /blog/breaking-news-article must 301 redirect to canonical /news/breaking-news-article
        $responseBlog = $this->get('/blog/breaking-news-article');
        $responseBlog->assertRedirect('/news/breaking-news-article');
    }

    public function test_direct_slug_and_blog_slug_can_coexist_independently(): void
    {
        // 1. Create a Blog Post with slug 'best-neet-coachings-in-sikar'
        $post = Post::factory()->create([
            'title' => 'Best NEET Coachings in Sikar - Complete Guide',
            'slug' => 'best-neet-coachings-in-sikar',
            'url_format' => 'blog/{slug}',
            'published' => true,
        ]);

        // 2. Create a Custom Landing Page with the SAME slug 'best-neet-coachings-in-sikar'
        $page = Page::create([
            'id' => (string) \Illuminate\Support\Str::uuid(),
            'title' => 'Best NEET Coachings in Sikar Landing Page',
            'slug' => 'best-neet-coachings-in-sikar',
            'type' => 'static',
            'content' => '<p>Direct landing page format content with institute rankings.</p>',
            'seo_title' => 'Best NEET Coachings in Sikar (Direct)',
            'faqs' => [
                ['question' => 'Which is top NEET coaching?', 'answer' => 'PCP Sikar is top ranked.']
            ]
        ]);

        // URL 1: /blog/best-neet-coachings-in-sikar opens the Blog Post format (200 OK)
        $blogResponse = $this->get('/blog/best-neet-coachings-in-sikar');
        $blogResponse->assertStatus(200);
        $blogResponse->assertInertia(fn ($assert) => $assert
            ->component('Blog/Show')
            ->has('post')
        );

        // URL 2: /best-neet-coachings-in-sikar opens the Landing Page format (200 OK)
        $directResponse = $this->get('/best-neet-coachings-in-sikar');
        $directResponse->assertStatus(200);
        $directResponse->assertInertia(fn ($assert) => $assert
            ->component('Static/CustomPage')
            ->has('page')
        );

        // Neither URL redirects to the other! Both exist independently with different formats!
        $this->assertFalse($blogResponse->isRedirect());
        $this->assertFalse($directResponse->isRedirect());
    }

    public function test_direct_post_opens_directly_at_root(): void
    {
        $post = Post::factory()->create([
            'title' => 'Direct Slug Article',
            'slug' => 'direct-article',
            'url_format' => '{slug}',
            'published' => true,
        ]);

        // Direct URL /direct-article must succeed (200)
        $this->get('/direct-article')->assertStatus(200);

        // Accessing prefixed URLs must 301 redirect to canonical direct URL /direct-article
        $this->get('/blog/direct-article')->assertRedirect('/direct-article');
        $this->get('/news/direct-article')->assertRedirect('/direct-article');

        // Non-existent direct URL must 404
        $this->get('/non-existent-direct-slug-456')->assertStatus(404);
    }

    public function test_post_without_url_format_defaults_to_blog_path(): void
    {
        $post = Post::factory()->create([
            'title' => 'Default Blog Post',
            'slug' => 'default-blog-post',
            'url_format' => null,
            'published' => true,
        ]);

        $this->assertEquals('/blog/default-blog-post', $post->url_path);
        $this->get('/blog/default-blog-post')->assertStatus(200);
    }

    public function test_post_controller_stores_direct_url_format(): void
    {
        $admin = \App\Models\User::factory()->create([
            'role' => 'super_admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/posts', [
            'title' => 'Direct Published Institute Post',
            'slug' => 'direct-published-institute-post',
            'url_format' => 'direct',
            'published' => true,
            'content' => '<p>Post content directly published.</p>',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('posts', [
            'slug' => 'direct-published-institute-post',
            'url_format' => '{slug}',
        ]);

        $this->get('/direct-published-institute-post')->assertStatus(200);
    }
}
