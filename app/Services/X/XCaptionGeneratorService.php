<?php

namespace App\Services\X;

use App\Models\Post;
use Illuminate\Support\Str;

class XCaptionGeneratorService
{
    /**
     * Generate an engaging, strictly <= 280 character tweet for a blog post.
     * Note: On X, any URL automatically takes exactly 23 characters (t.co).
     */
    public function generateForPost(Post $post, ?string $explicitUrl = null): array
    {
        $title = trim($post->title);

        // Resolve canonical base
        $canonicalBase = rtrim(config('services.x.site_url') ?: (config('services.google.site_url') ?: 'https://coachingsinsikar.com'), '/');

        // Resolve clean post URL
        if (!empty($explicitUrl)) {
            $cleanUrl = preg_replace('#^https?://(localhost|127\.0\.0\.1)(:\d+)?#i', $canonicalBase, trim($explicitUrl));
            if (!preg_match('#^https?://#i', $cleanUrl)) {
                $cleanUrl = $canonicalBase . '/' . ltrim($cleanUrl, '/');
            }
        } else {
            $path = ltrim($post->url_path ?: ('blog/' . ($post->slug ?: 'update')), '/');
            $cleanUrl = $canonicalBase . '/' . $path;
        }

        // 1. Generate targeted hashtags
        $hashtags = $this->generateHashtags($post);
        $hashtagString = !empty($hashtags) ? implode(' ', array_slice($hashtags, 0, 3)) : '#Sikar #Education';

        // 2. Budget calculation:
        // Max total = 280
        // URL string length + link emoji/newlines buffer = length + 8
        // HashtagString = length + 2
        // Available for Hook = 280 - mb_strlen($cleanUrl) - mb_strlen($hashtagString) - 15
        $linkAndTagsLen = mb_strlen($cleanUrl) + mb_strlen($hashtagString) + 12;
        $availableForHook = max(40, 280 - $linkAndTagsLen);

        $hook = "📢 " . $title;
        if (mb_strlen($hook) > $availableForHook) {
            $hook = Str::limit($hook, $availableForHook - 3, '...');
        }

        // 3. Assemble tweet text with guaranteed URL
        $tweetText = "{$hook}\n\n🔗 {$cleanUrl}\n\n{$hashtagString}";

        // Final sanity check for max 280
        if (mb_strlen($tweetText) > 280) {
            $excess = mb_strlen($tweetText) - 280;
            $hook = Str::limit($hook, max(20, mb_strlen($hook) - $excess - 3), '...');
            $tweetText = "{$hook}\n\n🔗 {$cleanUrl}\n\n{$hashtagString}";
        }

        $imageUrl = null;
        if (!empty($post->coverImage)) {
            $imageUrl = str_starts_with($post->coverImage, 'http') 
                ? $post->coverImage 
                : $canonicalBase . '/' . ltrim($post->coverImage, '/');
        }

        return [
            'title' => $title,
            'text' => $tweetText,
            'tweet_text' => $tweetText,
            'image_url' => $imageUrl,
            'target_link' => $cleanUrl,
            'hashtags' => $hashtags,
            'char_count' => mb_strlen($tweetText),
        ];
    }

    /**
     * Generate 2-4 clean hashtags from post category and tags.
     */
    protected function generateHashtags(Post $post): array
    {
        $tags = ['#Sikar'];

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
        } elseif (str_contains($title, 'neet')) {
            $tags[] = '#NEET';
        } elseif (str_contains($title, 'coaching')) {
            $tags[] = '#Coaching';
        } elseif (str_contains($title, 'exam') || str_contains($title, 'result')) {
            $tags[] = '#ExamAlert';
        } else {
            $tags[] = '#Education';
        }

        return array_values(array_unique($tags));
    }
}
