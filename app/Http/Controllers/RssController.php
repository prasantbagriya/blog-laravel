<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Post;
use Illuminate\Http\Request;

class RssController extends Controller
{
    public function communityFeed($name)
    {
        // Look up by slug first (URL-friendly), then fall back to exact name match.
        // Using abort(404) instead of firstOrFail() so the app returns a proper
        // 404 response rather than an unhandled ModelNotFoundException (500).
        $community = Community::where('slug', $name)
            ->orWhere('name', $name)
            ->first();

        if (! $community) {
            abort(404, 'Community not found');
        }

        $posts = Post::where('community_id', $community->id)
            ->where('published', true)
            ->where('isNoIndex', false)
            ->orderBy('created_at', 'desc')
            ->take(20)
            ->get();

        return response()->view('rss.feed', [
            'community' => $community,
            'posts' => $posts
        ])->header('Content-Type', 'application/rss+xml; charset=utf-8');
    }
    public function blogFeed()
    {
        $posts = Post::where('published', true)
            ->whereNull('community_id')
            ->where('isNoIndex', false)
            ->orderBy('date', 'desc')
            ->take(30)
            ->get();

        return response()->view('rss.blog', [
            'posts' => $posts
        ])->header('Content-Type', 'application/rss+xml; charset=utf-8');
    }
}
