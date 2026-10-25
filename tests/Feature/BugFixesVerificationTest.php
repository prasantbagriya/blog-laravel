<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Comment;
use App\Models\Community;
use App\Models\Post;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BugFixesVerificationTest extends TestCase
{
    use RefreshDatabase;

    public function test_community_creator_is_automatically_member_and_moderator(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('community.store'), [
            'name' => 'tech_sikar',
            'display_name' => 'Tech Sikar',
            'description' => 'Technology hub in Sikar',
        ]);

        $response->assertRedirect(route('community.show', 'tech_sikar'));

        $community = Community::where('name', 'tech_sikar')->first();
        $this->assertNotNull($community);
        $this->assertTrue($community->members()->where('user_id', $user->id)->exists());
        $this->assertTrue($community->moderators()->where('user_id', $user->id)->exists());
    }

    public function test_search_does_not_leak_user_email(): void
    {
        User::factory()->create([
            'username' => 'secret_user',
            'email' => 'superprivate@example.com',
            'name' => 'Secret User',
        ]);

        $response = $this->get('/search?q=secret_user');
        $response->assertStatus(200);

        // Inertia response should not contain the email
        $response->assertInertia(fn ($page) =>
            $page->component('Search/Index')
                ->has('users.0', fn ($user) =>
                    $user->where('username', 'secret_user')
                        ->where('name', 'Secret User')
                        ->missing('email')
                        ->etc()
                )
        );
    }

    public function test_cannot_reply_with_parent_comment_from_another_post(): void
    {
        $user = User::factory()->create();
        $community = Community::create([
            'name' => 'general_test',
            'owner_id' => $user->id,
        ]);

        $post1 = Post::create([
            'community_id' => $community->id,
            'author_id' => $user->id,
            'title' => 'Post One',
            'type' => 'TEXT',
            'content' => 'Content 1',
        ]);

        $post2 = Post::create([
            'community_id' => $community->id,
            'author_id' => $user->id,
            'title' => 'Post Two',
            'type' => 'TEXT',
            'content' => 'Content 2',
        ]);

        $commentOnPost1 = Comment::create([
            'post_id' => $post1->id,
            'author_id' => $user->id,
            'content' => 'Original Comment on Post 1',
        ]);

        // Attempt to reply on Post 2 referencing comment from Post 1
        $response = $this->actingAs($user)->post(route('post.comment.store', $post2->id), [
            'content' => 'Sneaky reply',
            'parent_id' => $commentOnPost1->id,
        ]);

        $response->assertSessionHasErrors(['parent_id']);
        $this->assertDatabaseMissing('comments', [
            'post_id' => $post2->id,
            'content' => 'Sneaky reply',
        ]);
    }

    public function test_review_vote_deduplication(): void
    {
        $user = User::factory()->create();

        $business = Business::create([
            'id' => 'b-test-101',
            'name' => 'Apex Academy',
            'slug' => 'apex-academy',
            'rating' => 4.5,
        ]);

        $review = Review::create([
            'id' => 'rev-test-101',
            'business_id' => $business->id,
            'reviewer_name' => 'Student A',
            'rating' => 5,
            'helpful_count' => 0,
        ]);

        // First vote succeeds
        $response1 = $this->actingAs($user)->postJson("/api/reviews/{$review->id}/vote", [
            'direction' => 'up',
        ]);
        $response1->assertStatus(200);
        $this->assertEquals(1, $review->fresh()->helpful_count);

        // Immediate duplicate vote is rejected
        $response2 = $this->actingAs($user)->postJson("/api/reviews/{$review->id}/vote", [
            'direction' => 'up',
        ]);
        $response2->assertStatus(422);
        $this->assertEquals(1, $review->fresh()->helpful_count);
    }

    public function test_businesses_sitemap_renders_valid_xml(): void
    {
        Business::create([
            'id' => 'b-sitemap-biz',
            'name' => 'Matrix Institute',
            'slug' => 'matrix-institute',
            'category' => 'coaching-institutes',
        ]);

        $response = $this->get('/sitemap/businesses.xml');
        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'text/xml; charset=UTF-8');
        $this->assertStringContainsString('matrix-institute', $response->getContent());
    }
}
