<?php

namespace App\Services\Pinterest;

use App\Models\PinterestAccount;
use App\Models\PinterestBoard;
use Exception;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PinterestService
{
    protected PinterestAuthService $authService;

    public function __construct(PinterestAuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Get a valid access token for the account, refreshing if needed.
     */
    protected function getValidToken(PinterestAccount $account): string
    {
        if ($account->token_expires_at && $account->token_expires_at->isPast()) {
            return $this->authService->refreshToken($account);
        }

        return (string) $account->access_token;
    }

    /**
     * Synchronize all Pinterest Boards belonging to this account.
     */
    public function syncBoards(PinterestAccount $account): Collection
    {
        $token = $this->getValidToken($account);

        $response = Http::withToken($token)
            ->timeout(10)
            ->get('https://api.pinterest.com/v5/boards', [
                'page_size' => 50,
            ]);

        if (!$response->successful()) {
            $err = $response->json('message') ?: $response->body();
            Log::warning("Failed to fetch Pinterest boards: {$err}");
            return $account->boards;
        }

        $items = $response->json('items') ?? [];
        $existingDefault = $account->boards()->where('is_default', true)->exists();

        foreach ($items as $index => $item) {
            $boardId = (string) $item['id'];
            $isDefault = !$existingDefault && $index === 0;

            PinterestBoard::updateOrCreate(
                [
                    'pinterest_account_id' => $account->id,
                    'board_id' => $boardId,
                ],
                [
                    'name' => (string) ($item['name'] ?? 'General Board'),
                    'description' => $item['description'] ?? null,
                    'privacy' => (string) ($item['privacy'] ?? 'PUBLIC'),
                    'pin_count' => (int) ($item['pin_count'] ?? 0),
                    'is_default' => $isDefault,
                ]
            );
        }

        $account->update(['board_count' => count($items)]);

        return $account->boards()->get();
    }

    /**
     * Create a new board on Pinterest.
     */
    public function createBoard(PinterestAccount $account, string $name, ?string $description = null, string $privacy = 'PUBLIC'): PinterestBoard
    {
        $token = $this->getValidToken($account);

        $response = Http::withToken($token)
            ->timeout(12)
            ->post('https://api.pinterest.com/v5/boards', [
                'name' => trim($name),
                'description' => $description,
                'privacy' => strtoupper($privacy) === 'SECRET' ? 'SECRET' : 'PUBLIC',
            ]);

        if (!$response->successful()) {
            $err = $response->json('message') ?: $response->body();
            throw new Exception("Pinterest Board Creation Failed: {$err}");
        }

        $data = $response->json();
        $isFirst = $account->boards()->count() === 0;

        return PinterestBoard::create([
            'pinterest_account_id' => $account->id,
            'board_id' => (string) $data['id'],
            'name' => (string) $data['name'],
            'description' => $data['description'] ?? null,
            'privacy' => (string) ($data['privacy'] ?? 'PUBLIC'),
            'pin_count' => 0,
            'is_default' => $isFirst,
        ]);
    }

    /**
     * Create and publish a new Pin to Pinterest using direct image URL.
     */
    public function createPin(
        PinterestAccount $account,
        PinterestBoard $board,
        string $title,
        string $description,
        string $imageUrl,
        ?string $targetLink = null,
        ?string $altText = null
    ): array {
        $token = $this->getValidToken($account);

        // Ensure image URL is absolute public URL
        $fullImageUrl = str_starts_with($imageUrl, 'http://') || str_starts_with($imageUrl, 'https://')
            ? $imageUrl
            : url($imageUrl);

        // Clean & truncate parameters according to Pinterest API v5 constraints
        $pinTitle = Str::limit(trim($title), 100, '');
        $pinDescription = Str::limit(trim($description), 500, '');

        $payload = [
            'board_id' => (string) $board->board_id,
            'title' => $pinTitle,
            'description' => $pinDescription,
            'media_source' => [
                'source_type' => 'image_url',
                'url' => $fullImageUrl,
            ],
        ];

        if (!empty($targetLink)) {
            $payload['link'] = $targetLink;
        }

        if (!empty($altText)) {
            $payload['alt_text'] = Str::limit(trim($altText), 500, '');
        }

        $response = Http::withToken($token)
            ->timeout(20)
            ->post('https://api.pinterest.com/v5/pins', $payload);

        if (!$response->successful()) {
            $err = $response->json('message') ?: ($response->json('error') ?: $response->body());
            Log::error("Pinterest Pin creation failed: {$err}");
            throw new Exception("Pinterest Pin Creation Failed: {$err}");
        }

        $data = $response->json();
        $pinId = (string) ($data['id'] ?? null);
        $pinUrl = $pinId ? "https://www.pinterest.com/pin/{$pinId}/" : "https://www.pinterest.com/";

        // Increment counts
        $board->increment('pin_count');
        $account->increment('pin_count');

        return [
            'success' => true,
            'pin_id' => $pinId,
            'pin_url' => $pinUrl,
            'title' => $data['title'] ?? $pinTitle,
            'description' => $data['description'] ?? $pinDescription,
        ];
    }

    /**
     * Retrieve recent pins from a specific board.
     */
    public function getBoardPins(PinterestAccount $account, PinterestBoard $board, int $limit = 8): array
    {
        $token = $this->getValidToken($account);

        try {
            $response = Http::withToken($token)
                ->timeout(6)
                ->get("https://api.pinterest.com/v5/boards/{$board->board_id}/pins", [
                    'page_size' => max(4, min($limit, 20)),
                ]);

            if (!$response->successful()) {
                return [];
            }

            $items = $response->json('items') ?? [];

            return array_map(function ($pin) {
                $pinId = (string) ($pin['id'] ?? '');
                $media = $pin['media'] ?? [];
                $images = $media['images'] ?? [];
                $imageObj = $images['600x'] ?? ($images['original'] ?? ($images['150x150'] ?? []));

                return [
                    'id' => $pinId,
                    'title' => $pin['title'] ?? '',
                    'description' => $pin['description'] ?? '',
                    'image' => $imageObj['url'] ?? null,
                    'link' => $pin['link'] ?? '',
                    'pin_url' => "https://www.pinterest.com/pin/{$pinId}/",
                    'created_at' => $pin['created_at'] ?? '',
                ];
            }, $items);
        } catch (\Throwable $e) {
            Log::warning('Pinterest getBoardPins error: ' . $e->getMessage());
            return [];
        }
    }
}
