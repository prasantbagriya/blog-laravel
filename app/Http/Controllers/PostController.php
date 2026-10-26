<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PostController extends Controller
{
    public function create(Request $request)
    {
        $communityId = $request->query('community_id');
        $user = auth()->user();
        
        $communities = Community::where('owner_id', $user->id)
            ->orWhereHas('members', function($q) use ($user) {
                $q->where('user_id', $user->id);
            })
            ->orderBy('name')
            ->get(['id', 'name', 'display_name']);
        
        $editPostId = $request->query('edit');
        $editPost = null;
        
        if ($editPostId) {
            $post = Post::findOrFail($editPostId);
            if (auth()->id() !== $post->author_id) {
                abort(403);
            }
            $editPost = [
                'id' => $post->id,
                'community_id' => $post->community_id,
                'title' => $post->title,
                'content' => $post->content,
                'type' => $post->type,
                'link_url' => $post->link_url,
                'is_live_discussion' => $post->is_live_discussion,
            ];
        }

        return Inertia::render('Post/Create', [
            'communities' => $communities,
            'default_community_id' => $communityId,
            'editPost' => $editPost
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'title' => 'required|string|max:300',
            'type' => 'required|in:TEXT,MEDIA,LINK',
            'content' => 'required_if:type,TEXT|nullable|string',
            'link_url' => 'required_if:type,LINK|nullable|url',
            'media_file' => 'required_if:type,MEDIA|nullable|file|mimes:jpeg,png,jpg,gif,mp4,webm|max:20480',
        ]);

        $postType = $validated['type'];
        $mediaUrls = null;

        if ($request->hasFile('media_file')) {
            $file = $request->file('media_file');
            
            if (str_starts_with($file->getMimeType(), 'video/')) {
                $postType = 'VIDEO';
                $path = $file->store('videos', 'uploads');
                $mediaUrls = json_encode(['/uploads/' . $path]);
            } else {
                $postType = 'IMAGE';
                $imageService = app(\App\Services\ImageService::class);
                $result = $imageService->optimizeAndStore(
                    file: $file,
                    maxWidth: 1200,
                    quality: 82
                );
                $mediaUrls = json_encode([$result['url']]);
            }
        }
        
        $community = Community::find($validated['community_id']);
        $user = auth()->user();
        if ($community->owner_id !== $user->id && !$community->members()->where('user_id', $user->id)->exists()) {
            return back()->withErrors(['community_id' => 'You must join this community to post.']);
        }

        $post = Post::create([
            'community_id' => $validated['community_id'],
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => isset($validated['content']) ? clean($validated['content']) : null,
            'type' => $postType,
            'link_url' => $validated['link_url'] ?? null,
            'media_urls' => $mediaUrls,
            'score' => 1,
            'published' => true,
            'is_live_discussion' => $request->boolean('is_live_discussion', false),
        ]);

        \Illuminate\Support\Facades\DB::table('votes')->insert([
            'user_id' => auth()->id(),
            'votable_type' => Post::class,
            'votable_id' => $post->id,
            'value' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $community = Community::find($validated['community_id']);

        return redirect()->route('community.show', $community->name);
    }

    public function update(Request $request, Post $post)
    {
        $user = auth()->user();
        $canAdminister = in_array($user->role, ['admin', 'super_admin'], true) || (bool) $user->getAttribute('is_admin');
        if ($user->id !== $post->author_id && !$canAdminister) {
            abort(403);
        }

        $validated = $request->validate([
            'community_id' => 'required|exists:communities,id',
            'title' => 'required|string|max:300',
            'type' => 'required|in:TEXT,MEDIA,LINK',
            'content' => 'required_if:type,TEXT|nullable|string',
            'link_url' => 'required_if:type,LINK|nullable|url',
        ]);

        // We only allow updating text or links easily for now to prevent complex media editing
        $post->update([
            'community_id' => $validated['community_id'],
            'title' => $validated['title'],
            'content' => isset($validated['content']) ? clean($validated['content']) : null,
            'type' => $validated['type'],
            'link_url' => $validated['link_url'] ?? null,
        ]);

        return redirect()->route('post.show', ['community' => $post->community->name, 'post' => $post->id]);
    }

    public function toggleSave(Request $request, Post $post)
    {
        $user = $request->user();
        
        if ($user->savedPosts()->where('post_id', $post->id)->exists()) {
            $user->savedPosts()->detach($post->id);
            $isSaved = false;
        } else {
            $user->savedPosts()->attach($post->id);
            $isSaved = true;
        }

        return redirect()->back();
    }

    public function show($communityName, $id)
    {
        $post = Post::with(['author', 'community'])->findOrFail($id);
        
        // If post does not belong to a community (e.g. blog post), redirect to canonical path
        if (!$post->community_id || !$post->community) {
            return redirect($post->url_path, 301);
        }

        $community = $post->community;

        $comments = \App\Models\Comment::with(['author', 'replies', 'replies.author'])
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
            ->where('is_spam', false)
            ->orderBy('is_pinned', 'desc')
            ->orderByRaw('CASE WHEN author_id = ? THEN 1 ELSE 0 END DESC', [$post->author_id])
            ->orderBy('created_at', 'desc')
            ->get();

        $userCommentVotes = [];
        if (auth()->check()) {
            $userCommentVotes = \Illuminate\Support\Facades\DB::table('votes')
                ->where('user_id', auth()->id())
                ->where('votable_type', \App\Models\Comment::class)
                ->pluck('value', 'votable_id')
                ->toArray();
        }

        return Inertia::render('Post/Show', [
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name ?: 'r/' . $community->name,
                'description' => $community->description,
                'icon_image' => $community->icon_image,
            ],
            'post' => [
                'id' => $post->id,
                'title' => $post->title,
                'excerpt' => $post->excerpt,
                'content' => $post->content,
                'type' => $post->type,
                'link_url' => $post->link_url,
                'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                'author' => ['username' => $post->getRelation('author') ? $post->getRelation('author')->username : 'deleted'],
                'author_id' => $post->author_id,
                'score' => $post->score,
                'comments_count' => $post->comments()->count(),
                'created_at' => $post->created_at->diffForHumans(),
                'published_at' => $post->created_at->toIso8601String(),
                'slug' => \Illuminate\Support\Str::slug($post->title),
                'is_saved' => auth()->check() ? auth()->user()->savedPosts()->where('post_id', $post->id)->exists() : false,
                'user_vote' => auth()->check() ? \Illuminate\Support\Facades\DB::table('votes')->where('user_id', auth()->id())->where('votable_type', \App\Models\Post::class)->where('votable_id', $post->id)->value('value') : 0,
            ],
            'comments' => $comments,
            'userCommentVotes' => $userCommentVotes
        ]);
    }

    public function storeComment(Request $request, $postId)
    {
        // Rate Limiting: 3 comments per minute per user
        $rateLimitKey = 'comment_store_' . auth()->id();
        if (\Illuminate\Support\Facades\RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            return back()->withErrors(['content' => 'You are posting comments too fast. Please wait a moment.']);
        }
        \Illuminate\Support\Facades\RateLimiter::hit($rateLimitKey, 60);

        $request->validate([
            'content' => 'required|string|max:3000',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $post = Post::findOrFail($postId);

        if ($request->filled('parent_id')) {
            $parentExistsOnPost = \App\Models\Comment::where('id', $request->parent_id)
                ->where('post_id', $post->id)
                ->exists();
            if (!$parentExistsOnPost) {
                return back()->withErrors(['parent_id' => 'The selected parent comment does not belong to this post.']);
            }
        }
        $rawContent = $request->content;
        $safeContent = clean(strip_tags($rawContent));

        // Duplicate Detection: Exact match in the last 15 minutes
        $isDuplicate = \App\Models\Comment::where('author_id', auth()->id())
            ->where('post_id', $post->id)
            ->where('content', $safeContent)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->exists();
            
        if ($isDuplicate) {
            return back()->withErrors(['content' => 'You have already posted this comment recently.']);
        }

        // Spam Filter: Prevent bot link spam
        $urlCount = substr_count(strtolower($rawContent), 'http');
        $isSpam = $urlCount > 2;
        $spamReason = $isSpam ? 'Too many URLs detected' : null;

        $comment = \App\Models\Comment::create([
            'post_id' => $post->id,
            'author_id' => auth()->id(),
            'parent_id' => $request->parent_id,
            'content' => $safeContent,
            'score' => 1,
            'is_spam' => $isSpam,
            'spam_reason' => $spamReason,
            'status' => $isSpam ? 'spam' : 'published',
        ]);

        $comment->load('author', 'replies');

        // try {
        //     broadcast(new \App\Events\CommentPosted($comment))->toOthers();
        // } catch (\Exception $e) {
        //     \Illuminate\Support\Facades\Log::error('Broadcasting failed: ' . $e->getMessage());
        // }

        return back();
    }

    public function destroy(Post $post)
    {
        $user = auth()->user();
        $isAuthorized = $user->id === $post->author_id 
            || in_array($user->role, ['admin', 'super_admin'], true) 
            || (bool) $user->getAttribute('is_admin')
            || ($post->community_id && $post->community && $post->community->moderators()->where('user_id', $user->id)->exists());

        if (!$isAuthorized) {
            abort(403);
        }

        $post->delete();
        return redirect()->route('feed');
    }

    public function uploadImage(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,webp|max:20480',
        ]);

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            
            try {
                $imageService = app(\App\Services\ImageService::class);
                $result = $imageService->optimizeAndStore(
                    file: $file,
                    maxWidth: 1200,
                    quality: 82
                );
                
                return response()->json([
                    'success' => true,
                    'url' => $result['url'],
                    'full_url' => $result['full_url'],
                    'filename' => $result['filename']
                ]);
            } catch (\Exception $e) {
                return response()->json(['success' => false, 'error' => 'Image processing failed: ' . $e->getMessage()], 500);
            }
        }

        return response()->json(['success' => false, 'error' => 'No file uploaded'], 400);
    }

    public function togglePin(Request $request, $id)
    {
        $comment = \App\Models\Comment::findOrFail($id);
        $post = $comment->post;
        $user = $request->user();

        // Allow if user is the post author, moderator, or an admin
        $canAdminister = in_array($user->role, ['admin', 'super_admin'], true) || (bool) $user->getAttribute('is_admin');
        if ($post->author_id !== $user->id && !$canAdminister) {
            abort(403, 'Unauthorized action.');
        }

        $comment->is_pinned = !$comment->is_pinned;
        $comment->save();

        return back();
    }
}
