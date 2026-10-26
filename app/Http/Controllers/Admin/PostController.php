<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use Illuminate\Support\Str;
use Carbon\Carbon;

class PostController extends Controller
{
    public function create()
    {
        return Inertia::render('Admin/Posts/New');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'slug' => 'nullable|string',
            'content' => 'nullable|string',
            'metaDescription' => 'nullable|string',
            'excerpt' => 'nullable|string',
            'coverImage' => 'nullable|string',
            'coverImageAlt' => 'nullable|string',
            'authorImage' => 'nullable|string',
            'authorSocials' => 'nullable|array',
            'seoTitle' => 'nullable|string',
            'ogTitle' => 'nullable|string',
            'ogDescription' => 'nullable|string',
            'canonicalUrl' => 'nullable|string',
            'keywords' => 'nullable|string',
            'twitterCard' => 'nullable|string',
            'twitterTitle' => 'nullable|string',
            'twitterDescription' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'faqs' => 'nullable|array',
            'howToSteps' => 'nullable|array',
            'localBusiness' => 'nullable|array',
            'seoRating' => 'nullable|array',
            'published' => 'nullable|boolean',
            'date' => 'nullable|string',
            'author' => 'nullable|string',
            'factCheckedBy' => 'nullable|string',
            'factCheckerRole' => 'nullable|string',
            'authorJobTitle' => 'nullable|string',
            'authorBio' => 'nullable|string',
            'researchMethodology' => 'nullable|string',
            'sources' => 'nullable|array',
            'searchIntent' => 'nullable|string',
            'seoScore' => 'nullable|numeric',
            'targetRegion' => 'nullable|string',
            'targetLanguage' => 'nullable|string',
            'contentScope' => 'nullable|string',
            'authorExperienceYears' => 'nullable|numeric',
            'authorAwards' => 'nullable|array',
            'authorAlumniOf' => 'nullable|array',
            'authorKnowsAbout' => 'nullable|array',
            'keyTakeaways' => 'nullable|array',
            'semanticMentions' => 'nullable|array',
            'reviewCycleDays' => 'nullable|numeric',
            'nextReviewDate' => 'nullable|string',
            'isNoIndex' => 'nullable|boolean',
            'isSponsored' => 'nullable|boolean',
            'isPillarPage' => 'nullable|boolean',
            'isAiAssisted' => 'nullable|boolean',
            'corrections' => 'nullable|array',
            'focusKeyword' => 'nullable|string',
            'lsiKeywords' => 'nullable|array',
            'type' => 'nullable|string',
            'url_format' => 'nullable|string',
            'schema_type' => 'nullable|string',
            'link_url' => 'nullable|string',
            'media_urls' => 'nullable|array',
            'community_id' => 'nullable|exists:communities,id',
            'author_id' => 'nullable|exists:users,id',
            'category_id' => 'nullable|exists:categories,id',
            'story_id' => 'nullable|exists:stories,id',
            'status' => 'nullable|string',
        ]);

        $data = $validated;
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        } else {
            $data['slug'] = Str::slug($data['slug']);
        }

        $originalSlug = $data['slug'];
        $count = 1;
        while (Post::where('slug', $data['slug'])->where('id', '!=', $data['id'])->exists()) {
            $data['slug'] = $originalSlug . '-' . $count;
            $count++;
        }
        if (isset($data['date'])) {
            $data['date'] = Carbon::parse($data['date']);
        }
        if (isset($data['content'])) {
            $imageService = app(\App\Services\ImageService::class);
            $data['content'] = $imageService->processContentImages($data['content']);
            $data['content'] = clean($data['content']);
        }

        // Map published boolean to status string if needed
        if (isset($data['published'])) {
            $data['status'] = $data['published'] ? 'published' : 'draft';
        }

        // Normalize url_format
        if (isset($data['url_format'])) {
            $uf = trim($data['url_format']);
            if ($uf === 'direct' || $uf === '/' || $uf === '{slug}' || $uf === '/{slug}') {
                $data['url_format'] = '{slug}';
            }
        }

        // Dynamically ensure required columns exist in MySQL / SQLite
        try {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `posts` ADD COLUMN `url_format` VARCHAR(255) NULL DEFAULT 'blog/{slug}'");
        } catch (\Throwable $e) {}
        try {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE `posts` ADD COLUMN `focus_keyword` VARCHAR(255) NULL");
        } catch (\Throwable $e) {}

        // Dynamically filter out fields that do not exist in the database schema
        $safeData = [];
        try {
            $columns = \Illuminate\Support\Facades\Schema::getColumnListing('posts');
        } catch (\Throwable $e) {
            // Older SQLite versions lack pragma_table_xinfo virtual table support in FROM clause
            try {
                $rawCols = \Illuminate\Support\Facades\DB::select('PRAGMA table_info("posts")');
                $columns = array_map(function ($c) {
                    return is_object($c) ? $c->name : ($c['name'] ?? null);
                }, $rawCols);
                $columns = array_values(array_filter($columns));
            } catch (\Throwable $ex) {
                $columns = [];
            }

            if (empty($columns)) {
                $columns = [
                    'id', 'slug', 'title', 'type', 'content', 'media_urls', 'link_url', 'poll_options',
                    'score', 'author_id', 'community_id', 'is_pinned', 'is_locked', 'is_nsfw', 'excerpt',
                    'coverImage', 'category', 'tags', 'published', 'date', 'created_at', 'updated_at',
                    'factCheckedBy', 'factCheckerRole', 'authorJobTitle', 'authorBio', 'researchMethodology',
                    'sources', 'searchIntent', 'seoScore', 'targetRegion', 'targetLanguage', 'contentScope',
                    'authorExperienceYears', 'authorAwards', 'authorAlumniOf', 'authorKnowsAbout',
                    'keyTakeaways', 'semanticMentions', 'reviewCycleDays', 'nextReviewDate', 'isNoIndex',
                    'isSponsored', 'isPillarPage', 'isAiAssisted', 'corrections', 'post_type', 'media_path',
                    'url', 'flair', 'status', 'is_live_discussion', 'seoTitle', 'ogTitle', 'ogDescription',
                    'canonicalUrl', 'keywords', 'faqs', 'authorImage', 'authorSocials', 'metaDescription',
                    'focusKeyword', 'lsiKeywords', 'twitterCard', 'twitterTitle', 'twitterDescription',
                    'coverImageAlt', 'howToSteps', 'localBusiness', 'seoRating', 'url_format', 'author', 'schema_type'
                ];
            }
        }
        $columnsLower = array_map('strtolower', $columns);
        foreach ($data as $key => $value) {
            $index = array_search(strtolower($key), $columnsLower);
            if ($index !== false) {
                // Use the exact database column name to avoid case sensitivity issues on Linux
                $actualColumn = $columns[$index];
                $safeData[$actualColumn] = $value;
            }
        }
        
        try {
            $post = Post::updateOrCreate(['id' => $safeData['id']], $safeData);
            \Illuminate\Support\Facades\Cache::forget('blog_all_posts');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
            \Illuminate\Support\Facades\Cache::forget('recent_posts_sidebar_v2');

            // Invalidate full page cache variants so direct URL loads fresh immediately
            try {
                $slugVal = $post->slug;
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5(url('/' . $slugVal) . '_0'));
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5(url('/' . $slugVal) . '_1'));
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5(url('/blog/' . $slugVal) . '_0'));
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5(url('/blog/' . $slugVal) . '_1'));
            } catch (\Throwable $ignore) {}

            // Auto-ping Google Instant Indexing API if post is published
            if (!empty($safeData['published'])) {
                try {
                    $gscSettings = \App\Models\GscSetting::instance();
                    if ($gscSettings->is_connected && $gscSettings->auto_index_posts) {
                        $siteBase = rtrim(config('services.google.site_url', 'https://coachingsinsikar.com'), '/');
                        $postUrl = $siteBase . '/' . ltrim($post->url_path, '/');
                        app(\App\Services\Google\GoogleIndexingService::class)->publishUrl($postUrl, 'URL_UPDATED', 'auto_post_publish');
                    }
                } catch (\Throwable $ignore) {}
            }

            // Auto-generate pending social post drafts (LinkedIn, Pinterest, Facebook, Instagram, X)
            try {
                \App\Services\Social\SocialAutoDraftService::syncDraftsForPost($post);
            } catch (\Throwable $ignore) {}
        } catch (\Throwable $e) {
            return response()->json(['success' => false, 'message' => 'DB Error: ' . $e->getMessage()], 500);
        }

        return response()->json(['success' => true]);
    }

    public function edit($id)
    {
        $post = Post::find($id);

        if (!$post) {
            abort(404, 'Post not found');
        }

        return Inertia::render('Admin/Posts/Edit', [
            'post' => $post
        ]);
    }
}
