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

        // Opening /news/sample-blog-article must return 404
        $responseNews = $this->get('/news/sample-blog-article');
        $responseNews->assertStatus(404);

        // Opening /random/sample-blog-article must return 404
        $responseRandom = $this->get('/random/sample-blog-article');
        $responseRandom->assertStatus(404);
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

        // Opening /blog/breaking-news-article must return 404
        $responseBlog = $this->get('/blog/breaking-news-article');
        $responseBlog->assertStatus(404);

        // Opening /updates/breaking-news-article must return 404
        $responseUpdates = $this->get('/updates/breaking-news-article');
        $responseUpdates->assertStatus(404);
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
        $this->get('/blog/dynamic-article')->assertStatus(404);

        // Change base page to blog
        $post->update(['url_format' => 'blog/{slug}']);
        $post->refresh();

        // Now /blog must be 200 and /news must be 404
        $this->get('/blog/dynamic-article')->assertStatus(200);
        $this->get('/news/dynamic-article')->assertStatus(404);
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

        // Prefixed URLs must return 404
        $this->get('/blog/direct-article')->assertStatus(404);
        $this->get('/news/direct-article')->assertStatus(404);
    }
}
