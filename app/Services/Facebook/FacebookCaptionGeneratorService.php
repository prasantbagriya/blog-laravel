<?php

namespace App\Services\Facebook;

use App\Models\Post;
use Illuminate\Support\Str;

class FacebookCaptionGeneratorService
{
    /**
     * Generate an engaging, high-conversion Facebook caption for a blog post.
     */
    public function generateForPost(Post $post): array
    {
        $title = trim($post->title);
        $category = $post->category ?: 'Education';
        $postUrl = $post->url_path;
        $fullUrl = url($postUrl) . '?utm_source=facebook&utm_medium=social&utm_campaign=blog_post';

        // 1. Try AI-powered content-aware caption generation
        try {
            $aiService = app(\App\Services\Social\AiSocialCaptionService::class);
            $aiDraft = $aiService->generateForPlatform($post, 'facebook');
            if (!empty($aiDraft) && !empty($aiDraft['caption'])) {
                $caption = trim($aiDraft['caption']);
                if (!str_contains($caption, $fullUrl) && !str_contains($caption, url($post->url_path))) {
                    $caption .= "\n\n👉 Read complete details here: {$fullUrl}";
                }
                return [
                    'title' => $title,
                    'caption' => $caption,
                    'image_url' => $post->coverImage ? url($post->coverImage) : null,
                    'target_link' => $fullUrl,
                    'hashtags' => $aiDraft['hashtags'] ?? $this->generateHashtags($post),
                    'is_ai_generated' => true,
                ];
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("AI Facebook caption fallback: " . $e->getMessage());
        }

        // 2. Clean content and extract summary sentences (Template Fallback)
        $summary = $this->extractSummary($post);

        // 2. Generate relevant hashtags based on category and title
        $hashtags = $this->generateHashtags($post);

        // 3. Compose structured caption
        $captionParts = [];

        // Catchy Hook
        $captionParts[] = "📢 {$title}";

        if (!empty($summary)) {
            $captionParts[] = "\n" . $summary;
        }

        // Call to Action
        $captionParts[] = "\n👉 Read complete details here: {$fullUrl}";

        // Hashtags
        if (!empty($hashtags)) {
            $captionParts[] = "\n" . implode(' ', $hashtags);
        }

        $caption = implode("\n", $captionParts);

        return [
            'title' => $title,
            'caption' => $caption,
            'image_url' => $post->coverImage ? url($post->coverImage) : null,
            'target_link' => $fullUrl,
            'hashtags' => $hashtags,
        ];
    }

    /**
     * Extract a clean 2-3 sentence punchy summary from post excerpt or content.
     */
    protected function extractSummary(Post $post): string
    {
        if (!empty($post->excerpt)) {
            return Str::limit(strip_tags($post->excerpt), 250);
        }

        if (!empty($post->content)) {
            $cleanText = strip_tags($post->content);
            $cleanText = preg_replace('/\s+/', ' ', $cleanText);
            
            // Grab first 200 characters ending cleanly at a word
            return Str::limit(trim($cleanText), 220);
        }

        return "Get the latest updates, expert insights, and comprehensive analysis on CoachingsinSikar.";
    }

    /**
     * Generate smart hashtags tailored to the post's content and category.
     */
    protected function generateHashtags(Post $post): array
    {
        $tags = ['#CoachingsinSikar', '#SikarEducation'];
        $titleLower = mb_strtolower($post->title . ' ' . ($post->category ?? ''));

        if (str_contains($titleLower, 'jee') || str_contains($titleLower, 'iit')) {
            $tags[] = '#JEEMains';
            $tags[] = '#IITJEE';
        }
        if (str_contains($titleLower, 'neet') || str_contains($titleLower, 'medical')) {
            $tags[] = '#NEETUG';
            $tags[] = '#MedicalAspirants';
        }
        if (str_contains($titleLower, 'admission') || str_contains($titleLower, 'registration')) {
            $tags[] = '#AdmissionsOpen';
        }
        if (str_contains($titleLower, 'result') || str_contains($titleLower, 'cut off') || str_contains($titleLower, 'cutoff')) {
            $tags[] = '#ExamResults';
        }
        if (str_contains($titleLower, 'news') || str_contains($titleLower, 'alert') || str_contains($titleLower, 'update')) {
            $tags[] = '#EducationAlert';
        }

        // Add sanitized category hashtag
        if (!empty($post->category)) {
            $catTag = '#' . Str::studly(preg_replace('/[^a-zA-Z0-9]/', ' ', $post->category));
            if (!in_array($catTag, $tags, true)) {
                $tags[] = $catTag;
            }
        }

        return array_slice(array_unique($tags), 0, 6);
    }
}
