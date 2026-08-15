<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/sitemap.xml', [\App\Http\Controllers\SitemapController::class, 'index'])->name('sitemap.index');
Route::get('/news-sitemap.xml', [\App\Http\Controllers\NewsSitemapController::class, 'index'])->name('sitemap.news');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

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
Route::get('/editorial-policy', [\App\Http\Controllers\PageController::class, 'editorialPolicy'])->name('page.editorialPolicy');
Route::get('/fact-checking-policy', [\App\Http\Controllers\PageController::class, 'factCheckingPolicy'])->name('page.factCheckingPolicy');
Route::get('/privacy', [\App\Http\Controllers\PageController::class, 'privacy'])->name('page.privacy');
Route::get('/terms', [\App\Http\Controllers\PageController::class, 'terms'])->name('page.terms');
Route::get('/search', [\App\Http\Controllers\SearchController::class, 'index'])->name('search.index');


// Admin Routes (Protected by Auth middleware)
Route::middleware(['auth'])->group(function () {
    Route::get('/admin', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.index');
    Route::get('/admin/posts/new', [\App\Http\Controllers\Admin\PostController::class, 'create'])->name('admin.posts.new');
    Route::get('/admin/posts/edit/{id}', [\App\Http\Controllers\Admin\PostController::class, 'edit'])->name('admin.posts.edit');
    Route::post('/api/admin/posts', [\App\Http\Controllers\Admin\PostController::class, 'store'])->name('admin.posts.store')->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::get('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'getPosts']);
    Route::post('/api/admin/upload', [\App\Http\Controllers\Api\AdminApiController::class, 'uploadMedia'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'deletePost'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    Route::get('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'getAuthors']);
    Route::post('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'storeAuthor'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteAuthor'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    Route::get('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'getCategories']);
    Route::post('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeCategory'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteCategory'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    Route::get('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'getStories']);
    Route::post('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeStory'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteStory'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    Route::get('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'getMedia']);
    Route::post('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'storeMedia'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/media', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteMedia'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
    Route::get('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'getSliders']);
    Route::post('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'storeSlider'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    Route::delete('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteSlider'])->withoutMiddleware([\Illuminate\Foundation\Http\Middleware\VerifyCsrfToken::class]);
    
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
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/submit', [\App\Http\Controllers\PostController::class, 'create'])->name('post.create');
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store'])->name('post.store');
    Route::put('/posts/{post}', [\App\Http\Controllers\PostController::class, 'update'])->name('post.update');
    Route::delete('/posts/{post}', [\App\Http\Controllers\PostController::class, 'destroy'])->name('post.destroy');
    Route::post('/posts/{post}/save', [\App\Http\Controllers\PostController::class, 'toggleSave'])->name('post.save');
    Route::post('/vote', [\App\Http\Controllers\VoteController::class, 'vote'])->name('vote');
    Route::post('/posts/{post}/comments', [\App\Http\Controllers\PostController::class, 'storeComment'])->name('post.comment.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
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
