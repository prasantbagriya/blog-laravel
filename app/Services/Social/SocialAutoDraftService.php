<?php

namespace App\Services\Social;

use App\Models\FacebookPage;
use App\Models\FacebookPostShare;
use App\Models\InstagramAccount;
use App\Models\InstagramPostShare;
use App\Models\LinkedInAccount;
use App\Models\LinkedInPostShare;
use App\Models\PinterestAccount;
use App\Models\PinterestPinShare;
use App\Models\Post;
use App\Models\XAccount;
use App\Models\XPostShare;
use App\Services\Facebook\FacebookCaptionGeneratorService;
use App\Services\Instagram\InstagramCaptionGeneratorService;
use App\Services\LinkedIn\LinkedInCaptionGeneratorService;
use App\Services\Pinterest\PinterestCaptionGeneratorService;
use App\Services\X\XCaptionGeneratorService;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SocialAutoDraftService
{
    /**
     * Auto-generate social drafts for all platforms when a post is created/published.
     */
    public static function syncDraftsForPost(Post $post): array
    {
        $results = [
            'linkedin' => false,
            'pinterest' => false,
            'facebook' => false,
            'instagram' => false,
            'x' => false,
        ];

        // 1. LinkedIn Draft
        try {
            $liShare = LinkedInPostShare::where('post_id', $post->id)->first();
            if (!$liShare) {
                $captionService = app(LinkedInCaptionGeneratorService::class);
                $draft = $captionService->generateForPost($post);
                $account = LinkedInAccount::active();

                LinkedInPostShare::create([
                    'post_id' => $post->id,
                    'linkedin_account_id' => $account?->id,
                    'commentary' => $draft['commentary'],
                    'media_url' => $post->coverImage ?: $post->metaImage,
                    'status' => 'pending_approval',
                ]);
                $results['linkedin'] = true;
            }
        } catch (\Throwable $e) {
            Log::warning('Auto-draft LinkedIn failed: ' . $e->getMessage());
        }

        // 2. Pinterest Pin Draft
        try {
            $pinShare = PinterestPinShare::where('post_id', $post->id)->first();
            if (!$pinShare) {
                $captionService = app(PinterestCaptionGeneratorService::class);
                $draft = $captionService->generateForPost($post);
                $account = PinterestAccount::active();
                $defaultBoard = $account?->defaultBoard() ?: $account?->boards()->first();

                PinterestPinShare::create([
                    'post_id' => $post->id,
                    'pinterest_account_id' => $account?->id,
                    'pinterest_board_id' => $defaultBoard?->id,
                    'title' => $draft['title'],
                    'description' => $draft['description'],
                    'image_url' => $draft['image_url'] ?: ($post->coverImage ?: ''),
                    'target_link' => $draft['target_link'],
                    'status' => 'pending_approval',
                ]);
                $results['pinterest'] = true;
            }
        } catch (\Throwable $e) {
            Log::warning('Auto-draft Pinterest failed: ' . $e->getMessage());
        }

        // 3. Facebook Draft
        try {
            $fbShare = FacebookPostShare::where('post_id', (string) $post->id)->first();
            if (!$fbShare) {
                $captionService = app(FacebookCaptionGeneratorService::class);
                $draft = $captionService->generateForPost($post);
                $page = FacebookPage::where('is_default', true)->first() ?: FacebookPage::first();

                if ($page) {
                    FacebookPostShare::create([
                        'post_id' => (string) $post->id,
                        'facebook_page_id' => $page->id,
                        'caption' => $draft['caption'] ?? $post->title,
                        'image_url' => $post->coverImage ?: $post->metaImage,
                        'target_link' => url($post->url_path),
                        'status' => 'pending_approval',
                    ]);
                    $results['facebook'] = true;
                }
            }
        } catch (\Throwable $e) {
            Log::warning('Auto-draft Facebook failed: ' . $e->getMessage());
        }

        // 4. Instagram Draft
        try {
            $igShare = InstagramPostShare::where('post_id', (string) $post->id)->first();
            if (!$igShare) {
                $captionService = app(InstagramCaptionGeneratorService::class);
                $draft = $captionService->generateForPost($post);
                $account = InstagramAccount::active();

                InstagramPostShare::create([
                    'post_id' => (string) $post->id,
                    'instagram_account_id' => $account?->id,
                    'caption' => $draft['caption'] ?? $post->title,
                    'image_url' => $post->coverImage ?: ($post->metaImage ?: ''),
                    'status' => 'pending_approval',
                ]);
                $results['instagram'] = true;
            }
        } catch (\Throwable $e) {
            Log::warning('Auto-draft Instagram failed: ' . $e->getMessage());
        }

        // 5. X (Twitter) Draft
        try {
            $xShare = XPostShare::where('post_id', (string) $post->id)->first();
            if (!$xShare) {
                $captionService = app(XCaptionGeneratorService::class);
                $draft = $captionService->generateForPost($post);
                $account = XAccount::active();

                $canonicalBase = rtrim(config('services.google.site_url', 'https://coachingsinsikar.com'), '/');
                $canonicalUrl = $draft['target_link'] ?? ($canonicalBase . '/' . ltrim($post->url_path, '/'));
                $finalText = $draft['text'] ?? ($draft['tweet_text'] ?? Str::limit($post->title . "\n\n🔗 " . $canonicalUrl, 280));

                XPostShare::create([
                    'post_id' => (string) $post->id,
                    'x_account_id' => $account?->id,
                    'text' => $finalText,
                    'media_url' => $draft['image_url'] ?? ($post->coverImage ?: $post->metaImage),
                    'target_link' => $canonicalUrl,
                    'status' => 'pending_approval',
                ]);
                $results['x'] = true;
            }
        } catch (\Throwable $e) {
            Log::warning('Auto-draft X failed: ' . $e->getMessage());
        }

        return $results;
    }
}
