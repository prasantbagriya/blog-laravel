@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($communities as $community)
        <url>
            <loc>{{ route('community.show', $community->name) }}</loc>
            <lastmod>{{ $community->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
        </url>
        <url>
            <loc>{{ route('community.rss', $community->name) }}</loc>
            <lastmod>{{ $community->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>hourly</changefreq>
            <priority>0.6</priority>
        </url>
    @endforeach
</urlset>
