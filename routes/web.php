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

Route::get('/run-image-migration', function () {
    // Increase max execution time for downloading images
    ini_set('max_execution_time', 600);

    $posts = \Illuminate\Support\Facades\DB::table('posts')->get();
    $downloadedCount = 0;

    if (!\Illuminate\Support\Facades\Storage::disk('public')->exists('wp-images')) {
        \Illuminate\Support\Facades\Storage::disk('public')->makeDirectory('wp-images');
    }

    foreach ($posts as $post) {
        $updated = false;
        $coverImage = $post->coverImage;
        $content = $post->content;

        // Process Cover Image
        if ($coverImage && str_starts_with($coverImage, 'http')) {
            $newPath = downloadAndSaveImageWeb($coverImage);
            if ($newPath) {
                $coverImage = $newPath;
                $updated = true;
                $downloadedCount++;
            }
        }

        // Process Images in Content
        if ($content) {
            preg_match_all('/<img[^>]+src="([^">]+)"/i', $content, $matches);
            if (!empty($matches[1])) {
                foreach ($matches[1] as $oldUrl) {
                    if (str_starts_with($oldUrl, 'http')) {
                        $newPath = downloadAndSaveImageWeb($oldUrl);
                        if ($newPath) {
                            $content = str_replace($oldUrl, $newPath, $content);
                            $updated = true;
                            $downloadedCount++;
                        }
                    }
                }
            }
        }

        if ($updated) {
            \Illuminate\Support\Facades\DB::table('posts')->where('id', $post->id)->update([
                'coverImage' => $coverImage,
                'content' => $content,
                'updated_at' => now(),
            ]);
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => "Migration complete! Successfully downloaded and updated {$downloadedCount} images."
    ]);
});

function downloadAndSaveImageWeb($url) {
    try {
        $cleanUrl = strtok($url, '?');
        $extension = pathinfo($cleanUrl, PATHINFO_EXTENSION) ?: 'jpg';
        $filename = \Illuminate\Support\Str::random(40) . '.' . $extension;
        
        $response = \Illuminate\Support\Facades\Http::timeout(30)->get($url);
        if ($response->successful()) {
            $path = 'wp-images/' . $filename;
            \Illuminate\Support\Facades\Storage::disk('public')->put($path, $response->body());
            return '/storage/' . $path;
        }
    } catch (\Exception $e) {}
    return null;
}

Route::get('/clean-duplicate-images', function () {
    $posts = \Illuminate\Support\Facades\DB::table('posts')->get();
    $cleanedCount = 0;

    foreach ($posts as $post) {
        $content = $post->content;
        $coverImage = $post->coverImage;

        if (!$content || !$coverImage) continue;

        // Get the filename of the cover image (without extension or dimension suffix)
        $filename = pathinfo($coverImage, PATHINFO_FILENAME);
        $filename = preg_replace('/-\d+x\d+$/', '', $filename);
        $filenameQ = preg_quote($filename, '/');

        // Regex to find <figure> or <img> containing this filename at the beginning of the content
        $pattern = '/^[\s\r\n]*(<figure[^>]*>.*?<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>.*?<\/figure>|<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>)/is';
        
        $newContent = preg_replace($pattern, '', $content);
        
        // Sometimes it's wrapped in paragraphs
        $pattern2 = '/^[\s\r\n]*<p[^>]*>[\s\r\n]*(<figure[^>]*>.*?<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>.*?<\/figure>|<img[^>]+src="[^"]*' . $filenameQ . '[^"]*"[^>]*>)[\s\r\n]*<\/p>/is';
        $newContent = preg_replace($pattern2, '', $newContent);

        if ($newContent !== $content) {
            \Illuminate\Support\Facades\DB::table('posts')->where('id', $post->id)->update([
                'content' => trim($newContent)
            ]);
            $cleanedCount++;
        }
    }

    return response()->json([
        'status' => 'success',
        'message' => "Cleaned duplicate cover images from {$cleanedCount} posts."
    ]);
});

require __DIR__.'/auth.php';

Route::get('/run-migrations', function () {
    \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    return \Illuminate\Support\Facades\Artisan::output();
});

Route::get('/fix-posts', function () {
    $count = \App\Models\Post::where('published', false)->update(['published' => true]);
    return "Successfully updated {$count} hidden posts to be published!";
});

Route::get('/clear-cache', function() {
    \Illuminate\Support\Facades\Artisan::call('config:clear');
    \Illuminate\Support\Facades\Artisan::call('cache:clear');
    return 'Cache & Config Cleared! Now you can visit the migration URLs.';
});

Route::get('/force-clear', function() {
    $files = [
        base_path('bootstrap/cache/config.php'),
        base_path('bootstrap/cache/routes-v7.php'),
        base_path('bootstrap/cache/packages.php'),
        base_path('bootstrap/cache/services.php'),
    ];
    $deleted = [];
    foreach ($files as $file) {
        if (file_exists($file)) {
            @unlink($file);
            $deleted[] = basename($file);
        }
    }
    return 'Force cleared cache files: ' . implode(', ', $deleted) . '. Now please visit /db-test again!';
});

Route::get('/env-test', function() {
    return response()->json([
        'env_file_exists' => file_exists(base_path('.env')),
        'DB_DATABASE_FROM_ENV' => env('DB_DATABASE'),
        'DB_USERNAME_FROM_ENV' => env('DB_USERNAME'),
        'DB_DATABASE_FROM_CONFIG' => config('database.connections.mysql.database'),
        'DB_USERNAME_FROM_CONFIG' => config('database.connections.mysql.username'),
    ]);
});

