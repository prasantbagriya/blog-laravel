<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

use App\Models\Post;
use App\Models\Author;
use App\Models\Category;
use App\Models\Story;
use App\Models\User;

class AdminApiController extends Controller
{

    // --- Posts ---
    public function getPosts()
    {
        return response()->json(Post::whereNull('community_id')->orderBy('created_at', 'desc')->get());
    }

    public function getCommunityPosts()
    {
        return response()->json(Post::whereNotNull('community_id')->with(['community', 'author'])->orderBy('created_at', 'desc')->get());
    }

    public function deletePost(Request $request)
    {
        $id = $request->query('id');
        Post::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Communities ---
    public function getCommunities()
    {
        return response()->json(\App\Models\Community::withCount('members')->with('owner')->orderBy('created_at', 'desc')->get());
    }

    public function storeCommunity(Request $request)
    {
        $id = $request->input('id');
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:communities,name,' . $id,
            'display_name' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'is_nsfw' => 'boolean',
            'is_private' => 'boolean',
        ]);

        if (isset($request['rules'])) {
            $validated['rules'] = $request['rules'];
        }

        if ($id) {
            $community = \App\Models\Community::findOrFail($id);
            $community->update($validated);
        } else {
            $validated['owner_id'] = auth()->id() ?? 1; // Fallback for super admin
            $community = \App\Models\Community::create($validated);
        }

        Cache::forget('home_data_v2');

