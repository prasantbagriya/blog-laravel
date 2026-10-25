<?php

namespace App\Services\Facebook;

use App\Models\FacebookPage;
use App\Models\FacebookPostShare;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class FacebookGraphService
{
    protected string $graphVersion;

    public function __construct()
    {
        $this->graphVersion = (string) config('services.facebook.graph_version', 'v20.0');
    }

    /**
     * Publish a photo post with caption and optional link to a Facebook Page.
     */
    public function publishPhotoPost(FacebookPage $page, string $imageUrl, string $caption, ?string $targetLink = null): array
    {
        $pageId = $page->page_id;
        $token = $page->page_access_token;

        if (empty($token)) {
            throw new Exception("Facebook Page Access Token is missing for page '{$page->name}'.");
        }

        // Ensure image URL is absolute
        $fullImageUrl = str_starts_with($imageUrl, 'http') ? $imageUrl : url($imageUrl);

        // Append link to caption if provided and not already present
        $finalCaption = $caption;
        if ($targetLink && !str_contains($finalCaption, $targetLink)) {
            $finalCaption .= "\n\n🔗 Read Full Story: " . $targetLink;
        }

        $endpoint = "https://graph.facebook.com/{$this->graphVersion}/{$pageId}/photos";

        $response = Http::withoutVerifying()
            ->timeout(30)
            ->post($endpoint, [
                'url' => $fullImageUrl,
                'caption' => $finalCaption,
                'access_token' => $token,
            ]);

        if (!$response->successful()) {
            $err = $response->json('error.message') ?: $response->body();
            Log::error("Facebook Page Photo Post Failed for Page {$pageId}: {$err}");
            throw new Exception("Meta Graph API error: {$err}");
        }

        $data = $response->json();
        $photoId = $data['id'] ?? null;
        $postId = $data['post_id'] ?? ($pageId . '_' . $photoId);
        $permalink = "https://www.facebook.com/{$postId}";

        return [
            'success' => true,
            'photo_id' => $photoId,
            'post_id' => $postId,
            'permalink' => $permalink,
            'raw' => $data,
        ];
    }

    /**
     * Publish a standard text feed / link post to a Facebook Page.
     */
    public function publishFeedPost(FacebookPage $page, string $message, ?string $link = null): array
    {
        $pageId = $page->page_id;
        $token = $page->page_access_token;

        if (empty($token)) {
            throw new Exception("Facebook Page Access Token is missing.");
        }

        $endpoint = "https://graph.facebook.com/{$this->graphVersion}/{$pageId}/feed";

        $payload = [
            'message' => $message,
            'access_token' => $token,
        ];

        if (!empty($link)) {
            $payload['link'] = str_starts_with($link, 'http') ? $link : url($link);
        }

        $response = Http::withoutVerifying()->timeout(30)->post($endpoint, $payload);

        if (!$response->successful()) {
            $err = $response->json('error.message') ?: $response->body();
            Log::error("Facebook Page Feed Post Failed for Page {$pageId}: {$err}");
            throw new Exception("Meta Graph API error: {$err}");
        }

        $data = $response->json();
        $postId = $data['id'] ?? null;
        $permalink = "https://www.facebook.com/{$postId}";

        return [
            'success' => true,
            'post_id' => $postId,
            'permalink' => $permalink,
            'raw' => $data,
        ];
    }

    /**
     * Retrieve recent published posts from the Facebook Page feed.
     */
    public function getPagePosts(FacebookPage $page, int $limit = 12): array
    {
        $pageId = $page->page_id;
        $token = $page->page_access_token;

        if (empty($token)) return [];

        $endpoint = "https://graph.facebook.com/{$this->graphVersion}/{$pageId}/posts";

        $response = Http::withoutVerifying()
            ->timeout(6)
            ->get($endpoint, [
                'fields' => 'id,message,created_time,full_picture,permalink_url,shares,reactions.summary(total_count),comments.summary(total_count)',
                'access_token' => $token,
                'limit' => $limit,
            ]);

        if (!$response->successful()) {
            Log::warning("Failed to fetch posts for Page {$pageId}: " . $response->body());
            return [];
        }

        $posts = $response->json('data') ?? [];

        return array_map(function ($p) {
            return [
                'id' => $p['id'] ?? '',
                'message' => $p['message'] ?? '',
                'created_time' => $p['created_time'] ?? '',
                'image' => $p['full_picture'] ?? null,
                'permalink' => $p['permalink_url'] ?? '',
                'reactions_count' => $p['reactions']['summary']['total_count'] ?? 0,
                'comments_count' => $p['comments']['summary']['total_count'] ?? 0,
                'shares_count' => $p['shares']['count'] ?? 0,
            ];
        }, $posts);
    }

    /**
     * Fetch key high-level 28-day analytics and insights for the Page.
     */
    public function getPageInsights(FacebookPage $page): array
    {
        $pageId = $page->page_id;
        $token = $page->page_access_token;

        if (empty($token)) {
            return [
                'impressions' => 0,
                'engagements' => 0,
                'views' => 0,
            ];
        }

        $endpoint = "https://graph.facebook.com/{$this->graphVersion}/{$pageId}/insights";

        $response = Http::withoutVerifying()
            ->timeout(6)
            ->get($endpoint, [
                'metric' => 'page_impressions,page_post_engagements,page_views_total',
                'period' => 'days_28',
                'access_token' => $token,
            ]);

        if (!$response->successful()) {
            return [
                'impressions' => 0,
                'engagements' => 0,
                'views' => 0,
            ];
        }

        $data = $response->json('data') ?? [];
        $insights = [
            'impressions' => 0,
            'engagements' => 0,
            'views' => 0,
        ];

        foreach ($data as $item) {
            $name = $item['name'] ?? '';
            $val = $item['values'][0]['value'] ?? 0;

            if ($name === 'page_impressions') $insights['impressions'] = (int) $val;
            if ($name === 'page_post_engagements') $insights['engagements'] = (int) $val;
            if ($name === 'page_views_total') $insights['views'] = (int) $val;
        }

        return $insights;
    }

    /**
     * Delete a published post from the Facebook Page.
     */
    public function deletePost(FacebookPage $page, string $fbPostId): bool
    {
        $token = $page->page_access_token;
        if (empty($token)) return false;

        $response = Http::withoutVerifying()
            ->timeout(15)
            ->delete("https://graph.facebook.com/{$this->graphVersion}/{$fbPostId}", [
                'access_token' => $token,
            ]);

        return $response->successful();
    }
}
