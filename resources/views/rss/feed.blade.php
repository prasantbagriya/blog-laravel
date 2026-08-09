<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
    <channel>
        <title>r/{{ $community->name }} - Nexus</title>
        <link>{{ url('/community/' . $community->name) }}</link>
        <description>{{ $community->description }}</description>
        <language>en-us</language>
        <lastBuildDate>{{ now()->toRfc822String() }}</lastBuildDate>
        @foreach($posts as $post)
            <item>
                <title>{{ $post->title }}</title>
                <link>{{ url('/r/' . $community->name . '/comments/' . $post->id . '/' . \Illuminate\Support\Str::slug($post->title)) }}</link>
                <description><![CDATA[ {!! \Illuminate\Support\Str::limit(strip_tags($post->content), 300) !!} ]]></description>
                <pubDate>{{ $post->created_at->toRfc822String() }}</pubDate>
                <guid>{{ url('/r/' . $community->name . '/comments/' . $post->id . '/' . \Illuminate\Support\Str::slug($post->title)) }}</guid>
            </item>
        @endforeach
    </channel>
</rss>