Route::get('/db-test', function() {
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $tables = \Illuminate\Support\Facades\DB::select('SHOW TABLES');
        $postCount = 0;
        if (\Illuminate\Support\Facades\Schema::hasTable('posts')) {
            $postCount = \Illuminate\Support\Facades\DB::table('posts')->count();
        }
        return response()->json([
            'status' => 'success',
            'message' => 'Successfully connected to the database!',
            'database_name' => \Illuminate\Support\Facades\DB::connection()->getDatabaseName(),
            'tables_found' => count($tables),
            'total_posts' => $postCount
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => 'Could not connect to the database.',
            'error_details' => $e->getMessage(),
            'database_name_in_config' => config('database.connections.mysql.database'),
            'username_in_config' => config('database.connections.mysql.username'),
            'host' => config('database.connections.mysql.host'),
        ]);
    }
});

Route::get('/storage-link', function() {
    try {
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        return 'Storage link created successfully!';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/fix-images', function() {
    try {
        $publicStoragePath = public_path('storage');
        if (file_exists($publicStoragePath) || is_link($publicStoragePath)) {
            unlink($publicStoragePath);
        }
        \Illuminate\Support\Facades\Artisan::call('storage:link');
        return 'Images fixed! The storage link was recreated successfully. Please refresh your website.';
    } catch (\Exception $e) {
        return 'Error: ' . $e->getMessage();
    }
});

Route::get('/fix-db-urls', function() {
    $tables = [
        ['table' => 'posts', 'columns' => ['content', 'coverImage', 'authorImage']],
        ['table' => 'authors', 'columns' => ['image', 'bio']],
        ['table' => 'categories', 'columns' => ['image', 'description']],
    ];
    $badUrls = [
        'https://coachingsinsikar.com/list/public/uploads/',
        'https://coachingsinsikar.com/public/uploads/'
    ];
    $goodUrl = 'https://coachingsinsikar.com/uploads/';
    $count = 0;
    foreach ($tables as $t) {
        $records = \Illuminate\Support\Facades\DB::table($t['table'])->get();
        foreach ($records as $record) {
            $update = [];
            foreach ($t['columns'] as $col) {
                if (!empty($record->{$col})) {
                    $val = $record->{$col};
                    foreach ($badUrls as $bad) {
                        if (str_contains($val, $bad)) {
                            $val = str_replace($bad, $goodUrl, $val);
                        }
                    }
                    if ($val !== $record->{$col}) {
                        $update[$col] = $val;
                    }
                }
            }
            if (!empty($update)) {
                \Illuminate\Support\Facades\DB::table($t['table'])->where('id', $record->id)->update($update);
                $count++;
            }
        }
    }
    return "Database updated successfully! Fixed {$count} records that had the wrong /public/ or /list/public/ paths in their images.";
});

Route::get('/fix-image-paths', function() {
    $tables = [
        ['table' => 'posts', 'columns' => ['content', 'coverImage', 'authorImage', 'media_urls']],
        ['table' => 'authors', 'columns' => ['image', 'bio']],
        ['table' => 'categories', 'columns' => ['image', 'description']],
    ];
    $goodBase = 'https://coachingsinsikar.com/uploads/';
    $count = 0;
    
    foreach ($tables as $t) {
        $records = \Illuminate\Support\Facades\DB::table($t['table'])->get();
        foreach ($records as $record) {
            $update = [];
            foreach ($t['columns'] as $col) {
                if (!empty($record->{$col})) {
                    $val = $record->{$col};
                    
                    // Array of old paths to replace with the new base URL
                    $replacements = [
                        'http://localhost/uploads/' => $goodBase,
                        'http://localhost/storage/wp-images/' => $goodBase,
                        'http://localhost/storage/uploads/' => $goodBase,
                        'http://localhost/storage/' => $goodBase,
                        'https://coachingsinsikar.com/storage/wp-images/' => $goodBase,
                        'https://coachingsinsikar.com/storage/uploads/' => $goodBase,
                        'https://coachingsinsikar.com/storage/' => $goodBase,
                        
                        // HTML and JSON contexts
                        '="/storage/wp-images/' => '="' . $goodBase,
                        '="/storage/uploads/' => '="' . $goodBase,
                        '="/storage/' => '="' . $goodBase,
                        
                        '"/storage/wp-images/' => '"' . $goodBase,
                        '"/storage/uploads/' => '"' . $goodBase,
                        '"/storage/' => '"' . $goodBase,
                    ];
                    
                    foreach ($replacements as $old => $new) {
                        if (str_contains($val, $old)) {
                            $val = str_replace($old, $new, $val);
                        }
                    }
                    
                    // Check if string exactly starts with relative storage paths
                    if (str_starts_with($val, '/storage/wp-images/')) {
                        $val = str_replace('/storage/wp-images/', $goodBase, $val);
                    } elseif (str_starts_with($val, '/storage/uploads/')) {
                        $val = str_replace('/storage/uploads/', $goodBase, $val);
                    } elseif (str_starts_with($val, '/storage/')) {
                        $val = str_replace('/storage/', $goodBase, $val);
                    }

                    if ($val !== $record->{$col}) {
                        $update[$col] = $val;
                    }
                }
            }
            if (!empty($update)) {
                \Illuminate\Support\Facades\DB::table($t['table'])->where('id', $record->id)->update($update);
                $count++;
            }
        }
    }
    return "Successfully updated {$count} records! All image paths now point to https://coachingsinsikar.com/uploads/";
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
