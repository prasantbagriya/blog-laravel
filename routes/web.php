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
Route::get('/sitemap/businesses.xml', [\App\Http\Controllers\SitemapController::class, 'businesses'])->name('sitemap.businesses');
Route::get('/news-sitemap.xml', [\App\Http\Controllers\NewsSitemapController::class, 'index'])->name('sitemap.news');

Route::get('/blog', [\App\Http\Controllers\BlogController::class, 'index'])->name('blog.index')->middleware('cacheResponse:86400');
Route::get('/blog/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.show')->middleware('cacheResponse:86400');
Route::get('/blog/{category}/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('blog.category.show')->middleware('cacheResponse:86400');

Route::get('/news', [\App\Http\Controllers\BlogController::class, 'index'])->name('news.index')->middleware('cacheResponse:86400');
Route::get('/news/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('news.show')->middleware('cacheResponse:86400');
Route::get('/news/{category}/{slug}', [\App\Http\Controllers\BlogController::class, 'show'])->name('news.category.show')->middleware('cacheResponse:86400');


// Redirect all old /public/... URLs to /blog/...
Route::get('/public/{any?}', function ($any = '') {
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
    
    Route::post('/reports', [\App\Http\Controllers\ReportController::class, 'store'])->name('reports.store')->middleware('throttle:20,1');
    Route::get('/community/{community}/modqueue', [\App\Http\Controllers\CommunityController::class, 'modqueue'])->name('community.modqueue');
    Route::post('/reports/{report}/approve', [\App\Http\Controllers\CommunityController::class, 'approveReport'])->name('reports.approve');
    Route::post('/reports/{report}/remove', [\App\Http\Controllers\CommunityController::class, 'removeReport'])->name('reports.remove');
    
    Route::post('/notifications/mark-read', [\App\Http\Controllers\NotificationController::class, 'markRead'])->name('notifications.markRead');
});

Route::get('/stories', [\App\Http\Controllers\StoryController::class, 'index'])->name('story.index')->middleware('cacheResponse:86400');
Route::get('/stories/{slug}', [\App\Http\Controllers\StoryController::class, 'show'])->name('story.show')->middleware('cacheResponse:86400');

Route::get('/category', [\App\Http\Controllers\TaxonomyController::class, 'categoryIndex'])->name('category.index')->middleware('cacheResponse:86400');
Route::get('/category/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'categoryShow'])->name('category.show')->middleware('cacheResponse:86400');

Route::get('/author', [\App\Http\Controllers\TaxonomyController::class, 'authorIndex'])->name('author.index')->middleware('cacheResponse:86400');
Route::get('/author/{slug}', [\App\Http\Controllers\TaxonomyController::class, 'authorShow'])->name('author.show')->middleware('cacheResponse:86400');

Route::get('/about', [\App\Http\Controllers\PageController::class, 'about'])->name('page.about')->middleware('cacheResponse:86400');
Route::get('/contact', [\App\Http\Controllers\PageController::class, 'contact'])->name('page.contact')->middleware('cacheResponse:86400');
Route::post('/contact', [\App\Http\Controllers\PageController::class, 'submitContact'])->name('page.contact.submit')->middleware('throttle:5,1');
Route::get('/editorial-policy', [\App\Http\Controllers\PageController::class, 'editorialPolicy'])->name('page.editorialPolicy')->middleware('cacheResponse:86400');
Route::get('/fact-checking-policy', [\App\Http\Controllers\PageController::class, 'factCheckingPolicy'])->name('page.factCheckingPolicy')->middleware('cacheResponse:86400');
Route::get('/privacy', [\App\Http\Controllers\PageController::class, 'privacy'])->name('page.privacy')->middleware('cacheResponse:86400');
Route::get('/terms', [\App\Http\Controllers\PageController::class, 'terms'])->name('page.terms')->middleware('cacheResponse:86400');
Route::get('/search', [\App\Http\Controllers\SearchController::class, 'index'])->name('search.index');



// Admin Routes (Protected by Auth and Admin middleware)
Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('/admin', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('admin.index');
    Route::get('/admin/posts/new', [\App\Http\Controllers\Admin\PostController::class, 'create'])->name('admin.posts.new');
    Route::get('/admin/posts/edit/{id}', [\App\Http\Controllers\Admin\PostController::class, 'edit'])->name('admin.posts.edit');
    Route::post('/api/admin/posts', [\App\Http\Controllers\Admin\PostController::class, 'store'])->name('admin.posts.store');
    Route::post('/api/admin/ai/research-post', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'researchAndGenerate']);
    Route::post('/api/admin/ai/expand-section', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'expandSection']);
    Route::post('/api/admin/ai/scrape-url', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'scrapeUrl']);
    Route::get('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'getPosts']);
    Route::get('/api/admin/community-posts', [\App\Http\Controllers\Api\AdminApiController::class, 'getCommunityPosts']);
    Route::post('/api/admin/upload', [\App\Http\Controllers\Api\Admin\MediaController::class, 'uploadMedia']);
    Route::post('/api/admin/upload-category', [\App\Http\Controllers\Api\Admin\MediaController::class, 'uploadCategoryImage']);
    Route::post('/api/admin/social/upload-image', [\App\Http\Controllers\Api\Admin\MediaController::class, 'uploadSocialImage']);
    Route::delete('/api/admin/posts', [\App\Http\Controllers\Api\AdminApiController::class, 'deletePost']);
    
    Route::get('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'getCommunities']);
    Route::post('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'storeCommunity']);
    Route::delete('/api/admin/communities', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteCommunity']);
    Route::get('/api/admin/users', [\App\Http\Controllers\Api\AdminApiController::class, 'getUsers']);
    Route::delete('/api/admin/users', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteUser']);
    
    Route::get('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'getAuthors']);
    Route::post('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'storeAuthor']);
    Route::delete('/api/admin/authors', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteAuthor']);
    
    Route::get('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'getCategories']);
    Route::post('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeCategory']);
    Route::delete('/api/admin/categories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteCategory']);
    
    Route::get('/api/admin/pages', [\App\Http\Controllers\Api\AdminApiController::class, 'getPages']);
    Route::post('/api/admin/pages', [\App\Http\Controllers\Api\AdminApiController::class, 'storePage']);
    Route::delete('/api/admin/pages', [\App\Http\Controllers\Api\AdminApiController::class, 'deletePage']);

    Route::get('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'getStories']);
    Route::post('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'storeStory']);
    Route::delete('/api/admin/stories', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteStory']);
    
    Route::get('/api/admin/media', [\App\Http\Controllers\Api\Admin\MediaController::class, 'getMedia']);
    Route::post('/api/admin/media', [\App\Http\Controllers\Api\Admin\MediaController::class, 'storeMedia']);
    Route::delete('/api/admin/media', [\App\Http\Controllers\Api\Admin\MediaController::class, 'deleteMedia']);
    
    Route::get('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'getSliders']);
    Route::post('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'storeSlider']);
    Route::delete('/api/admin/sliders', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteSlider']);

    Route::get('/api/admin/navigations', [\App\Http\Controllers\Api\AdminApiController::class, 'getNavigations']);
    Route::post('/api/admin/navigations', [\App\Http\Controllers\Api\AdminApiController::class, 'storeNavigation']);
    Route::delete('/api/admin/navigations', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteNavigation']);
    
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

    Route::get('/admin/users', function () { return \Inertia\Inertia::render('Admin/Users/Index'); })->name('admin.users');

    Route::get('/admin/authors', function () { return \Inertia\Inertia::render('Admin/Authors/Index'); })->name('admin.authors');
    Route::get('/admin/authors/new', function () { return \Inertia\Inertia::render('Admin/Authors/New'); })->name('admin.authors.new');
    Route::get('/admin/authors/edit/{id}', function ($id) {
        $author = \App\Models\Author::find($id);
        if (!$author) abort(404, 'Author not found');
        return \Inertia\Inertia::render('Admin/Authors/Edit', ['author' => $author]);
    })->name('admin.authors.edit');
    
    Route::get('/admin/categories', function () { return \Inertia\Inertia::render('Admin/Categories/Index'); })->name('admin.categories');
    Route::get('/admin/pages', function () { return \Inertia\Inertia::render('Admin/Pages/Index'); })->name('admin.pages');
    
    Route::get('/admin/stories', function () { return \Inertia\Inertia::render('Admin/Stories/Index'); })->name('admin.stories');
    Route::get('/admin/stories/new', function () { return \Inertia\Inertia::render('Admin/Stories/New'); })->name('admin.stories.new');
    Route::get('/admin/stories/edit/{id}', function ($id) {
        $story = \App\Models\Story::find($id);
        if (!$story) abort(404, 'Story not found');
        return \Inertia\Inertia::render('Admin/Stories/Edit', ['story' => $story]);
    })->name('admin.stories.edit');
    
    Route::get('/admin/media', function () { return \Inertia\Inertia::render('Admin/Media/Index'); })->name('admin.media');
    Route::get('/admin/seo-audit', function () { return \Inertia\Inertia::render('Admin/SeoAudit/Index'); })->name('admin.seo');
    Route::get('/admin/slider', function () { return \Inertia\Inertia::render('Admin/Settings/Slider'); })->name('admin.slider');
    Route::get('/admin/navigation', function () { return \Inertia\Inertia::render('Admin/Settings/Navigation'); })->name('admin.navigation');

    // Contact Messages
    Route::get('/api/admin/contact-messages', [\App\Http\Controllers\Api\AdminApiController::class, 'getContactMessages']);
    Route::delete('/api/admin/contact-messages/{id}', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteContactMessage']);
    Route::patch('/api/admin/contact-messages/{id}/read', [\App\Http\Controllers\Api\AdminApiController::class, 'readContactMessage']);
    Route::get('/admin/contact-messages', function () { return \Inertia\Inertia::render('Admin/ContactMessages/Index'); })->name('admin.contact-messages');

    // Newsletters
    Route::get('/api/admin/newsletters', [\App\Http\Controllers\Api\AdminApiController::class, 'getNewsletters']);
    Route::delete('/api/admin/newsletters/{id}', [\App\Http\Controllers\Api\AdminApiController::class, 'deleteNewsletter']);
    Route::get('/admin/newsletters', function () { return \Inertia\Inertia::render('Admin/Newsletters/Index'); })->name('admin.newsletters');

    // Google Search Console Hub & Instant Indexing (ModSecurity Safe URLs)
    Route::get('/admin/google-search', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'index'])->name('admin.gsc.index');
    Route::get('/admin/search-hub', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'index'])->name('admin.gsc.hub');
    Route::get('/admin/gsc', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'index'])->name('admin.gsc.short');
    Route::get('/admin/search-console', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'index'])->name('admin.gsc.legacy');
    Route::get('/admin/gsc/auth', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'redirectAuth'])->name('admin.gsc.auth');
    Route::post('/api/admin/gsc/connect-code', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'connectWithCode']);
    Route::post('/api/admin/gsc/settings', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'saveSettings']);
    Route::post('/api/admin/gsc/disconnect', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'disconnect']);
    Route::get('/api/admin/gsc/analytics', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'getAnalytics']);
    Route::post('/api/admin/gsc/sync', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'syncAnalytics']);
    Route::post('/api/admin/gsc/inspect', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'inspectUrl']);
    Route::get('/api/admin/gsc/sitemaps', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'getSitemaps']);
    Route::post('/api/admin/gsc/sitemaps/submit', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'submitSitemap']);
    Route::delete('/api/admin/gsc/sitemaps/delete', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'deleteSitemap']);
    Route::post('/api/admin/gsc/index-url', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'indexUrl']);
    Route::post('/api/admin/gsc/test-indexing', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'testIndexing']);
    Route::get('/api/admin/gsc/indexing-logs', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'getIndexingLogs']);
    Route::get('/api/admin/gsc/opportunities', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'getKeywordOpportunities']);

    // Google PageSpeed Insights & Core Web Vitals Hub
    Route::get('/admin/pagespeed', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'index'])->name('admin.pagespeed.index');
    Route::post('/api/admin/pagespeed/audit', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'runPageSpeedAudit']);
    Route::get('/api/admin/pagespeed/history', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'getPageSpeedHistory']);
    Route::post('/api/admin/pagespeed/api-key', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'savePageSpeedApiKey']);

    // Microsoft Bing Webmaster Tools & IndexNow Hub
    Route::get('/admin/bing', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'index'])->name('admin.bing.index');
    Route::get('/api/admin/bing/analytics', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'getAnalytics']);
    Route::get('/api/admin/bing/crawl-stats', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'getCrawlStats']);
    Route::post('/api/admin/bing/submit', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'submitUrl']);
    Route::post('/api/admin/bing/submit-batch', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'submitBatch']);
    Route::get('/api/admin/bing/sitemaps', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'getSitemaps']);
    Route::post('/api/admin/bing/sitemaps/submit', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'submitSitemap']);
    Route::post('/api/admin/bing/settings', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'saveSettings']);
    Route::post('/api/admin/bing/disconnect', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'disconnect']);

    // Facebook Hub & Page Management
    Route::get('/admin/facebook', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'index'])->name('admin.facebook.index');
    Route::post('/admin/facebook/default-page/{pageId}', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'setDefaultPage'])->name('admin.facebook.set_default');
    Route::post('/admin/facebook/toggle-auto-publish/{pageId}', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'toggleAutoPublish'])->name('admin.facebook.toggle_auto');
    Route::post('/admin/facebook/sync-pages', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'syncPages'])->name('admin.facebook.sync_pages');
    Route::post('/admin/facebook/disconnect', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'disconnect'])->name('admin.facebook.disconnect');
    Route::post('/admin/facebook/custom-post', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'publishCustomPost'])->name('admin.facebook.custom_post');
    Route::get('/api/admin/facebook/draft/{postId}', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'generateDraft']);
    Route::post('/api/admin/facebook/approve-publish', [\App\Http\Controllers\Admin\AdminFacebookController::class, 'approveAndPublish']);

    // X (Twitter) Management & Auto-Publishing
    Route::get('/admin/x', [\App\Http\Controllers\Admin\AdminXController::class, 'index'])->name('admin.x.index');
    Route::get('/admin/twitter', [\App\Http\Controllers\Admin\AdminXController::class, 'index'])->name('admin.x.alias');
    Route::post('/admin/x/credentials', [\App\Http\Controllers\Admin\AdminXController::class, 'saveApiCredentials'])->name('admin.x.credentials');
    Route::post('/admin/x/sync-profile', [\App\Http\Controllers\Admin\AdminXController::class, 'syncProfile'])->name('admin.x.sync');
    Route::post('/admin/x/disconnect', [\App\Http\Controllers\Admin\AdminXController::class, 'disconnect'])->name('admin.x.disconnect');
    Route::post('/admin/x/custom-tweet', [\App\Http\Controllers\Admin\AdminXController::class, 'publishCustomTweet'])->name('admin.x.custom_tweet');
    Route::get('/api/admin/x/draft/{postId}', [\App\Http\Controllers\Admin\AdminXController::class, 'generateDraft']);
    Route::post('/api/admin/x/approve-publish', [\App\Http\Controllers\Admin\AdminXController::class, 'approveAndPublish']);

    // Pinterest Management & Board Manager
    Route::get('/admin/pinterest', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'index'])->name('admin.pinterest.index');
    Route::post('/admin/pinterest/credentials', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'saveApiCredentials'])->name('admin.pinterest.credentials');
    Route::post('/admin/pinterest/sync-boards', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'syncBoards'])->name('admin.pinterest.sync_boards');
    Route::post('/admin/pinterest/default-board/{boardId}', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'setDefaultBoard'])->name('admin.pinterest.default_board');
    Route::post('/admin/pinterest/boards', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'createBoard'])->name('admin.pinterest.create_board');
    Route::post('/admin/pinterest/disconnect', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'disconnect'])->name('admin.pinterest.disconnect');
    Route::post('/admin/pinterest/custom-pin', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'publishCustomPin'])->name('admin.pinterest.custom_pin');
    Route::get('/api/admin/pinterest/draft/{postId}', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'generateDraft']);
    Route::post('/api/admin/pinterest/approve-publish', [\App\Http\Controllers\Admin\AdminPinterestController::class, 'approveAndPublish']);

    // Instagram Management & Direct Composer
    Route::get('/admin/instagram', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'index'])->name('admin.instagram.index');
    Route::post('/admin/instagram/credentials', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'saveCredentials'])->name('admin.instagram.credentials');
    Route::post('/admin/instagram/sync-profile', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'syncProfile'])->name('admin.instagram.sync_profile');
    Route::post('/admin/instagram/disconnect', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'disconnect'])->name('admin.instagram.disconnect');
    Route::post('/admin/instagram/custom-post', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'publishCustomPost'])->name('admin.instagram.custom_post');
    Route::get('/api/admin/instagram/draft/{postId}', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'generateDraft']);
    Route::post('/api/admin/instagram/approve-publish', [\App\Http\Controllers\Admin\AdminInstagramController::class, 'approveAndPublish']);

    // LinkedIn Management & Direct Composer
    Route::get('/admin/linkedin', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'index'])->name('admin.linkedin.index');
    Route::post('/admin/linkedin/credentials', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'saveCredentials'])->name('admin.linkedin.credentials');
    Route::post('/admin/linkedin/page-settings', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'savePageSettings'])->name('admin.linkedin.page_settings');
    Route::post('/admin/linkedin/disconnect', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'disconnect'])->name('admin.linkedin.disconnect');
    Route::post('/admin/linkedin/custom-post', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'publishCustomPost'])->name('admin.linkedin.custom_post');
    Route::get('/api/admin/linkedin/draft/{postId}', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'generateDraft']);
    Route::post('/api/admin/linkedin/approve-publish', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'approveAndPublish']);
    Route::post('/api/admin/linkedin/fetch-pages', [\App\Http\Controllers\Admin\AdminLinkedInController::class, 'fetchManagedPages']);
});

