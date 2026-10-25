<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\InstagramAccount;
use App\Models\InstagramPostShare;
use App\Models\Post;
use App\Services\Instagram\InstagramAuthService;
use App\Services\Instagram\InstagramCaptionGeneratorService;
use App\Services\Instagram\InstagramPublishService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminInstagramController extends Controller
{
    protected InstagramAuthService $authService;
    protected InstagramPublishService $publishService;
    protected InstagramCaptionGeneratorService $captionService;

    public function __construct(
        InstagramAuthService $authService,
        InstagramPublishService $publishService,
        InstagramCaptionGeneratorService $captionService
    ) {
        $this->authService = $authService;
        $this->publishService = $publishService;
        $this->captionService = $captionService;
    }

    /**
     * Display the Instagram Management Hub.
     */
    public function index(Request $request)
    {
        $needsMigration = false;
        $errorMessage = null;

        try {
            // Auto-check & auto-migrate if Instagram tables are missing
            if (!Schema::hasTable('instagram_accounts') || !Schema::hasTable('instagram_post_shares')) {
                $needsMigration = true;
                try {
                    Artisan::call('migrate', ['--force' => true]);
                    if (Schema::hasTable('instagram_accounts') && Schema::hasTable('instagram_post_shares')) {
                        $needsMigration = false;
                    }
                } catch (\Throwable $e) {
                    Log::warning('Instagram auto-migrate attempt failed: ' . $e->getMessage());
                }
            }

            $account = null;
            if (Schema::hasTable('instagram_accounts')) {
                try {
                    $account = InstagramAccount::where('is_active', true)->latest()->first();
                } catch (\Throwable $e) {
                    Log::error('InstagramAccount query error: ' . $e->getMessage());
                }
            }

            // Fetch Pending Post Approvals
            $pendingApprovals = collect();
            $recentShares = collect();

            if (Schema::hasTable('instagram_post_shares')) {
                try {
                    $pendingApprovals = InstagramPostShare::with(['post'])
                        ->where('status', 'pending_approval')
                        ->latest()
                        ->take(20)
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_id' => $share->post_id,
                            'title' => $share->post?->title ?: 'Direct Instagram Post',
                            'post_slug' => $share->post?->slug,
                            'caption' => $share->caption,
                            'image_url' => $share->image_url ?: $share->post?->coverImage,
                            'target_link' => $share->post ? url($share->post->url_path) : url('/'),
                            'status' => $share->status,
                            'created_at' => $share->created_at?->diffForHumans(),
                        ]);

                    $recentShares = InstagramPostShare::with(['post', 'publisher'])
                        ->whereIn('status', ['published', 'failed'])
                        ->latest()
                        ->take(15)
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_title' => $share->post?->title ?: 'Direct Instagram Post',
                            'caption' => $share->caption,
                            'image_url' => $share->image_url,
                            'status' => $share->status,
                            'ig_media_id' => $share->ig_media_id,
                            'ig_permalink' => $share->ig_permalink,
                            'error_message' => $share->error_message,
                            'published_by_name' => $share->publisher?->name ?: 'Admin',
                            'published_at' => $share->published_at ? $share->published_at->format('M d, Y h:i A') : null,
                        ]);
                } catch (\Throwable $e) {
                    Log::error('InstagramPostShare fetch error: ' . $e->getMessage());
                }
            }

            $authUrl = null;
            if ($this->authService->isConfigured()) {
                try {
                    $authUrl = $this->authService->getAuthorizationUrl();
                } catch (\Throwable $e) {
                    Log::warning('Instagram getAuthorizationUrl error: ' . $e->getMessage());
                }
            }

            return Inertia::render('Admin/Instagram/Index', [
                'needsMigration' => $needsMigration,
                'isConfigured' => $this->authService->isConfigured(),
                'appId' => config('services.instagram.client_id'),
                'hasAppSecret' => !empty(config('services.instagram.client_secret')),
                'redirectUri' => config('services.instagram.redirect_uri', url('/auth/instagram/callback')),
                'account' => $account ? [
                    'id' => $account->id,
                    'username' => $account->username,
                    'name' => $account->name,
                    'avatar' => $account->profile_picture_url,
                    'bio' => $account->bio,
                    'followers_count' => $account->followers_count,
                    'media_count' => $account->media_count,
                    'is_active' => (bool) $account->is_active,
                    'instagram_url' => "https://www.instagram.com/{$account->username}/",
                ] : null,
                'pendingApprovals' => $pendingApprovals,
                'recentShares' => $recentShares,
                'authUrl' => $authUrl,
                'errorMessage' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('AdminInstagramController@index critical error: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return Inertia::render('Admin/Instagram/Index', [
                'needsMigration' => true,
                'isConfigured' => $this->authService->isConfigured(),
                'appId' => config('services.instagram.client_id'),
                'hasAppSecret' => !empty(config('services.instagram.client_secret')),
                'redirectUri' => config('services.instagram.redirect_uri', url('/auth/instagram/callback')),
                'account' => null,
                'pendingApprovals' => [],
                'recentShares' => [],
                'authUrl' => null,
                'errorMessage' => 'Unable to load Instagram settings: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Save Meta/Instagram App Credentials into environment.
     */
    public function saveCredentials(Request $request)
    {
        $request->validate([
            'app_id' => 'required|string',
            'app_secret' => 'nullable|string',
        ]);

        $appId = trim($request->input('app_id'));
        $appSecret = trim($request->input('app_secret', ''));

        $envPath = base_path('.env');
        if (file_exists($envPath)) {
            $env = file_get_contents($envPath);

            $replaceOrAppend = function ($key, $val) use (&$env) {
                if (preg_match("/^{$key}=/m", $env)) {
                    $env = preg_replace("/^{$key}=.*/m", "{$key}=\"{$val}\"", $env);
                } else {
                    $env .= "\n{$key}=\"{$val}\"";
                }
            };

            $replaceOrAppend('INSTAGRAM_APP_ID', $appId);
            if (!empty($appSecret)) {
                $replaceOrAppend('INSTAGRAM_APP_SECRET', $appSecret);
            }

            file_put_contents($envPath, $env);
            Artisan::call('config:clear');
        }

        return redirect()->back()->with('success', 'Instagram / Meta App credentials updated successfully!');
    }

    /**
     * Refresh live metrics from Instagram Graph API.
     */
    public function syncProfile(Request $request)
    {
        $account = InstagramAccount::active();
        if (!$account) {
            return redirect()->back()->with('error', 'Connect an Instagram account first.');
        }

        try {
            $this->authService->syncProfile($account);
            return redirect()->back()->with('success', 'Instagram profile metrics refreshed successfully!');
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to refresh metrics: ' . $e->getMessage());
        }
    }

    /**
     * Disconnect active Instagram account.
     */
    public function disconnect(Request $request)
    {
        $account = InstagramAccount::active();
        if ($account) {
            $account->update(['is_active' => false]);
        }

        return redirect()->back()->with('success', 'Instagram account disconnected.');
    }

    /**
     * Auto-generate an Instagram draft for a blog post.
     */
    public function generateDraft(Request $request, $postId)
    {
        $post = Post::find($postId) ?: Post::where('slug', $postId)->first();

        $account = InstagramAccount::active();

        if ($post) {
            $draft = $this->captionService->generateForPost($post);

            $share = InstagramPostShare::where('post_id', $post->id)
                ->where('status', 'pending_approval')
                ->first();

            if (!$share && $account) {
                $share = InstagramPostShare::create([
                    'post_id' => $post->id,
                    'instagram_account_id' => $account->id,
                    'caption' => $draft['caption'],
                    'image_url' => $draft['image_url'] ?: '',
                    'status' => 'pending_approval',
                ]);
            }

            return response()->json([
                'success' => true,
                'share_id' => $share?->id,
                'draft' => $draft,
                'share' => $share,
                'account' => $account ? [
                    'id' => $account->id,
                    'username' => $account->username,
                ] : null,
            ]);
        }

        return response()->json([
            'success' => true,
            'share_id' => null,
            'draft' => [
                'caption' => "📢 Latest Education Updates in Sikar!\n\nExplore top coaching institutes, faculty insights, and admissions.\n\n📍 Sikar, Rajasthan\n👉 Tap link in bio!\n\n#CoachingsInSikar #SikarEducation #JEE #NEET",
                'image_url' => null,
                'target_link' => url('/'),
            ],
            'account' => $account ? [
                'id' => $account->id,
                'username' => $account->username,
            ] : null,
        ]);
    }

    /**
     * Approve and publish a pending draft to Instagram.
     */
    public function approveAndPublish(Request $request)
    {
        $request->validate([
            'share_id' => 'nullable',
            'post_id' => 'nullable',
            'caption' => 'required|string|max:2200',
            'image_url' => 'required|string',
        ]);

        $shareId = $request->input('share_id');
        $share = $shareId ? InstagramPostShare::find($shareId) : null;
        $account = $share?->account ?: InstagramAccount::active();

        if (!$account || !$account->access_token) {
            return response()->json([
                'success' => false,
                'message' => 'No active Instagram account connected. Connect with Instagram first.',
            ], 422);
        }

        $caption = $request->input('caption');
        $imageUrl = $request->input('image_url') ?: ($share?->image_url);

        if (empty($imageUrl)) {
            return response()->json([
                'success' => false,
                'message' => 'An image is required to publish to Instagram.',
            ], 422);
        }

        if (!$share) {
            $share = InstagramPostShare::create([
                'post_id' => $request->input('post_id'),
                'instagram_account_id' => $account->id,
                'caption' => $caption,
                'image_url' => $imageUrl,
                'status' => 'pending_approval',
            ]);
        }

        try {
            $result = $this->publishService->publishPhoto(
                $account,
                $imageUrl,
                $caption
            );

            $share->update([
                'status' => 'published',
                'caption' => $caption,
                'image_url' => $imageUrl,
                'ig_container_id' => $result['container_id'],
                'ig_media_id' => $result['media_id'],
                'ig_permalink' => $result['permalink'],
                'published_by' => auth()->id(),
                'published_at' => now(),
                'error_message' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post successfully published to Instagram!',
                'media_id' => $result['media_id'],
                'permalink' => $result['permalink'],
            ]);
        } catch (\Throwable $e) {
            $share->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Publishing to Instagram failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Publish a custom standalone post directly to Instagram.
     */
    public function publishCustomPost(Request $request)
    {
        $request->validate([
            'caption' => 'required|string|max:2200',
            'image_url' => 'required|string',
        ]);

        $account = InstagramAccount::active();
        if (!$account || !$account->access_token) {
            return redirect()->back()->with('error', 'Connect an Instagram account first.');
        }

        $caption = $request->input('caption');
        $imageUrl = $request->input('image_url');

        try {
            $result = $this->publishService->publishPhoto($account, $imageUrl, $caption);

            InstagramPostShare::create([
                'instagram_account_id' => $account->id,
                'caption' => $caption,
                'image_url' => $imageUrl,
                'ig_container_id' => $result['container_id'],
                'ig_media_id' => $result['media_id'],
                'ig_permalink' => $result['permalink'],
                'status' => 'published',
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Post published successfully to Instagram! View on Instagram: ' . $result['permalink']);
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to publish to Instagram: ' . $e->getMessage());
        }
    }
}
