<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use App\Models\Story;
use App\Models\Community;

class HomeController extends Controller
{
    public function index()
    {
        $homeData = \Illuminate\Support\Facades\Cache::remember('homepage_data_v6', 3600, function () {
            // Only send fields rendered on the home page.  The previous payload included
            // full post content, SEO metadata, and JSON fields that are not displayed here.
            $morePosts = Post::where('published', true)
                ->select(['id', 'slug', 'title', 'coverImage', 'category', 'date'])
                ->orderBy('date', 'desc')
                ->offset(4)
                ->limit(4)
                ->get()
                ->toArray();

            $publishedStories = Story::where('published', true)
                ->select(['id', 'slug', 'title', 'posterImage'])
                ->take(4)
                ->get()
                ->toArray();
            $sliders = \App\Models\Slider::where('active', true)
                ->select(['id', 'image_url', 'order'])
                ->orderBy('order', 'asc')
                ->get()
                ->map(function ($slider) {
                    $slider->image_url = $this->responsiveImageUrl($slider->image_url, 672);

                    return $slider;
                })
                ->toArray();

            $categories = \App\Models\Category::select(['id', 'name', 'slug', 'description'])->get()->toArray();
            $featuredBusinesses = \App\Models\Business::select([
                    'id', 'name', 'slug', 'logo', 'category', 'category_name',
                    'rating', 'review_count', 'trust_score', 'is_verified',
                ])
                ->orderBy('rating', 'desc')
                ->take(4)
                ->get()
                ->map(function ($business) {
                    $business->logo = $this->responsiveImageUrl($business->logo, 384);

                    return $business;
                })
                ->toArray();
            $heroImage = $sliders[0]['image_url'] ?? $this->responsiveImageUrl('/uploads/background.webp', 672);

            $feedPosts = Post::with(['author', 'community'])
                ->whereNotNull('community_id')
                ->where(function ($q) {
                    $q->whereNull('status')->orWhereNotIn('status', ['removed', 'spam']);
                })
                ->orderBy('created_at', 'desc')
                ->take(3)
                ->get()
                ->map(function ($post) {
                    return [
                        'id' => $post->id,
                        'community' => $post->community->name ?? 'General',
                        'title' => $post->title,
                        'author' => $post->author->username ?? 'deleted',
                        'time' => $post->created_at->diffForHumans(),
                        'score' => $post->score,
                        'comments' => $post->comments()->count(),
                        'type' => $post->type,
                        'content' => \Illuminate\Support\Str::limit(strip_tags($post->content), 150),
                        'slug' => $post->slug,
                    ];
                })->toArray();

            $topCommunities = Community::withCount('members')
                ->orderBy('members_count', 'desc')
                ->take(4)
                ->get()
                ->map(function ($c) {
                    return [
                        'id' => $c->id,
                        'name' => $c->name,
                        'members' => $c->members_count,
                    ];
                })->toArray();

            return [
                'morePosts' => $morePosts,
                'categories' => $categories,
                'publishedStories' => $publishedStories,
                'sliders' => $sliders,
                'featuredBusinesses' => $featuredBusinesses,
                'feedPosts' => $feedPosts,
                'topCommunities' => $topCommunities,
                'meta' => [
                    'title' => 'CoachinginSikar: JEE, NEET, CA, CLAT & School Guide',
                    'description' => 'Find and compare the best coaching institutes and schools in Sikar. Honest guides on JEE, NEET, CA, CLAT, RBSE, and ICSE schools to help students and parents choose wisely.',
                    'keywords' => 'CoachinginSikar, best CoachinginSikar, JEE coaching Sikar, NEET coaching Sikar, CA coaching Sikar, CLAT coaching Sikar, RBSE school Sikar, ICSE school Sikar, compare coaching institutes, education guide Sikar, top coaching centres Sikar, Sikar education blog',
                    'og_title' => 'CoachinginSikar - Guide to JEE, NEET, CA, CLAT & Schools',
                    'og_description' => 'Check out the best coaching institutes and schools in Sikar. Compare JEE, NEET, CA, CLAT, RBSE and ICSE options to find which is best.',
                    'twitter_title' => 'CoachingsinSikar - JEE, NEET, CA, CLAT, NDA, Schools, & Hospital',
                    'twitter_description' => 'A simple, local guide to the best coaching institutes and schools in Sikar. Compare options for JEE, NEET, CA, CLAT, RBSE, and ICSE with clear, practical info.',
                    'url' => url('/'),
                    'type' => 'website',
                    'og_image' => url('/uploads/social-cover.webp'),
                    'twitter_card' => 'summary_large_image',
                    // Blade emits this before the JavaScript application starts, allowing
                    // the browser to request the LCP image immediately.
                    'preload_image' => $heroImage,
                    'schemas' => [
                        [
                            "@context" => "https://schema.org",
                            "@graph" => [
                                [
                                    "@type" => "WebSite",
                                    "@id" => url('/') . "/#website",
                                    "url" => url('/'),
                                    "name" => "Coachinginsikar",
                                    "potentialAction" => [
                                        "@type" => "SearchAction",
                                        "target" => url('/search?q={search_term_string}'),
                                        "query-input" => "required name=search_term_string"
                                    ]
                                ],
                                [
                                    "@type" => "Organization",
                                    "@id" => url('/') . "/#organization",
                                    "name" => "Coachinginsikar",
                                    "url" => url('/'),
                                    "logo" => [
                                        "@type" => "ImageObject",
                                        "url" => url('/uploads/logo.webp')
                                    ],
                                    "sameAs" => [
                                        "https://www.facebook.com/coachinginsikar",
                                        "https://x.com/coachinginsikar",
                                        "https://www.instagram.com/coachinginsikar",
                                        "https://www.linkedin.com/company/coachinginsikar", "https://www.youtube.com/@coachinginsikar", "https://www.pinterest.com/coachinginsikar", "https://coachinginsikar.tumblr.com"
                                    ]
                                ],
                                [
                                    "@type" => "LocalBusiness",
                                    "@id" => url('/') . "/#localbusiness",
                                    "name" => "Coachinginsikar",
                                    "url" => url('/'),
                                    "image" => url('/uploads/logo.webp'),
                                    "address" => [
                                        "@type" => "PostalAddress",
                                        "addressLocality" => "Sikar",
                                        "addressRegion" => "Rajasthan",
                                        "addressCountry" => "IN"
                                    ],
                                    "sameAs" => [
                                        "https://www.facebook.com/coachinginsikar",
                                        "https://x.com/coachinginsikar",
                                        "https://www.instagram.com/coachinginsikar",
                                        "https://www.linkedin.com/company/coachinginsikar", "https://www.youtube.com/@coachinginsikar", "https://www.pinterest.com/coachinginsikar", "https://coachinginsikar.tumblr.com"
                                    ]
                                ]
                            ]
                        ]
                    ]
                ]
            ];
        });

        // Dynamically replace .png/.jpg to .webp for any images from /uploads/ in the homepage data
        // array_walk_recursive($homeData, function(&$item) {
        //     if (is_string($item) && str_contains($item, 'uploads/')) {
        //         $item = preg_replace('/(uploads\/[^"\'\s>]+)\.(png|jpg|jpeg|bmp)/i', '$1.webp', $item);
        //     }
        // });

        if (!isset($homeData['topCommunities'])) {
            $homeData['topCommunities'] = [];
        }
        if (!isset($homeData['feedPosts'])) {
            $homeData['feedPosts'] = [];
        }

        // Map joined status for communities outside the cache
        if (auth()->check()) {
            $joinedIds = auth()->user()->communities()->pluck('communities.id')->toArray();
            foreach ($homeData['topCommunities'] as &$community) {
                $community['is_joined'] = in_array($community['id'], $joinedIds);
            }
            
            $votedPostIds = \Illuminate\Support\Facades\DB::table('votes')
                ->where('user_id', auth()->id())
                ->where('votable_type', \App\Models\Post::class)
                ->where('value', 1)
                ->pluck('votable_id')->toArray();
            foreach ($homeData['feedPosts'] as &$post) {
                $post['has_voted'] = in_array($post['id'], $votedPostIds);
            }
        } else {
            foreach ($homeData['topCommunities'] as &$community) {
                $community['is_joined'] = false;
            }
            foreach ($homeData['feedPosts'] as &$post) {
                $post['has_voted'] = false;
            }
        }

        return view('home', $homeData);
    }

    private function responsiveImageUrl(?string $imageUrl, int $width): ?string
    {
        if (! $imageUrl || ! str_starts_with($imageUrl, '/uploads/')) {
            return $imageUrl;
        }

        return '/images/' . $width . '/' . ltrim(substr($imageUrl, strlen('/uploads/')), '/');
    }
}
