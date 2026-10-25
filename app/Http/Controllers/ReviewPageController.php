<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Business;

class ReviewPageController extends Controller
{
    /**
     * Display the main reviews home page.
     */
    public function index()
    {
        $businesses = Business::select([...Business::publicColumns(), 'user_id'])
            ->orderByDesc('trust_score')
            ->take(30)
            ->get()
            ->map(fn (Business $business) => $business->publicPayload(request()->user()))
            ->values();

        $meta = [
            'title' => 'Verified Business Directory & Reviews | CoachingsinSikar',
            'description' => 'Explore verified companies, institutes, and schools. Read authentic student reviews, AI fraud-filtered ratings, and trust scores.',
            'url' => route('reviews.index'),
            'preload_image' => '/uploads/background.webp',
            'type' => 'website',
            'schemas' => [
                [
                    '@context' => 'https://schema.org',
                    '@type' => 'CollectionPage',
                    'name' => 'Verified Business Directory & Reviews',
                    'description' => 'Explore verified companies, institutes, and schools with authentic reviews and trust scores.',
                    'url' => route('reviews.index'),
                ]
            ],
        ];

        return Inertia::render('Reviews/Index', [
            'initialView' => 'home',
            'initialBusinesses' => $businesses,
            'meta' => $meta,
        ]);
    }

    /**
     * Display the category directory page.
     */
    public function category($categorySlug)
    {
        if ($categorySlug === 'feed') {
            return redirect('/feed', 301);
        }

        // If a business slug is passed directly to /business/{slug}, redirect to canonical category URL
        $business = Business::where('slug', $categorySlug)->orWhere('id', $categorySlug)->first();
        if ($business) {
            $cat = $business->category ?: 'coaching-institutes';
            return redirect()->route('reviews.business', [
                'category' => $cat,
                'business' => $business->slug ?: $business->id,
            ], 301);
        }

        $categoryBusinesses = Business::select([...Business::publicColumns(), 'user_id'])
            ->where('category', $categorySlug)
            ->orderByDesc('trust_score')
            ->take(30)
            ->get()
            ->map(fn (Business $business) => $business->publicPayload(request()->user()))
            ->values();

        $formattedCatName = ucwords(str_replace('-', ' ', $categorySlug));
        $meta = [
            'title' => "{$formattedCatName} Reviews & Ratings | CoachingsinSikar",
            'description' => "Browse verified companies and top-rated institutes in {$formattedCatName}. Read authentic reviews and trust scores.",
            'url' => url('/business/' . $categorySlug),
            'preload_image' => '/uploads/background.webp',
            'type' => 'website',
        ];

        return Inertia::render('Reviews/Index', [
            'initialView' => 'directory',
            'initialCategorySlug' => $categorySlug,
            'initialBusinesses' => $categoryBusinesses,
            'meta' => $meta,
        ]);
    }

    /**
     * Display a specific business profile.
     */
    public function business($categorySlug, $businessSlug)
    {
        // Keep account ownership data server-side; it is only used to produce canEdit.
        $business = Business::select([...Business::publicColumns(), 'user_id'])
            ->where('slug', $businessSlug)
            ->orWhere('id', $businessSlug)
            ->first();

        if (!$business) {
            abort(404, 'Business Profile Not Found');
        }

        // Canonical URL enforcement (SEO)
        $canonicalCategory = $business->category ?: 'coaching-institutes';
        if ($categorySlug !== $canonicalCategory) {
            return redirect()->route('reviews.business', [
                'category' => $canonicalCategory,
                'business' => $businessSlug
            ], 301);
        }

        $reviews = \App\Models\Review::where('business_id', $business->id)
            ->where('status', 'published')
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get();

        $rating = floatval($business->rating ?? 0);
        $reviewCount = intval($business->review_count ?? 0);

        $businessSchema = [
            '@context' => 'https://schema.org',
            '@type' => 'LocalBusiness',
            'name' => $business->name,
            'description' => $business->description ?? $business->detailed_description ?? '',
        ];

        if (!empty($business->logo)) {
            $businessSchema['image'] = str_starts_with($business->logo, 'http') ? $business->logo : url($business->logo);
        }
        if (!empty($business->phone)) {
            $businessSchema['telephone'] = $business->phone;
        }
        if (!empty($business->website)) {
            $businessSchema['url'] = $business->website;
        }
        if (!empty($business->social_links) && is_array($business->social_links)) {
            $sameAs = array_values(array_filter($business->social_links));
            if (!empty($sameAs)) {
                $businessSchema['sameAs'] = $sameAs;
            }
        }
        if (!empty($business->address) || !empty($business->city)) {
            $businessSchema['address'] = [
                '@type' => 'PostalAddress',
                'streetAddress' => $business->address ?? '',
                'addressLocality' => $business->city ?? 'Sikar',
                'addressRegion' => 'Rajasthan',
                'addressCountry' => $business->country ?? 'IN',
            ];
        }

        // Google Structured Data requirement:
        // AggregateRating must only be included if reviewCount is positive (> 0)
        // and ratingValue is within [worstRating, bestRating].
        if ($reviewCount > 0 && $rating >= 1 && $rating <= 5) {
            $businessSchema['aggregateRating'] = [
                '@type' => 'AggregateRating',
                'ratingValue' => round($rating, 1),
                'reviewCount' => $reviewCount,
                'bestRating' => 5,
                'worstRating' => 1,
            ];
        }

        $canonicalUrl = route('reviews.business', [
            'category' => $canonicalCategory,
            'business' => $business->slug ?: $business->id
        ]);

        $seoDescription = $reviewCount > 0
            ? "Read {$reviewCount} verified reviews for {$business->name}. Trust score: {$business->trust_score}/100. " . \Illuminate\Support\Str::limit(strip_tags($business->description ?? ''), 150)
            : "Explore verified details, student ratings, and coaching information for {$business->name}. Trust score: {$business->trust_score}/100. " . \Illuminate\Support\Str::limit(strip_tags($business->description ?? ''), 150);

        return Inertia::render('Reviews/Index', [
            'initialView' => 'profile',
            'initialCategorySlug' => $canonicalCategory,
            'businessData' => $business->publicPayload(request()->user()),
            'initialReviews' => $reviews,
            'meta' => [
                'title' => "{$business->name} Reviews & Trust Score | TrustPulse",
                'description' => $seoDescription,
                'og_image' => !empty($business->logo) ? (str_starts_with($business->logo, 'http') ? $business->logo : url($business->logo)) : '',
                'url' => $canonicalUrl,
                'schemas' => [$businessSchema],
            ],
        ]);
    }
}
