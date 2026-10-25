<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Post;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class BlogPublicAccessAuditTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_blog_index_loads_successfully(): void
    {
        $response = $this->get('/blog');
        $response->assertStatus(200);
    }

    public function test_public_news_index_loads_successfully(): void
    {
        $response = $this->get('/news');
        $response->assertStatus(200);
    }

    public function test_admin_can_preview_draft_post(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $post = Post::factory()->create([
            'title' => 'Unpublished Draft Post',
            'slug' => 'draft-post-preview',
            'url_format' => 'blog/{slug}',
            'published' => false,
        ]);

        // Guest cannot view draft (404)
        $this->get('/blog/draft-post-preview')->assertStatus(404);

        // Logged-in Admin can view draft (200)
        $this->actingAs($admin)->get('/blog/draft-post-preview')->assertStatus(200);
    }

    public function test_admin_can_preview_draft_news_post(): void
    {
        $admin = User::factory()->create(['is_admin' => true]);
        $post = Post::factory()->create([
            'title' => 'Draft News Post',
            'slug' => 'draft-news-preview',
            'url_format' => 'news/{slug}',
            'published' => false,
        ]);

        // Guest cannot view draft (404)
        $this->get('/news/draft-news-preview')->assertStatus(404);

        // Logged-in Admin can view draft (200)
        $this->actingAs($admin)->get('/news/draft-news-preview')->assertStatus(200);
    }
}
