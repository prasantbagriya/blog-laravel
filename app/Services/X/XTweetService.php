<?php

namespace App\Services\X;

use App\Models\XAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class XTweetService
{
    protected XAuthService $authService;

    public function __construct(XAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Get a valid access token for the account, refreshing if needed.
     */
    protected function getValidToken(XAccount $account): string
    {
        if ($account->token_expires_at && $account->token_expires_at->isPast()) {
            return $this->authService->refreshToken($account);
        }

        return (string) $account->access_token;
    }

    /**
     * Upload an image to X Media endpoint (v1.1) and return media_id_string.
     */
    public function uploadMedia(XAccount $account, string $imageUrl): ?string
    {
        try {
            // Normalize image path/URL and fetch contents
            $imageBinary = null;
            if (str_starts_with($imageUrl, 'http://') || str_starts_with($imageUrl, 'https://')) {
                $imageBinary = @file_get_contents($imageUrl);
            } else {
                $localPath = public_path(ltrim($imageUrl, '/'));
                if (file_exists($localPath)) {
                    $imageBinary = file_get_contents($localPath);
                } else {
                    $imageBinary = @file_get_contents(url($imageUrl));
                }
            }

            if (!$imageBinary) {
                Log::warning("X Media Upload: unable to fetch image data from {$imageUrl}");
                return null;
            }

            $base64 = base64_encode($imageBinary);
            $uploadUrl = 'https://upload.twitter.com/1.1/media/upload.json';
            $httpRequest = Http::timeout(25);

            if ($account->auth_mode === 'oauth1' || !empty($account->access_token_secret)) {
                $authHeader = $this->authService->buildOAuth1Header('POST', $uploadUrl, [], $account->access_token, $account->access_token_secret);
                $httpRequest = $httpRequest->withHeaders(['Authorization' => $authHeader]);
            } else {
                $token = $this->getValidToken($account);
                $httpRequest = $httpRequest->withToken($token);
            }

            // Attempt upload via 1.1 media endpoint
            $response = $httpRequest
                ->asForm()
                ->post($uploadUrl, [
                    'media_data' => $base64,
                ]);

            if ($response->successful()) {
                return (string) ($response->json('media_id_string') ?? $response->json('media_id'));
            }

            Log::warning('X Media Upload error: ' . $response->body());
            return null;
        } catch (\Throwable $e) {
            Log::warning('X Media Upload exception: ' . $e->getMessage());
            return null;
        }
    }

    /**
     * Post a new tweet (optionally with media and link) via Twitter API v2.
     */
    public function createTweet(XAccount $account, string $text, ?string $mediaUrl = null, ?string $targetLink = null): array
    {
        $token = $this->getValidToken($account);

        // Append link to text if provided and not already included
        $finalText = trim($text);
        if ($targetLink && !str_contains($finalText, $targetLink)) {
            $finalText .= "\n" . $targetLink;
        }

        // Upload media if present
        $mediaId = null;
        if (!empty($mediaUrl)) {
            $mediaId = $this->uploadMedia($account, $mediaUrl);
        }

        $payload = [
            'text' => $finalText,
        ];

        if ($mediaId) {
            $payload['media'] = [
                'media_ids' => [(string) $mediaId],
            ];
        }

        $tweetUrl = 'https://api.twitter.com/2/tweets';
        $httpRequest = Http::timeout(20);

        if ($account->auth_mode === 'oauth1' || !empty($account->access_token_secret)) {
            $authHeader = $this->authService->buildOAuth1Header('POST', $tweetUrl, [], $account->access_token, $account->access_token_secret);
            $httpRequest = $httpRequest->withHeaders(['Authorization' => $authHeader]);
        } else {
            $token = $this->getValidToken($account);
            $httpRequest = $httpRequest->withToken($token);
        }

        $response = $httpRequest->post($tweetUrl, $payload);

        if (!$response->successful()) {
            $err = $response->json('detail') ?: ($response->json('title') ?: $response->body());
            Log::error("X Tweet creation failed: {$err}");
            throw new Exception("X API Tweet failed: {$err}");
        }

        $data = $response->json('data') ?? [];
        $tweetId = $data['id'] ?? null;
        $username = $account->username ?: 'i';
        $permalink = $tweetId ? "https://x.com/{$username}/status/{$tweetId}" : "https://x.com/{$username}";

        // Increment local tweet count
        $account->increment('tweet_count');

        return [
            'success' => true,
            'tweet_id' => $tweetId,
            'permalink' => $permalink,
            'text' => $data['text'] ?? $finalText,
            'media_id' => $mediaId,
        ];
    }

    /**
     * Fetch recent tweets published by this account.
     */
    public function getRecentTweets(XAccount $account, int $limit = 8): array
    {
        if (empty($account->x_user_id)) return [];

        try {
            $token = $this->getValidToken($account);

            $response = Http::withToken($token)
                ->timeout(6)
                ->get("https://api.twitter.com/2/users/{$account->x_user_id}/tweets", [
                    'max_results' => max(5, min($limit, 20)),
                    'tweet.fields' => 'created_at,public_metrics,text',
                ]);

            if (!$response->successful()) {
                return [];
            }

            $tweets = $response->json('data') ?? [];

            return array_map(function ($t) use ($account) {
                $metrics = $t['public_metrics'] ?? [];
                $id = $t['id'] ?? '';
                return [
                    'id' => $id,
                    'text' => $t['text'] ?? '',
                    'created_at' => $t['created_at'] ?? '',
                    'retweets' => (int) ($metrics['retweet_count'] ?? 0),
                    'likes' => (int) ($metrics['like_count'] ?? 0),
                    'replies' => (int) ($metrics['reply_count'] ?? 0),
                    'impressions' => (int) ($metrics['impression_count'] ?? 0),
                    'permalink' => "https://x.com/{$account->username}/status/{$id}",
                ];
            }, $tweets);
        } catch (\Throwable $e) {
            Log::warning('X getRecentTweets error: ' . $e->getMessage());
            return [];
        }
    }

    /**
     * Refresh follower count and bio metrics from X
     */
    public function refreshMetrics(XAccount $account): array
    {
        if (empty($account->x_user_id)) {
            return [
                'followers_count' => $account->followers_count,
                'following_count' => $account->following_count,
                'tweet_count' => $account->tweet_count,
            ];
        }

        try {
            $token = $this->getValidToken($account);

            $response = Http::withToken($token)
                ->timeout(6)
                ->get("https://api.twitter.com/2/users/{$account->x_user_id}", [
                    'user.fields' => 'description,profile_image_url,public_metrics',
                ]);

            if ($response->successful()) {
                $userData = $response->json('data') ?? [];
                $metrics = $userData['public_metrics'] ?? [];

                $account->update([
                    'followers_count' => (int) ($metrics['followers_count'] ?? $account->followers_count),
                    'following_count' => (int) ($metrics['following_count'] ?? $account->following_count),
                    'tweet_count' => (int) ($metrics['tweet_count'] ?? $account->tweet_count),
                    'bio' => $userData['description'] ?? $account->bio,
                    'profile_image_url' => $userData['profile_image_url'] ?? $account->profile_image_url,
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('X refreshMetrics error: ' . $e->getMessage());
        }

        return [
            'followers_count' => $account->followers_count,
            'following_count' => $account->following_count,
            'tweet_count' => $account->tweet_count,
        ];
    }
}
