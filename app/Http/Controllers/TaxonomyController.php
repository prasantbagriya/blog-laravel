<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Author;

class TaxonomyController extends Controller
{
    public function categoryIndex()
    {
        $categories = \App\Models\Category::all()->toArray();
        return Inertia::render('Category/Index', [
            'categories' => $categories
        ]);
    }

    public function categoryShow($slug)
    {
        // Simple matching for category (in the old code it was a string matching)
        $target = strtolower(str_replace('-', ' ', $slug));
        
        $posts = Post::where('published', true)
                     ->where('category', 'LIKE', '%' . $target . '%')
                     ->get()
                     ->toArray();

        return Inertia::render('Category/Show', [
            'categoryName' => ucwords(str_replace('-', ' ', $slug)),
            'posts' => $posts
        ]);
    }

    public function authorIndex()
    {
        $authors = Author::all()->toArray();
        return Inertia::render('Author/Index', [
            'authors' => $authors
        ]);
    }

    public function authorShow($slug)
    {
        $author = Author::where('slug', $slug)->first();
        
        if (!$author) {
            abort(404);
        }

        $posts = Post::where('published', true)
                     ->where('author', $author->name)
                     ->get()
                     ->toArray();

        return Inertia::render('Author/Show', [
            'author' => $author->toArray(),
            'posts' => $posts
        ]);
    }
}
