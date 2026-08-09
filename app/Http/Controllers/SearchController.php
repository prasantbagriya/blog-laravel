<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Inertia\Inertia;
use App\Models\Post;
use App\Models\Community;
use App\Models\User;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $q = $request->q;

        if (!$q) {
            return Inertia::render('Search/Index', [
                'posts' => [],
                'communities' => [],
                'users' => [],
                'query' => ''
            ]);
        }

        $posts = Post::with(['author', 'community'])
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
            'communities' => $communities,
            'users' => $users,
            'query' => $q
        ]);
    }
}
