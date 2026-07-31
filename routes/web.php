<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\HomeController::class, 'index'])->name('home');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show');

Route::get('/stories', [\App\Http\Controllers\StoryController::class, 'index'])->name('story.index');
Route::get('/stories/{slug}', [\App\Http\Controllers\StoryController::class, 'show'])->name('story.show');

Route::get('/category/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'categoryShow'])->name('category.show');

Route::get('/author', [\App\Http\Controllers\TaxonomyController::class, 'authorIndex'])->name('author.index');
Route::get('/author/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'authorShow'])->name('author.show');

Route::get('/about', [\App\Http\Controllers\PageController::class, 'about'])->name('page.about');
Route::get('/contact', [\App\Http\Controllers\PageController::class, 'contact'])->name('page.contact');
Route::get('/editorial-policy', [\App\Http\Controllers\PageController::class, 'editorialPolicy'])->name('page.editorialPolicy');
Route::get('/fact-checking-policy', [\App\Http\Controllers\PageController::class, 'factCheckingPolicy'])->name('page.factCheckingPolicy');
Route::get('/privacy', [\App\Http\Controllers\PageController::class, 'privacy'])->name('page.privacy');
Route::get('/terms', [\App\Http\Controllers\PageController::class, 'terms'])->name('page.terms');
Route::get('/search', [\App\Http\Controllers\PageController::class, 'search'])->name('page.search');

// Fallback for cPanel users to run migrations via browser
Route::get('/run-migrations', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();
        return "Migrations completed successfully!<br><pre>" . $output . "</pre>";
    } catch (\Exception $e) {
        return "Migration failed: " . $e->getMessage();
    }
});

Route::get('/run-data-transfer', function () {
    try {
        $log = "";
        
        // Migrate Authors
        $authorsPath = storage_path('app/data/authors.json');
        if (\Illuminate\Support\Facades\File::exists($authorsPath)) {
            $authors = json_decode(\Illuminate\Support\Facades\File::get($authorsPath), true);
            foreach ($authors as $author) {
                \App\Models\Author::updateOrCreate(
                    ['id' => $author['id']],
                    [
                        'name' => $author['name'] ?? null,
                        'slug' => $author['slug'] ?? \Illuminate\Support\Str::slug($author['name'] ?? ''),
                        'bio' => $author['bio'] ?? null,
                        'image' => $author['image'] ?? null,
                        'jobTitle' => $author['jobTitle'] ?? null,
                        'experienceYears' => $author['experienceYears'] ?? null,
                        'socials' => $author['socials'] ?? null,
                    ]
                );
            }
            $log .= "Authors migrated: " . count($authors) . "<br>";
            \Illuminate\Support\Facades\File::delete($authorsPath);
        }

        // Migrate Categories
        $categoriesPath = storage_path('app/data/categories.json');
        if (\Illuminate\Support\Facades\File::exists($categoriesPath)) {
            $categories = json_decode(\Illuminate\Support\Facades\File::get($categoriesPath), true);
            foreach ($categories as $cat) {
                \App\Models\Category::updateOrCreate(
                    ['id' => $cat['id'] ?? \Illuminate\Support\Str::uuid()],
                    [
                        'name' => $cat['name'] ?? null,
                        'slug' => $cat['slug'] ?? \Illuminate\Support\Str::slug($cat['name'] ?? ''),
                        'description' => $cat['description'] ?? null,
                    ]
                );
            }
            $log .= "Categories migrated: " . count($categories) . "<br>";
            \Illuminate\Support\Facades\File::delete($categoriesPath);
        }

        // Migrate Stories
        $storiesPath = storage_path('app/data/stories.json');
        if (\Illuminate\Support\Facades\File::exists($storiesPath)) {
            $stories = json_decode(\Illuminate\Support\Facades\File::get($storiesPath), true);
            foreach ($stories as $story) {
                \App\Models\Story::updateOrCreate(
                    ['id' => $story['id']],
                    [
                        'title' => $story['title'] ?? null,
                        'slug' => $story['slug'] ?? \Illuminate\Support\Str::slug($story['title'] ?? ''),
                        'description' => $story['description'] ?? null,
                        'posterImage' => $story['posterImage'] ?? null,
                        'category' => $story['category'] ?? null,
                        'author' => $story['author'] ?? null,
                        'date' => isset($story['date']) ? \Carbon\Carbon::parse($story['date']) : null,
                        'pages' => $story['pages'] ?? null,
                        'published' => $story['published'] ?? false,
                    ]
                );
            }
            $log .= "Stories migrated: " . count($stories) . "<br>";
            \Illuminate\Support\Facades\File::delete($storiesPath);
        }

        // Migrate Posts
        $postsPath = storage_path('app/data/posts.json');
        if (\Illuminate\Support\Facades\File::exists($postsPath)) {
            $posts = json_decode(\Illuminate\Support\Facades\File::get($postsPath), true);
            foreach ($posts as $post) {
                \App\Models\Post::updateOrCreate(
                    ['id' => $post['id']],
                    [
                        'title' => $post['title'] ?? null,
                        'slug' => $post['slug'] ?? \Illuminate\Support\Str::slug($post['title'] ?? ''),
                        'content' => $post['content'] ?? null,
                        'metaDescription' => $post['metaDescription'] ?? null,
                        'excerpt' => $post['excerpt'] ?? null,
                        'coverImage' => $post['coverImage'] ?? null,
                        'authorImage' => $post['authorImage'] ?? null,
                        'authorSocials' => $post['authorSocials'] ?? null,
                        'seoTitle' => $post['seoTitle'] ?? null,
                        'ogTitle' => $post['ogTitle'] ?? null,
                        'ogDescription' => $post['ogDescription'] ?? null,
                        'canonicalUrl' => $post['canonicalUrl'] ?? null,
                        'keywords' => $post['keywords'] ?? null,
                        'category' => $post['category'] ?? null,
                        'tags' => $post['tags'] ?? null,
                        'faqs' => $post['faqs'] ?? null,
                        'published' => $post['published'] ?? false,
                        'date' => isset($post['date']) ? \Carbon\Carbon::parse($post['date']) : null,
                        'author' => $post['author'] ?? null,
                    ]
                );
            }
            $log .= "Posts migrated: " . count($posts) . "<br>";
            \Illuminate\Support\Facades\File::delete($postsPath);
        }

        return "Data Transfer Completed Successfully!<br><br>" . ($log ?: "No JSON files found to migrate.");
    } catch (\Exception $e) {
        return "Transfer failed: " . $e->getMessage() . "<br>Line: " . $e->getLine() . "<br>File: " . $e->getFile();
    }
});

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
    
    // Additional Admin pages mapped to Inertia placeholders
    Route::get('/admin/authors', function () { return \Inertia\Inertia::render('Admin/Authors/Index'); })->name('admin.authors');
    Route::get('/admin/authors/new', function () { return \Inertia\Inertia::render('Admin/Authors/New'); })->name('admin.authors.new');
    
    Route::get('/admin/categories', function () { return \Inertia\Inertia::render('Admin/Categories/Index'); })->name('admin.categories');
    
    Route::get('/admin/stories', function () { return \Inertia\Inertia::render('Admin/Stories/Index'); })->name('admin.stories');
    Route::get('/admin/stories/new', function () { return \Inertia\Inertia::render('Admin/Stories/New'); })->name('admin.stories.new');
    
    Route::get('/admin/media', function () { return \Inertia\Inertia::render('Admin/Media/Index'); })->name('admin.media');
    Route::get('/admin/seo-audit', function () { return \Inertia\Inertia::render('Admin/SeoAudit/Index'); })->name('admin.seo');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';

