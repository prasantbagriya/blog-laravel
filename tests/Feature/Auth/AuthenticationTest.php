<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/login');

        $response->assertStatus(200);
    }

    public function test_users_can_authenticate_using_the_login_screen(): void
    {
        $user = User::factory()->create();

        $response = $this->post('/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $this->post('/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post('/logout');

        $this->assertGuest();
        $response->assertRedirect('/');
    }

    public function test_admin_user_can_login_with_email_and_redirects_to_admin(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@coachingsinsikar.com',
            'username' => 'admin',
            'password' => bcrypt('Admin@12345'),
            'role' => 'super_admin',
            'is_admin' => true,
        ]);

        $response = $this->post('/login', [
            'email' => 'admin@coachingsinsikar.com',
            'password' => 'Admin@12345',
        ]);

        $this->assertAuthenticatedAs($admin);
        $response->assertRedirect(route('admin.index', absolute: false));
    }

    public function test_admin_user_can_login_with_username(): void
    {
        $admin = User::factory()->create([
            'email' => 'admin@coachingsinsikar.com',
            'username' => 'admin',
            'password' => bcrypt('Admin@12345'),
            'role' => 'super_admin',
            'is_admin' => true,
        ]);

        $response = $this->post('/login', [
            'email' => 'admin',
            'password' => 'Admin@12345',
        ]);

        $this->assertAuthenticatedAs($admin);
        $response->assertRedirect(route('admin.index', absolute: false));
    }
}
