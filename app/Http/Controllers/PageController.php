<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About');
    }

    public function contact()
    {
        return Inertia::render('Static/Contact');
    }

    public function submitContact(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'subject' => 'required|string|max:255',
            'message' => 'required|string|max:5000',
        ]);

        \App\Models\ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'unread',
        ]);

        return back()->with('success', 'Message sent successfully!');
    }

    public function editorialPolicy()
    {
        return Inertia::render('Static/EditorialPolicy');
    }

    public function factCheckingPolicy()
    {
        return Inertia::render('Static/FactCheckingPolicy');
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy');
    }

    public function terms()
    {
        return Inertia::render('Static/Terms');
    }

    public function search()
    {
        return Inertia::render('Search/Index');
    }
}
