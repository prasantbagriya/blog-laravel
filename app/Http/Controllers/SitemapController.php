<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Category;
use App\Models\Community;
use App\Models\Author;
use App\Models\Story;

class SitemapController extends Controller
{
    public function index()
    {
        $baseQuery = Post::where('published', true)->where('isNoIndex', false)->orderBy('updated_at', 'desc');
        $blogPosts = (clone $baseQuery)->whereNull('community_id')->get();
        $communityPosts = (clone $baseQuery)->whereNotNull('community_id')->with('community')->get();
        
        $categories = Category::orderBy('updated_at', 'desc')->get();
        $communities = Community::orderBy('updated_at', 'desc')->get();
        $authors = Author::orderBy('updated_at', 'desc')->get();
        $stories = Story::where('published', true)->orderBy('updated_at', 'desc')->get();

        return response()->view('sitemap.index', [
            'blogPosts' => $blogPosts,
            'communityPosts' => $communityPosts,
            'categories' => $categories,
            'communities' => $communities,
            'authors' => $authors,
            'stories' => $stories,
        ])->header('Content-Type', 'text/xml');
    }
}