        return response()->json(['success' => true, 'community' => $community]);
    }

    public function deleteCommunity(Request $request)
    {
        $id = $request->query('id');
        \App\Models\Community::where('id', $id)->delete();
        Cache::forget('home_data_v2');
        return response()->json(['success' => true]);
    }

    // --- Users ---
    public function getUsers()
    {
        return response()->json(User::orderBy('created_at', 'desc')->get());
    }

    public function deleteUser(Request $request)
    {
        $id = $request->query('id');
        User::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Authors ---
    public function getAuthors()
    {
        return response()->json(Author::orderBy('created_at', 'desc')->get());
    }

    public function storeAuthor(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'bio' => 'nullable|string',
            'image' => 'nullable|string',
            'jobTitle' => 'nullable|string',
            'experienceYears' => 'nullable|numeric',
            'socials' => 'nullable|array'
        ]);
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        if (isset($data['bio'])) {
            $data['bio'] = clean($data['bio']);
        }
        $author = Author::updateOrCreate(['id' => $data['id']], $data);

        // Sync author updates to Posts and Stories
        if ($author->name) {
            $updateData = [];
            if (isset($data['image'])) $updateData['authorImage'] = $data['image'];
            if (isset($data['bio'])) $updateData['authorBio'] = $data['bio'];
            if (isset($data['socials'])) $updateData['authorSocials'] = is_array($data['socials']) ? json_encode($data['socials']) : $data['socials'];

            if (!empty($updateData)) {
                $authorNames = [$author->name];
                if (strtolower($author->name) === 'prashant') {
                    $authorNames[] = 'Prasant';
                    $authorNames[] = 'prasant';
                }
                
                \App\Models\Post::whereIn('author', $authorNames)->update($updateData);
                \App\Models\Story::whereIn('author', $authorNames)->update($updateData);
            }
        }

        return response()->json(['success' => true]);
    }

    public function deleteAuthor(Request $request)
    {
        $id = $request->query('id');
        Author::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Categories ---
    public function getCategories()
    {
        return response()->json(Category::orderBy('created_at', 'desc')->get());
    }

    public function storeCategory(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'name' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'color' => 'nullable|string',
            'icon' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'image' => 'nullable|string',
            'image_alt' => 'nullable|string'
        ]);
        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['name']);
        }
        if (isset($data['description'])) {
            $data['description'] = clean($data['description']);
        }
        if (isset($data['seo_description'])) {
            $data['seo_description'] = clean($data['seo_description']);
        }
        if (isset($data['og_description'])) {
            $data['og_description'] = clean($data['og_description']);
        }
        Category::updateOrCreate(['id' => $data['id']], $data);
        return response()->json(['success' => true]);
    }

    public function deleteCategory(Request $request)
    {
        $id = $request->query('id');
        Category::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Stories ---
    public function getStories()
    {
        return response()->json(Story::orderBy('created_at', 'desc')->get());
    }

    public function storeStory(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string',
            'slug' => 'nullable|string',
            'description' => 'nullable|string',
            'posterImage' => 'nullable|string',
            'squarePoster' => 'nullable|string',
            'landscapePoster' => 'nullable|string',
            'category' => 'nullable|string',
            'tags' => 'nullable|array',
            'author' => 'nullable|string',
            'authorBio' => 'nullable|string',
            'authorImage' => 'nullable|string',
            'authorSocials' => 'nullable|array',
            'date' => 'nullable|string',
            'slides' => 'nullable|array',
            'articleLink' => 'nullable|string',
            'published' => 'nullable|boolean',
            'isSponsored' => 'nullable|boolean',
            'isNoIndex' => 'nullable|boolean',
            'seoTitle' => 'nullable|string',
            'ogTitle' => 'nullable|string',
            'ogDescription' => 'nullable|string',
            'ogImage' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $data['id'] = Str::uuid()->toString();
        }
        if (empty($data['slug'])) {
            $data['slug'] = Str::slug($data['title']);
        }
        if (isset($data['date'])) {
            $data['date'] = \Carbon\Carbon::parse($data['date']);
        }
        if (isset($data['description'])) {
            $data['description'] = clean($data['description']);
        }
        
        $pages = $data['slides'] ?? [];
        $data['pages'] = $pages;
        unset($data['slides']);
        
        $data['seo_meta'] = [
            'seo_title' => $data['seoTitle'] ?? null,
            'og_title' => $data['ogTitle'] ?? null,
            'og_description' => $data['ogDescription'] ?? null,
            'og_image' => $data['ogImage'] ?? null,
        ];
        unset($data['seoTitle'], $data['ogTitle'], $data['ogDescription'], $data['ogImage']);

        Story::updateOrCreate(['id' => $data['id']], $data);
        return response()->json(['success' => true]);
    }

    public function deleteStory(Request $request)
    {
        $id = $request->query('id');
        Story::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    // --- Media (Moved to MediaController) ---


    // --- Sliders ---
    public function getSliders()
    {
        return response()->json(\App\Models\Slider::orderBy('order', 'asc')->get());
    }

    public function storeSlider(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'image_url' => 'required|string',
            'link_url' => 'nullable|string',
            'order' => 'integer',
            'locations' => 'nullable|array'
        ]);
        if (empty($data['id'])) {
            $data['id'] = \Illuminate\Support\Str::uuid()->toString();
        }
        $data['active'] = true;
        
        \App\Models\Slider::updateOrCreate(['id' => $data['id']], $data);
        \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
        return response()->json(['success' => true]);
    }

    public function deleteSlider(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Slider::where('id', $request->input('id'))->delete();
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
        }
        return response()->json(['success' => true]);
    }

    // --- Businesses ---
    public function getBusinesses()
    {
        return response()->json(\App\Models\Business::orderBy('created_at', 'desc')->get());
    }

    public function deleteBusiness(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Business::where('id', $request->input('id'))->delete();
        }
        return response()->json(['success' => true]);
    }

    // --- Contact Messages ---
    public function getContactMessages()
    {
        return response()->json(\App\Models\ContactMessage::orderBy('created_at', 'desc')->get());
    }

    public function deleteContactMessage($id)
    {
        \App\Models\ContactMessage::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    public function readContactMessage($id)
    {
        $message = \App\Models\ContactMessage::find($id);
        if ($message) {
            $message->status = 'read';
            $message->save();
        }
        return response()->json(['success' => true]);
    }

    // --- Newsletters & Inquiries ---
    public function getNewsletters()
    {
        return response()->json(\App\Models\NewsletterSubscriber::orderBy('created_at', 'desc')->get());
    }

    public function deleteNewsletter($id)
    {
        \App\Models\NewsletterSubscriber::where('id', $id)->delete();
        return response()->json(['success' => true]);
    }

    public function collectInquiry(\Illuminate\Http\Request $request)
    {
        $request->validate(['email' => 'required|email']);
        
        if ($request->input('type') === 'newsletter') {
            \App\Models\NewsletterSubscriber::firstOrCreate(
                ['email' => $request->input('email')],
                [
                    'source' => $request->input('source'),
                    'type' => $request->input('type'),
                ]
            );
        }
        
        return response()->json(['success' => true]);
    }

    // --- Pages ---
    public function getPages()
    {
        try {
            return response()->json(\App\Models\Page::orderBy('created_at', 'desc')->get());
        } catch (\Exception $e) {
            return response()->json(['error' => 'pages_table_missing', 'message' => $e->getMessage()], 500);
        }
    }

    public function storePage(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable|string',
            'title' => 'required|string|max:255',
            'slug' => 'required|string|max:255',
            'type' => 'required|string|in:static,feed',
            'category_id' => 'nullable|string',
            'schema_type' => 'nullable|string',
            'content' => 'nullable|string',
            'seo_title' => 'nullable|string|max:255',
            'seo_description' => 'nullable|string',
            'seo_keywords' => 'nullable|string|max:255',
            'og_title' => 'nullable|string|max:255',
            'og_description' => 'nullable|string',
            'og_image' => 'nullable|string',
            'faqs' => 'nullable|array',
            'faqs.*.question' => 'nullable|string',
            'faqs.*.answer' => 'nullable|string',
        ]);

        if (empty($data['id'])) {
            $data['id'] = \Illuminate\Support\Str::uuid()->toString();
        }

        try {
            \App\Models\Page::updateOrCreate(['id' => $data['id']], $data);
            return response()->json(['success' => true]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function deletePage(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Page::where('id', $request->input('id'))->delete();
        }
        return response()->json(['success' => true]);
    }
    public function getNavigations()
    {
        return response()->json(\App\Models\Navigation::orderBy('order', 'asc')->get());
    }

    public function storeNavigation(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable',
            'name' => 'required|string|max:255',
            'url' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'parent_id' => 'nullable|integer',
        ]);
        
        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;

        if (!empty($data['id']) && $data['id'] !== 'new') {
            \App\Models\Navigation::where('id', $data['id'])->update([
                'name' => $data['name'],
                'url' => $data['url'],
                'order' => $data['order'],
                'is_active' => $data['is_active'],
                'parent_id' => $data['parent_id'],
            ]);
            $nav = \App\Models\Navigation::find($data['id']);
        } else {
            $nav = \App\Models\Navigation::create([
                'name' => $data['name'],
                'url' => $data['url'],
                'order' => $data['order'],
                'is_active' => $data['is_active'],
                'parent_id' => $data['parent_id'],
            ]);
        }
        
        return response()->json($nav);
    }

    public function deleteNavigation(Request $request)
    {
        if ($request->has('id')) {
            \App\Models\Navigation::where('id', $request->input('id'))->delete();
        }
        return response()->json(['success' => true]);
    }
}
