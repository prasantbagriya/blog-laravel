<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap.index');
Route::get('/sitemap/pages.xml', [\App\Http\Controllers\SitemapController::class, 'pages'])->name('sitemap.pages');
Route::get('/sitemap/posts.xml', [\App\Http\Controllers\SitemapController::class, 'blogPosts'])->name('sitemap.posts');
Route::get('/sitemap/community-posts.xml', [\App\Http\Controllers\SitemapController::class, 'communityPosts'])->name('sitemap.community_posts');
Route::get('/sitemap/categories.xml', [\App\Http\Controllers\SitemapController::class, 'categories'])->name('sitemap.categories');
Route::get('/sitemap/communities.xml', [\App\Http\Controllers\SitemapController::class, 'communities'])->name('sitemap.communities');
Route::get('/sitemap/authors.xml', [\App\Http\Controllers\SitemapController::class, 'authors'])->name('sitemap.authors');
Route::get('/sitemap/stories.xml', [\App\Http\Controllers\SitemapController::class, 'stories'])->name('sitemap.stories');
Route::get('/news-sitemap.xml', [\App\Http\Controllers\NewsSitemapController::class, 'index'])->name('sitemap.news');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

// Temporary route to run migrations from cPanel browser
Route::middleware(['auth', 'admin'])->get('/run-migrations-secret', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return '<pre>Migrations executed successfully. Output:\n\n' . \Illuminate\Support\Facades\Artisan::output() . '</pre>';
    } catch (\Exception $e) {
        return '<pre>Error executing migrations:\n\n' . $e->getMessage() . '</pre>';
    }
});

// Redirect all old /public/... URLs to /blog/...
Route::get('/public/{any}', function ($any) {
    return redirect('/blog/' . $any, 301);
})->where('any', '.*');

Route::get('/feed', [\App\Http\Controllers\CommunityController::class, 'feed'])->name('community.feed');
Route::get('/community/{name}', [\App\Http\Controllers\CommunityController::class, 'show'])->name('community.show');
Route::get('/r/{name}/feed.xml', [\App\Http\Controllers\RssController::class, 'communityFeed'])->name('community.rss');
Route::get('/r/{community}/comments/{post}/{slug?}', [\App\Http\Controllers\PostController::class, 'show'])->name('post.show');
Route::get('/u/{username}', [\App\Http\Controllers\UserController::class, 'show'])->name('user.show');

Route::middleware('auth')->group(function () {
    Route::get('/communities/create', [\App\Http\Controllers\CommunityController::class, 'create'])->name('community.create');
    Route::post('/communities', [\App\Http\Controllers\CommunityController::class, 'store'])->name('community.store');
    Route::get('/community/{community}/edit', [\App\Http\Controllers\CommunityController::class, 'edit'])->name('community.edit');
    Route::post('/community/{community}/update', [\App\Http\Controllers\CommunityController::class, 'update'])->name('community.update');
    Route::post('/community/{community}/join', [\App\Http\Controllers\CommunityController::class, 'join'])->name('community.join');
    
    Route::get('/submit', [\App\Http\Controllers\PostController::class, 'create'])->name('post.create');
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store'])->name('post.store');
    
    Route::post('/posts/{post}/comments', [\App\Http\Controllers\PostController::class, 'storeComment'])->name('post.comment.store');
    
    Route::post('/reports', [\App\Http\Controllers\ReportController::class, 'store'])->name('reports.store');
    Route::get('/community/{community}/modqueue', [\App\Http\Controllers\CommunityController::class, 'modqueue'])->name('community.modqueue');
    Route::post('/reports/{report}/approve', [\App\Http\Controllers\CommunityController::class, 'approveReport'])->name('reports.approve');
    Route::post('/reports/{report}/remove', [\App\Http\Controllers\CommunityController::class, 'removeReport'])->name('reports.remove');
    
    Route::post('/notifications/mark-read', [\App\Http\Controllers\NotificationController::class, 'markRead'])->name('notifications.markRead');
});

