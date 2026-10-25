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
    public function generateForPost(Post $post): array
    {
        $title = trim($post->title);
        $postUrl = $post->url_path;
        $fullUrl = url($postUrl) . '?utm_source=twitter&utm_medium=social&utm_campaign=blog_post';

        // 1. Generate 2-3 targeted hashtags (approx 30-40 chars)
        $hashtags = $this->generateHashtags($post);
        $hashtagString = !empty($hashtags) ? implode(' ', array_slice($hashtags, 0, 3)) : '#Sikar #Education';

        // 2. Budget calculation:
        // Max total = 280
        // URL = 23 chars
        // Newlines/Spaces buffer = 10 chars
        // HashtagString = length
        // Available for Hook = 280 - 23 - 10 - strlen($hashtagString)
        $availableForHook = max(80, 247 - mb_strlen($hashtagString));

        $hook = "📢 " . $title;
        if (mb_strlen($hook) > $availableForHook) {
            $hook = Str::limit($hook, $availableForHook - 3, '...');
        }

        // 3. Assemble tweet text
        $tweetText = "{$hook}\n\n🔗 {$fullUrl}\n\n{$hashtagString}";

        return [
            'title' => $title,
            'text' => $tweetText,
            'image_url' => $post->coverImage ? (str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage)) : null,
            'target_link' => $fullUrl,
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
