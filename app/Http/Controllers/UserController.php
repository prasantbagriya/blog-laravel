<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function show(Request $request, $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        
        $sort = $request->query('sort', 'new');

        $query = Post::with(['author', 'community'])
            ->withCount('comments')
            ->where('author_id', $user->id)
            ->published();

        if ($sort === 'top') {
            $query->orderBy('score', 'desc');
        } elseif ($sort === 'hot') {
            $query->orderBy('score', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $posts = $query->paginate(15)
            ->through(function ($post) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'type' => $post->type,
                    'link_url' => $post->link_url,
                    'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                    'community' => $post->community ? $post->community->name : '',
                    'author' => [
                        'username' => $post->getRelation('author') ? $post->getRelation('author')->username : 'deleted',
                        'flair' => $post->getRelation('author') ? $post->getRelation('author')->flair : null
                    ],
                    'flair' => $post->flair,
                    'score' => $post->score,
                    'comments_count' => $post->comments_count,
                    'created_at' => $post->created_at->diffForHumans(),
                    'slug' => \Illuminate\Support\Str::slug($post->title),
                    'is_saved' => auth()->check() ? auth()->user()->savedPosts()->where('post_id', $post->id)->exists() : false,
                    'user_vote' => auth()->check() ? \Illuminate\Support\Facades\DB::table('votes')->where('user_id', auth()->id())->where('votable_type', \App\Models\Post::class)->where('votable_id', $post->id)->value('value') : 0,
                ];
            });

        return Inertia::render('User/Show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'bio' => $user->bio,
                'profile_picture' => $user->profile_picture,
                'banner_image' => $user->banner_image,
                'created_at' => $user->created_at->format('M j, Y'),
            ],
            'posts' => $posts,
            'currentSort' => $sort,
        ]);
    }
}
