<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Post;
use App\Models\XAccount;
use App\Models\XPostShare;
use App\Services\X\XAuthService;
use App\Services\X\XCaptionGeneratorService;
use App\Services\X\XTweetService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminXController extends Controller
{
    protected XAuthService $authService;
    protected XTweetService $tweetService;
    protected XCaptionGeneratorService $captionService;

    public function __construct(
        XAuthService $authService,
        XTweetService $tweetService,
        XCaptionGeneratorService $captionService
    ) {
        $this->authService = $authService;
        $this->tweetService = $tweetService;
        $this->captionService = $captionService;
    }

    /**
     * Display the X (Twitter) Management Hub.
     */
    public function index(Request $request)
    {
        $needsMigration = false;
        $errorMessage = null;

        try {
            // 1. Auto-check & auto-migrate if X tables are missing
            if (!Schema::hasTable('x_accounts') || !Schema::hasTable('x_post_shares')) {
                $needsMigration = true;
                try {
                    Artisan::call('migrate', ['--force' => true]);
                    if (Schema::hasTable('x_accounts') && Schema::hasTable('x_post_shares')) {
                        $needsMigration = false;
                    }
                } catch (\Throwable $e) {
                    Log::warning('X auto-migrate attempt failed: ' . $e->getMessage());
                }
            }

            $account = null;
            if (Schema::hasTable('x_accounts')) {
                try {
                    $account = XAccount::where('is_active', true)->latest()->first();
                } catch (\Throwable $e) {
                    Log::error('XAccount query error: ' . $e->getMessage());
                }
            }

            // Fetch recent published tweets if account is connected
            $recentTweets = [];
            if ($account && !empty($account->access_token)) {
                try {
                    $recentTweets = $this->tweetService->getRecentTweets($account, 8);
                } catch (\Throwable $e) {
                    Log::warning('X recent tweets fetch skipped: ' . $e->getMessage());
                }
            }

            // Fetch pending approvals and recent audit log
            $pendingApprovals = [];
            $recentShares = [];

            if (Schema::hasTable('x_post_shares')) {
                try {
                    $pendingApprovals = XPostShare::with(['post', 'account'])
                        ->where('status', 'pending_approval')
                        ->latest()
                        ->get();

                    $recentShares = XPostShare::with(['post', 'publisher', 'account'])
                        ->whereIn('status', ['published', 'failed'])
                        ->latest()
                        ->take(15)
                        ->get();
                } catch (\Throwable $e) {
                    Log::warning('XPostShare query error: ' . $e->getMessage());
                }
            }

            $authUrl = null;
            if ($this->authService->isConfigured()) {
                try {
                    $authUrl = $this->authService->getAuthorizationUrl();
                } catch (\Throwable $e) {
                    Log::warning('X getAuthorizationUrl error: ' . $e->getMessage());
                }
            }

            return Inertia::render('Admin/X/Index', [
                'needsMigration' => $needsMigration,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.x.client_id'),
                'hasClientSecret' => !empty(config('services.x.client_secret')),
                'consumerKey' => config('services.x.consumer_key'),
                'hasConsumerSecret' => !empty(config('services.x.consumer_secret')),
                'redirectUri' => config('services.x.redirect_uri', url('/auth/x/callback')),
                'account' => $account ? [
                    'id' => $account->id,
                    'username' => $account->username,
                    'name' => $account->name,
                    'bio' => $account->bio,
                    'avatar' => $account->profile_image_url,
                    'followers_count' => $account->followers_count,
                    'following_count' => $account->following_count,
                    'tweet_count' => $account->tweet_count,
                    'auth_mode' => $account->auth_mode,
                    'is_active' => (bool) $account->is_active,
                    'x_url' => "https://x.com/{$account->username}",
                ] : null,
                'pendingApprovals' => $pendingApprovals,
                'recentShares' => $recentShares,
                'recentTweets' => $recentTweets,
                'authUrl' => $authUrl,
                'errorMessage' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('AdminXController@index critical error: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return Inertia::render('Admin/X/Index', [
                'needsMigration' => true,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.x.client_id'),
                'hasClientSecret' => !empty(config('services.x.client_secret')),
                'consumerKey' => config('services.x.consumer_key'),
                'hasConsumerSecret' => !empty(config('services.x.consumer_secret')),
                'redirectUri' => config('services.x.redirect_uri', url('/auth/x/callback')),
                'account' => null,
                'pendingApprovals' => [],
                'recentShares' => [],
                'recentTweets' => [],
                'authUrl' => null,
                'errorMessage' => 'Error initializing X Hub: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Save direct Access Token & Secret from Twitter Developer Portal.
     */
    public function saveApiCredentials(Request $request)
    {
        $request->validate([
            'access_token' => 'required|string',
            'access_token_secret' => 'nullable|string',
            'username' => 'nullable|string',
        ]);

        try {
            $accessToken = trim($request->input('access_token'));
            $tokenSecret = trim((string) $request->input('access_token_secret'));
            $username = trim((string) $request->input('username')) ?: 'coachingsinsikar';

            $account = $this->authService->syncUserFromToken(
                $accessToken,
                null,
                86400 * 365,
                'direct_token',
                $tokenSecret
            );

            return redirect()->back()->with('success', "X account @{$account->username} verified & connected!");
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to connect X account: ' . $e->getMessage());
        }
    }

    /**
     * Sync profile followers, following, and tweet stats from X.
     */
    public function syncProfile(Request $request)
    {
        $account = XAccount::where('is_active', true)->latest()->first();
        if (!$account) {
            return redirect()->back()->with('error', 'No active X account connected.');
        }

        try {
            $this->tweetService->refreshMetrics($account);
            return redirect()->back()->with('success', 'X profile metrics synchronized successfully!');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to refresh metrics: ' . $e->getMessage());
        }
    }

    /**
     * Disconnect active X account.
     */
    public function disconnect(Request $request)
    {
        $account = XAccount::where('is_active', true)->latest()->first();
        if ($account) {
            $account->update(['is_active' => false]);
        }

        return redirect()->back()->with('success', 'X account disconnected.');
    }

    /**
     * Auto-generate a 280-char draft for a blog post.
     */
    public function generateDraft(Request $request, $postId)
    {
        $post = Post::findOrFail($postId);
        $draft = $this->captionService->generateForPost($post);

        // Check if pending share already exists
        $share = XPostShare::where('post_id', $postId)
            ->where('status', 'pending_approval')
            ->first();

        if (!$share) {
            $account = XAccount::active();
            $share = XPostShare::create([
                'post_id' => $post->id,
                'x_account_id' => $account?->id,
                'text' => $draft['text'],
                'media_url' => $draft['image_url'],
                'target_link' => $draft['target_link'],
                'status' => 'pending_approval',
            ]);
        }

        return response()->json([
            'success' => true,
            'share_id' => $share->id,
            'draft' => $draft,
            'share' => $share,
        ]);
    }

    /**
     * Approve and publish a pending draft tweet to X.
     */
    public function approveAndPublish(Request $request)
    {
        $request->validate([
            'share_id' => 'required',
            'text' => 'required|string|max:280',
        ]);

        $share = XPostShare::findOrFail($request->input('share_id'));
        $account = $share->account ?: XAccount::active();

        if (!$account || !$account->access_token) {
            return response()->json([
                'success' => false,
                'message' => 'No active X account connected. Connect with X first.',
            ], 422);
        }

        $finalText = $request->input('text');
        $mediaUrl = $request->input('media_url') ?: $share->media_url;
        $targetLink = $request->input('target_link') ?: $share->target_link;

        try {
            $result = $this->tweetService->createTweet(
                $account,
                $finalText,
                $mediaUrl,
                $targetLink
            );

            $share->update([
                'status' => 'published',
                'text' => $finalText,
                'tweet_id' => $result['tweet_id'],
                'tweet_permalink' => $result['permalink'],
                'x_media_id' => $result['media_id'],
                'published_by' => auth()->id(),
                'published_at' => now(),
                'error_message' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Tweet successfully published to X!',
                'tweet_id' => $result['tweet_id'],
                'permalink' => $result['permalink'],
            ]);
        } catch (\Throwable $e) {
            $share->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Publishing to X failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Publish a standalone custom tweet directly from Admin.
     */
    public function publishCustomTweet(Request $request)
    {
        $request->validate([
            'text' => 'required|string|max:280',
            'image_url' => 'nullable|string',
            'target_link' => 'nullable|string',
        ]);

        $account = XAccount::active();
        if (!$account || !$account->access_token) {
            return redirect()->back()->with('error', 'Connect an X account first before posting.');
        }

        try {
            $text = $request->input('text');
            $image = $request->input('image_url');
            $link = $request->input('target_link');

            $result = $this->tweetService->createTweet($account, $text, $image, $link);

            XPostShare::create([
                'x_account_id' => $account->id,
                'text' => $text,
                'media_url' => $image,
                'target_link' => $link,
                'status' => 'published',
                'tweet_id' => $result['tweet_id'],
                'tweet_permalink' => $result['permalink'],
                'x_media_id' => $result['media_id'],
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Tweet published successfully to X!');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to publish tweet: ' . $e->getMessage());
        }
    }
}