// Google OAuth Login & Callbacks (Accessible to guests for authentication & callback handling)
Route::get('/auth/google', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'redirectToGoogleLogin'])->name('login.google');
Route::get('/auth/callback', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'handleCallback'])->name('admin.gsc.callback.alt');
Route::get('/admin/gsc/callback', [\App\Http\Controllers\Admin\SearchConsoleController::class, 'handleCallback'])->name('admin.gsc.callback');

// Facebook OAuth Login & Callbacks
Route::get('/auth/facebook', [\App\Http\Controllers\FacebookController::class, 'redirectToFacebook'])->name('login.facebook');
Route::match(['get', 'post'], '/auth/facebook/callback', [\App\Http\Controllers\FacebookController::class, 'handleCallback'])->name('facebook.callback');
Route::match(['get', 'post'], '/admin/facebook/callback', [\App\Http\Controllers\FacebookController::class, 'handleCallback'])->name('admin.facebook.callback');
Route::match(['get', 'post'], '/api/fb/callback', [\App\Http\Controllers\FacebookController::class, 'handleCallback'])->name('facebook.callback.api');

// X (Twitter) OAuth Login & Callbacks
Route::get('/auth/x', [\App\Http\Controllers\XController::class, 'redirectToX'])->name('login.x');
Route::match(['get', 'post'], '/auth/x/callback', [\App\Http\Controllers\XController::class, 'handleCallback'])->name('x.callback');
Route::match(['get', 'post'], '/api/x/callback', [\App\Http\Controllers\XController::class, 'handleCallback'])->name('x.callback.api');

