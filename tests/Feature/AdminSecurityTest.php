<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminSecurityTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_guest_cannot_access_admin_dashboard(): void
    {
        $response = $this->get('/admin');
        $response->assertStatus(302); // Redirect to login
    }

    public function test_normal_user_cannot_access_admin_dashboard(): void
    {
        $user = \App\Models\User::factory()->create(['is_admin' => false]);
        $response = $this->actingAs($user)->get('/admin');
        $response->assertStatus(403);
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        $response = $this->actingAs($admin)->get('/admin');
        $response->assertStatus(200);
    }

    public function test_normal_user_cannot_create_post(): void
    {
        $user = \App\Models\User::factory()->create(['is_admin' => false]);
        $response = $this->actingAs($user)->postJson('/api/admin/posts', [
            'title' => 'Hacked Post'
        ]);
        $response->assertStatus(403);
    }

    public function test_admin_can_create_post(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        $response = $this->actingAs($admin)->postJson('/api/admin/posts', [
            'title' => 'Admin Post'
        ]);
        $response->assertStatus(200);
    }
}
