<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class RateLimitSecurityTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_post_creation_is_rate_limited(): void
    {
        $user = \App\Models\User::factory()->create();
        $community = \App\Models\Community::factory()->create(['owner_id' => $user->id]);

        for ($i = 0; $i < 10; $i++) {
            $this->actingAs($user)->postJson('/posts', [
                'community_id' => $community->id,
                'title' => 'Test Post ' . $i,
                'type' => 'TEXT',
                'content' => 'Content'
            ]);
        }

        // The 11th request should hit the throttle (10,1)
        $response = $this->actingAs($user)->postJson('/posts', [
            'community_id' => $community->id,
            'title' => 'Test Post 11',
            'type' => 'TEXT',
            'content' => 'Content'
        ]);

        $response->assertStatus(429);
    }

    public function test_reporting_is_rate_limited(): void
    {
        $user = \App\Models\User::factory()->create();
        
        for ($i = 1; $i <= 20; $i++) {
            // Using different fake IDs since duplicate checking would block it first
            $this->actingAs($user)->postJson('/reports', [
                'reportable_id' => $i,
                'reportable_type' => 'post',
                'reason' => 'spam'
            ]);
        }

        // 21st request hits throttle (20,1)
        $response = $this->actingAs($user)->postJson('/reports', [
            'reportable_id' => 999,
            'reportable_type' => 'post',
            'reason' => 'spam'
        ]);

        $response->assertStatus(429);
    }
}
