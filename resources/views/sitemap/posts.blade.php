@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    @foreach ($posts as $post)
        <url>
            <loc>{{ route('blog.show', $post->slug) }}</loc>
            <lastmod>{{ $post->updated_at->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.8</priority>
            @if($post->coverImage)
            <image:image>
                <image:loc>{{ str_starts_with($post->coverImage, 'http') ? $post->coverImage : url($post->coverImage) }}</image:loc>
                <image:title>{{ $post->title }}</image:title>
            </image:image>
            @endif
        </url>
    @endforeach
</urlset>
