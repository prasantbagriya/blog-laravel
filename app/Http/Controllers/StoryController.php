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
            'stories' => $stories,
            'meta'    => [
                'title'       => 'Visual Web Stories',
                'h1'          => 'Visual Web Stories',
                'description' => 'Explore bite-sized visual web stories on JEE, NEET, CA, CLAT, schools, and top coaching institutes in Sikar from CoachingsinSikar.',
                'url'         => url('/stories'),
                'type'        => 'website',
            ],
        ]);
    }

    public function show($slug)
    {
        $story = Story::where('slug', $slug)->first();

        if (!$story) {
            abort(404);
        }

        return view('story.amp', [
            'story' => $story
        ]);
    }
}
