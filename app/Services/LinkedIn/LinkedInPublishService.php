<?php

namespace App\Services\LinkedIn;

use App\Models\LinkedInAccount;
use Exception;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class LinkedInPublishService
{
    /**
     * Register a media asset for upload on LinkedIn.
     */
    public function registerImageUpload(LinkedInAccount $account, ?string $overrideAuthor = null): array
    {
        $author = $overrideAuthor ?: $account->effective_author_urn;

        $response = Http::withToken($account->access_token)
            ->timeout(20)
            ->withHeaders(['X-Restli-Protocol-Version' => '2.0.0'])
            ->post('https://api.linkedin.com/v2/assets?action=registerUpload', [
                'registerUploadRequest' => [
                    'recipes' => ['urn:li:digitalmediaRecipe:feedshare-image'],
                    'owner' => $author,
                    'serviceRelationships' => [
                        [
                            'relationshipType' => 'OWNER',
                            'identifier' => 'urn:li:userGeneratedContent',
                        ],
                    ],
                ],
            ]);

        if (!$response->successful()) {
            $err = $response->json('message') ?: $response->body();
            Log::error('LinkedIn register upload failed: ' . $err);
            throw new Exception("LinkedIn register upload error: " . $err);
        }

        $data = $response->json('value');
        $asset = $data['asset'] ?? null;
        $uploadUrl = $data['uploadMechanism']['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest']['uploadUrl'] ?? null;

        if (!$asset || !$uploadUrl) {
            throw new Exception("LinkedIn did not return upload credentials.");
        }

        return [
            'asset' => $asset,
            'upload_url' => $uploadUrl,
        ];
    }

    /**
     * Upload binary image content to LinkedIn's AWS S3 ingestion URL.
     */
    public function uploadImageBinary(string $uploadUrl, string $imageUrl): bool
    {
        try {
            // Retrieve image bytes: either from local public storage or HTTP
            $imageData = null;
            if (str_starts_with($imageUrl, 'http://') || str_starts_with($imageUrl, 'https://')) {
                $parsed = parse_url($imageUrl, PHP_URL_PATH);
                $localPath = public_path(ltrim($parsed, '/'));
                if (file_exists($localPath)) {
                    $imageData = file_get_contents($localPath);
                } else {
                    $imageData = Http::withoutVerifying()->timeout(20)->get($imageUrl)->body();
                }
            } else {
                $localPath = public_path(ltrim($imageUrl, '/'));
                if (file_exists($localPath)) {
                    $imageData = file_get_contents($localPath);
                }
            }

            if (!$imageData) {
                return false;
            }

            $response = Http::withoutVerifying()
                ->timeout(30)
                ->withBody($imageData, 'application/octet-stream')
                ->put($uploadUrl);

            return $response->successful();
        } catch (\Throwable $e) {
            Log::warning('LinkedIn binary upload error: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Publish a UGC Post with Image or Article Link to LinkedIn.
     */
    public function publishPost(
        LinkedInAccount $account,
        string $commentary,
        ?string $imageUrl = null,
        ?string $targetLink = null,
        ?string $title = null
    ): array {
        $author = $account->effective_author_urn;
        $assetUrn = null;

        // 1. Try uploading Image Asset if image URL is present
        if (!empty($imageUrl)) {
            try {
                $uploadMeta = $this->registerImageUpload($account);
                $uploaded = $this->uploadImageBinary($uploadMeta['upload_url'], $imageUrl);
                if ($uploaded) {
                    $assetUrn = $uploadMeta['asset'];
                }
            } catch (\Throwable $e) {
                Log::warning('LinkedIn image upload skipped or failed, falling back to article/text share: ' . $e->getMessage());
            }
        }

        // 2. Build LinkedIn UGC SpecificContent payload
        $shareContent = [
            'shareCommentary' => [
                'text' => $commentary,
            ],
        ];

        if ($assetUrn) {
            $shareContent['shareMediaCategory'] = 'IMAGE';
            $shareContent['media'] = [
                [
                    'status' => 'READY',
                    'description' => [
                        'text' => $title ?: Str::limit($commentary, 100),
                    ],
                    'media' => $assetUrn,
                    'title' => [
                        'text' => $title ?: 'Coachings in Sikar Update',
                    ],
                ],
            ];
        } elseif (!empty($targetLink)) {
            $shareContent['shareMediaCategory'] = 'ARTICLE';
            $shareContent['media'] = [
                [
                    'status' => 'READY',
                    'description' => [
                        'text' => Str::limit($commentary, 200),
                    ],
                    'originalUrl' => $targetLink,
                    'title' => [
                        'text' => $title ?: 'Coachings in Sikar',
                    ],
                ],
            ];
        } else {
            $shareContent['shareMediaCategory'] = 'NONE';
        }

        $payload = [
            'author' => $author,
            'lifecycleState' => 'PUBLISHED',
            'specificContent' => [
                'com.linkedin.ugc.ShareContent' => $shareContent,
            ],
            'visibility' => [
                'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC',
            ],
        ];

        // 3. Dispatch to LinkedIn UGC Posts API
        $response = Http::withToken($account->access_token)
            ->timeout(25)
            ->withHeaders([
                'X-Restli-Protocol-Version' => '2.0.0',
                'Content-Type' => 'application/json',
            ])
            ->post('https://api.linkedin.com/v2/ugcPosts', $payload);

        if (!$response->successful()) {
            $err = $response->json('message') ?: $response->body();

            // If organization author was rejected (e.g. no Community Management API or member not admin),
            // and we have a valid personal account, automatically retry as the connected member profile
            $canFallbackToPerson = str_starts_with($author, 'urn:li:organization:')
                && !empty($account->linkedin_person_id)
                && !str_contains($account->linkedin_person_id, 'pending_')
                && (str_contains($err, '[/author]') || str_contains($err, 'permissions') || str_contains($err, 'ACCESS_DENIED'));

            if ($canFallbackToPerson) {
                $personAuthor = $account->linkedin_person_id;
                Log::warning("Posting as organization ({$author}) rejected by LinkedIn ({$err}). Automatically retrying as connected member ({$personAuthor})...");

                // Build a fresh shareContent for personAuthor.
                // We MUST re-register the image under personAuthor because LinkedIn requires
                // that the media asset owner strictly matches the post author.
                $retryShareContent = [
                    'shareCommentary' => [
                        'text' => $commentary,
                    ],
                ];

                if (!empty($imageUrl)) {
                    try {
                        $pMeta = $this->registerImageUpload($account, $personAuthor);
                        if ($this->uploadImageBinary($pMeta['upload_url'], $imageUrl)) {
                            $retryShareContent['shareMediaCategory'] = 'IMAGE';
                            $retryShareContent['media'] = [
                                [
                                    'status' => 'READY',
                                    'description' => ['text' => $title ?: Str::limit($commentary, 100)],
                                    'media' => $pMeta['asset'],
                                    'title' => ['text' => $title ?: 'Coachings in Sikar Update'],
                                ],
                            ];
                        }
                    } catch (\Throwable $ex) {
                        Log::warning('Fallback person image upload failed, reverting to article link: ' . $ex->getMessage());
                    }
                }

                if (empty($retryShareContent['shareMediaCategory'])) {
                    if (!empty($targetLink)) {
                        $retryShareContent['shareMediaCategory'] = 'ARTICLE';
                        $retryShareContent['media'] = [
                            [
                                'status' => 'READY',
                                'description' => ['text' => Str::limit($commentary, 200)],
                                'originalUrl' => $targetLink,
                                'title' => ['text' => $title ?: 'Coachings in Sikar'],
                            ],
                        ];
                    } else {
                        $retryShareContent['shareMediaCategory'] = 'NONE';
                    }
                }

                $retryPayload = [
                    'author' => $personAuthor,
                    'lifecycleState' => 'PUBLISHED',
                    'specificContent' => [
                        'com.linkedin.ugc.ShareContent' => $retryShareContent,
                    ],
                    'visibility' => [
                        'com.linkedin.ugc.MemberNetworkVisibility' => 'PUBLIC',
                    ],
                ];

                $retryResponse = Http::withToken($account->access_token)
                    ->timeout(25)
                    ->withHeaders([
                        'X-Restli-Protocol-Version' => '2.0.0',
                        'Content-Type' => 'application/json',
                    ])
                    ->post('https://api.linkedin.com/v2/ugcPosts', $retryPayload);

                if ($retryResponse->successful()) {
                    $shareId = $retryResponse->json('id');
                    $permalink = $shareId ? "https://www.linkedin.com/feed/update/{$shareId}/" : "https://www.linkedin.com/feed/";
                    return [
                        'success' => true,
                        'share_urn' => $shareId,
                        'permalink' => $permalink,
                        'media_category' => $retryShareContent['shareMediaCategory'],
                        'published_as' => 'person_fallback',
                    ];
                }

                $err = $retryResponse->json('message') ?: $retryResponse->body();
            }

            Log::error('LinkedIn UGC Post failed: ' . $err);

            if (str_contains($err, '[/author]')) {
                throw new Exception("LinkedIn rejected author ({$author}). Company page par post karne ke liye aapka account us page ka Admin hona chahiye aur LinkedIn Developer App me 'Community Management API' approved hona chahiye. Turant post karne ke liye LinkedIn Page Settings me 'Post As' ko 'Personal Profile' chunein.");
            }

            throw new Exception("LinkedIn publishing failed: " . $err);
        }

        $shareId = $response->json('id');
        $permalink = $shareId ? "https://www.linkedin.com/feed/update/{$shareId}/" : "https://www.linkedin.com/feed/";

        return [
            'success' => true,
            'share_urn' => $shareId,
            'permalink' => $permalink,
            'media_category' => $shareContent['shareMediaCategory'],
        ];
    }
}
