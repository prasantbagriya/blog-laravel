<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;

class ReviewModerationController extends Controller
{
    public function queue(Request $request)
    {
        $flagged = Review::whereIn('status', ['flagged', 'under_review'])
            ->orWhere('ai_fraud_score', '>=', 40)
            ->get();
        return response()->json($flagged);
    }

    public function action(Request $request)
    {
        $reviewId = $request->input('reviewId');
        $action = $request->input('action'); // 'approve' or 'reject'
        $notes = $request->input('notes');

        $review = Review::find($reviewId);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        if ($action === 'approve') {
            $review->status = 'published';
        } else {
            $review->status = 'rejected';
        }

        if ($notes) {
            $review->ai_fraud_reason = $notes;
        }

        $review->save();

        return response()->json($review);
    }

    public function flag($id, Request $request)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $review->status = 'flagged';
        $review->ai_fraud_reason = $request->input('reason', 'Flagged by community user');
        $review->save();

        return response()->json(['message' => 'Review submitted for moderation inspection', 'review' => $review]);
    }
}
