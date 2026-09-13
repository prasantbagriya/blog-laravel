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
        return Inertia::render('Reviews/Index', [
            'initialView' => 'home',
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

        return Inertia::render('Reviews/Index', [
            'initialView' => 'directory',
            'initialCategorySlug' => $categorySlug,
        ]);
    }

    /**
     * Display a specific business profile.
     */
    public function business($categorySlug, $businessSlug)
    {
        $business = Business::where('slug', $businessSlug)->first();

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

        return Inertia::render('Reviews/Index', [
            'initialView' => 'profile',
            'initialCategorySlug' => $canonicalCategory,
            'businessData' => $business,
        ]);
    }
}