Route::get('/check-env', function () {
    try {
        $dbConn = config('database.default');
        $dbHost = config('database.connections.'.$dbConn.'.host', 'N/A');
        $dbName = config('database.connections.'.$dbConn.'.database', 'N/A');
        $dbUser = config('database.connections.'.$dbConn.'.username', 'N/A');
        $dbPass = config('database.connections.'.$dbConn.'.password', '');
        
        $info = [
            'php_version' => phpversion(),
            'laravel_env' => app()->environment(),
            'db_connection' => $dbConn,
            'db_host' => $dbHost,
            'db_database' => $dbName,
            'db_username' => $dbUser,
            'db_password_length' => strlen($dbPass) . ' chars',
            'app_url' => config('app.url'),
        ];
        
        // Test DB connection
        try {
            \Illuminate\Support\Facades\DB::connection()->getPdo();
            $info['db_status'] = '✅ Connected Successfully!';
        } catch (\Exception $e) {
            $info['db_status'] = '❌ FAILED: ' . $e->getMessage();
        }
        
        return '<pre>' . print_r($info, true) . '</pre>';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/clear-cache', function () {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    \Illuminate\Support\Facades\Artisan::call('view:clear');
    return 'Cache Cleared! Now try /run-migration again.';
});

Route::get('/run-migration', function () {
    try {
        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $output = \Illuminate\Support\Facades\Artisan::output();
        return '<pre>Migration Done!&#10;' . $output . '</pre>';
    } catch (\Exception $e) {
        return 'Migration Failed: ' . $e->getMessage();
    }
});

Route::get('/create-admin', function () {
    \App\Models\User::firstOrCreate(
        ['email' => 'admin@example.com'],
        [
            'name' => 'Admin',
            'password' => \Illuminate\Support\Facades\Hash::make('password')
        ]
    );
    return 'Admin Account Created! Email: admin@example.com | Password: password';
});

Route::get('/force-admin', function () {
    \App\Models\User::updateOrCreate(
        ['email' => 'super@example.com'],
        ['name' => 'Super Admin', 'password' => \Illuminate\Support\Facades\Hash::make('12345678')]
    );
    return 'Super Admin created! Email: super@example.com | Password: 12345678';
});
