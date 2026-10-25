<?php

namespace App\Services\Pinterest;

use App\Models\Post;
use Illuminate\Support\Str;

class PinterestCaptionGeneratorService
{
    /**
     * Generate an engaging, SEO-optimized Title and Description for a Pinterest Pin.
     */
    public function generateForPost(Post $post): array
    {
        $rawTitle = trim($post->title);
        $postUrl = $post->url_path;
        $fullUrl = url($postUrl) . '?utm_source=pinterest&utm_medium=social&utm_campaign=pin';

        // 1. Clean Pin Title (Max 100 chars)
        $title = Str::limit($rawTitle, 95, '...');

        // 2. Extract clean summary from post content or excerpt
        $summary = '';
        if (!empty($post->excerpt)) {
            $summary = trim(strip_tags($post->excerpt));
        } elseif (!empty($post->content)) {
            $clean = preg_replace('/\s+/', ' ', strip_tags($post->content));
            $summary = Str::limit($clean, 260, '...');
        }

        // 3. Generate high-intent search hashtags
        $hashtags = $this->generateHashtags($post);
        $hashtagString = implode(' ', $hashtags);

        // 4. Assemble Description (Max 500 chars)
        $descriptionParts = [];
        if (!empty($summary)) {
            $descriptionParts[] = $summary;
        } else {
            $descriptionParts[] = "Check complete details, eligibility, reviews, and admission updates for {$rawTitle}.";
        }

        $descriptionParts[] = "Read more on CoachingsInSikar: {$fullUrl}";

        if (!empty($hashtagString)) {
            $descriptionParts[] = $hashtagString;
        }

        $description = implode("\n\n", $descriptionParts);
        $description = Str::limit($description, 490, '...');

        return [
            'title' => $title,
            'description' => $description,
            'image_url' => $post->coverImage ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : null,
            'target_link' => $fullUrl,
            'hashtags' => $hashtags,
        ];
    }

    /**
     * Generate 4-6 high-traffic Pinterest hashtags based on category and post title.
     */
    protected function generateHashtags(Post $post): array
    {
        $tags = ['#SikarCoaching', '#SikarEducation'];

        $category = trim((string) $post->category);
        if (!empty($category)) {
            $catTag = '#' . preg_replace('/[^A-Za-z0-9]/', '', ucwords($category));
            if (strlen($catTag) > 2) {
                $tags[] = $catTag;
            }
        }

        $title = strtolower($post->title);
        if (str_contains($title, 'jee') || str_contains($title, 'iit')) {
            $tags[] = '#JEEMains';
            $tags[] = '#IITJEEPreparation';
        } elseif (str_contains($title, 'neet')) {
            $tags[] = '#NEETPreparation';
            $tags[] = '#MedicalAspirants';
        } elseif (str_contains($title, 'coaching')) {
            $tags[] = '#CoachingHub';
            $tags[] = '#PipraliRoad';
        } elseif (str_contains($title, 'exam') || str_contains($title, 'result')) {
            $tags[] = '#ExamAlert';
            $tags[] = '#StudentUpdates';
        } else {
            $tags[] = '#StudyTips';
            $tags[] = '#CareerGuidance';
        }

        return array_values(array_unique($tags));
    }
}
