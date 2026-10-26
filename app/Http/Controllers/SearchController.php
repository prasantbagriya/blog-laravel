<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Community;
use App\Models\User;
use App\Models\Business;
use App\Models\Category;

class SearchController extends Controller
{
    protected static ?array $postSearchableColumns = null;

    /**
     * Get valid searchable columns on the posts table that actually exist in the database.
     */
    protected function getPostSearchableColumns(): array
    {
        if (static::$postSearchableColumns !== null) {
            return static::$postSearchableColumns;
        }

        try {
            $allColumns = Schema::getColumnListing('posts');
            $candidates = ['title', 'content', 'category', 'excerpt', 'keywords', 'focusKeyword', 'focus_keyword'];
            $valid = array_values(array_intersect($candidates, $allColumns));

            static::$postSearchableColumns = !empty($valid) ? $valid : ['title', 'content', 'category', 'excerpt'];
        } catch (\Throwable $e) {
            static::$postSearchableColumns = ['title', 'content', 'category', 'excerpt'];
        }

        return static::$postSearchableColumns;
    }
    /**
     * Parse raw search query into clean tokens, stop words, and core keywords.
     */
    protected function parseSearchTerms(string $rawQuery): array
    {
        $clean = preg_replace('/[^\p{L}\p{N}\s\-]/u', ' ', $rawQuery);
        $clean = preg_replace('/\s+/', ' ', trim((string) $clean));
        $lower = mb_strtolower($clean);

        if (empty($lower)) {
            return [
                'raw' => '',
                'clean' => '',
                'lower' => '',
                'words' => [],
                'contentKeywords' => [],
                'coreKeywords' => [],
                'isGenericPortalQuery' => false,
            ];
        }

        $allWords = array_values(array_filter(explode(' ', $lower), fn($w) => mb_strlen($w) >= 2));

        $stopWords = ['in', 'at', 'of', 'for', 'the', 'a', 'an', 'to', 'and', 'is', 'on', 'with', 'by', 'from', 'near', 'me', 'rajasthan', 'city', 'district', 'area'];
        $intentWords = ['best', 'top', 'good', 'famous', 'popular', 'list', 'review', 'reviews', 'fee', 'fees', 'contact', 'admission', 'admissions', 'result', 'results', 'ranking', 'rankings', 'compare', 'guide', 'which', 'how', 'about', 'center', 'centre', 'centres', 'centers', 'coaching', 'coachings', 'institute', 'institutes', 'classes', 'academy'];
        $portalNameWords = ['sikar', 'coachingsinsikar', 'coachinginsikar'];

        // Content keywords (drop pure stop words)
        $contentKeywords = array_values(array_filter($allWords, fn($w) => !in_array($w, $stopWords, true)));

        // Core keywords (drop stop words, intent words, and portal location 'sikar')
        $coreKeywords = array_values(array_filter($contentKeywords, fn($w) => !in_array($w, $intentWords, true) && !in_array($w, $portalNameWords, true)));

        // Is this a broad portal-wide query like "coaching in sikar", "best coaching", "top institutes"?
        $isGenericPortalQuery = empty($coreKeywords) && (
            in_array('coaching', $allWords, true) ||
            in_array('coachings', $allWords, true) ||
            in_array('institute', $allWords, true) ||
            in_array('institutes', $allWords, true) ||
            in_array('sikar', $allWords, true) ||
            in_array('best', $allWords, true) ||
            in_array('top', $allWords, true)
        );

        return [
            'raw' => $rawQuery,
            'clean' => $clean,
            'lower' => $lower,
            'words' => $allWords,
            'contentKeywords' => $contentKeywords,
            'coreKeywords' => $coreKeywords,
            'isGenericPortalQuery' => $isGenericPortalQuery,
        ];
    }

