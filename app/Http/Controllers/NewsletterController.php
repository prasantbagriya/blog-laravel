<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $request->validate([
            'email' => 'required|email'
        ]);

        \App\Models\NewsletterSubscriber::updateOrCreate(
            ['email' => $request->email],
            ['source' => $request->source ?? 'unknown']
        );

        return response()->json(['success' => true]);
    }

    public function getSubscribers()
    {
        return response()->json(\App\Models\NewsletterSubscriber::orderBy('created_at', 'desc')->get());
    }

    public function deleteSubscriber($id)
    {
        \App\Models\NewsletterSubscriber::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
