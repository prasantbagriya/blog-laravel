<?php

namespace Tests\Feature;

use App\Models\PageSpeedAudit;
use App\Models\User;
use App\Services\Google\GooglePageSpeedService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PageSpeedInsightsIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function mockPageSpeedResponse(): array
    {
        return [
            'lighthouseResult' => [
                'lighthouseVersion' => '12.2.0',
                'categories' => [
                    'performance' => ['score' => 0.94],
                    'accessibility' => ['score' => 0.98],
                    'best-practices' => ['score' => 1.0],
                    'seo' => ['score' => 0.96],
                ],
                'audits' => [
                    'first-contentful-paint' => [
                        'numericValue' => 1200,
                        'displayValue' => '1.2 s',
                        'score' => 0.95,
                    ],
                    'largest-contentful-paint' => [
                        'numericValue' => 2100,
                        'displayValue' => '2.1 s',
                        'score' => 0.92,
                    ],
                    'total-blocking-time' => [
                        'numericValue' => 110,
                        'displayValue' => '110 ms',
                        'score' => 0.97,
                    ],
                    'cumulative-layout-shift' => [
                        'numericValue' => 0.02,
                        'displayValue' => '0.02',
                        'score' => 0.99,
                    ],
                    'speed-index' => [
                        'numericValue' => 2400,
                        'displayValue' => '2.4 s',
                        'score' => 0.90,
                    ],
                    'server-response-time' => [
                        'numericValue' => 320,
                        'displayValue' => '320 ms',
                        'score' => 0.95,
                    ],
                    'render-blocking-resources' => [
                        'title' => 'Eliminate render-blocking resources',
                        'description' => 'Resources are blocking the first paint of your page.',
                        'score' => 0.45,
                        'displayValue' => 'Potential savings: 480 ms',
                        'details' => [
                            'overallSavingsMs' => 480,
                            'overallSavingsBytes' => 45000,
                            'items' => [
                                ['url' => 'https://coachingsinsikar.com/css/app.css'],
                            ],
                        ],
                    ],
                    'dom-size' => [
                        'title' => 'Avoid an excessive DOM size',
                        'description' => 'A large DOM will increase memory usage.',
                        'score' => 0.95,
                        'displayValue' => '650 elements',
                    ],
                ],
            ],
            'loadingExperience' => [
                'overall_category' => 'FAST',
                'metrics' => [
                    'LARGEST_CONTENTFUL_PAINT_MS' => [
                        'percentile' => 1950,
                        'category' => 'FAST',
                    ],
                ],
            ],
        ];
    }

    public function test_pagespeed_service_runs_audit_and_persists_data()
    {
        Http::fake([
            'https://www.googleapis.com/pagespeedonline/v5/runPagespeed*' => Http::response($this->mockPageSpeedResponse(), 200),
        ]);

        Config::set('services.google.pagespeed_api_key', 'mock_pagespeed_api_key_123');

        $service = app(GooglePageSpeedService::class);
        $result = $service->runAudit('https://coachingsinsikar.com', 'mobile', true);

        $this->assertEquals(94, $result['scores']['performance']);
        $this->assertEquals(98, $result['scores']['accessibility']);
        $this->assertEquals(100, $result['scores']['best_practices']);
        $this->assertEquals(96, $result['scores']['seo']);

        $this->assertEquals(1.2, $result['core_web_vitals']['fcp']['value']);
        $this->assertEquals('good', $result['core_web_vitals']['fcp']['status']);
        $this->assertEquals(2.1, $result['core_web_vitals']['lcp']['value']);
        $this->assertEquals('good', $result['core_web_vitals']['lcp']['status']);

        $this->assertNotEmpty($result['opportunities']);
        $this->assertEquals('render-blocking-resources', $result['opportunities'][0]['id']);
        $this->assertEquals(480, $result['opportunities'][0]['savings_ms']);

        $this->assertDatabaseHas('pagespeed_audits', [
            'url' => 'https://coachingsinsikar.com',
            'strategy' => 'mobile',
            'performance_score' => 94,
            'field_overall_category' => 'FAST',
        ]);
    }

    public function test_admin_can_run_pagespeed_audit_via_api()
    {
        Http::fake([
            'https://www.googleapis.com/pagespeedonline/v5/runPagespeed*' => Http::response($this->mockPageSpeedResponse(), 200),
        ]);

        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        $response = $this->actingAs($admin)->postJson('/api/admin/pagespeed/audit', [
            'url' => 'https://coachingsinsikar.com/blog/sample-post',
            'strategy' => 'desktop',
            'forceRefresh' => true,
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'success' => true,
            'audit' => [
                'strategy' => 'desktop',
                'scores' => [
                    'performance' => 94,
                    'seo' => 96,
                ],
            ],
        ]);
    }

    public function test_admin_can_retrieve_pagespeed_history()
    {
        $admin = User::factory()->create([
            'role' => 'admin',
            'is_admin' => true,
        ]);

        PageSpeedAudit::create([
            'url' => 'https://coachingsinsikar.com/test-history',
            'strategy' => 'mobile',
            'performance_score' => 88,
            'accessibility_score' => 92,
            'best_practices_score' => 95,
            'seo_score' => 94,
            'fcp_value' => 1.5,
            'lcp_value' => 2.4,
            'field_overall_category' => 'FAST',
        ]);

        $response = $this->actingAs($admin)->getJson('/api/admin/pagespeed/history');

        $response->assertStatus(200);
        $response->assertJson(['success' => true]);
        $this->assertNotEmpty($response->json('history'));
        $this->assertEquals(88, $response->json('history.0.scores.performance'));
    }
}
