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
        $post = Post::find($id);
        if ($post) {
            $post->delete();
        }
        Cache::forget('homepage_data_v6');
        Cache::forget('recent_posts_sidebar_v2');
        Cache::forget('blog_all_posts');
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
            $community->members()->syncWithoutDetaching([$validated['owner_id']]);
            $community->moderators()->syncWithoutDetaching([$validated['owner_id']]);
        }

        Cache::forget('homepage_data_v6');

        return response()->json(['success' => true, 'community' => $community]);
    }

    public function deleteCommunity(Request $request)
    {
        $id = $request->query('id');
        \App\Models\Community::where('id', $id)->delete();
        Cache::forget('homepage_data_v6');
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
        if (!$id) {
            return response()->json(['success' => false, 'message' => 'User ID is required.'], 400);
        }

        $currentUser = auth()->user();
        if ($currentUser && (int) $currentUser->id === (int) $id) {
            return response()->json(['success' => false, 'message' => 'You cannot delete your own account.'], 422);
        }

        $targetUser = User::find($id);
        if ($targetUser) {
            if ($targetUser->role === 'super_admin' && $currentUser?->role !== 'super_admin') {
                return response()->json(['success' => false, 'message' => 'Only a Super Admin can delete another Super Admin.'], 403);
            }
            $targetUser->delete();
        }

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
            Cache::forget('homepage_data_v6');
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
        if (\Illuminate\Support\Facades\Schema::hasTable('navigations')) {
            $items = \App\Models\Navigation::orderBy('order', 'asc')->get();
            if ($items->isEmpty()) {
                // Auto-seed initial default navigation items so admin panel is never empty
                $defaults = [
                    ['name' => 'Blog', 'url' => '/blog', 'order' => 1, 'is_active' => true, 'show_in_footer' => true, 'parent_id' => null],
                    ['name' => 'Community', 'url' => '/feed', 'order' => 2, 'is_active' => true, 'show_in_footer' => true, 'parent_id' => null],
                    ['name' => 'Explore Institutes', 'url' => '/business', 'order' => 3, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => null],
                    ['name' => 'Category', 'url' => '/category', 'order' => 4, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => null],
                    ['name' => 'About Us', 'url' => '/about', 'order' => 5, 'is_active' => true, 'show_in_footer' => true, 'parent_id' => null],
                    ['name' => 'Contact Us', 'url' => '/contact', 'order' => 6, 'is_active' => true, 'show_in_footer' => true, 'parent_id' => null],
                ];
                foreach ($defaults as $item) {
                    $parent = \App\Models\Navigation::create($item);
                    if ($item['name'] === 'Explore Institutes') {
                        \App\Models\Navigation::create(['name' => 'Coaching & Test Prep', 'url' => '/category/coaching', 'order' => 1, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'Hospitals & Healthcare', 'url' => '/category/hospitals', 'order' => 2, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'AI Tools & Tech', 'url' => '/category/ai-tools', 'order' => 3, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'Hotels & Hospitality', 'url' => '/category/hotels', 'order' => 4, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                    } elseif ($item['name'] === 'Category') {
                        \App\Models\Navigation::create(['name' => 'Coaching & Institutes', 'url' => '/category/coaching', 'order' => 1, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'SaaS & Cloud Platforms', 'url' => '/category/saas', 'order' => 2, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'AI Tools & Models', 'url' => '/category/ai-tools', 'order' => 3, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'E-commerce & Retail', 'url' => '/category/ecommerce', 'order' => 4, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'Hospitals & Healthcare', 'url' => '/category/hospitals', 'order' => 5, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'Web Hosting & Servers', 'url' => '/category/hosting', 'order' => 6, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                        \App\Models\Navigation::create(['name' => 'Fintech & Banking', 'url' => '/category/finance', 'order' => 7, 'is_active' => true, 'show_in_footer' => false, 'parent_id' => $parent->id]);
                    }
                }
                \Illuminate\Support\Facades\Cache::forget('global_nav_active');
                \Illuminate\Support\Facades\Cache::forget('global_nav_active_array');
                \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
                $items = \App\Models\Navigation::orderBy('order', 'asc')->get();
            }
            return response()->json($items);
        }
        return response()->json([]);
    }

    public function storeNavigation(Request $request)
    {
        $data = $request->validate([
            'id' => 'nullable',
            'name' => 'required|string|max:255',
            'url' => 'nullable|string',
            'order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
            'show_in_footer' => 'nullable|boolean',
            'parent_id' => 'nullable|integer',
        ]);
        
        $data['order'] = $data['order'] ?? 0;
        $data['is_active'] = $data['is_active'] ?? true;
        $data['show_in_footer'] = $data['show_in_footer'] ?? false;

        if (!empty($data['id']) && $data['id'] !== 'new') {
            \App\Models\Navigation::where('id', $data['id'])->update([
                'name' => $data['name'],
                'url' => $data['url'],
                'order' => $data['order'],
                'is_active' => $data['is_active'],
                'show_in_footer' => $data['show_in_footer'],
                'parent_id' => $data['parent_id'],
            ]);
            $nav = \App\Models\Navigation::find($data['id']);
        } else {
            $nav = \App\Models\Navigation::create([
                'name' => $data['name'],
                'url' => $data['url'],
                'order' => $data['order'],
                'is_active' => $data['is_active'],
                'show_in_footer' => $data['show_in_footer'],
                'parent_id' => $data['parent_id'],
            ]);
        }
        
        \Illuminate\Support\Facades\Cache::forget('global_nav_active');
        \Illuminate\Support\Facades\Cache::forget('global_nav_active_array');
        \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');

        return response()->json($nav);
    }

    public function deleteNavigation(Request $request)
    {
        if ($request->has('id')) {
            $id = $request->input('id');
            \App\Models\Navigation::where('parent_id', $id)->delete();
            \App\Models\Navigation::where('id', $id)->delete();
            \Illuminate\Support\Facades\Cache::forget('global_nav_active');
            \Illuminate\Support\Facades\Cache::forget('global_nav_active_array');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
        }
        return response()->json(['success' => true]);
    }
}
