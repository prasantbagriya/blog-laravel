<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class UploadSecurityTest extends TestCase
{
    /**
     * A basic feature test example.
     */
    public function test_valid_image_upload_succeeds(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        
        \Illuminate\Support\Facades\Storage::fake('public');
        $file = \Illuminate\Http\UploadedFile::fake()->image('photo.jpg', 10, 10);

        $response = $this->actingAs($admin)->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'url']);
    }

    public function test_php_file_upload_is_rejected(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        
        $file = \Illuminate\Http\UploadedFile::fake()->create('shell.php', 100, 'application/x-php');

        $response = $this->actingAs($admin)->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_svg_file_upload_is_rejected(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        
        $file = \Illuminate\Http\UploadedFile::fake()->create('vector.svg', 100, 'image/svg+xml');

        $response = $this->actingAs($admin)->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_fake_image_content_is_rejected(): void
    {
        $admin = \App\Models\User::factory()->create(['is_admin' => true]);
        
        // Has jpg extension but text content
        $file = \Illuminate\Http\UploadedFile::fake()->createWithContent('fake.jpg', '<?php system("id"); ?>');

        $response = $this->actingAs($admin)->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(422);
    }

    public function test_normal_user_cannot_upload_anything(): void
    {
        $user = \App\Models\User::factory()->create(['is_admin' => false]);
        
        $file = \Illuminate\Http\UploadedFile::fake()->image('photo.jpg');

        $response = $this->actingAs($user)->postJson('/api/admin/upload', [
            'file' => $file,
        ]);

        $response->assertStatus(403);
    }
}
