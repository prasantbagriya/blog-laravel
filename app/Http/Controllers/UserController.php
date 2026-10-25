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

        $posts = $query->paginate(15);
        $postIds = $posts->pluck('id')->toArray();
        $savedPostIds = [];
        $userVotes = [];

        if (auth()->check()) {
            $savedPostIds = \Illuminate\Support\Facades\DB::table('saved_posts')
                ->where('user_id', auth()->id())
                ->whereIn('post_id', $postIds)
                ->pluck('post_id')
                ->toArray();
                
            $userVotes = \Illuminate\Support\Facades\DB::table('votes')
                ->where('user_id', auth()->id())
                ->where('votable_type', \App\Models\Post::class)
                ->whereIn('votable_id', $postIds)
                ->pluck('value', 'votable_id')
                ->toArray();
        }

        $posts->getCollection()->transform(function ($post) use ($savedPostIds, $userVotes) {
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
                    'is_saved' => in_array($post->id, $savedPostIds),
                    'user_vote' => $userVotes[$post->id] ?? 0,
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
                'post_karma' => $user->post_karma ?? 0,
                'comment_karma' => $user->comment_karma ?? 0,
            ],
            'posts' => $posts,
            'currentSort' => $sort,
            'meta' => [
                'title'       => $user->name . ' (@' . $user->username . ') | CoachingsinSikar',
                'description' => 'Check out ' . $user->name . '\'s profile on CoachingsinSikar. Read their posts, reviews, and updates about coaching institutes and schools in Sikar.',
                'og_title'    => $user->name . ' (@' . $user->username . ') | CoachingsinSikar',
                'og_image'    => $user->profile_picture ?? url('/uploads/social-cover.webp'),
                'url'         => url('/u/' . $user->username),
                'type'        => 'profile',
            ],
        ]);
    }
}
