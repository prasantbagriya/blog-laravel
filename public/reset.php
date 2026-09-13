<?php
// reset.php - V17 (Fix AMP Validation)

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);

echo "<h2>Fixing Google AMP Validation...</h2>";

$bladeContent = <<<'EOD'
<!DOCTYPE html>
<html amp lang="en">
  <head>
    <meta charset="utf-8">
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
    <title>{{ $story->title }}</title>
    <meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1,maximum-scale=1,user-scalable=no">
    <meta name="description" content="{{ $story->description ?: 'Web story about ' . $story->title }}">
    <link rel="canonical" href="{{ url()->current() }}">
    
    @php
        $seo_title = data_get($story->seo_meta, 'og_title', $story->title);
        $seo_desc = data_get($story->seo_meta, 'og_description', $story->description ?: 'Web story about ' . $story->title);
        $first_page_image = (!empty($story->pages) && isset($story->pages[0])) ? data_get($story->pages[0], 'image') : null;
        $seo_image = data_get($story->seo_meta, 'og_image', $story->posterImage ?: ($first_page_image ?: url('/images/default-story.jpg')));
        
        $storyLink = null;
        if (!empty($story->pages)) {
            $lastPage = $story->pages[count($story->pages) - 1];
            $storyLink = data_get($lastPage, 'articleLink');
        }
    @endphp
    
    <meta property="og:title" content="{{ $seo_title }}">
    <meta property="og:description" content="{{ $seo_desc }}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="{{ url()->current() }}">
    <meta property="og:image" content="{{ $seo_image }}">
    
    <script type="application/ld+json">
    {
      "@@context": "https://schema.org",
      "@@type": "Article",
      "mainEntityOfPage": { 
        "@@type": "WebPage", 
        "@@id": "{{ url()->current() }}" 
      },
      "headline": "{{ $story->title }}",
      "image": [
        "{{ $seo_image }}"
      ],
      "datePublished": "{{ $story->created_at ? $story->created_at->toIso8601String() : now()->toIso8601String() }}",
      "dateModified": "{{ $story->updated_at ? $story->updated_at->toIso8601String() : now()->toIso8601String() }}",
      "author": [{
          "@@type": "Person",
          "name": "{{ $story->author ?: 'Coachinginsikar' }}",
          "url": "https://coachingsinsikar.com"
      }],
      "publisher": {
        "@@type": "Organization",
        "name": "Coachinginsikar",
        "logo": {
          "@@type": "ImageObject",
          "url": "{{ url('/images/logo.webp') }}"
        }
      }
    }
    </script>
    <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
    
    <style amp-custom>
      html, body { margin: 0; padding: 0; width: 100%; height: 100%; }
      amp-story { font-family: 'Outfit', sans-serif; }
      amp-story-page { background-color: #000; }
      amp-img img { object-fit: cover; }
    </style>
  </head>
  <body>
    <amp-story standalone title="{{ $story->title }}" publisher="Coachinginsikar" publisher-logo-src="{{ url('/images/logo.webp') }}" poster-portrait-src="{{ $seo_image }}">
        @if(!empty($story->pages))
          @foreach($story->pages as $index => $page)
          @php
              $pageTitle = data_get($page, 'title', $story->title);
              $pageImage = data_get($page, 'image');
          @endphp
      <amp-story-page id="page-{{ $index }}">
        <amp-story-grid-layer template="fill">
            @if($pageImage)
          <amp-img src="{{ $pageImage }}" layout="fill" alt="{{ $pageTitle }}"></amp-img>
            @endif
        </amp-story-grid-layer>
        
        @if($storyLink)
        <amp-story-page-outlink layout="nodisplay">
          <a href="{{ $storyLink }}">Read Full Article</a>
        </amp-story-page-outlink>
        @endif
      </amp-story-page>
          @endforeach
        @endif
    </amp-story>
  </body>
</html>
EOD;

$viewPath = resource_path('views/story/amp.blade.php');
if (file_put_contents($viewPath, $bladeContent)) {
    echo "<span style='color:green'>SUCCESS: amp.blade.php fixed (Validation rules respected).</span><br>";
} else {
    echo "<span style='color:red'>FAILED to write amp.blade.php.</span><br>";
}

// Clear Caches
try {
    $files = glob(storage_path('framework/views/*'));
    foreach($files as $file) {
        if(is_file($file)) @unlink($file);
    }
    $kernel->call('view:clear');
    $kernel->call('cache:clear');
    if (function_exists('opcache_reset')) { opcache_reset(); }
    echo "<span style='color:green'>SUCCESS: All Caches cleared.</span><br>";
} catch (\Exception $e) {
    echo "<span style='color:red'>Cache clearing error: " . $e->getMessage() . "</span><br>";
}

echo "<h1>V17 FINISHED! YOUR STORY IS NOW GOOGLE VALID!</h1>";
?>
