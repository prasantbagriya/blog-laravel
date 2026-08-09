<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Post;
use Illuminate\Http\Request;

class RssController extends Controller
{
    public function communityFeed($name)
    {
        $community = Community::where('name', $name)->firstOrFail();
        
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
}
