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
            $data['content'] = clean($data['content']);
        }

        // Map published boolean to status string if needed
        if (isset($data['published'])) {
            $data['status'] = $data['published'] ? 'published' : 'draft';
        }

        // Dynamically filter out fields that do not exist in the database schema
        $safeData = [];
        $columns = \Illuminate\Support\Facades\Schema::getColumnListing('posts');
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
            Post::updateOrCreate(['id' => $safeData['id']], $safeData);
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
