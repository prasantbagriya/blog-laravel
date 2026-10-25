@php echo '<?xml version="1.0" encoding="UTF-8"?>'; @endphp
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    @foreach ($businesses as $biz)
        @php
            $cat = $biz->category ?: 'coaching-institutes';
            $bizUrl = route('reviews.business', ['category' => $cat, 'business' => $biz->slug ?: $biz->id]);
        @endphp
        <url>
            <loc>{{ $bizUrl }}</loc>
            <lastmod>{{ $biz->updated_at ? $biz->updated_at->tz('UTC')->toAtomString() : now()->tz('UTC')->toAtomString() }}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.9</priority>
            @if($biz->logo)
            <image:image>
                <image:loc>{{ str_starts_with($biz->logo, 'http') ? $biz->logo : url($biz->logo) }}</image:loc>
                <image:title>{{ $biz->name }}</image:title>
            </image:image>
            @endif
        </url>
    @endforeach
</urlset>
