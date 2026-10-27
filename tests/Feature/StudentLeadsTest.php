<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\InstituteInquiry;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class StudentLeadsTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_can_submit_student_lead(): void
    {
        $response = $this->postJson('/api/inquiries', [
            'student_name'  => 'Rahul Sharma',
            'phone'         => '9876543210',
            'business_id'   => '12345678-1234-1234-1234-123456789abc',
            'business_name' => 'Allen Institute',
            'course'        => 'NEET Dropper',
            'message'       => 'Want to know admission fees',
        ]);

        $response->assertStatus(201);
        $response->assertJson(['success' => true]);

        $this->assertDatabaseHas('institute_inquiries', [
            'student_name' => 'Rahul Sharma',
            'phone'        => '9876543210',
            'course'       => 'NEET Dropper',
        ]);
    }

    public function test_admin_can_access_inquiries_page(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'role'     => 'admin',
        ]);

        $response = $this->actingAs($admin)->get('/admin/inquiries');
        $response->assertStatus(200);
    }

    public function test_admin_can_fetch_inquiries_api(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'role'     => 'admin',
        ]);

        InstituteInquiry::create([
            'student_name'  => 'Priya Verma',
            'phone'         => '9123456780',
            'business_name' => 'Gurukripa',
            'course'        => 'JEE Main',
            'status'        => 'new',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/inquiries');
        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $response->assertJsonFragment(['student_name' => 'Priya Verma']);
    }

    public function test_admin_can_update_inquiry_status(): void
    {
        $admin = User::factory()->create([
            'is_admin' => true,
            'role'     => 'admin',
        ]);

        $inquiry = InstituteInquiry::create([
            'student_name'  => 'Amit Kumar',
            'phone'         => '9988776655',
            'status'        => 'new',
        ]);

        $response = $this->actingAs($admin)->patchJson("/api/admin/inquiries/{$inquiry->id}/status", [
            'status' => 'contacted',
        ]);

        $response->assertStatus(200);
        $this->assertEquals('contacted', $inquiry->fresh()->status);
    }
}
