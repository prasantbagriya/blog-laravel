<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PostUrlRoutingTest extends TestCase
{
    use RefreshDatabase;

    public function test_post_with_blog_url_format_only_opens_on_blog_url(): void
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

    public function test_post_with_news_url_format_only_opens_on_news_url(): void
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

    public function test_changing_base_page_switches_active_url_and_closes_old_url(): void
    {
        $post = Post::factory()->create([
            'title' => 'Dynamic Base Page Article',
            'slug' => 'dynamic-article',
            'url_format' => 'news/{slug}',
            'published' => true,
        ]);

        // Initially on /news
        $this->get('/news/dynamic-article')->assertStatus(200);
        $this->get('/blog/dynamic-article')->assertRedirect('/news/dynamic-article');

        // Change base page to blog
        $post->update(['url_format' => 'blog/{slug}']);
        $post->refresh();

        // Now /blog must be 200 and /news must redirect to /blog
        $this->get('/blog/dynamic-article')->assertStatus(200);
        $this->get('/news/dynamic-article')->assertRedirect('/blog/dynamic-article');
    }

    public function test_direct_slug_format_works_and_blocks_prefixed_urls(): void
    {
        $post = Post::factory()->create([
            'title' => 'Direct Slug Article',
            'slug' => 'direct-article',
            'url_format' => '{slug}',
            'published' => true,
        ]);

        // Direct URL /direct-article must succeed (200)
        $this->get('/direct-article')->assertStatus(200);

        // Prefixed URLs must 301 redirect to canonical direct URL /direct-article
        $this->get('/blog/direct-article')->assertRedirect('/direct-article');
        $this->get('/news/direct-article')->assertRedirect('/direct-article');

        // Non-existent direct URL must 404
        $this->get('/non-existent-direct-slug-456')->assertStatus(404);
    }
}
