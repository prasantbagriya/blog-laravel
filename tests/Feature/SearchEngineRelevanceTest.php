<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Models\Business;
use App\Models\Post;
use App\Models\Category;

class SearchEngineRelevanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_smart_search_finds_relevant_coaching_for_multi_word_query(): void
    {
        // 1. Create Sample Businesses
        Business::create([
            'id' => 'biz-1',
            'name' => 'Matrix Academy',
            'slug' => 'matrix-academy',
            'category' => 'coaching-institutes',
            'category_name' => 'IIT-JEE & NEET Coaching',
            'subcategory' => 'IIT-JEE',
            'description' => 'Premier institute in Sikar for JEE and NEET preparation.',
            'tags' => ['JEE', 'NEET', 'Coaching in Sikar'],
            'rating' => 4.9,
            'review_count' => 500,
            'is_verified' => true,
        ]);

        Business::create([
            'id' => 'biz-2',
            'name' => 'Allen Career Institute',
            'slug' => 'allen-sikar',
            'category' => 'coaching-institutes',
            'category_name' => 'Medical & Engineering',
            'subcategory' => 'NEET',
            'description' => 'Comprehensive classroom coaching for NEET aspirants.',
            'tags' => ['NEET', 'Medical'],
            'rating' => 4.8,
            'review_count' => 400,
            'is_verified' => true,
        ]);

        Business::create([
            'id' => 'biz-3',
            'name' => 'Daffodils World School',
            'slug' => 'daffodils-sikar',
            'category' => 'schools',
            'category_name' => 'CBSE English Medium School',
            'subcategory' => 'CBSE',
            'description' => 'Top CBSE residential school in Sikar.',
            'tags' => ['School', 'CBSE'],
            'rating' => 4.5,
            'review_count' => 100,
            'is_verified' => false,
        ]);

        // Test Query 1: Natural language query "best neet coaching in sikar"
        $response = $this->getJson('/api/search/suggestions?q=best+neet+coaching+in+sikar');
        $response->assertStatus(200);
        $data = $response->json();
        
        $this->assertNotEmpty($data['businesses'], 'Businesses should not be empty for "best neet coaching in sikar"');
        $names = array_column($data['businesses'], 'name');
        $this->assertTrue(in_array('Matrix Academy', $names) || in_array('Allen Career Institute', $names));

        // Test Query 2: Single keyword brand query "matrix"
        $responseMatrix = $this->getJson('/api/search/suggestions?q=matrix');
        $responseMatrix->assertStatus(200);
        $dataMatrix = $responseMatrix->json();
        $this->assertNotEmpty($dataMatrix['businesses']);
        $this->assertEquals('Matrix Academy', $dataMatrix['businesses'][0]['name']);

        // Test Query 3: Generic query "coaching in sikar"
        $responseGeneric = $this->getJson('/api/search/suggestions?q=coaching+in+sikar');
        $responseGeneric->assertStatus(200);
        $dataGeneric = $responseGeneric->json();
        $this->assertNotEmpty($dataGeneric['businesses'], 'Generic search "coaching in sikar" should return top coaching institutes');

        // Test 4: Search Index page
        $searchPage = $this->get('/search?q=neet');
        $searchPage->assertStatus(200);

        // Test 5: Blog relevance
        Post::create([
            'title' => 'Top 10 Best NEET Coaching in Sikar 2026',
            'slug' => 'top-10-neet-coaching-sikar',
            'content' => 'Complete guide comparing Allen, Matrix, CLC and Gurukripa for NEET aspirants.',
            'published' => true,
            'date' => now(),
        ]);

        $blogSuggest = $this->getJson('/api/search/suggestions?q=neet+preparation');
        $blogSuggest->assertStatus(200);
        $blogData = $blogSuggest->json();
        $this->assertNotEmpty($blogData['blogs']);
        $this->assertEquals('Top 10 Best NEET Coaching in Sikar 2026', $blogData['blogs'][0]['title']);
    }
}
