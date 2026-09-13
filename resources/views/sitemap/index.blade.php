@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>{{ route('sitemap.pages') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.posts') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.community_posts') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.categories') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.communities') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.authors') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.stories') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
    <sitemap>
        <loc>{{ route('sitemap.news') }}</loc>
        <lastmod>{{ now()->tz('UTC')->toAtomString() }}</lastmod>
    </sitemap>
</sitemapindex>