    /**
     * Search businesses / institutes with high precision and relevance ranking.
     */
    protected function searchBusinesses(array $parsed, int $limit = 24)
    {
        $clean = $parsed['clean'];
        $lower = $parsed['lower'];
        $coreKeywords = $parsed['coreKeywords'];
        $contentKeywords = $parsed['contentKeywords'];
        $isGeneric = $parsed['isGenericPortalQuery'];

        $query = Business::query();

        if ($isGeneric) {
            return $query->orderBy('is_verified', 'desc')
                ->orderBy('rating', 'desc')
                ->orderBy('review_count', 'desc')
                ->limit($limit)
                ->get();
        }

        $searchTerms = !empty($coreKeywords) ? $coreKeywords : $contentKeywords;
        if (empty($searchTerms)) {
            $searchTerms = !empty($clean) ? [$clean] : [];
        }

        if (empty($searchTerms)) {
            return collect();
        }

        $query->where(function ($sub) use ($clean, $searchTerms) {
            // Full phrase search
            $sub->where('name', 'like', "%{$clean}%")
                ->orWhere('category_name', 'like', "%{$clean}%")
                ->orWhere('subcategory', 'like', "%{$clean}%")
                ->orWhere('category', 'like', "%{$clean}%")
                ->orWhere('tags', 'like', "%{$clean}%")
                ->orWhere('description', 'like', "%{$clean}%")
                ->orWhere('address', 'like', "%{$clean}%");

            // Individual keyword matches
            foreach ($searchTerms as $term) {
                if (mb_strlen($term) < 2) continue;
                $sub->orWhere('name', 'like', "%{$term}%")
                    ->orWhere('category_name', 'like', "%{$term}%")
                    ->orWhere('subcategory', 'like', "%{$term}%")
                    ->orWhere('category', 'like', "%{$term}%")
                    ->orWhere('tags', 'like', "%{$term}%")
                    ->orWhere('description', 'like', "%{$term}%")
                    ->orWhere('address', 'like', "%{$term}%");
            }
        });

        $results = $query->limit(60)->get();

        return $results->sortByDesc(function ($b) use ($lower, $searchTerms) {
            $score = 0;
            $nameLower = mb_strtolower($b->name ?? '');
            $catLower = mb_strtolower(($b->category_name ?? '') . ' ' . ($b->subcategory ?? '') . ' ' . ($b->category ?? ''));
            $tagsLower = mb_strtolower(is_array($b->tags) ? implode(' ', $b->tags) : ($b->tags ?? ''));
            $descLower = mb_strtolower($b->description ?? '');

            // Exact full match
            if ($nameLower === $lower) $score += 200;
            elseif (str_starts_with($nameLower, $lower)) $score += 150;
            elseif (str_contains($nameLower, $lower)) $score += 100;

            foreach ($searchTerms as $term) {
                if (empty($term)) continue;
                if ($nameLower === $term) $score += 80;
                elseif (str_starts_with($nameLower, $term)) $score += 60;
                elseif (str_contains($nameLower, $term)) $score += 45;

                if (str_contains($catLower, $term)) $score += 35;
                if (str_contains($tagsLower, $term)) $score += 30;
                if (str_contains($descLower, $term)) $score += 10;
            }

            if ($b->is_verified) $score += 10;
            $score += min(floatval($b->rating ?? 0), 5);

            return $score;
        })->values()->take($limit);
    }