// Pinterest OAuth Login & Callbacks
Route::get('/auth/pinterest', [\App\Http\Controllers\PinterestController::class, 'redirectToPinterest'])->name('login.pinterest');
Route::match(['get', 'post'], '/auth/pinterest/callback', [\App\Http\Controllers\PinterestController::class, 'handleCallback'])->name('pinterest.callback');
Route::match(['get', 'post'], '/api/pinterest/callback', [\App\Http\Controllers\PinterestController::class, 'handleCallback'])->name('pinterest.callback.api');

// Instagram OAuth Login & Callbacks
Route::get('/auth/instagram', [\App\Http\Controllers\InstagramController::class, 'redirectToInstagram'])->name('login.instagram');
Route::match(['get', 'post'], '/auth/instagram/callback', [\App\Http\Controllers\InstagramController::class, 'handleCallback'])->name('instagram.callback');
Route::match(['get', 'post'], '/api/instagram/callback', [\App\Http\Controllers\InstagramController::class, 'handleCallback'])->name('instagram.callback.api');
Route::match(['get', 'post'], '/api/instagram/webhook', function (\Illuminate\Http\Request $request) {
    $verifyToken = config('services.instagram.verify_token', env('INSTAGRAM_VERIFY_TOKEN', 'sikar_instagram_verify_token_2026'));
    if ($request->isMethod('get')) {
        $mode = $request->query('hub_mode', $request->query('hub.mode'));
        $token = $request->query('hub_verify_token', $request->query('hub.verify_token'));
        $challenge = $request->query('hub_challenge', $request->query('hub.challenge'));

        if (($mode === 'subscribe' || empty($mode)) && $token === $verifyToken) {
            return response($challenge, 200, ['Content-Type' => 'text/plain']);
        }
        return response('Forbidden', 403);
    }
    return response('EVENT_RECEIVED', 200);
})->name('instagram.webhook');

