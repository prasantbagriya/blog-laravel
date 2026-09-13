<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class ModerationSecurityTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_post_remains_visible_after_multiple_reports(): void
    {
        $user1 = \App\Models\User::factory()->create();
        $user2 = \App\Models\User::factory()->create();
        $user3 = \App\Models\User::factory()->create();
        $user4 = \App\Models\User::factory()->create();
        
        $community = \App\Models\Community::factory()->create(['owner_id' => $user1->id]);
        $post = \App\Models\Post::factory()->create([
            'author_id' => $user1->id, 
            'community_id' => $community->id,
            'status' => 'published'
        ]);

        $this->actingAs($user2)->postJson('/reports', ['reportable_id' => $post->id, 'reportable_type' => 'post', 'reason' => 'spam']);
        $this->actingAs($user3)->postJson('/reports', ['reportable_id' => $post->id, 'reportable_type' => 'post', 'reason' => 'spam']);
        $this->actingAs($user4)->postJson('/reports', ['reportable_id' => $post->id, 'reportable_type' => 'post', 'reason' => 'spam']);

        $post->refresh();
        // The post must not be hidden automatically
        $this->assertNotEquals('hidden', $post->status);
    }

    public function test_duplicate_reports_from_same_user_are_blocked(): void
    {
        $user = \App\Models\User::factory()->create();
        $community = \App\Models\Community::factory()->create(['owner_id' => $user->id]);
        $post = \App\Models\Post::factory()->create(['author_id' => $user->id, 'community_id' => $community->id]);

        $response1 = $this->actingAs($user)->postJson('/reports', ['reportable_id' => $post->id, 'reportable_type' => 'post', 'reason' => 'spam']);
        $response1->assertStatus(302); // Redirect back on success
        
        // Second attempt
        $response2 = $this->actingAs($user)->postJson('/reports', ['reportable_id' => $post->id, 'reportable_type' => 'post', 'reason' => 'spam']);
        $response2->assertSessionHas('error', 'You have already reported this item.');
    }

    public function test_comment_xss_is_sanitized(): void
    {
        $user = \App\Models\User::factory()->create();
        $community = \App\Models\Community::factory()->create(['owner_id' => $user->id]);
        $post = \App\Models\Post::factory()->create(['author_id' => $user->id, 'community_id' => $community->id]);

        $this->actingAs($user)->postJson('/posts/' . $post->id . '/comments', [
            'content' => '<script>alert(1)</script>Hello'
        ]);

        $comment = \App\Models\Comment::where('post_id', $post->id)->first();
        // The script tag should be stripped by clean()
        $this->assertStringNotContainsString('<script>', $comment->content);
        $this->assertStringContainsString('Hello', $comment->content);
    }
}
