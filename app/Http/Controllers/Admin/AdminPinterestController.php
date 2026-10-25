<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PinterestAccount;
use App\Models\PinterestBoard;
use App\Models\PinterestPinShare;
use App\Models\Post;
use App\Services\Pinterest\PinterestAuthService;
use App\Services\Pinterest\PinterestCaptionGeneratorService;
use App\Services\Pinterest\PinterestService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminPinterestController extends Controller
{
    protected PinterestAuthService $authService;
    protected PinterestService $pinterestService;
    protected PinterestCaptionGeneratorService $captionService;

    public function __construct(
        PinterestAuthService $authService,
        PinterestService $pinterestService,
        PinterestCaptionGeneratorService $captionService
    ) {
        $this->authService = $authService;
        $this->pinterestService = $pinterestService;
        $this->captionService = $captionService;
    }

    /**
     * Display the Pinterest Management Hub.
     */
    public function index(Request $request)
    {
        $needsMigration = false;
        $errorMessage = null;

        try {
            // 1. Auto-check & auto-migrate if Pinterest tables are missing
            if (!Schema::hasTable('pinterest_accounts') || !Schema::hasTable('pinterest_boards')) {
                $needsMigration = true;
                try {
                    Artisan::call('migrate', ['--force' => true]);
                    if (Schema::hasTable('pinterest_accounts') && Schema::hasTable('pinterest_boards')) {
                        $needsMigration = false;
                    }
                } catch (\Throwable $e) {
                    Log::warning('Pinterest auto-migrate attempt failed: ' . $e->getMessage());
                }
            }

            $account = null;
            $boards = collect();
            $defaultBoard = null;

            if (Schema::hasTable('pinterest_accounts') && Schema::hasTable('pinterest_boards')) {
                try {
                    $account = PinterestAccount::with('boards')->where('is_active', true)->latest()->first();
                    $boards = $account ? $account->boards : collect();
                    $defaultBoard = $boards->firstWhere('is_default', true) ?: $boards->first();
                } catch (\Throwable $e) {
                    Log::error('PinterestAccount query error: ' . $e->getMessage());
                }
            }

            // Fetch recent pins from default board if connected
            $recentPins = [];
            if ($account && $defaultBoard && !empty($account->access_token)) {
                try {
                    $recentPins = $this->pinterestService->getBoardPins($account, $defaultBoard, 8);
                } catch (\Throwable $e) {
                    Log::warning('Pinterest recent pins fetch skipped: ' . $e->getMessage());
                }
            }

            // Fetch pending approvals and recent audit log
            $pendingApprovals = [];
            $recentShares = [];

            if (Schema::hasTable('pinterest_pin_shares')) {
                try {
                    $pendingApprovals = PinterestPinShare::with(['post', 'board', 'account'])
                        ->where('status', 'pending_approval')
                        ->latest()
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_id' => $share->post_id,
                            'title' => $share->title ?: ($share->post?->title ?: 'Pin Draft'),
                            'description' => $share->description ?: ($share->post?->metaDescription ?: $share->post?->excerpt ?: ''),
                            'image_url' => $share->image_url ?: ($share->post?->coverImage ?: '/uploads/aboutus.webp'),
                            'target_link' => $share->target_link ?: ($share->post ? url($share->post->url_path) : url('/')),
                            'pinterest_board_id' => $share->pinterest_board_id,
                            'board_name' => $share->board?->name ?: 'Default Board',
                            'status' => $share->status,
                            'created_at' => $share->created_at?->diffForHumans(),
                            'post' => $share->post ? [
                                'id' => $share->post->id,
                                'title' => $share->post->title,
                                'slug' => $share->post->slug,
                                'coverImage' => $share->post->coverImage,
                            ] : null,
                        ]);

                    $recentShares = PinterestPinShare::with(['post', 'board', 'publisher', 'account'])
                        ->whereIn('status', ['published', 'failed'])
                        ->latest()
                        ->take(15)
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_title' => $share->title ?: ($share->post?->title ?: 'Pin'),
                            'pin_id' => $share->pin_id,
                            'pin_url' => $share->pin_url,
                            'image_url' => $share->image_url ?: ($share->post?->coverImage ?: ''),
                            'status' => $share->status,
                            'board_name' => $share->board?->name ?: 'Default Board',
                            'published_by' => $share->publisher?->name ?: 'Admin',
                            'published_at' => $share->published_at ? $share->published_at->format('M d, Y h:i A') : $share->updated_at?->diffForHumans(),
                            'error_message' => $share->error_message,
                        ]);
                } catch (\Throwable $e) {
                    Log::warning('PinterestPinShare query error: ' . $e->getMessage());
                }
            }

            $authUrl = null;
            if ($this->authService->isConfigured()) {
                try {
                    $authUrl = $this->authService->getAuthorizationUrl();
                } catch (\Throwable $e) {
                    Log::warning('Pinterest getAuthorizationUrl error: ' . $e->getMessage());
                }
            }

            return Inertia::render('Admin/Pinterest/Index', [
                'needsMigration' => $needsMigration,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.pinterest.client_id'),
                'hasClientSecret' => !empty(config('services.pinterest.client_secret')),
                'redirectUri' => config('services.pinterest.redirect_uri', url('/auth/pinterest/callback')),
                'account' => $account ? [
                    'id' => $account->id,
                    'username' => $account->username,
                    'name' => $account->name,
                    'avatar' => $account->profile_image,
                    'bio' => $account->bio,
                    'follower_count' => $account->follower_count,
                    'pin_count' => $account->pin_count,
                    'board_count' => $account->board_count,
                    'is_active' => (bool) $account->is_active,
                    'pinterest_url' => "https://www.pinterest.com/{$account->username}/",
                ] : null,
                'boards' => $boards->map(fn($b) => [
                    'id' => $b->id,
                    'board_id' => $b->board_id,
                    'name' => $b->name,
                    'description' => $b->description,
                    'privacy' => $b->privacy,
                    'pin_count' => $b->pin_count,
                    'is_default' => (bool) $b->is_default,
                    'board_url' => "https://www.pinterest.com/{$account?->username}/" . rawurlencode($b->name) . "/",
                ]),
                'defaultBoard' => $defaultBoard ? [
                    'id' => $defaultBoard->id,
                    'board_id' => $defaultBoard->board_id,
                    'name' => $defaultBoard->name,
                ] : null,
                'pendingApprovals' => $pendingApprovals,
                'recentShares' => $recentShares,
                'recentPins' => $recentPins,
                'authUrl' => $authUrl,
                'errorMessage' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('AdminPinterestController@index critical error: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return Inertia::render('Admin/Pinterest/Index', [
                'needsMigration' => true,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.pinterest.client_id'),
                'hasClientSecret' => !empty(config('services.pinterest.client_secret')),
                'redirectUri' => config('services.pinterest.redirect_uri', url('/auth/pinterest/callback')),
                'account' => null,
                'boards' => [],
                'defaultBoard' => null,
                'pendingApprovals' => [],
                'recentShares' => [],
                'recentPins' => [],
                'authUrl' => null,
                'errorMessage' => 'Error initializing Pinterest Hub: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Save direct Access Token from Pinterest Developers.
     */
    public function saveApiCredentials(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
        ]);

        try {
            $accessToken = trim($request->input('access_token'));
            $account = $this->authService->syncUserFromToken($accessToken);

            // Immediately sync boards
            $this->pinterestService->syncBoards($account);

            return redirect()->back()->with('success', "Pinterest account @{$account->username} connected & boards synced!");
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to connect Pinterest account: ' . $e->getMessage());
        }
    }

    /**
     * Sync boards from Pinterest API.
     */
    public function syncBoards(Request $request)
    {
        $account = PinterestAccount::active();
        if (!$account) {
            return redirect()->back()->with('error', 'No active Pinterest account connected.');
        }

        try {
            $this->pinterestService->syncBoards($account);
            return redirect()->back()->with('success', 'Pinterest boards synchronized successfully!');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to sync boards: ' . $e->getMessage());
        }
    }

    /**
     * Set a board as the primary/default pin board.
     */
    public function setDefaultBoard(Request $request, $boardId)
    {
        $board = PinterestBoard::findOrFail($boardId);
        $board->makeDefault();

        return redirect()->back()->with('success', "Board '{$board->name}' is now your default board.");
    }

    /**
     * Create a new board directly from the portal.
     */
    public function createBoard(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string|max:500',
            'privacy' => 'nullable|string',
        ]);

        $account = PinterestAccount::active();
        if (!$account) {
            return redirect()->back()->with('error', 'Connect a Pinterest account first.');
        }

        try {
            $board = $this->pinterestService->createBoard(
                $account,
                $request->input('name'),
                $request->input('description'),
                $request->input('privacy', 'PUBLIC')
            );

            return redirect()->back()->with('success', "Board '{$board->name}' created successfully on Pinterest!");
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to create board: ' . $e->getMessage());
        }
    }

    /**
     * Disconnect active Pinterest account.
     */
    public function disconnect(Request $request)
    {
        $account = PinterestAccount::active();
        if ($account) {
            $account->update(['is_active' => false]);
        }

        return redirect()->back()->with('success', 'Pinterest account disconnected.');
    }

    /**
     * Auto-generate a Pin draft for a blog post.
     */
    public function generateDraft(Request $request, $postId)
    {
        $post = Post::find($postId) ?: Post::where('slug', $postId)->first();

        $account = PinterestAccount::active();
        $defaultBoard = $account?->defaultBoard() ?: $account?->boards()->first();

        if ($post) {
            $draft = $this->captionService->generateForPost($post);

            $share = PinterestPinShare::where('post_id', $post->id)
                ->where('status', 'pending_approval')
                ->first();

            if (!$share) {
                $share = PinterestPinShare::create([
                    'post_id' => $post->id,
                    'pinterest_account_id' => $account?->id,
                    'pinterest_board_id' => $defaultBoard?->id,
                    'title' => $draft['title'],
                    'description' => $draft['description'],
                    'image_url' => $draft['image_url'] ?: '',
                    'target_link' => $draft['target_link'],
                    'status' => 'pending_approval',
                ]);
            }

            return response()->json([
                'success' => true,
                'share_id' => $share->id,
                'draft' => $draft,
                'share' => $share,
                'board' => $defaultBoard ? [
                    'id' => $defaultBoard->id,
                    'board_id' => $defaultBoard->board_id,
                    'name' => $defaultBoard->name,
                ] : null,
            ]);
        }

        return response()->json([
            'success' => true,
            'share_id' => null,
            'draft' => [
                'title' => 'Top Updates in Sikar',
                'description' => 'Explore the best institutions and latest educational news in Sikar.',
                'image_url' => null,
                'target_link' => url('/'),
            ],
            'board' => $defaultBoard ? [
                'id' => $defaultBoard->id,
                'board_id' => $defaultBoard->board_id,
                'name' => $defaultBoard->name,
            ] : null,
        ]);
    }

    /**
     * Approve and publish a pending Pin to Pinterest.
     */
    public function approveAndPublish(Request $request)
    {
        $request->validate([
            'share_id' => 'nullable',
            'post_id' => 'nullable',
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:500',
            'image_url' => 'required|string',
            'pinterest_board_id' => 'nullable',
        ]);

        $shareId = $request->input('share_id');
        $share = $shareId ? PinterestPinShare::find($shareId) : null;
        $account = $share?->account ?: PinterestAccount::active();

        if (!$account || !$account->access_token) {
            return response()->json([
                'success' => false,
                'message' => 'No active Pinterest account connected.',
            ], 422);
        }

        $boardId = $request->input('pinterest_board_id') ?: ($share?->pinterest_board_id);
        $board = $boardId ? PinterestBoard::find($boardId) : $account->defaultBoard();

        if (!$board) {
            $board = $account->boards()->first();
        }

        if (!$board) {
            return response()->json([
                'success' => false,
                'message' => 'Please select or create a Pinterest board first.',
            ], 422);
        }

        $title = $request->input('title');
        $description = $request->input('description');
        $imageUrl = $request->input('image_url') ?: ($share?->image_url);
        $targetLink = $request->input('target_link') ?: ($share?->target_link);

        if (empty($imageUrl)) {
            return response()->json([
                'success' => false,
                'message' => 'A valid image URL is required to publish a Pin to Pinterest.',
            ], 422);
        }

        if (!$share) {
            $share = PinterestPinShare::create([
                'post_id' => $request->input('post_id'),
                'pinterest_account_id' => $account->id,
                'pinterest_board_id' => $board->id,
                'title' => $title,
                'description' => $description,
                'image_url' => $imageUrl,
                'target_link' => $targetLink ?: url('/'),
                'status' => 'pending_approval',
            ]);
        }

        try {
            $result = $this->pinterestService->createPin(
                $account,
                $board,
                $title,
                $description,
                $imageUrl,
                $targetLink
            );

            $share->update([
                'status' => 'published',
                'title' => $title,
                'description' => $description,
                'image_url' => $imageUrl,
                'pinterest_board_id' => $board->id,
                'pin_id' => $result['pin_id'],
                'pin_url' => $result['pin_url'],
                'published_by' => auth()->id(),
                'published_at' => now(),
                'error_message' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Pin successfully created on Pinterest!',
                'pin_id' => $result['pin_id'],
                'pin_url' => $result['pin_url'],
            ]);
        } catch (\Throwable $e) {
            $share->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Publishing to Pinterest failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Publish a custom standalone Pin directly from Admin.
     */
    public function publishCustomPin(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:100',
            'description' => 'required|string|max:500',
            'image_url' => 'required|string',
            'pinterest_board_id' => 'required',
            'target_link' => 'nullable|string',
        ]);

        $account = PinterestAccount::active();
        if (!$account || !$account->access_token) {
            return redirect()->back()->with('error', 'Connect a Pinterest account first.');
        }

        $board = PinterestBoard::findOrFail($request->input('pinterest_board_id'));

        try {
            $title = $request->input('title');
            $description = $request->input('description');
            $image = $request->input('image_url');
            $link = $request->input('target_link');

            $result = $this->pinterestService->createPin(
                $account,
                $board,
                $title,
                $description,
                $image,
                $link
            );

            PinterestPinShare::create([
                'pinterest_account_id' => $account->id,
                'pinterest_board_id' => $board->id,
                'title' => $title,
                'description' => $description,
                'image_url' => $image,
                'target_link' => $link,
                'status' => 'published',
                'pin_id' => $result['pin_id'],
                'pin_url' => $result['pin_url'],
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Pin published successfully to Pinterest!');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to publish pin: ' . $e->getMessage());
        }
    }
}