// LinkedIn OAuth Login & Callbacks
Route::get('/auth/linkedin', [\App\Http\Controllers\LinkedInController::class, 'redirectToLinkedIn'])->name('login.linkedin');
Route::match(['get', 'post'], '/auth/linkedin/callback', [\App\Http\Controllers\LinkedInController::class, 'handleCallback'])->name('linkedin.callback');
Route::match(['get', 'post'], '/api/linkedin/callback', [\App\Http\Controllers\LinkedInController::class, 'handleCallback'])->name('linkedin.callback.api');

// Bing Webmaster Tools OAuth Login & Callbacks
Route::get('/auth/bing', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'redirectToBing'])->name('login.bing');
Route::match(['get', 'post'], '/auth/bing/callback', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'handleCallback'])->name('bing.callback');
Route::match(['get', 'post'], '/admin/bing/callback', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'handleCallback'])->name('admin.bing.callback');
Route::match(['get', 'post'], '/api/bing/callback', [\App\Http\Controllers\Admin\BingWebmasterController::class, 'handleCallback'])->name('bing.callback.api');

// 🚀 ModSecurity-Safe Database & System Upgrade Runner
$dbUpgradeRunner = function () {
    $code = request()->input('code') ?: (request()->input('pin') ?: (request()->input('key') ?: request()->input('v')));
    $isAdmin = auth()->check() && (bool) (auth()->user()->is_admin || in_array(auth()->user()->role, ['admin', 'super_admin'], true));
    $isAuthorized = $isAdmin || in_array($code, ['sikar2026', 'migrate', config('app.key')], true) || app()->environment('local');

    // If not authorized and no code submitted, show a friendly PIN input form
    if (!$isAuthorized) {
        $errorMsg = $code ? "<div style='color:#ef4444;margin-bottom:12px;font-weight:bold;font-size:13px;'>⚠️ Invalid PIN. Please try again.</div>" : "";
        return response("<!DOCTYPE html><html><head><title>System Upgrade</title><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body style='margin:0;background:#090d16;color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;padding:16px;box-sizing:border-box;'>".
            "<div style='background:#1e293b;padding:32px;border-radius:16px;max-width:440px;width:100%;box-shadow:0 20px 25px -5px rgba(0,0,0,0.5);border:1px solid #334155;text-align:center;'>".
            "<div style='font-size:36px;margin-bottom:12px;'>⚡</div>".
            "<h2 style='margin:0 0 8px 0;font-size:20px;color:#f8fafc;'>Database & System Upgrade</h2>".
            "<p style='color:#94a3b8;font-size:13px;line-height:1.5;margin-bottom:24px;'>Run pending database migrations and clear application cache safely.</p>".
            $errorMsg.
            "<form method='POST' action='/app-upgrade'>".
            "<input type='hidden' name='_token' value='".csrf_token()."'>".
            "<div style='margin-bottom:16px;'>".
            "<input type='password' name='pin' placeholder='Enter Security PIN' value='sikar2026' required style='width:100%;padding:12px 16px;border-radius:10px;border:1px solid #475569;background:#0f172a;color:#fff;font-size:14px;box-sizing:border-box;outline:none;'>".
            "</div>".
            "<button type='submit' style='width:100%;padding:12px;background:#2563eb;color:#fff;border:none;border-radius:10px;font-weight:bold;font-size:14px;cursor:pointer;'>Run Database Upgrade 🚀</button>".
            "</form>".
            "<p style='color:#64748b;font-size:11px;margin-top:20px;'>(Default PIN: sikar2026)</p>".
            "</div></body></html>", 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    }

    try {
        $envFile = base_path('.env');
        $switchSuccessMsg = '';
        $switchErrorMsg = '';
        $copySuccessMsg = '';

        // Action: Switch to MySQL
        if (request()->input('action') === 'switch_mysql') {
            $mHost = trim(request()->input('db_host', '127.0.0.1'));
            $mPort = trim(request()->input('db_port', '3306'));
            $mDb   = trim(request()->input('db_database', 'coachtim_lara172'));
            $mUser = trim(request()->input('db_username', 'coachtim_lara172'));
            $mPass = request()->input('db_password', '2vY1Sp)a!4');

            try {
                $testPdo = new \PDO("mysql:host={$mHost};port={$mPort};dbname={$mDb};charset=utf8mb4", $mUser, $mPass, [
                    \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
                    \PDO::ATTR_TIMEOUT => 5
                ]);

                // Connection succeeded! Update .env
                if (file_exists($envFile) && is_writable($envFile)) {
                    $envContent = file_get_contents($envFile);

                    $envUpdates = [
                        'DB_CONNECTION' => 'mysql',
                        'DB_HOST'       => $mHost,
                        'DB_PORT'       => $mPort,
                        'DB_DATABASE'   => $mDb,
                        'DB_USERNAME'   => $mUser,
                        'DB_PASSWORD'   => '"' . addcslashes($mPass, '"') . '"',
                    ];

                    foreach ($envUpdates as $k => $v) {
                        $pattern = "/^#?\s*{$k}=.*/m";
                        if (preg_match($pattern, $envContent)) {
                            $envContent = preg_replace($pattern, "{$k}={$v}", $envContent);
                        } else {
                            $envContent .= "\n{$k}={$v}";
                        }
                    }

                    file_put_contents($envFile, $envContent);
                }

                \Illuminate\Support\Facades\Artisan::call('config:clear');
                \Illuminate\Support\Facades\Artisan::call('cache:clear');
                \Illuminate\Support\Facades\Artisan::call('optimize:clear');

                config([
                    'database.default' => 'mysql',
                    'database.connections.mysql.host' => $mHost,
                    'database.connections.mysql.port' => $mPort,
                    'database.connections.mysql.database' => $mDb,
                    'database.connections.mysql.username' => $mUser,
                    'database.connections.mysql.password' => $mPass,
                ]);

                \Illuminate\Support\Facades\DB::purge();
                \Illuminate\Support\Facades\DB::reconnect('mysql');
                \Illuminate\Support\Facades\DB::setDefaultConnection('mysql');

                $switchSuccessMsg = "✅ Successfully connected and switched to MySQL database '{$mDb}' on {$mHost}!";
            } catch (\Throwable $ex) {
                $switchErrorMsg = "❌ MySQL Connection Failed: " . $ex->getMessage();
            }
        }

        // Action: Copy SQLite Data to MySQL
        if (request()->input('action') === 'copy_sqlite_to_mysql') {
            $sqlitePath = database_path('database.sqlite');
            if (file_exists($sqlitePath)) {
                try {
                    $sqPdo = new \PDO("sqlite:" . $sqlitePath);
                    $tables = ['users', 'categories', 'posts', 'businesses', 'pages', 'sliders', 'navigations', 'gsc_settings', 'bing_webmaster_settings'];
                    $stats = [];
                    foreach ($tables as $tbl) {
                        try {
                            if (\Illuminate\Support\Facades\Schema::hasTable($tbl)) {
                                $stmt = $sqPdo->query("SELECT * FROM {$tbl}");
                                $rows = $stmt ? $stmt->fetchAll(\PDO::FETCH_ASSOC) : [];
                                if (!empty($rows)) {
                                    $count = 0;
                                    foreach ($rows as $r) {
                                        $primaryKey = isset($r['id']) ? ['id' => $r['id']] : (isset($r['slug']) ? ['slug' => $r['slug']] : reset($r));
                                        \Illuminate\Support\Facades\DB::table($tbl)->updateOrInsert(is_array($primaryKey) ? $primaryKey : ['id' => $primaryKey], $r);
                                        $count++;
                                    }
                                    $stats[] = "{$tbl}: {$count}";
                                }
                            }
                        } catch (\Throwable $eTbl) {}
                    }
                    $copySuccessMsg = "✅ SQLite data successfully synchronized to MySQL: " . implode(', ', $stats);
                } catch (\Throwable $sqEx) {
                    $switchErrorMsg = "Failed copying SQLite data: " . $sqEx->getMessage();
                }
            } else {
                $switchErrorMsg = "No SQLite database file found at {$sqlitePath}";
            }
        }

        $migrationRecorded = false;
        try {
            $migrationRecorded = \Illuminate\Support\Facades\DB::table('migrations')
                ->where('migration', 'like', '%create_google_search_console_tables%')
                ->exists();
        } catch (\Throwable $ignore) {}

        if (request()->boolean('reset') || request()->input('reset') === '1') {
            \Illuminate\Support\Facades\Schema::dropIfExists('gsc_inspections');
            \Illuminate\Support\Facades\Schema::dropIfExists('gsc_indexing_logs');
            \Illuminate\Support\Facades\Schema::dropIfExists('gsc_search_analytics');
            \Illuminate\Support\Facades\Schema::dropIfExists('gsc_settings');
        }

        \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
        $migrateOutput = \Illuminate\Support\Facades\Artisan::output();

        try {
            $setting = \App\Models\GscSetting::instance();
            if (config('services.google.refresh_token')) {
                $setting->update([
                    'refresh_token' => config('services.google.refresh_token'),
                    'is_connected' => true,
                    'auth_mode' => 'oauth',
                    'last_error' => null,
                ]);
            }
        } catch (\Throwable $ignore) {}

        try {
            // Clean up old expired sessions to prevent session table bloat and connection locks
            if (\Illuminate\Support\Facades\Schema::hasTable('sessions')) {
                \Illuminate\Support\Facades\DB::table('sessions')
                    ->where('last_activity', '<', now()->subDays(7)->getTimestamp())
                    ->delete();
            }
        } catch (\Throwable $ignore) {}

        \App\Http\Middleware\CachePublicResponse::purge();
        \Illuminate\Support\Facades\Cache::flush();
        \Illuminate\Support\Facades\Artisan::call('cache:clear');
        \Illuminate\Support\Facades\Artisan::call('optimize:clear');
        $clearOutput = \Illuminate\Support\Facades\Artisan::output();

        // Database Diagnostics
        $activeDriver = \Illuminate\Support\Facades\DB::connection()->getDriverName();
        $activeDbName = \Illuminate\Support\Facades\DB::connection()->getDatabaseName();
        $activeHost   = config("database.connections.{$activeDriver}.host", 'N/A');
        $activeUser   = config("database.connections.{$activeDriver}.username", 'N/A');
        $postCount    = 0;
        $userCount    = 0;
        try {
            $postCount = \Illuminate\Support\Facades\DB::table('posts')->count();
            $userCount = \Illuminate\Support\Facades\DB::table('users')->count();
        } catch (\Throwable $eCnt) {}

        $sqliteHasData = false;
        $sqlitePostCount = 0;
        if (file_exists(database_path('database.sqlite'))) {
            try {
                $sqPdo = new \PDO("sqlite:" . database_path('database.sqlite'));
                $sqlitePostCount = (int) $sqPdo->query("SELECT COUNT(*) FROM posts")->fetchColumn();
                $sqliteHasData = $sqlitePostCount > 0;
            } catch (\Throwable $sqIgnore) {}
        }

        $dbCardHtml = "
        <div style='background:#1e293b;padding:20px;border-radius:12px;border-left:4px solid ".($activeDriver === 'mysql' ? '#22c55e' : '#f59e0b').";margin-bottom:20px;'>
            <div style='display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;flex-wrap:wrap;gap:8px;'>
                <h4 style='margin:0;color:".($activeDriver === 'mysql' ? '#4ade80' : '#fbbf24').";font-size:16px;'>
                    🗄️ Active Database: <span style='text-transform:uppercase;font-weight:bold;'>{$activeDriver}</span>
                </h4>
                <span style='background:".($activeDriver === 'mysql' ? '#22c55e25' : '#f59e0b25').";color:".($activeDriver === 'mysql' ? '#4ade80' : '#fbbf24').";border:1px solid ".($activeDriver === 'mysql' ? '#22c55e50' : '#f59e0b50').";padding:3px 10px;border-radius:999px;font-size:12px;font-weight:bold;'>
                    ".($activeDriver === 'mysql' ? '● Connected to MySQL' : '⚠️ Connected to SQLite')."
                </span>
            </div>
            <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;font-size:13px;color:#cbd5e1;background:#0f172a80;padding:12px;border-radius:8px;'>
                <div><strong>Database Name:</strong> <code style='color:#38bdf8;'>{$activeDbName}</code></div>
                <div><strong>Host / Socket:</strong> <code style='color:#38bdf8;'>{$activeHost}</code></div>
                <div><strong>DB User:</strong> <code style='color:#38bdf8;'>{$activeUser}</code></div>
                <div><strong>Total Posts in DB:</strong> <code style='color:#4ade80;'>{$postCount}</code></div>
                <div><strong>Total Users in DB:</strong> <code style='color:#4ade80;'>{$userCount}</code></div>
            </div>
            ".($switchSuccessMsg ? "<div style='margin-top:12px;padding:10px 14px;background:#22c55e20;border:1px solid #22c55e;color:#4ade80;border-radius:8px;font-weight:bold;font-size:13px;'>{$switchSuccessMsg}</div>" : "")."
            ".($switchErrorMsg ? "<div style='margin-top:12px;padding:10px 14px;background:#ef444420;border:1px solid #ef4444;color:#fca5a5;border-radius:8px;font-weight:bold;font-size:13px;'>{$switchErrorMsg}</div>" : "")."
            ".($copySuccessMsg ? "<div style='margin-top:12px;padding:10px 14px;background:#38bdf820;border:1px solid #38bdf8;color:#7dd3fc;border-radius:8px;font-weight:bold;font-size:13px;'>{$copySuccessMsg}</div>" : "")."
        </div>";

        $mysqlSwitcherHtml = "";
        if ($activeDriver !== 'mysql') {
            $defaultDbHost = env('DB_HOST') && env('DB_HOST') !== '127.0.0.1' ? env('DB_HOST') : 'localhost';
            $defaultDbName = config('database.connections.mysql.database', 'coachtim_lara172');
            $defaultDbUser = config('database.connections.mysql.username', 'coachtim_lara172');
            $defaultDbPass = config('database.connections.mysql.password', '2vY1Sp)a!4');

            $mysqlSwitcherHtml = "
            <div style='background:#1e293b;padding:24px;border-radius:12px;border:1px solid #3b82f6;margin-bottom:20px;'>
                <h3 style='margin:0 0 8px 0;color:#60a5fa;'>🔄 Switch Server Database to MySQL</h3>
                <p style='color:#94a3b8;font-size:13px;margin:0 0 16px 0;'>Apne server ko SQLite se MySQL par switch karne ke liye credentials verify karke 'Switch to MySQL' par click karein:</p>
                <form method='POST' action='/run-migrate'>
                    <input type='hidden' name='pin' value='sikar2026'>
                    <input type='hidden' name='action' value='switch_mysql'>
                    <div style='display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:16px;'>
                        <div>
                            <label style='display:block;color:#94a3b8;font-size:12px;font-weight:bold;margin-bottom:4px;'>MySQL Host</label>
                            <input type='text' name='db_host' value='".htmlspecialchars($defaultDbHost)."' required style='width:100%;padding:10px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#fff;box-sizing:border-box;'>
                        </div>
                        <div>
                            <label style='display:block;color:#94a3b8;font-size:12px;font-weight:bold;margin-bottom:4px;'>MySQL Port</label>
                            <input type='text' name='db_port' value='3306' required style='width:100%;padding:10px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#fff;box-sizing:border-box;'>
                        </div>
                        <div>
                            <label style='display:block;color:#94a3b8;font-size:12px;font-weight:bold;margin-bottom:4px;'>Database Name</label>
                            <input type='text' name='db_database' value='".htmlspecialchars($defaultDbName)."' required style='width:100%;padding:10px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#fff;box-sizing:border-box;'>
                        </div>
                        <div>
                            <label style='display:block;color:#94a3b8;font-size:12px;font-weight:bold;margin-bottom:4px;'>Database User</label>
                            <input type='text' name='db_username' value='".htmlspecialchars($defaultDbUser)."' required style='width:100%;padding:10px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#fff;box-sizing:border-box;'>
                        </div>
                        <div style='grid-column:1/-1;'>
                            <label style='display:block;color:#94a3b8;font-size:12px;font-weight:bold;margin-bottom:4px;'>Database Password</label>
                            <input type='text' name='db_password' value='".htmlspecialchars($defaultDbPass)."' style='width:100%;padding:10px 12px;background:#0f172a;border:1px solid #475569;border-radius:8px;color:#fff;box-sizing:border-box;'>
                        </div>
                    </div>
                    <button type='submit' style='background:#2563eb;color:#fff;border:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;cursor:pointer;width:100%;'>
                        🚀 Verify Connection & Switch Server to MySQL
                    </button>
                </form>
            </div>";
        } elseif ($activeDriver === 'mysql' && $sqliteHasData) {
            $mysqlSwitcherHtml = "
            <div style='background:#1e293b;padding:20px;border-radius:12px;border:1px solid #22c55e;margin-bottom:20px;'>
                <h4 style='margin:0 0 8px 0;color:#4ade80;'>📦 SQLite Data Detected ({$sqlitePostCount} posts in SQLite file)</h4>
                <p style='color:#94a3b8;font-size:13px;margin:0 0 14px 0;'>Aapka active database MySQL hai. Agar SQLite file se posts aur data MySQL me copy/sync karna chahein toh niche diye button par click karein:</p>
                <form method='POST' action='/run-migrate'>
                    <input type='hidden' name='pin' value='sikar2026'>
                    <input type='hidden' name='action' value='copy_sqlite_to_mysql'>
                    <button type='submit' style='background:#059669;color:#fff;border:none;padding:10px 20px;border-radius:8px;font-weight:bold;font-size:13px;cursor:pointer;'>
                        📥 Copy All SQLite Posts & Data to MySQL
                    </button>
                </form>
            </div>";
        }

        return response("<!DOCTYPE html><html><head><title>Upgrade Complete</title><meta name='viewport' content='width=device-width, initial-scale=1.0'></head><body style='margin:0;background:#090d16;color:#f8fafc;padding:32px;font-family:ui-monospace,Menlo,monospace;box-sizing:border-box;'>".
            "<h2 style='color:#38bdf8;margin-top:0;'>🚀 Database & System Upgrade Successful</h2>".
            $dbCardHtml.
            $mysqlSwitcherHtml.
            "<div style='background:#1e293b;padding:20px;border-radius:10px;border-left:4px solid #22c55e;margin-bottom:20px;'>".
            "<h4 style='margin:0 0 10px 0;color:#4ade80;'>✅ Database Migration Results:</h4>".
            "<pre style='margin:0;color:#cbd5e1;white-space:pre-wrap;font-family:inherit;'>".htmlspecialchars(trim($migrateOutput) ?: 'Nothing to migrate. All database tables are already up to date.')."</pre>".
            "</div>".
            "<div style='background:#1e293b;padding:20px;border-radius:10px;border-left:4px solid #38bdf8;margin-bottom:20px;'>".
            "<h4 style='margin:0 0 10px 0;color:#38bdf8;'>🧹 System Cache Clear Results:</h4>".
            "<pre style='margin:0;color:#cbd5e1;white-space:pre-wrap;font-family:inherit;'>".htmlspecialchars(trim($clearOutput))."</pre>".
            "</div>".
            "<p style='margin-top:24px;'><a href='/admin' style='color:#60a5fa;text-decoration:none;font-weight:bold;'>← Return to Admin Panel</a> | <a href='/admin/google-search' style='color:#38bdf8;text-decoration:none;font-weight:bold;margin-left:12px;'>Open Search Console Hub →</a> | <a href='/admin/pagespeed' style='color:#38bdf8;text-decoration:none;font-weight:bold;margin-left:12px;'>Open PageSpeed & CWV ⚡ →</a> | <a href='/admin/bing' style='color:#0ea5e9;background:#0369a120;border:1px solid #0284c7;padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:bold;margin-left:12px;'>Open Bing Webmaster 🌐 →</a> | <a href='/admin/facebook' style='color:#1877f2;text-decoration:none;font-weight:bold;margin-left:12px;'>Open Facebook Hub →</a> | <a href='/admin/x' style='color:#f8fafc;background:#000;border:1px solid #334155;padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:bold;margin-left:12px;'>Open X Hub 𝕏 →</a> | <a href='/admin/pinterest' style='color:#fff;background:#e60023;padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:bold;margin-left:12px;'>Open Pinterest Hub 📌 →</a> | <a href='/admin/instagram' style='color:#fff;background:linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888);padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:bold;margin-left:12px;'>Open Instagram Hub 📸 →</a> | <a href='/admin/linkedin' style='color:#fff;background:#0a66c2;padding:3px 8px;border-radius:6px;text-decoration:none;font-weight:bold;margin-left:12px;'>Open LinkedIn Hub 💼 →</a></p>".
            "</body></html>", 200, ['Content-Type' => 'text/html; charset=UTF-8']);
    } catch (\Throwable $e) {
        return response("<!DOCTYPE html><html><head><title>Upgrade Error</title></head><body style='margin:0;background:#180606;color:#f8fafc;padding:32px;font-family:ui-monospace,Menlo,monospace;'>".
            "<h2 style='color:#ef4444;margin-top:0;'>❌ Migration Execution Failed</h2>".
            "<pre style='background:#2d0b0b;color:#fca5a5;padding:20px;border-radius:8px;white-space:pre-wrap;font-family:inherit;'>".htmlspecialchars($e->getMessage())."</pre>".
            "</body></html>", 500, ['Content-Type' => 'text/html; charset=UTF-8']);
    }
};

Route::match(['get', 'post'], '/app-upgrade', $dbUpgradeRunner)->name('system.app-upgrade');
Route::match(['get', 'post'], '/system-sync', $dbUpgradeRunner)->name('system.system-sync');
Route::match(['get', 'post'], '/run-migrate', $dbUpgradeRunner)->name('system.run-migrate');




// Collect Inquiries (Newsletters, etc)
Route::post('/api/inquiries/collect', [\App\Http\Controllers\Api\AdminApiController::class, 'collectInquiry'])->middleware('throttle:5,1');

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

Route::get('/blog/feed.xml', [\App\Http\Controllers\RssController::class, 'blogFeed'])->name('blog.rss');

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
    Route::post('/posts', [\App\Http\Controllers\PostController::class, 'store'])->name('post.store')->middleware('throttle:10,1');
    Route::put('/posts/{post}', [\App\Http\Controllers\PostController::class, 'update'])->name('post.update');
    Route::delete('/posts/{post}', [\App\Http\Controllers\PostController::class, 'destroy'])->name('post.destroy');
    Route::post('/posts/{post}/save', [\App\Http\Controllers\PostController::class, 'toggleSave'])->name('post.save');
    Route::post('/vote', [\App\Http\Controllers\VoteController::class, 'vote'])->name('vote');
    Route::post('/posts/{post}/comments', [\App\Http\Controllers\PostController::class, 'storeComment'])->name('post.comment.store');
    Route::post('/comments/{id}/pin', [\App\Http\Controllers\PostController::class, 'togglePin'])->name('comment.pin');
    Route::post('/api/upload', [\App\Http\Controllers\PostController::class, 'uploadImage'])->name('api.upload');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});



