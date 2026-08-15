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
        $sliders = \App\Models\Slider::where('active', true)->orderBy('order', 'asc')->get()->toArray();

        return Inertia::render('Welcome', [
            'featuredPost' => $featuredPost,
            'recentPosts' => $recentPosts,
            'publishedStories' => $publishedStories,
            'sliders' => $sliders,
            'meta' => [
                'title' => 'Coaching Sinsikar | Master Modern Web Dev & Advanced SEO 2026',
                'description' => 'Expert insights, visual web stories, and high-performance strategies to dominate Google search and AI overviews in 2026.',
            ]
        ]);
    }
}
