<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Post;
use App\Models\Community;
use App\Models\User;
use App\Models\Business;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->q;

        if (!$q) {
            return Inertia::render('Search/Index', [
                'posts' => [],
                'blogs' => [],
                'businesses' => [],
                'communities' => [],
                'users' => [],
                'query' => ''
            ]);
        }

        // Community Posts
        $posts = Post::with(['author', 'community'])
            ->whereNotNull('community_id')
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhere('content', 'like', "%{$q}%");
            })
            ->where(function ($query) {
                $query->whereNull('status')
                      ->orWhereNotIn('status', ['removed', 'spam']);
            })
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get();

        // Blog Posts
        $blogs = Post::with(['author'])
            ->whereNull('community_id')
            ->where('published', true)
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhere('content', 'like', "%{$q}%");
            })
            ->orderBy('date', 'desc')
            ->limit(20)
            ->get();

        // Institutes/Businesses
        $businesses = Business::where('name', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->orWhere('category', 'like', "%{$q}%")
            ->limit(20)
            ->get();

        $communities = Community::where('name', 'like', "%{$q}%")
            ->orWhere('display_name', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->limit(10)
            ->get();

        $users = User::where('username', 'like', "%{$q}%")
            ->limit(10)
            ->get();

        return Inertia::render('Search/Index', [
            'posts' => $posts,
            'blogs' => $blogs,
            'businesses' => $businesses,
            'communities' => $communities,
            'users' => $users,
            'query' => $q
        ]);
    }

    public function suggestions(Request $request)
    {
        $q = $request->q;
        if (!$q) return response()->json(['categories' => [], 'businesses' => [], 'blogs' => []]);

        $categories = \App\Models\Category::where('name', 'like', "%{$q}%")
            ->select('id', 'name', 'slug')
            ->limit(4)->get();

        $businesses = Business::where('name', 'like', "%{$q}%")
            ->orWhere('category', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->select('id', 'name', 'slug', 'category', 'logo')
            ->limit(5)->get();
        
        $blogs = Post::whereNull('community_id')->where('published', true)
            ->where(function ($query) use ($q) {
                $query->where('title', 'like', "%{$q}%")
                      ->orWhere('content', 'like', "%{$q}%");
            })
            ->limit(3)->get()->map(function($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'slug' => $post->slug,
                    'excerpt' => $post->excerpt ?? \Illuminate\Support\Str::limit(strip_tags($post->content ?? ''), 80)
                ];
            });

        $communities = Community::where('name', 'like', "%{$q}%")
            ->orWhere('display_name', 'like', "%{$q}%")
            ->orWhere('description', 'like', "%{$q}%")
            ->withCount('members')
            ->limit(3)->get()->map(function($community) {
                return [
                    'id' => $community->id,
                    'name' => $community->name,
                    'display_name' => $community->display_name,
                    'members' => $community->members_count
                ];
            });

        return response()->json([
            'categories' => $categories,
            'businesses' => $businesses,
            'blogs' => $blogs,
            'communities' => $communities
        ]);
    }
}
