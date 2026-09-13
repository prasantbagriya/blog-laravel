<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Report;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'reportable_id' => 'required',
            'reportable_type' => 'required|in:post,comment',
            'reason' => 'required|string|max:255',
        ]);

        $user = $request->user();

        // Determine the model
        $modelClass = $validated['reportable_type'] === 'post' ? Post::class : Comment::class;
        $reportable = $modelClass::findOrFail($validated['reportable_id']);

        // Check if user already reported this
        $existingReport = Report::where('user_id', $user->id)
            ->where('reportable_id', $reportable->id)
            ->where('reportable_type', $modelClass)
            ->first();

        if ($existingReport) {
            return back()->with('error', 'You have already reported this item.');
        }

        // Get community id for easy filtering in modqueue
        $communityId = $validated['reportable_type'] === 'post' 
            ? $reportable->community_id 
            : $reportable->post->community_id;

        Report::create([
            'user_id' => $user->id,
            'community_id' => $communityId,
            'reportable_id' => $reportable->id,
            'reportable_type' => $modelClass,
            'reason' => $validated['reason'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Report submitted successfully. It will be reviewed by a moderator.');
    }
}