    /**
     * Search blog posts with smart relevance ranking.
     */
    protected function searchBlogs(array $parsed, int $limit = 20)
    {
        $clean = $parsed['clean'];
        $lower = $parsed['lower'];
        $coreKeywords = $parsed['coreKeywords'];
        $contentKeywords = $parsed['contentKeywords'];
        $isGeneric = $parsed['isGenericPortalQuery'];

        $query = Post::with(['author'])
            ->whereNull('community_id')
            ->where('published', true);

        if ($isGeneric) {
            return $query->orderBy('date', 'desc')->limit($limit)->get();
        }

        $searchTerms = !empty($coreKeywords) ? $coreKeywords : $contentKeywords;
        if (empty($searchTerms)) {
            $searchTerms = !empty($clean) ? [$clean] : [];
        }

        if (empty($searchTerms)) {
            return collect();
        }

        $searchableCols = $this->getPostSearchableColumns();

        $query->where(function ($sub) use ($clean, $searchTerms, $searchableCols) {
            $isFirst = true;
            foreach ($searchableCols as $col) {
                if ($isFirst) {
                    $sub->where($col, 'like', "%{$clean}%");
                    $isFirst = false;
                } else {
                    $sub->orWhere($col, 'like', "%{$clean}%");
                }
            }

            foreach ($searchTerms as $term) {
                if (mb_strlen($term) < 2) continue;
                foreach ($searchableCols as $col) {
                    $sub->orWhere($col, 'like', "%{$term}%");
                }
            }
        });

        $results = $query->limit(60)->get();

        return $results->sortByDesc(function ($post) use ($lower, $searchTerms) {
            $score = 0;
            $titleLower = mb_strtolower($post->title ?? '');
            $contentLower = mb_strtolower($post->content ?? '');
            $catLower = mb_strtolower($post->category ?? '');
            $excerptLower = mb_strtolower($post->excerpt ?? '');
            $focusLower = mb_strtolower($post->focusKeyword ?? $post->focus_keyword ?? '');
            $keywordsLower = mb_strtolower($post->keywords ?? '');

            if ($titleLower === $lower) $score += 200;
            elseif (str_starts_with($titleLower, $lower)) $score += 120;
            elseif (str_contains($titleLower, $lower)) $score += 80;

            if (str_contains($catLower, $lower)) $score += 60;
            if (str_contains($focusLower, $lower)) $score += 50;
            if (str_contains($keywordsLower, $lower)) $score += 40;
            if (str_contains($excerptLower, $lower)) $score += 30;

            foreach ($searchTerms as $term) {
                if (empty($term)) continue;
                if ($titleLower === $term) $score += 60;
                elseif (str_contains($titleLower, $term)) $score += 40;

                if (str_contains($catLower, $term)) $score += 35;
                if (str_contains($focusLower, $term)) $score += 30;
                if (str_contains($keywordsLower, $term)) $score += 25;
                if (str_contains($excerptLower, $term)) $score += 15;
                if (str_contains($contentLower, $term)) $score += 8;
            }

            return $score;
        })->values()->take($limit);
    }

    /**
     * Search community posts.
     */
    protected function searchCommunityPosts(array $parsed, int $limit = 20)
    {
        $clean = $parsed['clean'];
        $searchTerms = !empty($parsed['coreKeywords']) ? $parsed['coreKeywords'] : $parsed['contentKeywords'];
        if (empty($searchTerms)) $searchTerms = !empty($clean) ? [$clean] : [];

        $query = Post::with(['author', 'community'])
            ->whereNotNull('community_id')
            ->where(function ($q) {
                $q->whereNull('status')->orWhereNotIn('status', ['removed', 'spam']);
            });

        if ($parsed['isGenericPortalQuery']) {
            return $query->orderBy('created_at', 'desc')->limit($limit)->get();
        }

        if (empty($searchTerms)) {
            return collect();
        }

        $query->where(function ($sub) use ($clean, $searchTerms) {
            $sub->where('title', 'like', "%{$clean}%")
                ->orWhere('content', 'like', "%{$clean}%");

            foreach ($searchTerms as $term) {
                if (mb_strlen($term) < 2) continue;
                $sub->orWhere('title', 'like', "%{$term}%")
                    ->orWhere('content', 'like', "%{$term}%");
            }
        });

        return $query->orderBy('created_at', 'desc')->limit($limit)->get();
    }

