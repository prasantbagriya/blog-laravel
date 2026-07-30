<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;

class BlogController extends Controller
{
    public function index()
    {
        $allPosts = Post::where('published', true)->orderBy('date', 'desc')->get()->toArray();

        return Inertia::render('Blog/Index', [
            'posts' => $allPosts
        ]);
    }

    public function show($slug)
    {
        $post = Post::where('slug', $slug)->first();

        if (!$post) {
            abort(404);
        }

        return Inertia::render('Blog/Show', [
            'post' => $post->toArray()
        ]);
    }
}
