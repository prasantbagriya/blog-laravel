<?php

namespace Tests\Feature;

// use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_the_application_returns_a_successful_response(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_ads_txt_is_accessible(): void
    {
        $response = $this->get('/ads.txt');

        $response->assertStatus(200);
        $response->assertSee('pub-1798439945710344');
        $this->assertStringContainsString('text/plain', (string) $response->headers->get('Content-Type'));
    }

    public function test_homepage_contains_adsense_script(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSee('ca-pub-1798439945710344');
    }
}
