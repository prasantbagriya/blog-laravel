<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;

class NewsSitemapController extends Controller
{
    public function index()
    {
        // Google News Sitemap requires articles from the last 48 hours
        $posts = Post::where('published', true)
                     ->where('isNoIndex', false)
                     ->where('created_at', '>=', now()->subDays(2))
                     ->orderBy('created_at', 'desc')
                     ->get();

        return response()->view('sitemap.news', [
            'posts' => $posts,
        ])->header('Content-Type', 'text/xml');
    }
}
