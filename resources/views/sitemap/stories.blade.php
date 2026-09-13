@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    @foreach ($stories as $story)
        <url>
            <loc>{{ route('story.show', $story->slug) }}</loc>
            <lastmod>{{ $story->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
            @if($story->posterImage)
            <image:image>
                <image:loc>{{ $story->posterImage }}</image:loc>
                <image:title>{{ $story->title }}</image:title>
            </image:image>
            @endif
        </url>
    @endforeach
</urlset>
