@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
    @foreach ($posts as $post)
        <url>
            <loc>{{ route('blog.show', $post->slug) }}</loc>
            <news:news>
                <news:publication>
                    <news:name>Nexus</news:name>
                    <news:language>en</news:language>
                </news:publication>
                <news:publication_date>{{ $post->created_at->tz('UTC')->toAtomString() }}</news:publication_date>
                <news:title>{{ $post->title }}</news:title>
            </news:news>
        </url>
    @endforeach
</urlset>
