<?php

namespace App\Services\Instagram;

use App\Models\InstagramAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class InstagramPublishService
{
    protected string $graphVersion;

    public function __construct()
    {
        $this->graphVersion = config('services.instagram.graph_version', 'v21.0');
    }

    /**
     * Step 1: Create an Instagram Media Container for an image.
     */
    public function createImageContainer(InstagramAccount $account, string $imageUrl, string $caption): string
    {
        $url = "https://graph.facebook.com/{$this->graphVersion}/{$account->instagram_business_id}/media";

        $response = Http::timeout(30)->post($url, [
            'image_url' => $imageUrl,
            'caption' => $caption,
            'access_token' => $account->access_token,
        ]);

        if (!$response->successful()) {
            $err = $response->json('error.message') ?: $response->body();
            Log::error('Instagram create media container failed: ' . $err);
            throw new Exception("Instagram media container error: " . $err);
        }

        $containerId = $response->json('id');
        if (!$containerId) {
            throw new Exception("Instagram did not return a valid media container ID.");
        }

        return (string) $containerId;
    }

    /**
     * Step 2: Publish the uploaded media container.
     */
    public function publishContainer(InstagramAccount $account, string $containerId): string
    {
        $url = "https://graph.facebook.com/{$this->graphVersion}/{$account->instagram_business_id}/media_publish";

        $response = Http::timeout(30)->post($url, [
            'creation_id' => $containerId,
            'access_token' => $account->access_token,
        ]);

        if (!$response->successful()) {
            $err = $response->json('error.message') ?: $response->body();
            Log::error('Instagram publish container failed: ' . $err);
            throw new Exception("Instagram publish error: " . $err);
        }

        $mediaId = $response->json('id');
        if (!$mediaId) {
            throw new Exception("Instagram did not return a published media ID.");
        }

        return (string) $mediaId;
    }

    /**
     * Step 3: Fetch the direct Instagram post permalink (https://www.instagram.com/p/.../).
     */
    public function getMediaPermalink(InstagramAccount $account, string $mediaId): ?string
    {
        try {
            $url = "https://graph.facebook.com/{$this->graphVersion}/{$mediaId}";
            $response = Http::timeout(10)->get($url, [
                'fields' => 'permalink,shortcode',
                'access_token' => $account->access_token,
            ]);

            if ($response->successful()) {
                return $response->json('permalink') ?: "https://www.instagram.com/p/{$response->json('shortcode')}/";
            }
        } catch (\Throwable $e) {
            Log::warning('Failed to fetch Instagram permalink: ' . $e->getMessage());
        }

        return "https://www.instagram.com/";
    }

    /**
     * Complete publishing workflow: Create Container -> Publish -> Fetch Permalink.
     */
    public function publishPhoto(InstagramAccount $account, string $imageUrl, string $caption): array
    {
        // 1. Create Media Container
        $containerId = $this->createImageContainer($account, $imageUrl, $caption);

        // Optional short wait for Meta to ingest image
        usleep(500000); // 0.5 sec

        // 2. Publish Container
        $mediaId = $this->publishContainer($account, $containerId);

        // 3. Fetch direct permalink
        $permalink = $this->getMediaPermalink($account, $mediaId);

        return [
            'success' => true,
            'container_id' => $containerId,
            'media_id' => $mediaId,
            'permalink' => $permalink,
        ];
    }
}
