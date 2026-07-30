<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Story;

class StoryController extends Controller
{
    public function index()
    {
        $stories = Story::where('published', true)->get()->toArray();

        return Inertia::render('Story/Index', [
            'stories' => $stories
        ]);
    }

    public function show($slug)
    {
        $story = Story::where('slug', $slug)->first();

        if (!$story) {
            abort(404);
        }

        return Inertia::render('Story/Show', [
            'story' => $story->toArray()
        ]);
    }
}
