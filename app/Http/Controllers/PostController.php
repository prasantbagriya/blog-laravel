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
        $communities = Community::orderBy('name')->get(['id', 'name', 'display_name']);
        
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
            $path = $file->store('uploads', 'public');
            $mediaUrls = json_encode(['/storage/' . $path]);
            
            if (str_starts_with($file->getMimeType(), 'video/')) {
                $postType = 'VIDEO';
            } else {
                $postType = 'IMAGE';
            }
        }

        $post = Post::create([
            'community_id' => $validated['community_id'],
            'author_id' => auth()->id(),
            'title' => $validated['title'],
            'content' => $validated['content'] ?? null,
            'type' => $postType,
            'link_url' => $validated['link_url'] ?? null,
            'media_urls' => $mediaUrls,
            'score' => 1,
        ]);

        $community = Community::find($validated['community_id']);

        return redirect()->route('community.show', $community->name);
    }

    public function update(Request $request, Post $post)
    {
        if (auth()->id() !== $post->author_id) {
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
            'content' => $validated['content'] ?? null,
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
        $community = $post->community;

        // Fetch top level comments and eager load replies recursively
        $comments = \App\Models\Comment::with(['author', 'replies'])
            ->where('post_id', $post->id)
            ->whereNull('parent_id')
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
                'content' => $post->content,
                'type' => $post->type,
                'link_url' => $post->link_url,
                'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                'author' => ['username' => $post->getRelation('author') ? $post->getRelation('author')->username : 'deleted'],
                'score' => $post->score,
                'comments_count' => $post->comments()->count(),
                'created_at' => $post->created_at->diffForHumans(),
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
        $request->validate([
            'content' => 'required|string',
            'parent_id' => 'nullable|exists:comments,id'
        ]);

        $post = Post::findOrFail($postId);

        \App\Models\Comment::create([
            'post_id' => $post->id,
            'author_id' => auth()->id(),
            'parent_id' => $request->parent_id,
            'content' => $request->content,
            'score' => 1
        ]);

        return back();
    }

    public function destroy(Post $post)
    {
        if (auth()->id() !== $post->author_id) {
            abort(403);
        }

        $post->delete();
        return redirect()->route('feed');
    }
}
