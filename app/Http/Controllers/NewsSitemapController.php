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
                     ->whereNull('community_id') // Exclude forum/community posts
                     ->where('date', '>=', now()->subDays(2)) // Use 'date' as it is the official publication date field
                     ->orderBy('date', 'desc')
                     ->get();

        // Fallback: If no posts in the last 48 hours, get the latest 1 post 
        // to prevent Google Search Console "Missing XML tag" error (urlset must have at least one url)
        if ($posts->isEmpty()) {
            $posts = Post::where('published', true)
                         ->where('isNoIndex', false)
                         ->whereNull('community_id')
                         ->orderBy('date', 'desc')
                         ->take(1)
                         ->get();
        }

        return response()->view('sitemap.news', [
            'posts' => $posts,
        ])->header('Content-Type', 'text/xml');
    }
}
