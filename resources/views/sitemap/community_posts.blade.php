@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    @foreach ($posts as $post)
        @if ($post->community)
            <url>
                <loc>{{ route('post.show', ['community' => $post->community->name, 'post' => $post->id, 'slug' => \Illuminate\Support\Str::slug($post->title)]) }}</loc>
                <lastmod>{{ $post->updated_at->tz('UTC')->toAtomString() }}</lastmod>
                <changefreq>daily</changefreq>
                <priority>0.7</priority>
            </url>
        @endif
    @endforeach
</urlset>
