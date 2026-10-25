<?php

namespace App\Services\LinkedIn;

use App\Models\Post;
use Illuminate\Support\Str;

class LinkedInCaptionGeneratorService
{
    /**
     * Generate an authoritative, professional post commentary for LinkedIn.
     */
    public function generateForPost(Post $post): array
    {
        $title = trim($post->title);
        $fullUrl = url($post->url_path) . '?utm_source=linkedin&utm_medium=social&utm_campaign=feed_post';

        $parts = [];

        // 1. Professional Hook
        $parts[] = "🎓 {$title}";

        // 2. Value Proposition / Summary
        if (!empty($post->excerpt)) {
            $parts[] = trim(strip_tags($post->excerpt));
        } elseif (!empty($post->content)) {
            $cleanContent = preg_replace('/\s+/', ' ', strip_tags($post->content));
            $parts[] = Str::limit($cleanContent, 280, '...');
        } else {
            $parts[] = "A comprehensive analysis covering institute faculty credentials, fee structures, hostel infrastructure, and historic competitive exam selection ratios in Sikar.";
        }

        // 3. Key Highlights
        $parts[] = "Key Takeaways for Students & Parents:\n" .
                   "• Verified benchmarks on student-to-faculty ratios\n" .
                   "• Transparent admissions deadlines & scholarship test criteria\n" .
                   "• Practical insights on hostel accommodations on Piprali Road";

        // 4. Professional Call to Action
        $parts[] = "👉 Access the full guide & comparative review here:\n{$fullUrl}";

        // 5. Hashtags
        $hashtags = $this->generateHashtags($post);
        $parts[] = implode(' ', $hashtags);

        $commentary = implode("\n\n", $parts);

        // LinkedIn character limit is 3,000 characters
        $commentary = Str::limit($commentary, 2900, '...');

        $imageUrl = null;
        if (!empty($post->coverImage)) {
            $imageUrl = str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage);
        }

        return [
            'commentary' => $commentary,
            'title' => $title,
            'image_url' => $imageUrl,
            'target_link' => $fullUrl,
            'hashtags' => $hashtags,
        ];
    }

    /**
     * Generate professional, high-intent LinkedIn hashtags.
     */
    public function generateHashtags(Post $post): array
    {
        $tags = [
            '#Education',
            '#CareerGuidance',
            '#SikarEducationHub',
            '#CoachingInstitutes',
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
            $tags[] = '#IITJEE';
            $tags[] = '#EngineeringAdmissions';
            $tags[] = '#JEEMains';
        } elseif (str_contains($title, 'neet')) {
            $tags[] = '#NEETUG';
            $tags[] = '#MedicalAdmissions';
            $tags[] = '#FutureDoctors';
        } elseif (str_contains($title, 'school')) {
            $tags[] = '#K12Education';
            $tags[] = '#BoardingSchools';
        } else {
            $tags[] = '#HigherEducation';
            $tags[] = '#AcademicSuccess';
        }

        $tags[] = '#Rajasthan';
        $tags[] = '#StudentMentorship';

        return array_values(array_unique($tags));
    }
}
