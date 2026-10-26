<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LinkedInAccount;
use App\Models\LinkedInPostShare;
use App\Models\Post;
use App\Services\LinkedIn\LinkedInAuthService;
use App\Services\LinkedIn\LinkedInCaptionGeneratorService;
use App\Services\LinkedIn\LinkedInPublishService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class AdminLinkedInController extends Controller
{
    protected LinkedInAuthService $authService;
    protected LinkedInPublishService $publishService;
    protected LinkedInCaptionGeneratorService $captionService;

    public function __construct(
        LinkedInAuthService $authService,
        LinkedInPublishService $publishService,
        LinkedInCaptionGeneratorService $captionService
    ) {
        $this->authService = $authService;
        $this->publishService = $publishService;
        $this->captionService = $captionService;
    }

    /**
     * Display the LinkedIn Management Hub.
     */
    public function index(Request $request)
    {
        $needsMigration = false;
        $errorMessage = null;

        try {
            // Auto-check & auto-heal LinkedIn database schema
            LinkedInAccount::ensureSchema();

            $account = null;
            if (Schema::hasTable('linkedin_accounts')) {
                try {
                    $account = LinkedInAccount::where('is_active', true)->latest()->first();
                } catch (\Throwable $e) {
                    Log::error('LinkedInAccount query error: ' . $e->getMessage());
                }
            }

            // Fetch Pending Post Approvals
            $pendingApprovals = collect();
            $recentShares = collect();

            if (Schema::hasTable('linkedin_post_shares')) {
                try {
                    $pendingApprovals = LinkedInPostShare::with(['post'])
                        ->where('status', 'pending_approval')
                        ->latest()
                        ->take(20)
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_id' => $share->post_id,
                            'title' => $share->post?->title ?: 'Direct LinkedIn Post',
                            'post_slug' => $share->post?->slug,
                            'commentary' => $share->commentary,
                            'media_url' => $share->media_url ?: $share->post?->coverImage,
                            'target_link' => $share->post ? url($share->post->url_path) : url('/'),
                            'status' => $share->status,
                            'created_at' => $share->created_at?->diffForHumans(),
                        ]);

                    $recentShares = LinkedInPostShare::with(['post', 'publisher'])
                        ->whereIn('status', ['published', 'failed'])
                        ->latest()
                        ->take(15)
                        ->get()
                        ->map(fn($share) => [
                            'id' => $share->id,
                            'post_title' => $share->post?->title ?: 'Direct LinkedIn Post',
                            'commentary' => $share->commentary,
                            'media_url' => $share->media_url,
                            'status' => $share->status,
                            'share_urn' => $share->share_urn,
                            'permalink' => $share->permalink,
                            'error_message' => $share->error_message,
                            'published_by_name' => $share->publisher?->name ?: 'Admin',
                            'published_at' => $share->published_at ? $share->published_at->format('M d, Y h:i A') : null,
                        ]);
                } catch (\Throwable $e) {
                    Log::error('LinkedInPostShare fetch error: ' . $e->getMessage());
                }
            }

            $authUrl = null;
            if ($this->authService->isConfigured()) {
                try {
                    $authUrl = $this->authService->getAuthorizationUrl();
                } catch (\Throwable $e) {
                    Log::warning('LinkedIn getAuthorizationUrl error: ' . $e->getMessage());
                }
            }

            $savedOrgId = config('services.linkedin.organization_id') ?: ($account?->organization_id ?: env('LINKEDIN_ORGANIZATION_ID'));
            $savedOrgName = config('services.linkedin.organization_name') ?: ($account?->organization_name ?: 'Coachings in Sikar');

            if ($account && empty($account->organization_id) && !empty($savedOrgId)) {
                try {
                    $cols = Schema::getColumnListing('linkedin_accounts');
                    $up = [];
                    if (in_array('organization_id', $cols)) $up['organization_id'] = $savedOrgId;
                    if (in_array('organization_name', $cols)) $up['organization_name'] = $savedOrgName;
                    if (in_array('post_as', $cols)) $up['post_as'] = 'organization';
                    if (!empty($up)) $account->update($up);
                } catch (\Throwable $e) {}
            }

            return Inertia::render('Admin/LinkedIn/Index', [
                'needsMigration' => $needsMigration,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.linkedin.client_id'),
                'hasClientSecret' => !empty(config('services.linkedin.client_secret')),
                'redirectUri' => config('services.linkedin.redirect_uri', url('/auth/linkedin/callback')),
                'savedOrgId' => $savedOrgId,
                'savedOrgName' => $savedOrgName,
                'account' => $account ? [
                    'id' => $account->id,
                    'name' => $account->name,
                    'given_name' => $account->given_name,
                    'family_name' => $account->family_name,
                    'email' => $account->email,
                    'avatar' => $account->profile_picture_url,
                    'headline' => $account->headline,
                    'person_id' => $account->linkedin_person_id,
                    'organization_id' => $account->organization_id ?: $savedOrgId,
                    'organization_name' => $account->organization_name ?: $savedOrgName,
                    'organization_vanity_name' => $account->organization_vanity_name,
                    'organization_logo_url' => $account->organization_logo_url,
                    'post_as' => $account->post_as ?: 'organization',
                    'effective_name' => $account->effective_name,
                    'effective_author_urn' => $account->effective_author_urn,
                    'is_active' => (bool) $account->is_active,
                ] : null,
                'pendingApprovals' => $pendingApprovals,
                'recentShares' => $recentShares,
                'authUrl' => $authUrl,
                'errorMessage' => null,
            ]);
        } catch (\Throwable $e) {
            Log::error('AdminLinkedInController@index critical error: ' . $e->getMessage(), [
                'exception' => $e
            ]);

            return Inertia::render('Admin/LinkedIn/Index', [
                'needsMigration' => true,
                'isConfigured' => $this->authService->isConfigured(),
                'clientId' => config('services.linkedin.client_id'),
                'hasClientSecret' => !empty(config('services.linkedin.client_secret')),
                'redirectUri' => config('services.linkedin.redirect_uri', url('/auth/linkedin/callback')),
                'account' => null,
                'pendingApprovals' => [],
                'recentShares' => [],
                'authUrl' => null,
                'errorMessage' => 'Unable to load LinkedIn settings: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Save LinkedIn App credentials into environment.
     */
    public function saveCredentials(Request $request)
    {
        $request->validate([
            'client_id' => 'required|string',
            'client_secret' => 'nullable|string',
        ]);

        $clientId = trim($request->input('client_id'));
        $clientSecret = trim($request->input('client_secret', ''));

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

            $replaceOrAppend('LINKEDIN_CLIENT_ID', $clientId);
            if (!empty($clientSecret)) {
                $replaceOrAppend('LINKEDIN_CLIENT_SECRET', $clientSecret);
            }

            file_put_contents($envPath, $env);
            Artisan::call('config:clear');
        }

        return redirect()->back()->with('success', 'LinkedIn App credentials updated successfully!');
    }

    /**
     * Save LinkedIn Company Page / Organization settings.
     */
    public function savePageSettings(Request $request)
    {
        $request->validate([
            'organization_id' => 'nullable|string',
            'organization_name' => 'nullable|string',
            'post_as' => 'required|in:organization,person',
        ]);

        LinkedInAccount::ensureSchema();

        $account = LinkedInAccount::active() ?: LinkedInAccount::latest()->first();
        $rawOrg = trim((string) $request->input('organization_id'));
        $orgName = $request->input('organization_name');
        $orgUrn = null;

        if (!empty($rawOrg)) {
            // Strip full linkedin URL down to identifier
            if (preg_match('#linkedin\.com/company/([^/?]+)#i', $rawOrg, $matches)) {
                $rawOrg = trim($matches[1]);
            }

            if (is_numeric($rawOrg)) {
                $orgUrn = "urn:li:organization:{$rawOrg}";
            } elseif (str_starts_with($rawOrg, 'urn:li:organization:')) {
                $orgUrn = $rawOrg;
            } else {
                // Try resolving vanity slug via LinkedIn Organizations API if token available
                if ($account && !empty($account->access_token)) {
                    try {
                        $res = \Illuminate\Support\Facades\Http::withToken($account->access_token)
                            ->timeout(10)
                            ->get("https://api.linkedin.com/v2/organizations?q=vanityName&vanityName={$rawOrg}");

                        if ($res->successful()) {
                            $elements = $res->json('elements', []);
                            if (!empty($elements[0]['id'])) {
                                $orgUrn = "urn:li:organization:" . $elements[0]['id'];
                                if (empty($orgName) && !empty($elements[0]['localizedName'])) {
                                    $orgName = $elements[0]['localizedName'];
                                }
                            }
                        }
                    } catch (\Throwable $e) {
                        Log::warning('LinkedIn vanity lookup failed: ' . $e->getMessage());
                    }
                }

                if (!$orgUrn) {
                    $orgUrn = "urn:li:organization:{$rawOrg}";
                }
            }
        }

        try {
            if (!$account) {
                $availableCols = Schema::getColumnListing('linkedin_accounts');
                $initialData = [
                    'linkedin_person_id' => 'urn:li:person:pending_' . uniqid(),
                    'name' => $orgName ?: 'Coachings in Sikar',
                    'is_active' => true,
                ];
                if (in_array('organization_id', $availableCols)) $initialData['organization_id'] = $orgUrn;
                if (in_array('organization_name', $availableCols)) $initialData['organization_name'] = $orgName ?: 'Coachings in Sikar';
                if (in_array('post_as', $availableCols)) $initialData['post_as'] = $request->input('post_as', 'organization');

                $account = LinkedInAccount::create($initialData);
            } else {
                $account->safeUpdate([
                    'organization_id' => $orgUrn,
                    'organization_name' => $orgName ?: $account->organization_name,
                    'post_as' => $request->input('post_as', 'organization'),
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Saving LinkedIn page settings to database failed: ' . $e->getMessage());
        }

        // Permanently persist to .env so it never gets lost even after reconnecting or logging out
        if (!empty($orgUrn)) {
            try {
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
                    $replaceOrAppend('LINKEDIN_ORGANIZATION_ID', $orgUrn);
                    $replaceOrAppend('LINKEDIN_ORGANIZATION_NAME', $orgName ?: 'Coachings in Sikar');
                    file_put_contents($envPath, $env);
                    Artisan::call('config:clear');
                }
            } catch (\Throwable $e) {
                Log::warning('Saving LinkedIn org to .env failed: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('success', 'LinkedIn Organization ID & Page settings saved permanently!');
    }

    /**
     * Auto-fetch all managed LinkedIn Company Pages for the connected member.
     */
    public function fetchManagedPages(Request $request)
    {
        $account = LinkedInAccount::active();
        if (!$account || empty($account->access_token)) {
            return response()->json([
                'success' => false,
                'message' => 'Please connect your LinkedIn account first via the "Connect with LinkedIn" button.',
            ], 422);
        }

        try {
            $response = \Illuminate\Support\Facades\Http::withToken($account->access_token)
                ->timeout(15)
                ->withHeaders(['X-Restli-Protocol-Version' => '2.0.0'])
                ->get('https://api.linkedin.com/v2/organizationalEntityAcls?q=roleAssignee');

            if (!$response->successful()) {
                $err = $response->json('message') ?: $response->body();
                if (str_contains($err, 'Not enough permissions') || str_contains($err, 'organizationalEntityAcls')) {
                    return response()->json([
                        'success' => false,
                        'message' => 'LinkedIn Developer App me "Community Management API" permission approval pending hai. Kripya apna Organization ID ya Page URL niche ek baar enter karke "Save LinkedIn Page Settings" par click karein — ye permanent save ho jayega aur dobara kabhi nahi mangega!',
                    ], 200);
                }
                return response()->json([
                    'success' => false,
                    'message' => 'LinkedIn API: ' . $err,
                ], 400);
            }

            $elements = $response->json('elements', []);
            $pages = [];

            foreach ($elements as $el) {
                $targetUrn = $el['organizationalTarget'] ?? '';
                if (!empty($targetUrn) && str_contains($targetUrn, 'urn:li:organization:')) {
                    $orgId = str_replace('urn:li:organization:', '', $targetUrn);
                    $detailsRes = \Illuminate\Support\Facades\Http::withToken($account->access_token)
                        ->timeout(10)
                        ->get("https://api.linkedin.com/v2/organizations/{$orgId}");

                    if ($detailsRes->successful()) {
                        $orgData = $detailsRes->json();
                        $pages[] = [
                            'urn' => $targetUrn,
                            'id' => $orgId,
                            'name' => $orgData['localizedName'] ?? "Organization #{$orgId}",
                            'vanity_name' => $orgData['vanityName'] ?? null,
                            'role' => $el['role'] ?? 'ADMINISTRATOR',
                        ];
                    } else {
                        $pages[] = [
                            'urn' => $targetUrn,
                            'id' => $orgId,
                            'name' => "Organization #{$orgId}",
                            'vanity_name' => null,
                            'role' => $el['role'] ?? 'ADMINISTRATOR',
                        ];
                    }
                }
            }

            if (!empty($pages)) {
                $primary = $pages[0];
                $account->safeUpdate([
                    'organization_id' => $primary['urn'],
                    'organization_name' => $primary['name'],
                    'organization_vanity_name' => $primary['vanity_name'],
                    'post_as' => 'organization',
                ]);

                return response()->json([
                    'success' => true,
                    'message' => "Detected & linked: {$primary['name']} ({$primary['urn']})!",
                    'pages' => $pages,
                    'selected' => $primary,
                ]);
            }

            return response()->json([
                'success' => false,
                'message' => 'No managed LinkedIn Company Pages found where your account has an administrator role.',
                'pages' => [],
            ]);
        } catch (\Throwable $e) {
            Log::error('LinkedIn fetchManagedPages exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Error querying LinkedIn: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Disconnect active LinkedIn account.
     */
    public function disconnect(Request $request)
    {
        $account = LinkedInAccount::active();
        if ($account) {
            $account->update(['is_active' => false]);
        }

        return redirect()->back()->with('success', 'LinkedIn account disconnected.');
    }

    /**
     * Auto-generate a professional LinkedIn post draft for a blog post.
     */
    public function generateDraft(Request $request, $postId)
    {
        $post = Post::find($postId) ?: Post::where('slug', $postId)->first();
        $account = LinkedInAccount::active();

        if ($post) {
            $draft = $this->captionService->generateForPost($post);

            $share = LinkedInPostShare::where('post_id', $post->id)
                ->where('status', 'pending_approval')
                ->first();

            if (!$share && $account) {
                $share = LinkedInPostShare::create([
                    'post_id' => $post->id,
                    'linkedin_account_id' => $account->id,
                    'commentary' => $draft['commentary'],
                    'media_url' => $draft['image_url'] ?: '',
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
                    'name' => $account->name,
                ] : null,
            ]);
        }

        return response()->json([
            'success' => true,
            'share_id' => null,
            'draft' => [
                'commentary' => "🎓 Top Coaching & Education Updates in Sikar\n\nKey Takeaways:\n• Verified student benchmarks\n• Admissions criteria\n\n👉 Learn more: " . url('/'),
                'image_url' => null,
                'target_link' => url('/'),
            ],
            'account' => $account ? [
                'id' => $account->id,
                'name' => $account->name,
            ] : null,
        ]);
    }

    /**
     * Approve and publish a pending draft to LinkedIn.
     */
    public function approveAndPublish(Request $request)
    {
        $request->validate([
            'share_id' => 'nullable',
            'post_id' => 'nullable',
            'commentary' => 'required|string|max:3000',
            'media_url' => 'nullable|string',
            'target_link' => 'nullable|string',
            'title' => 'nullable|string',
        ]);

        $shareId = $request->input('share_id');
        $share = $shareId ? LinkedInPostShare::find($shareId) : null;
        $account = $share?->account ?: LinkedInAccount::active();

        if (!$account || !$account->access_token) {
            return response()->json([
                'success' => false,
                'message' => 'No active LinkedIn account connected. Connect with LinkedIn first.',
            ], 422);
        }

        $commentary = $request->input('commentary');
        $mediaUrl = $request->input('media_url') ?: ($share?->media_url);
        $targetLink = $request->input('target_link');
        $title = $request->input('title');

        if (!$share) {
            $share = LinkedInPostShare::create([
                'post_id' => $request->input('post_id'),
                'linkedin_account_id' => $account->id,
                'commentary' => $commentary,
                'media_url' => $mediaUrl,
                'status' => 'pending_approval',
            ]);
        }

        try {
            $result = $this->publishService->publishPost(
                $account,
                $commentary,
                $mediaUrl,
                $targetLink,
                $title
            );

            $share->update([
                'status' => 'published',
                'commentary' => $commentary,
                'media_url' => $mediaUrl,
                'share_urn' => $result['share_urn'],
                'permalink' => $result['permalink'],
                'published_by' => auth()->id(),
                'published_at' => now(),
                'error_message' => null,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Post successfully published to LinkedIn!',
                'share_urn' => $result['share_urn'],
                'permalink' => $result['permalink'],
            ]);
        } catch (\Throwable $e) {
            $share->update([
                'status' => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Publishing to LinkedIn failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Publish a custom standalone post directly to LinkedIn.
     */
    public function publishCustomPost(Request $request)
    {
        $request->validate([
            'commentary' => 'required|string|max:3000',
            'media_url' => 'nullable|string',
            'target_link' => 'nullable|string',
        ]);

        $account = LinkedInAccount::active();
        if (!$account || !$account->access_token) {
            return redirect()->back()->with('error', 'Connect a LinkedIn account first.');
        }

        $commentary = $request->input('commentary');
        $mediaUrl = $request->input('media_url');
        $targetLink = $request->input('target_link');

        try {
            $result = $this->publishService->publishPost(
                $account,
                $commentary,
                $mediaUrl,
                $targetLink
            );

            LinkedInPostShare::create([
                'linkedin_account_id' => $account->id,
                'commentary' => $commentary,
                'media_url' => $mediaUrl,
                'share_urn' => $result['share_urn'],
                'permalink' => $result['permalink'],
                'status' => 'published',
                'published_by' => auth()->id(),
                'published_at' => now(),
            ]);

            return redirect()->back()->with('success', 'Post published successfully to LinkedIn! View on LinkedIn: ' . $result['permalink']);
        } catch (\Throwable $e) {
            return redirect()->back()->with('error', 'Failed to publish to LinkedIn: ' . $e->getMessage());
        }
    }
}
