<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Post;
use App\Models\Story;

class HomeController extends Controller
{
    public function index()
    {
        $homeData = \Illuminate\Support\Facades\Cache::remember('homepage_data', 3600, function () {
            // Fetch only 14 posts instead of ALL published posts to save memory/time
            $publishedPosts = Post::where('published', true)
                                  ->orderBy('date', 'desc')
                                  ->limit(14)
                                  ->get()
                                  ->toArray();
            
            $featuredPost = $publishedPosts[0] ?? null;
            $recentPosts = array_slice($publishedPosts, 1, 3);
            $morePosts = array_slice($publishedPosts, 4, 10);

            $publishedStories = Story::where('published', true)->take(4)->get()->toArray();
            $sliders = \App\Models\Slider::where('active', true)->orderBy('order', 'asc')->get()->toArray();

            $categories = \App\Models\Category::all()->toArray();
            $authors = \App\Models\Author::all()->toArray();
            $featuredBusinesses = \App\Models\Business::orderBy('rating', 'desc')->take(4)->get()->toArray();

            return [
                'featuredPost' => $featuredPost,
                'recentPosts' => $recentPosts,
                'morePosts' => $morePosts,
                'categories' => $categories,
                'authors' => $authors,
                'publishedStories' => $publishedStories,
                'sliders' => $sliders,
                'featuredBusinesses' => $featuredBusinesses,
                'meta' => [
                    'title' => 'coachinginsikar | Education News, Exams & Coaching Updates',
                    'description' => 'CoachingsinsSikar brings you the latest education news, exam results, Olympiads, coaching updates, and school information from Sikar and beyond. Our goal is to provide students and parents with simple, useful, and reliable education updates in one place. Stay informed with clear and relevant content to make better academic decisions.',
                    'url' => url('/'),
                    'type' => 'website',
                    'og_image' => url('/uploads/social-cover.webp'),
                    'twitter_card' => 'summary_large_image',
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

        return Inertia::render('Welcome', $homeData);
    }
}
