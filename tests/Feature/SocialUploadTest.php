<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class SocialUploadTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_upload_social_post_image()
    {
        Storage::fake('uploads');

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $file = UploadedFile::fake()->image('sikar_announcement.jpg', 800, 600);

        $response = $this->actingAs($admin)->post('/api/admin/social/upload-image', [
            'file' => $file,
        ]);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'url',
            'full_url',
            'filename',
        ]);

        $json = $response->json();
        $this->assertTrue($json['success']);
        $this->assertStringContainsString('/uploads/social/', $json['url']);
        $this->assertStringEndsWith('.webp', $json['filename']);
    }

    public function test_unauthenticated_user_cannot_upload_social_image()
    {
        $file = UploadedFile::fake()->image('test.jpg');

        $response = $this->postJson('/api/admin/social/upload-image', [
            'file' => $file,
        ]);

        $response->assertStatus(401);
    }
}