    /**
     * Search categories.
     */
    protected function searchCategories(array $parsed, int $limit = 6)
    {
        $clean = $parsed['clean'];
        $searchTerms = !empty($parsed['coreKeywords']) ? $parsed['coreKeywords'] : $parsed['contentKeywords'];
        if (empty($searchTerms)) $searchTerms = !empty($clean) ? [$clean] : [];

        if (empty($searchTerms)) {
            return Category::select('id', 'name', 'slug')->limit($limit)->get();
        }

        return Category::where(function ($sub) use ($clean, $searchTerms) {
            $sub->where('name', 'like', "%{$clean}%")
                ->orWhere('slug', 'like', "%{$clean}%");

            foreach ($searchTerms as $term) {
                if (mb_strlen($term) < 2) continue;
                $sub->orWhere('name', 'like', "%{$term}%")
                    ->orWhere('slug', 'like', "%{$term}%");
            }
        })->select('id', 'name', 'slug')->limit($limit)->get();
    }

    /**
     * Search communities.
     */
    protected function searchCommunities(array $parsed, int $limit = 6)
    {
        $clean = $parsed['clean'];
        $searchTerms = !empty($parsed['coreKeywords']) ? $parsed['coreKeywords'] : $parsed['contentKeywords'];
        if (empty($searchTerms)) $searchTerms = !empty($clean) ? [$clean] : [];

        $query = Community::query();

        if (!empty($searchTerms)) {
            $query->where(function ($sub) use ($clean, $searchTerms) {
                $sub->where('name', 'like', "%{$clean}%")
                    ->orWhere('display_name', 'like', "%{$clean}%")
                    ->orWhere('description', 'like', "%{$clean}%");

                foreach ($searchTerms as $term) {
                    if (mb_strlen($term) < 2) continue;
                    $sub->orWhere('name', 'like', "%{$term}%")
                        ->orWhere('display_name', 'like', "%{$term}%")
                        ->orWhere('description', 'like', "%{$term}%");
                }
            });
        }

        return $query->withCount('members')->limit($limit)->get();
    }

    public function index(Request $request)
    {
        $q = trim((string) $request->input('q', ''));
        if (strlen($q) > 100) {
            $q = substr($q, 0, 100);
        }

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

        $parsed = $this->parseSearchTerms($q);

        $businesses = $this->searchBusinesses($parsed, 30);
        $blogs = $this->searchBlogs($parsed, 20);
        $posts = $this->searchCommunityPosts($parsed, 20);
        $communities = $this->searchCommunities($parsed, 12);

        $users = User::where('username', 'like', "%{$q}%")
            ->orWhere('name', 'like', "%{$q}%")
            ->select(['id', 'name', 'username', 'profile_picture', 'flair'])
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
        $q = trim((string) $request->input('q', ''));
        if (!$q) {
            return response()->json([
                'categories' => [],
                'businesses' => [],
                'blogs' => [],
                'communities' => []
            ]);
        }

        $parsed = $this->parseSearchTerms($q);

        $categories = $this->searchCategories($parsed, 4);

        $businesses = $this->searchBusinesses($parsed, 6)->map(function ($b) {
            return [
                'id' => $b->id,
                'name' => $b->name,
                'slug' => $b->slug,
                'category' => $b->category ?: 'coaching-institutes',
                'category_name' => $b->category_name,
                'logo' => $b->logo,
                'rating' => $b->rating,
            ];
        });

        $blogs = $this->searchBlogs($parsed, 4)->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'slug' => $post->slug,
                'url_path' => $post->url_path ?: "/blog/{$post->slug}",
                'excerpt' => $post->excerpt ?? \Illuminate\Support\Str::limit(strip_tags($post->content ?? ''), 90)
            ];
        });

        $communities = $this->searchCommunities($parsed, 3)->map(function ($community) {
            return [
                'id' => $community->id,
                'name' => $community->name,
                'display_name' => $community->display_name ?: $community->name,
                'members' => $community->members_count ?? 0,
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
