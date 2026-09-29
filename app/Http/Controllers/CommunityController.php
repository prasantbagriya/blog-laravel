<?php

namespace App\Http\Controllers;

use App\Models\Community;
use App\Models\Post;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityController extends Controller
{
    public function feed(Request $request)
    {
        $sort = $request->query('sort', 'new');
        $filter = $request->query('filter', 'home');

        $query = Post::with(['author', 'community'])
            ->withCount('comments')
            ->whereNotNull('community_id')
            ->where(function ($q) {
                $q->whereNull('status')->orWhereNotIn('status', ['removed', 'spam']);
            });

        if (auth()->check() && $filter !== 'popular') {
            $joinedCommunityIds = auth()->user()->communities()->pluck('communities.id');
            if ($joinedCommunityIds->isNotEmpty()) {
                $query->whereIn('community_id', $joinedCommunityIds);
            }
        }

        if ($sort === 'top') {
            $query->orderBy('score', 'desc');
        } elseif ($sort === 'hot') {
            $query->orderBy('score', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginated = $query->paginate(15);
        
        $savedPostIds = [];
        $userVotes = [];

        if (auth()->check()) {
            $postIds = $paginated->pluck('id')->toArray();
            $savedPostIds = auth()->user()->savedPosts()->whereIn('post_id', $postIds)->pluck('post_id')->toArray();
            $userVotes = \Illuminate\Support\Facades\DB::table('votes')
                ->where('user_id', auth()->id())
                ->where('votable_type', \App\Models\Post::class)
                ->whereIn('votable_id', $postIds)
                ->pluck('value', 'votable_id')
                ->toArray();
        }

        $posts = $paginated->through(function ($post) use ($savedPostIds, $userVotes) {
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

        return Inertia::render('Community/Feed', [
            'posts' => $posts,
            'currentSort' => $sort,
            'currentFilter' => $filter,
        ]);
    }

    public function show(Request $request, $name)
    {
        $community = Community::where('name', $name)->firstOrFail();
        
        $sort = $request->query('sort', 'new');

        $query = Post::with('author')
            ->withCount('comments')
            ->where('community_id', $community->id)
            ->where(function ($q) {
                $q->whereNull('status')->orWhereNotIn('status', ['removed', 'spam']);
            });

        if ($sort === 'top') {
            $query->orderBy('score', 'desc');
        } elseif ($sort === 'hot') {
            $query->orderBy('score', 'desc')->orderBy('created_at', 'desc');
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $paginated = $query->paginate(15);
        
        $savedPostIds = [];
        $userVotes = [];

        if (auth()->check()) {
            $postIds = $paginated->pluck('id')->toArray();
            $savedPostIds = auth()->user()->savedPosts()->whereIn('post_id', $postIds)->pluck('post_id')->toArray();
            $userVotes = \Illuminate\Support\Facades\DB::table('votes')
                ->where('user_id', auth()->id())
                ->where('votable_type', \App\Models\Post::class)
                ->whereIn('votable_id', $postIds)
                ->pluck('value', 'votable_id')
                ->toArray();
        }

        $posts = $paginated->through(function ($post) use ($savedPostIds, $userVotes, $community) {
                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'content' => $post->content,
                    'type' => $post->type,
                    'link_url' => $post->link_url,
                    'media_urls' => is_string($post->media_urls) ? json_decode($post->media_urls) : $post->media_urls,
                    'community' => $community->name,
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

        return Inertia::render('Community/Show', [
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name ?: 'r/' . $community->name,
                'description' => $community->description,
                'banner_image' => $community->banner_image,
                'icon_image' => $community->icon_image,
                'members_count' => $community->members()->count(),
                'online_count' => 1,
                'is_member' => auth()->check() ? $community->members()->where('user_id', auth()->id())->exists() : false,
                'is_owner' => auth()->check() ? auth()->id() === $community->owner_id : false,
                'is_moderator' => auth()->check() ? $community->moderators()->where('user_id', auth()->id())->exists() : false,
            ],
            'posts' => $posts,
            'currentSort' => $sort,
        ]);
    }

    public function create()
    {
        return Inertia::render('Community/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:21|unique:communities,name|regex:/^[a-zA-Z0-9_]+$/',
            'display_name' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
        ]);

        $community = Community::create([
            'name' => strtolower($validated['name']),
            'display_name' => $validated['display_name'],
            'description' => $validated['description'],
            'owner_id' => auth()->id(),
        ]);

        return redirect()->route('community.show', $community->name);
    }

    public function join(Community $community)
    {
        $user = auth()->user();
        if ($community->members()->where('user_id', $user->id)->exists()) {
            $community->members()->detach($user->id);
        } else {
            $community->members()->attach($user->id);
        }

        return back();
    }

    public function edit(Community $community)
    {
        $user = auth()->user();
        $isOwner = $community->owner_id === $user->id;
        $isModerator = $community->moderators()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isModerator) {
            abort(403);
        }

        return Inertia::render('Community/Edit', [
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name,
                'description' => $community->description,
                'banner_image' => $community->banner_image,
                'icon_image' => $community->icon_image,
            ]
        ]);
    }

    public function update(Request $request, Community $community)
    {
        $user = auth()->user();
        $isOwner = $community->owner_id === $user->id;
        $isModerator = $community->moderators()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isModerator) {
            abort(403);
        }

        $validated = $request->validate([
            'display_name' => 'nullable|string|max:50',
            'description' => 'nullable|string|max:500',
            'banner_image' => 'nullable|url|max:2048',
            'icon_image' => 'nullable|url|max:2048',
        ]);

        $community->update($validated);

        return redirect()->route('community.show', $community->name);
    }

    public function modqueue(Community $community)
    {
        $user = auth()->user();
        $isOwner = $community->owner_id === $user->id;
        $isModerator = $community->moderators()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isModerator) {
            abort(403);
        }

        $reports = \App\Models\Report::with(['user', 'reportable.author'])
            ->where('community_id', $community->id)
            ->where('status', 'pending')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('Community/ModQueue', [
            'community' => [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name,
            ],
            'reports' => $reports,
        ]);
    }

    public function approveReport(Request $request, \App\Models\Report $report)
    {
        $community = $report->community;
        $user = auth()->user();
        $isOwner = $community && $community->owner_id === $user->id;
        $isModerator = $community && $community->moderators()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isModerator) {
            abort(403);
        }

        $reportable = $report->reportable;
        if ($reportable) {
            $reportable->update(['status' => 'published']);
            \App\Models\Report::where('reportable_id', $reportable->id)
                ->where('reportable_type', $report->reportable_type)
                ->update(['status' => 'resolved']);
        }

        return back();
    }

    public function removeReport(Request $request, \App\Models\Report $report)
    {
        $community = $report->community;
        $user = auth()->user();
        $isOwner = $community && $community->owner_id === $user->id;
        $isModerator = $community && $community->moderators()->where('user_id', $user->id)->exists();

        if (!$isOwner && !$isModerator) {
            abort(403);
        }

        $reportable = $report->reportable;
        if ($reportable) {
            $reportable->update(['status' => 'removed']);
            \App\Models\Report::where('reportable_id', $reportable->id)
                ->where('reportable_type', $report->reportable_type)
                ->update(['status' => 'resolved']);
        }

        return back();
    }
}
