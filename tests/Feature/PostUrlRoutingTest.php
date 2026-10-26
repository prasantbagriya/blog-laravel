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

        // Non-existent direct URL must 404
        $this->get('/non-existent-direct-slug-456')->assertStatus(404);
    }
}
