<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About', [
            'meta' => [
                'title'       => 'About Us',
                'h1'          => 'About Us',
                'description' => 'Learn about CoachingsinSikar — India\'s trusted platform for finding and comparing coaching institutes, schools, and colleges in Sikar, Rajasthan.',
                'url'         => url('/about'),
            ],
        ]);
    }

    public function contact()
    {
        return Inertia::render('Static/Contact', [
            'meta' => [
                'title'       => 'Contact Us',
                'h1'          => 'Contact Us',
                'description' => 'Have a question about coaching or schools in Sikar? Reach out to the CoachingsinSikar team with suggestions, corrections, or topics you want us to cover next.',
                'url'         => url('/contact'),
            ],
        ]);
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        \App\Models\ContactMessage::create([
            'name'    => $validated['name'],
            'email'   => $validated['email'],
            'phone'   => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status'  => 'unread',
        ]);

        return back()->with('success', 'Message sent successfully!');
    }

    public function editorialPolicy()
    {
        return Inertia::render('Static/EditorialPolicy', [
            'meta' => [
                'title'       => 'Editorial Policy',
                'h1'          => 'Editorial Policy — How We Create and Review Content',
                'description' => 'Read about CoachingsinSikar\'s editorial standards, fact-checking process, and commitment to accurate, unbiased education content.',
                'url'         => url('/editorial-policy'),
            ],
        ]);
    }

    public function factCheckingPolicy()
    {
        return Inertia::render('Static/FactCheckingPolicy', [
            'meta' => [
                'title'       => 'Fact-Checking Policy',
                'h1'          => 'Fact-Checking Policy — Our Commitment to Accuracy',
                'description' => 'CoachingsinSikar\'s fact-checking policy explains how we verify data, fees, results, and rankings of coaching institutes and schools in Sikar.',
                'url'         => url('/fact-checking-policy'),
            ],
        ]);
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy', [
            'meta' => [
                'title'       => 'Privacy Policy',
                'h1'          => 'Privacy Policy — How We Handle Your Data',
                'description' => 'Read CoachingsinSikar\'s privacy policy to understand how we collect, use, and protect your personal information.',
                'url'         => url('/privacy'),
            ],
        ]);
    }

    public function terms()
    {
        return Inertia::render('Static/Terms', [
            'meta' => [
                'title'       => 'Terms of Service',
                'h1'          => 'Terms of Service',
                'description' => 'Review the terms and conditions governing your use of the CoachingsinSikar platform, including content, listings, and user responsibilities.',
                'url'         => url('/terms'),
            ],
        ]);
    }

    public function search()
    {
        return Inertia::render('Search/Index');
    }
}

