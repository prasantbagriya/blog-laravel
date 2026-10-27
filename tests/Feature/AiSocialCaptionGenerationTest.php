<?php

namespace Tests\Feature;

use App\Models\Post;
use App\Services\Facebook\FacebookCaptionGeneratorService;
use App\Services\Instagram\InstagramCaptionGeneratorService;
use App\Services\LinkedIn\LinkedInCaptionGeneratorService;
use App\Services\Pinterest\PinterestCaptionGeneratorService;
use App\Services\Social\AiSocialCaptionService;
use App\Services\X\XCaptionGeneratorService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class AiSocialCaptionGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        \Illuminate\Support\Facades\Config::set('services.gemini.enable_test_mock', true);
    }

    protected function createSamplePost(): Post
    {
        return Post::factory()->create([
            'title' => 'Top 5 NEET Coachings in Sikar for 2026',
            'slug' => 'top-5-neet-coachings-in-sikar-2026',
            'category' => 'NEET',
            'excerpt' => 'A detailed comparison of top NEET coaching institutes in Sikar including Gurukripa, PCP, and CLC.',
            'content' => '<p>Sikar has emerged as a premier coaching hub for NEET and JEE. In this guide, we analyze faculty experience, fee structure, batch sizes, test series, and hostel facilities across Gurukripa, PCP Sikar, and CLC. Gurukripa offers strong biology faculty, while PCP provides disciplined campus culture.</p>',
            'url_format' => 'blog/{slug}',
            'coverImage' => '/uploads/neet-sample.webp',
            'published' => true,
        ]);
    }

    public function test_ai_social_caption_service_generates_facebook_caption_from_blog_content(): void
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'caption' => "🎯 Planning for NEET 2026 from Sikar?\n\nHere are 3 key takeaways from our comprehensive analysis:\n• Gurukripa leads in Biology faculty consistency\n• PCP Sikar offers disciplined hostel and mock test infrastructure\n• Fee structures range between 1.1L to 1.45L per year\n\nWhich coaching are you planning to join? Drop your questions below! 👇",
                                        'hashtags' => ['#NEET2026', '#SikarCoaching', '#NEETAspirants']
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $post = $this->createSamplePost();
        $service = app(FacebookCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['caption']);
        $this->assertStringContainsString('Planning for NEET 2026 from Sikar', $draft['caption']);
        $this->assertStringContainsString('Gurukripa leads in Biology', $draft['caption']);
        $this->assertStringContainsString('/blog/top-5-neet-coachings-in-sikar-2026', $draft['target_link']);
        $this->assertTrue($draft['is_ai_generated'] ?? false);
    }

    public function test_ai_social_caption_service_generates_instagram_caption_from_blog_content(): void
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'caption' => "🔥 Top 5 NEET Coachings in Sikar Ranked (2026 Guide)!\n\nStruggling to pick the right coaching? Here is what you need to know:\n📍 Gurukripa: Known for intensive test drills\n📍 PCP Sikar: Top-notch residential campus & doubts counter\n📍 CLC Sikar: Renowned for motivational support\n\n📌 Save this post before visiting Piprali Road!\n👉 Tap the link in bio for the full review.",
                                        'hashtags' => ['#CoachingsInSikar', '#NEET2026', '#PipraliRoad', '#SikarEducation']
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $post = $this->createSamplePost();
        $service = app(InstagramCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['caption']);
        $this->assertStringContainsString('Top 5 NEET Coachings in Sikar Ranked', $draft['caption']);
        $this->assertStringContainsString('Piprali Road', $draft['caption']);
        $this->assertTrue($draft['is_ai_generated'] ?? false);
    }

    public function test_ai_social_caption_service_generates_pinterest_pin_from_blog_content(): void
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'title' => 'Top 5 NEET Coaching Institutes in Sikar (2026 Comparison)',
                                        'description' => 'Compare fees, top faculty, selection ratio, and hostel amenities for Gurukripa, PCP, and CLC in Sikar. Make an informed choice for NEET 2026.',
                                        'hashtags' => ['#NEETPreparation', '#SikarCoaching', '#StudyTips']
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $post = $this->createSamplePost();
        $service = app(PinterestCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertEquals('Top 5 NEET Coaching Institutes in Sikar (2026 Comparison)', $draft['title']);
        $this->assertStringContainsString('Compare fees, top faculty', $draft['description']);
        $this->assertStringContainsString('/blog/top-5-neet-coachings-in-sikar-2026', $draft['target_link']);
        $this->assertTrue($draft['is_ai_generated'] ?? false);
    }

    public function test_ai_social_caption_service_generates_x_tweet_from_blog_content(): void
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response([
                'candidates' => [
                    [
                        'content' => [
                            'parts' => [
                                [
                                    'text' => json_encode([
                                        'tweet_text' => "Looking for the best NEET coaching in Sikar? 🩺 We analyzed fee structures, top faculty & hostel culture at Gurukripa, PCP & CLC.",
                                        'hashtags' => ['#NEET2026', '#Sikar']
                                    ])
                                ]
                            ]
                        ]
                    ]
                ]
            ], 200)
        ]);

        $post = $this->createSamplePost();
        $service = app(XCaptionGeneratorService::class);
        $draft = $service->generateForPost($post);

        $this->assertNotEmpty($draft['tweet_text']);
        $this->assertLessThanOrEqual(280, mb_strlen($draft['tweet_text']));
        $this->assertStringContainsString('Gurukripa, PCP & CLC', $draft['tweet_text']);
        $this->assertStringContainsString('/blog/top-5-neet-coachings-in-sikar-2026', $draft['tweet_text']);
        $this->assertTrue($draft['is_ai_generated'] ?? false);
    }

    public function test_graceful_fallback_to_template_when_ai_fails(): void
    {
        Http::fake([
            'https://generativelanguage.googleapis.com/*' => Http::response(['error' => 'Rate limit exceeded'], 429)
        ]);

        $post = $this->createSamplePost();

        // Facebook Fallback
        $fbDraft = app(FacebookCaptionGeneratorService::class)->generateForPost($post);
        $this->assertNotEmpty($fbDraft['caption']);
        $this->assertStringContainsString($post->title, $fbDraft['caption']);

        // Instagram Fallback
        $igDraft = app(InstagramCaptionGeneratorService::class)->generateForPost($post);
        $this->assertNotEmpty($igDraft['caption']);
        $this->assertStringContainsString($post->title, $igDraft['caption']);

        // Pinterest Fallback
        $pinDraft = app(PinterestCaptionGeneratorService::class)->generateForPost($post);
        $this->assertNotEmpty($pinDraft['title']);
        $this->assertNotEmpty($pinDraft['description']);

        // X Fallback
        $xDraft = app(XCaptionGeneratorService::class)->generateForPost($post);
        $this->assertNotEmpty($xDraft['tweet_text']);
        $this->assertLessThanOrEqual(280, mb_strlen($xDraft['tweet_text']));
    }
}
