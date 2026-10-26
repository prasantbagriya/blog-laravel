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
     * Post a new tweet (guaranteeing post URL inclusion and <= 280 char limit) via Twitter API v2.
     */
    public function createTweet(XAccount $account, string $text, ?string $mediaUrl = null, ?string $targetLink = null): array
    {
        $token = $this->getValidToken($account);

        $canonicalBase = rtrim(config('services.x.site_url') ?: (config('services.google.site_url') ?: 'https://coachingsinsikar.com'), '/');

        // Normalize target link to canonical live URL
        if (!empty($targetLink)) {
            $targetLink = preg_replace('#^https?://(localhost|127\.0\.0\.1)(:\d+)?#i', $canonicalBase, trim($targetLink));
            if (!preg_match('#^https?://#i', $targetLink)) {
                $targetLink = $canonicalBase . '/' . ltrim($targetLink, '/');
            }
        }

        $finalText = trim($text);

        // Ensure post URL is included in the tweet
        if (!empty($targetLink)) {
            $urlHost = parse_url($targetLink, PHP_URL_HOST);
            $hasLink = ($urlHost && str_contains($finalText, $urlHost)) || str_contains($finalText, $targetLink);

            if (!$hasLink) {
                $separator = "\n\n🔗 ";
                $linkBudget = mb_strlen($separator . $targetLink);
                $maxTextLen = max(30, 280 - $linkBudget);

                if (mb_strlen($finalText) > $maxTextLen) {
                    $finalText = \Illuminate\Support\Str::limit($finalText, $maxTextLen - 3, '...');
                }

                $finalText = $finalText . $separator . $targetLink;
            }
        }

        // Final safety guard: strictly cap at 280 chars so Twitter API v2 never rejects with "length greater than 280"
        if (mb_strlen($finalText) > 280) {
            if (!empty($targetLink) && str_contains($finalText, $targetLink)) {
                $parts = explode($targetLink, $finalText);
                $prefix = $parts[0] ?? '';
                $suffix = $parts[1] ?? '';
                $availPrefix = max(20, 280 - mb_strlen($targetLink) - mb_strlen($suffix) - 5);
                $finalText = mb_substr($prefix, 0, $availPrefix) . '... ' . $targetLink . $suffix;
            } else {
                $finalText = mb_substr($finalText, 0, 277) . '...';
            }
        }

        // Upload media if present (gracefully falls back if media upload fails)
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
        $httpRequest = Http::timeout(25);

        if ($account->auth_mode === 'oauth1' || !empty($account->access_token_secret)) {
            $authHeader = $this->authService->buildOAuth1Header('POST', $tweetUrl, [], $account->access_token, $account->access_token_secret);
            $httpRequest = $httpRequest->withHeaders(['Authorization' => $authHeader]);
        } else {
            $token = $this->getValidToken($account);
            $httpRequest = $httpRequest->withToken($token);
        }

        $response = $httpRequest->post($tweetUrl, $payload);

        if (!$response->successful()) {
            $status = $response->status();
            $body = $response->json();
            $err = $body['detail'] 
                ?? ($body['errors'][0]['message'] ?? ($body['title'] ?? ($body['error'] ?? $response->body())));

            if ($status === 401) {
                $err = "X Authentication Failed (401): Access token invalid or expired. Please re-authenticate your X account in Admin > X Hub. ({$err})";
            } elseif (stripos($err, 'credits depleted') !== false || $status === 402) {
                $err = "X API Credits Depleted: Aapke X (Twitter) Developer Account ke monthly tweet credits/balance khatam ho gaye hain. developer.x.com par ja kar apna API usage aur credits check karein. ({$err})";
            } elseif ($status === 403) {
                if (stripos($err, 'duplicate') !== false) {
                    $err = "X Duplicate Tweet (403): You have already posted this exact tweet recently. Please change the tweet wording slightly. ({$err})";
                } elseif (stripos($err, 'write') !== false || stripos($err, 'permission') !== false || stripos($err, 'access') !== false) {
                    $err = "X Permissions Error (403): Your X Developer App does not have 'Write' permissions. Open developer.twitter.com > User authentication settings and set permissions to 'Read and write'. ({$err})";
                } else {
                    $err = "X API 403 Forbidden: {$err}";
                }
            }

            Log::error("X Tweet creation failed [HTTP {$status}]: {$err}");
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