// Reviews SEO Routes
Route::get('/business', [\App\Http\Controllers\ReviewPageController::class, 'index'])->name('reviews.index')->middleware('cacheResponse:86400');
Route::get('/business/{category}', [\App\Http\Controllers\ReviewPageController::class, 'category'])->name('reviews.category')->middleware('cacheResponse:86400');
Route::get('/business/{category}/{business}', [\App\Http\Controllers\ReviewPageController::class, 'business'])->name('reviews.business')->middleware('cacheResponse:86400');

// Short & Direct Business Profile Redirects
Route::get('/biz/{business}', function ($businessSlug) {
    $business = \App\Models\Business::where('slug', $businessSlug)
        ->orWhere('id', $businessSlug)
        ->first();
    if (!$business) {
        abort(404, 'Business Profile Not Found');
    }
    $category = $business->category ?: 'coaching-institutes';
    return redirect()->route('reviews.business', [
        'category' => $category,
        'business' => $business->slug ?: $business->id,
    ], 301);
})->name('business.short_profile');

Route::get('/businesses/{business}', function ($businessSlug) {
    $business = \App\Models\Business::where('slug', $businessSlug)
        ->orWhere('id', $businessSlug)
        ->first();
    if (!$business) {
        abort(404, 'Business Profile Not Found');
    }
    $category = $business->category ?: 'coaching-institutes';
    return redirect()->route('reviews.business', [
        'category' => $category,
        'business' => $business->slug ?: $business->id,
    ], 301);
});

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

