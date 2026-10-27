<?php

namespace App\Services\Instagram;

use App\Models\Post;
use Illuminate\Support\Str;

class InstagramCaptionGeneratorService
{
    /**
     * Generate an engaging, Instagram-optimized caption with emojis, spacing, CTA, and hashtags.
     */
    public function generateForPost(Post $post): array
    {
        $title = trim($post->title);
        $fullUrl = url($post->url_path) . '?utm_source=instagram&utm_medium=social&utm_campaign=ig_feed';

        // 1. Try AI-powered content-aware Instagram caption generation
        try {
            $aiService = app(\App\Services\Social\AiSocialCaptionService::class);
            $aiDraft = $aiService->generateForPlatform($post, 'instagram');
            if (!empty($aiDraft) && !empty($aiDraft['caption'])) {
                $caption = trim($aiDraft['caption']);
                $caption = Str::limit($caption, 2100, '');

                $imageUrl = null;
                if (!empty($post->coverImage)) {
                    $imageUrl = str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage);
                }

                return [
                    'caption' => $caption,
                    'image_url' => $imageUrl,
                    'target_link' => $fullUrl,
                    'hashtags' => $aiDraft['hashtags'] ?? $this->generateHashtags($post),
                    'is_ai_generated' => true,
                ];
            }
        } catch (\Throwable $e) {
            \Illuminate\Support\Facades\Log::warning("AI Instagram caption fallback: " . $e->getMessage());
        }

        // 2. Engaging Opening Hook (Template Fallback)
        $emojis = ['📢', '✨', '🎯', '🚀', '🔥'];
        $hookEmoji = $emojis[array_rand($emojis)];
        $captionParts = [];
        $captionParts[] = "{$hookEmoji} {$title}";

        // 2. Body Extract / Key Highlights
        if (!empty($post->excerpt)) {
            $captionParts[] = trim(strip_tags($post->excerpt));
        } elseif (!empty($post->content)) {
            $cleanContent = preg_replace('/\s+/', ' ', strip_tags($post->content));
            $captionParts[] = Str::limit($cleanContent, 280, '...');
        } else {
            $captionParts[] = "Discover everything you need to know about top coaching institutes, faculty insights, fee structures, and admissions in Sikar.";
        }

        // 3. Instagram CTA
        $captionParts[] = "📍 Sikar, Rajasthan\n👉 Tap the link in our bio for the complete in-depth guide & verified rankings!";
        $captionParts[] = "🔗 {$fullUrl}";

        // 4. Curated Hashtags
        $hashtags = $this->generateHashtags($post);
        $captionParts[] = implode(' ', $hashtags);

        $caption = implode("\n\n", $captionParts);

        // Instagram max caption is 2,200 chars
        $caption = Str::limit($caption, 2100, '');

        $imageUrl = null;
        if (!empty($post->coverImage)) {
            $imageUrl = str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage);
        }

        return [
            'caption' => $caption,
            'image_url' => $imageUrl,
            'target_link' => $fullUrl,
            'hashtags' => $hashtags,
        ];
    }

    /**
     * Generate 15-20 high-traffic, niche-specific Instagram hashtags.
     */
    public function generateHashtags(Post $post): array
    {
        $tags = [
            '#CoachingsInSikar',
            '#SikarEducation',
            '#SikarCity',
            '#PipraliRoad',
            '#SikarCoachingHub',
            '#EducationInRajasthan',
        ];

        $category = trim((string) $post->category);
        if (!empty($category)) {
            $catTag = '#' . preg_replace('/[^A-Za-z0-9]/', '', ucwords($category));
            if (strlen($catTag) > 2) {
                $tags[] = $catTag;
            }
        }

        $title = strtolower($post->title);
        if (str_contains($title, 'jee') || str_contains($title, 'iit')) {
            $tags = array_merge($tags, [
                '#JEEMains',
                '#JEEAdvanced',
                '#IITJEEPreparation',
                '#EngineeringAspirants',
                '#IITianLife',
            ]);
        } elseif (str_contains($title, 'neet')) {
            $tags = array_merge($tags, [
                '#NEETUG',
                '#NEETPreparation',
                '#MedicalAspirants',
                '#DoctorDreams',
                '#FutureDoctors',
            ]);
        } elseif (str_contains($title, 'school') || str_contains($title, 'hostel')) {
            $tags = array_merge($tags, [
                '#SikarSchools',
                '#HostelLife',
                '#SchoolingInSikar',
            ]);
        } else {
            $tags = array_merge($tags, [
                '#CareerGuidance',
                '#StudentSuccess',
                '#ExamPreparation',
            ]);
        }

        $tags = array_merge($tags, [
            '#StudyMotivation',
            '#RajasthanEducation',
            '#KotaVsSikar',
            '#SikarUpdates',
        ]);

        return array_values(array_unique($tags));
    }
}