Route::get('/stories', [\App\Http\Controllers\StoryController::class, 'index'])->name('story.index');
Route::get('/stories/{slug}', [\App\Http\Controllers\StoryController::class, 'show'])->name('story.show');

Route::get('/category', [\App\Http\Controllers\TaxonomyController::class, 'categoryIndex'])->name('category.index');
Route::get('/category/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'categoryShow'])->name('category.show');

Route::get('/author', [\App\Http\Controllers\TaxonomyController::class, 'authorIndex'])->name('author.index');
Route::get('/author/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'authorShow'])->name('author.show');

Route::get('/about', [\App\Http\Controllers\PageController::class, 'about'])->name('page.about');
Route::get('/contact', [\App\Http\Controllers\PageController::class, 'contact'])->name('page.contact');
Route::post('/contact', [\App\Http\Controllers\PageController::class, 'submitContact'])->name('page.contact.submit');
Route::get('/editorial-policy', [\App\Http\Controllers\PageController::class, 'editorialPolicy'])->name('page.editorialPolicy');
Route::get('/fact-checking-policy', [\App\Http\Controllers\PageController::class, 'factCheckingPolicy'])->name('page.factCheckingPolicy');
Route::get('/privacy', [\App\Http\Controllers\PageController::class, 'privacy'])->name('page.privacy');
Route::get('/terms', [\App\Http\Controllers\PageController::class, 'terms'])->name('page.terms');
Route::get('/search', [\App\Http\Controllers\SearchController::class, 'index'])->name('search.index');

Route::middleware(['auth', 'admin'])->get('/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        return \Illuminate\Support\Facades\Artisan::output();
    } catch (\Exception $e) {
        return $e->getMessage();
    }
});

