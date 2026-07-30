<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Story;

class HomeController extends Controller
{
    public function index()
    {
        $publishedPosts = Post::where('published', true)->orderBy('date', 'desc')->get()->toArray();
        
        $featuredPost = $publishedPosts[0] ?? null;
        $recentPosts = array_slice($publishedPosts, 1, 3);

        $publishedStories = Story::where('published', true)->take(4)->get()->toArray();

        return Inertia::render('Welcome', [
            'featuredPost' => $featuredPost,
            'recentPosts' => $recentPosts,
            'publishedStories' => $publishedStories,
        ]);
    }
}