// Gemini AI Intelligence Routes (Protected by auth and rate-limiting)
Route::prefix('api/ai')->middleware(['auth', 'throttle:30,1'])->group(function () {
    Route::post('/research-post', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'researchAndGenerate'])->middleware('admin');
    Route::post('/expand-section', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'expandSection'])->middleware('admin');
    Route::post('/scrape-url', [\App\Http\Controllers\Api\Admin\AiBlogResearchController::class, 'scrapeUrl'])->middleware('admin');
    Route::post('/research-business', [\App\Http\Controllers\Api\AiBusinessController::class, 'research']);
    Route::post('/scrape-website', [\App\Http\Controllers\Api\AiBusinessController::class, 'scrapeWebsite']);
    Route::post('/analyze-review', [\App\Http\Controllers\Api\AiReviewController::class, 'analyzeReview']);
    Route::post('/generate-reply', [\App\Http\Controllers\Api\AiReviewController::class, 'generateReply']);
    Route::post('/business-summary', [\App\Http\Controllers\Api\AiReviewController::class, 'businessSummary']);
    Route::post('/competitor-compare', [\App\Http\Controllers\Api\AiReviewController::class, 'competitorCompare']);
    Route::post('/semantic-search', [\App\Http\Controllers\Api\AiReviewController::class, 'semanticSearch']);
    Route::post('/ocr-receipt', [\App\Http\Controllers\Api\AiReviewController::class, 'ocrReceipt']);
    Route::post('/executive-digest', [\App\Http\Controllers\Api\AiReviewController::class, 'executiveDigest']);
    Route::post('/translate-review', [\App\Http\Controllers\Api\AiReviewController::class, 'translateReview']);
});

