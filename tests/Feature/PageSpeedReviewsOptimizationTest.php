<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Business;
use Inertia\Testing\AssertableInertia as Assert;

class PageSpeedReviewsOptimizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_reviews_index_passes_initial_businesses_and_seo_meta(): void
    {
        Business::create([
            'id' => 'b-test-1',
            'name' => 'Apex Coaching Institute',
            'slug' => 'apex-coaching-institute',
            'category' => 'coaching-institutes',
            'category_name' => 'Coaching & Institutes',
            'rating' => 4.9,
            'trust_score' => 95,
            'review_count' => 120,
            'is_verified' => true,
        ]);

        $response = $this->get('/business');
        $response->assertStatus(200);

        // Verify Inertia props
        $response->assertInertia(fn (Assert $page) => $page
            ->component('Reviews/Index')
            ->where('initialView', 'home')
            ->has('initialBusinesses', 1)
            ->where('initialBusinesses.0.name', 'Apex Coaching Institute')
            ->has('meta')
            ->where('meta.preload_image', '/uploads/background.webp')
        );

        // Verify critical head preloads and zero-CLS SSR placeholder in HTML
        $html = $response->getContent();
        $this->assertStringContainsString('rel="preload" as="image" href="/uploads/background.webp"', $html);
        $this->assertStringContainsString('lite-reviews-container', $html);
        $this->assertStringContainsString('Trust What You Buy.', $html);
    }

    public function test_reviews_category_passes_initial_businesses(): void
    {
        Business::create([
            'id' => 'b-test-2',
            'name' => 'Matrix Sikar',
            'slug' => 'matrix-sikar',
            'category' => 'coaching-institutes',
            'category_name' => 'Coaching & Institutes',
            'rating' => 4.8,
            'trust_score' => 92,
            'review_count' => 85,
            'is_verified' => true,
        ]);

        $response = $this->get('/business/coaching-institutes');
        $response->assertStatus(200);

        $response->assertInertia(fn (Assert $page) => $page
            ->component('Reviews/Index')
            ->where('initialView', 'directory')
            ->where('initialCategorySlug', 'coaching-institutes')
            ->has('initialBusinesses', 1)
            ->has('meta')
        );
    }
}