// Admin Routes (Protected by Auth and Admin middleware)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.index');
    Route::get('/admin/posts/new', [\App\Http\Controllers\Admin\PostController::class, 'create'])->name('admin.posts.new');
    Route::get('/admin/posts/edit/{id}', [\App\Http\Controllers\Admin\PostController::class, 'edit'])->name('admin.posts.edit');
    Route::post('/api/admin/posts', [\App\Http\Controllers\Admin\PostController::class, 'store'])->name('admin.posts.store');
    Route::get('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'getPosts']);
    Route::get('/api/admin/community-posts', [\App\Http\Controllers\Api\AdminApiController::class, 'getCommunityPosts']);
    Route::post('/api/admin/upload', [\App\Http\Controllers\Api\AdminApiController::class, 'uploadMedia']);
    Route::delete('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'deletePost']);
    
    Route::get('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'getCommunities']);
    Route::post('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'storeCommunity']);
    Route::delete('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteCommunity']);
    
    Route::get('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'getAuthors']);
    Route::post('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'storeAuthor']);
    Route::delete('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteAuthor']);
    
    Route::get('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'getCategories']);
    Route::post('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeCategory']);
    Route::delete('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteCategory']);
    
    Route::get('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'getStories']);
    Route::post('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeStory']);
    Route::delete('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteStory']);
    
    Route::get('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'getMedia']);
    Route::post('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'storeMedia']);
    Route::delete('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteMedia']);
    
    Route::get('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'getSliders']);
    Route::post('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'storeSlider']);
    Route::delete('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteSlider']);
    
    Route::get('/api/admin/businesses', [\App\Http\Controllers\Api\AdminApiController::class, 'getBusinesses']);
    Route::delete('/api/admin/businesses', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteBusiness']);
    
    Route::get('/admin/businesses', function () { return \Inertia\Inertia::render('Admin/Businesses/Index'); })->name('admin.businesses');
    Route::get('/admin/community-posts', function () { return \Inertia\Inertia::render('Admin/CommunityPosts/Index'); })->name('admin.community-posts');

    Route::get('/admin/communities', function () { return \Inertia\Inertia::render('Admin/Communities/Index'); })->name('admin.communities');
    Route::get('/admin/communities/edit/{id}', function ($id) {
        $community = \App\Models\Community::find($id);
        if (!$community) abort(404, 'Community not found');
        return \Inertia\Inertia::render('Admin/Communities/Edit', ['community' => $community]);
    })->name('admin.communities.edit');

    Route::get('/admin/authors', function () { return \Inertia\Inertia::render('Admin/Authors/Index'); })->name('admin.authors');
    Route::get('/admin/authors/new', function () { return \Inertia\Inertia::render('Admin/Authors/New'); })->name('admin.authors.new');
    Route::get('/admin/authors/edit/{id}', function ($id) {
        $author = \App\Models\Author::find($id);
        if (!$author) abort(404, 'Author not found');
        return \Inertia\Inertia::render('Admin/Authors/Edit', ['author' => $author]);
    })->name('admin.authors.edit');
    
    Route::get('/admin/categories', function () { return \Inertia\Inertia::render('Admin/Categories/Index'); })->name('admin.categories');
    
    Route::get('/admin/stories', function () { return \Inertia\Inertia::render('Admin/Stories/Index'); })->name('admin.stories');
    Route::get('/admin/stories/new', function () { return \Inertia\Inertia::render('Admin/Stories/New'); })->name('admin.stories.new');
    
    Route::get('/admin/media', function () { return \Inertia\Inertia::render('Admin/Media/Index'); })->name('admin.media');
    Route::get('/admin/seo-audit', function () { return \Inertia\Inertia::render('Admin/SeoAudit/Index'); })->name('admin.seo');
    Route::get('/admin/slider', function () { return \Inertia\Inertia::render('Admin/Settings/Slider'); })->name('admin.slider');

    // Contact Messages
    Route::get('/api/admin/contact-messages', [\App\Http\Controllers\Api\AdminApiController::class, 'getContactMessages']);
    Route::delete('/api/admin/contact-messages/{id}', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteContactMessage']);
    Route::patch('/api/admin/contact-messages/{id}/read', [\App\Http\Controllers\Api\AdminApiController::class, 'readContactMessage']);
    Route::get('/admin/contact-messages', function () { return \Inertia\Inertia::render('Admin/ContactMessages/Index'); })->name('admin.contact-messages');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard', [
        'userBusinesses' => \App\Models\Business::where('user_id', auth()->id())
            ->orWhere('email', auth()->user()->email)
            ->get(),
        'userCommunities' => \App\Models\Community::where('owner_id', auth()->id())->get()
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/businesses/create', function () {
    return Inertia::render('Business/Create');
})->middleware(['auth', 'verified'])->name('businesses.create');

Route::get('/test-edit', function() {
    return "Route is working! Cache is cleared.";
});

Route::get('/businesses/{slug}/edit', function ($slug) {
    $business = \App\Models\Business::where('slug', $slug)->orWhere('id', $slug)->first();
    if (!$business) {
        abort(404, 'Business not found');
    }

    $user = request()->user();
    $canAdminister = in_array($user->role, ['admin', 'super_admin'], true)
        || (bool) $user->getAttribute('is_admin');
    abort_unless($business->user_id === $user->id || $canAdminister, 403);

    return Inertia::render('Business/Edit', [
        'business' => $business
    ]);
})->middleware(['auth', 'verified'])->name('businesses.edit');

Route::middleware('auth')->group(function () {
    Route::get('/submit', [\App\Http\Controllers\PostController::class, 'create'])->name('post.create');
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store'])->name('post.store');
    Route::put('/posts/{post}', [\App\Http\Controllers\PostController::class, 'update'])->name('post.update');
    Route::delete('/posts/{post}', [\App\Http\Controllers\PostController::class, 'destroy'])->name('post.destroy');
    Route::post('/posts/{post}/save', [\App\Http\Controllers\PostController::class, 'toggleSave'])->name('post.save');
    Route::post('/vote', [\App\Http\Controllers\VoteController::class, 'vote'])->name('vote');
    Route::post('/posts/{post}/comments', [\App\Http\Controllers\PostController::class, 'storeComment'])->name('post.comment.store');
    Route::post('/api/upload', [\App\Http\Controllers\PostController::class, 'uploadImage'])->name('api.upload');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// Reviews SEO Routes
Route::get('/reviews', [\App\Http\Controllers\ReviewPageController::class, 'index'])->name('reviews.index');
Route::get('/reviews/{category}', [\App\Http\Controllers\ReviewPageController::class, 'category'])->name('reviews.category');
Route::get('/reviews/{category}/{business}', [\App\Http\Controllers\ReviewPageController::class, 'business'])->name('reviews.business');

// Reviews API Routes
Route::get('/api/businesses', [\App\Http\Controllers\Api\BusinessController::class, 'index']);
Route::get('/api/businesses/{slug}', [\App\Http\Controllers\Api\BusinessController::class, 'show']);
Route::get('/api/businesses/{businessId}/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'index']);
Route::middleware('auth')->group(function () {
    Route::post('/api/businesses', [\App\Http\Controllers\Api\BusinessController::class, 'store']);
    Route::put('/api/businesses/{id}', [\App\Http\Controllers\Api\BusinessController::class, 'update']);
    Route::post('/api/reviews', [\App\Http\Controllers\Api\ReviewController::class, 'store']);
    Route::post('/api/reviews/{id}/vote', [\App\Http\Controllers\Api\ReviewController::class, 'vote']);
    Route::post('/api/reviews/{id}/reply', [\App\Http\Controllers\Api\ReviewController::class, 'reply']);
});
Route::get('/api/search/suggestions', [\App\Http\Controllers\SearchController::class, 'suggestions']);

// Public image variants are generated once and then served as immutable WebP files.
Route::get('/images/{width}/{path}', [\App\Http\Controllers\ResponsiveImageController::class, 'show'])
    ->whereNumber('width')
    ->where('path', '.*')
    ->name('images.responsive');

require __DIR__.'/auth.php';

Route::middleware(['auth', 'admin'])->get('/create-storage-link', function () {
    try {
        $targetFolder = storage_path('app/public');
        $linkFolder = $_SERVER['DOCUMENT_ROOT'] . '/storage';
        
        if (file_exists($linkFolder)) {
            return "Symlink or folder already exists at: " . $linkFolder;
        }
        
        symlink($targetFolder, $linkFolder);
        return "Storage link created successfully at $linkFolder pointing to $targetFolder";
    } catch (\Exception $e) {
        return "Error creating storage link: " . $e->getMessage();
    }
});

// Fallback route to serve images if symlink is broken or missing
Route::get('/storage/{path}', function ($path) {
    $fullPath = storage_path('app/public/' . $path);
    if (!file_exists($fullPath)) {
        abort(404);
    }
    
    $mimeType = \Illuminate\Support\Facades\File::mimeType($fullPath);
    $headers = ['Content-Type' => $mimeType];
    
    return response()->file($fullPath, $headers);
})->where('path', '.*');

Route::middleware(['auth', 'admin'])->get('/fix-admin-temp', function () {
    if (request('key') !== env('APP_KEY')) abort(403);
    $user = \App\Models\User::firstOrCreate(
        ['email' => 'admin@example.com'],
        ['name' => 'Admin User', 'password' => \Illuminate\Support\Facades\Hash::make('password')]
    );
    $user->password = \Illuminate\Support\Facades\Hash::make('password');
    $user->role = 'super_admin';
    // Use is_admin only if the column exists, to prevent errors on older schemas
    if (\Illuminate\Support\Facades\Schema::hasColumn('users', 'is_admin')) {
        $user->is_admin = true;
    }
    $user->save();
    return 'Admin email and password fixed. You can now login with admin@example.com and password "password".';
});
Route::fallback(function () {
    $path = request()->path();
    // Redirect old root-level post slugs to /blog/...
    $post = \App\Models\Post::where('slug', $path)->first();
    if ($post) {
        return redirect('/blog/' . $path, 301);
    }
    return redirect('/');
});
