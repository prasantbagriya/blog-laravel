<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FacebookAccount;
use App\Models\FacebookPage;
use App\Models\FacebookPostShare;
use App\Models\Post;
use App\Services\Facebook\FacebookAuthService;
use App\Services\Facebook\FacebookCaptionGeneratorService;
use App\Services\Facebook\FacebookGraphService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminFacebookController extends Controller
{
    protected FacebookAuthService $authService;
    protected FacebookGraphService $graphService;
    protected FacebookCaptionGeneratorService $captionService;

    public function __construct(
        FacebookAuthService $authService,
        FacebookGraphService $graphService,
        FacebookCaptionGeneratorService $captionService
    ) {
        $this->authService = $authService;
        $this->graphService = $graphService;
        $this->captionService = $captionService;
    }

    /**
     * Display the Facebook Hub Dashboard in Admin Workspace.
     */
    public function index(Request $request)
    {
        $needsMigration = false;
        $errorMessage = null;

        try {
            // 1. Auto-check & auto-migrate if Facebook tables are missing
            if (!Schema::hasTable('facebook_accounts') || !Schema::hasTable('facebook_pages')) {
                $needsMigration = true;
                try {
                    Artisan::call('migrate', ['--force' => true]);
                    if (Schema::hasTable('facebook_accounts') && Schema::hasTable('facebook_pages')) {
                        $needsMigration = false;
                    }
                } catch (\Throwable $e) {
                    Log::warning('Facebook auto-migrate attempt failed: ' . $e->getMessage());
                }
            }

            $account = null;
            $pages = collect();
            $defaultPage = null;

            if (Schema::hasTable('facebook_accounts') && Schema::hasTable('facebook_pages')) {
                try {
                    $account = FacebookAccount::with('pages')->where('is_active', true)->latest()->first();
                    $pages = $account ? $account->pages : collect();
                    $defaultPage = $pages->firstWhere('is_default', true) ?: $pages->first();
                } catch (\Throwable $e) {
                    Log::error('FacebookAccount query error: ' . $e->getMessage());
                }
            }

            // Fetch recent page feed & insights if default page is connected
            $recentFeed = [];
            $insights = ['impressions' => 0, 'engagements' => 0, 'views' => 0];

            if ($defaultPage && !empty($defaultPage->page_access_token)) {
                try {
                    $recentFeed = $this->graphService->getPagePosts($defaultPage, 8);
                    $insights = $this->graphService->getPageInsights($defaultPage);
                } catch (\Throwable $e) {
                    Log::warning('Facebook Page live feed fetch skipped: ' . $e->getMessage());
                }
            }

            // Fetch pending approvals and recent audit log
            $pendingApprovals = [];
            $recentShares = [];

            if (Schema::hasTable('facebook_post_shares')) {
                try {
                    $pendingApprovals = FacebookPostShare::with(['page', 'post'])
                        ->where('status', 'pending_approval')
                        ->latest()
                        ->get();

                    $recentShares = FacebookPostShare::with(['page', 'post', 'publisher'])
                        ->whereIn('status', ['published', 'failed'])
                        ->latest()
                        ->take(15)
                        ->get();
                } catch (\Throwable $e) {
                    Log::warning('FacebookPostShare query error: ' . $e->getMessage());
                }
            }

            $authUrl = null;
            if ($this->authService->isConfigured()) {
                try {
                    $authUrl = $this->authService->getAuthorizationUrl();
                } catch (\Throwable $e) {
                    Log::warning('Facebook getAuthorizationUrl error: ' . $e->getMessage());
                }
            }

            return Inertia::render('Admin/Facebook/Index', [
                'needsMigration' => $needsMigration,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.facebook.client_id'),
                'hasClientSecret' => !empty(config('services.facebook.client_secret')),
                'redirectUri' => config('services.facebook.redirect_uri', url('/api/fb/callback')),
                'account' => $account ? [
                    'id' => $account->id,
                    'name' => $account->name,
                    'email' => $account->email,
                    'avatar' => $account->avatar,
                    'expires_at' => $account->token_expires_at ? $account->token_expires_at->toIso8601String() : null,
                    'is_active' => (bool) $account->is_active,
                ] : null,
                'pages' => $pages->map(fn($p) => [
                    'id' => $p->id,
                    'page_id' => $p->page_id,
                    'name' => $p->name,
                    'category' => $p->category,
                    'picture_url' => $p->picture_url,
                    'fan_count' => $p->fan_count,
                    'followers_count' => $p->followers_count,
                    'is_default' => (bool) $p->is_default,
                    'auto_publish_enabled' => (bool) $p->auto_publish_enabled,
                    'facebook_url' => "https://facebook.com/{$p->page_id}",
                ]),
                'defaultPage' => $defaultPage ? [
                    'id' => $defaultPage->id,
                    'page_id' => $defaultPage->page_id,
                    'name' => $defaultPage->name,
                    'picture_url' => $defaultPage->picture_url,
                    'followers_count' => $defaultPage->followers_count,
                ] : null,
                'pendingApprovals' => $pendingApprovals,
                'recentShares' => $recentShares,
                'recentFeed' => $recentFeed,
                'insights' => $insights,
                'authUrl' => $authUrl,
                'errorMessage' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('AdminFacebookController@index critical error: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return Inertia::render('Admin/Facebook/Index', [
                'needsMigration' => true,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.facebook.client_id'),
                'hasClientSecret' => !empty(config('services.facebook.client_secret')),
                'redirectUri' => config('services.facebook.redirect_uri', url('/api/fb/callback')),
                'account' => null,
                'pages' => [],
                'defaultPage' => null,
                'pendingApprovals' => [],
                'recentShares' => [],
                'recentFeed' => [],
                'insights' => ['impressions' => 0, 'engagements' => 0, 'views' => 0],
                'authUrl' => null,
                'errorMessage' => 'Error initializing Facebook Hub: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Mark a page as the primary default publishing target.
     */
    public function setDefaultPage(Request $request, $pageId)
    {
        $page = FacebookPage::findOrFail($pageId);
        $page->makeDefault();

        return redirect()->back()->with('success', "Facebook Page '{$page->name}' is now set as default!");
    }

    /**
     * Toggle auto-publish feature for a specific page.
     */
    public function toggleAutoPublish(Request $request, $pageId)
    {
        $page = FacebookPage::findOrFail($pageId);
        $page->update(['auto_publish_enabled' => !$page->auto_publish_enabled]);

        return redirect()->back()->with('success', 'Page settings updated.');
    }

    /**
     * Re-sync all managed pages from Meta Graph API.
     */
    public function syncPages(Request $request)
    {
        $account = FacebookAccount::where('is_active', true)->latest()->first();
        if (!$account) {
            return redirect()->back()->with('error', 'No active Facebook account connected.');
        }

        try {
            $pages = $this->authService->syncManagedPages($account);
            return redirect()->back()->with('success', count($pages) . " Facebook Pages synced successfully!");
        } catch (Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Generate smart caption preview for a blog post.
     */
    public function generateDraft(Request $request, $postId)
    {
        $post = Post::where('id', $postId)->orWhere('slug', $postId)->firstOrFail();
        $draft = $this->captionService->generateForPost($post);

        // Find default or selected page
        $page = null;
        if ($request->has('page_id')) {
            $page = FacebookPage::find($request->input('page_id'));
        }
        if (!$page) {
            $page = FacebookPage::where('is_default', true)->first() ?: FacebookPage::first();
        }

        $share = null;
        if ($page) {
            $share = FacebookPostShare::updateOrCreate(
                [
                    'post_id' => (string) $post->id,
                    'facebook_page_id' => $page->id,
                    'status' => 'pending_approval',
                ],
                [
                    'caption' => $draft['caption'],
                    'image_url' => $draft['image_url'],
                    'target_link' => $draft['target_link'],
                ]
            );
        }

        return response()->json([
            'success' => true,
            'draft' => $draft,
            'share_id' => $share?->id,
            'page' => $page ? ['id' => $page->id, 'name' => $page->name] : null,
        ]);
    }

    /**
     * Approve and Publish a draft post to the selected Facebook Page.
     */
    public function approveAndPublish(Request $request)
    {
        $request->validate([
            'caption' => 'required|string',
            'facebook_page_id' => 'required|exists:facebook_pages,id',
            'image_url' => 'nullable|string',
            'target_link' => 'nullable|string',
            'post_id' => 'nullable|string',
            'share_id' => 'nullable|integer',
        ]);

        $page = FacebookPage::findOrFail($request->input('facebook_page_id'));
        $caption = $request->input('caption');
        $imageUrl = $request->input('image_url');
        $targetLink = $request->input('target_link');
        $postId = $request->input('post_id');
        $shareId = $request->input('share_id');

        $share = null;
        if ($shareId) {
            $share = FacebookPostShare::find($shareId);
        }

        if (!$share && $postId) {
            $share = FacebookPostShare::where('post_id', $postId)
                ->where('facebook_page_id', $page->id)
                ->where('status', 'pending_approval')
                ->first();
        }

        if (!$share) {
            $share = new FacebookPostShare([
                'post_id' => $postId,
                'facebook_page_id' => $page->id,
                'status' => 'pending_approval',
            ]);
        }

        $share->caption = $caption;
        $share->image_url = $imageUrl;
        $share->target_link = $targetLink;

        try {
            // Dispatch to Meta Graph API
            if (!empty($imageUrl)) {
                $result = $this->graphService->publishPhotoPost($page, $imageUrl, $caption, $targetLink);
            } else {
                $result = $this->graphService->publishFeedPost($page, $caption, $targetLink);
            }

            $share->status = 'published';
            $share->fb_post_id = $result['post_id'];
            $share->fb_permalink = $result['permalink'];
            $share->published_by = auth()->id();
            $share->published_at = now();
            $share->error_message = null;
            $share->save();

            return response()->json([
                'success' => true,
                'message' => 'Post published successfully to Facebook Page!',
                'permalink' => $result['permalink'],
                'post_id' => $result['post_id'],
            ]);
        } catch (\Throwable $e) {
            $share->status = 'failed';
            $share->error_message = $e->getMessage();
            $share->save();

            return response()->json([
                'success' => false,
                'message' => 'Publishing failed: ' . $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Direct Custom Post from the Portal to Facebook Page.
     */
    public function publishCustomPost(Request $request)
    {
        $request->validate([
            'facebook_page_id' => 'required|exists:facebook_pages,id',
            'caption' => 'required|string',
            'image_url' => 'nullable|string',
            'link' => 'nullable|string',
        ]);

        $page = FacebookPage::findOrFail($request->input('facebook_page_id'));
        $caption = $request->input('caption');
        $imageUrl = $request->input('image_url');
        $link = $request->input('link');

        try {
            if (!empty($imageUrl)) {
                $result = $this->graphService->publishPhotoPost($page, $imageUrl, $caption, $link);
            } else {
                $result = $this->graphService->publishFeedPost($page, $caption, $link);
            }

            FacebookPostShare::create([
                'post_id' => null,
                'facebook_page_id' => $page->id,
                'caption' => $caption,
                'image_url' => $imageUrl,
                'target_link' => $link,
                'status' => 'published',
                'fb_post_id' => $result['post_id'],
                'fb_permalink' => $result['permalink'],
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Post published to Facebook Page successfully!');
        } catch (Exception $e) {
            return redirect()->back()->with('error', 'Failed to publish: ' . $e->getMessage());
        }
    }

    /**
     * Disconnect the Facebook Account and connected pages.
     */
    public function disconnect(Request $request)
    {
        FacebookAccount::truncate();
        return redirect()->back()->with('success', 'Facebook account disconnected.');
    }
}