// Public image variants are generated once and then served as immutable WebP files.
Route::get('/images/{width}/{path}', [\App\Http\Controllers\ResponsiveImageController::class, 'show'])
    ->whereNumber('width')
    ->where('path', '.*')
    ->name('images.responsive')
    ->withoutMiddleware([
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \Illuminate\Foundation\Http\Middleware\PreventRequestForgery::class,
        \App\Http\Middleware\HandleInertiaRequests::class,
        \Illuminate\Cookie\Middleware\EncryptCookies::class,
        \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
    ]);

require __DIR__.'/auth.php';

// Fallback route to serve images if symlink is broken or missing (with path traversal protection)
Route::get('/storage/{path}', function ($path) {
    abort_if(\Illuminate\Support\Str::contains($path, '..'), 404);
    $storagePublic = realpath(storage_path('app/public'));
    if (!$storagePublic) abort(404);

    $relativePath = ltrim(str_replace(['/', '\\'], DIRECTORY_SEPARATOR, $path), DIRECTORY_SEPARATOR);
    $fullPath = realpath($storagePublic . DIRECTORY_SEPARATOR . $relativePath);
    $prefix = rtrim($storagePublic, DIRECTORY_SEPARATOR) . DIRECTORY_SEPARATOR;

    if (!$fullPath || !\Illuminate\Support\Str::startsWith($fullPath, $prefix) || !file_exists($fullPath)) {
        abort(404);
    }
    
    $mimeType = \Illuminate\Support\Facades\File::mimeType($fullPath);
    $headers = ['Content-Type' => $mimeType];
    
    return response()->file($fullPath, $headers);
})->where('path', '.*');

Route::fallback(function () {
    $path = request()->path();
    
    $page = \App\Models\Page::where('slug', $path)->first();
    if ($page) {
        if ($page->type === 'feed') {
            return app(\App\Http\Controllers\BlogController::class)->index(request());
        }
        return app(\App\Http\Controllers\PageController::class)->showDynamicPage($page);
    }

    $segments = explode('/', $path);
    $lastSegment = end($segments);

    $postQuery = \App\Models\Post::where('slug', $lastSegment)->orWhere('slug', strtolower($lastSegment));
    if (!auth()->check() || (!auth()->user()->isSuperAdmin() && !auth()->user()->isModerator() && auth()->user()->role !== 'admin' && !auth()->user()->is_admin)) {
        $postQuery->where('published', true);
    }
    $post = $postQuery->first();

    if ($post) {
        return app(\App\Http\Controllers\BlogController::class)->show(request(), $lastSegment);
    }

    return abort(404);
})->middleware('cacheResponse:86400');
