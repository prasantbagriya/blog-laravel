<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function feed()
    {
        $posts = Post::with(['author', 'community'])
            ->withCount('comments')
            ->whereNotNull('community_id')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'type' => $post->type,
                    'link_url' => $post->link_url,
                    'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                    'community' => $post->community ? $post->community->name : '',
                    'author' => ['username' => $post->getRelation('author') ? $post->getRelation('author')->username : 'deleted'],
                    'score' => $post->score,
                    'comments_count' => $post->comments_count,
                    'created_at' => $post->created_at->diffForHumans(),
                    'slug' => \Illuminate\Support\Str::slug($post->title),
                    'is_saved' => auth()->check() ? auth()->user()->savedPosts()->where('post_id', $post->id)->exists() : false,
                    'user_vote' => auth()->check() ? \Illuminate\Support\Facades\DB::table('votes')->where('user_id', auth()->id())->where('votable_type', \App\Models\Post::class)->where('votable_id', $post->id)->value('value') : 0,
                ];
            });

        return Inertia::render('Community/Feed', [
            'posts' => $posts
        ]);
    }

    public function show($name)
    {
        $community = Community::where('name', $name)->firstOrFail();
        
        $posts = Post::with('author')
            ->withCount('comments')
            ->where('community_id', $community->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'type' => $post->type,
                    'link_url' => $post->link_url,
                    'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                    'author' => ['username' => $post->getRelation('author') ? $post->getRelation('author')->username : 'deleted'],
                    'score' => $post->score,
                    'comments_count' => $post->comments_count,
                    'created_at' => $post->created_at->diffForHumans(),
                    'slug' => \Illuminate\Support\Str::slug($post->title),
                    'is_saved' => auth()->check() ? auth()->user()->savedPosts()->where('post_id', $post->id)->exists() : false,
                    'user_vote' => auth()->check() ? \Illuminate\Support\Facades\DB::table('votes')->where('user_id', auth()->id())->where('votable_type', \App\Models\Post::class)->where('votable_id', $post->id)->value('value') : 0,
                ];
            });

        return Inertia::render('Community/Show', [
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name ?: 'r/' . $community->name,
                'description' => $community->description,
                'banner_image' => $community->banner_image,
                'icon_image' => $community->icon_image,
                'members_count' => 1,
                'online_count' => 1,
            ],
            'posts' => $posts
        ]);
    }

    public function create()
    {
        return Inertia::render('Community/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:21|unique:communities,name|regex:/^[a-zA-Z0-9_]+$/',
            'display_name' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
        ]);

        $community = Community::create([
            'name' => strtolower($validated['name']),
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
            'owner_id' => auth()->id(),
        ]);

        return redirect()->route('community.show', $community->name);
    }
}
