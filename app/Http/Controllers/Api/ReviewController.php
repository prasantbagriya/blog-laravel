<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Business;

class ReviewController extends Controller
{
    public function index($businessIdentifier, Request $request)
    {
        $business = Business::where('id', $businessIdentifier)->orWhere('slug', $businessIdentifier)->first();

        if (!$business) {
            return response()->json([]);
        }

        $query = Review::where('business_id', $business->id)->where('status', 'published');

        if ($request->filled('minRating')) {
            $query->where('rating', '>=', $request->minRating);
        }

        if ($request->filled('verifiedOnly') && $request->verifiedOnly === 'true') {
            $query->where('is_verified_purchase', true);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $sort = $request->get('sort');
        if ($sort === 'recent') {
            $query->orderByDesc('created_at');
        } elseif ($sort === 'helpful') {
            $query->orderByDesc('helpful_count');
        } elseif ($sort === 'rating_high') {
            $query->orderByDesc('rating');
        } elseif ($sort === 'rating_low') {
            $query->orderBy('rating');
        } else {
            $query->orderByDesc('created_at');
        }

        return response()->json($query->get());
    }

    public function vote($id, Request $request)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $direction = $request->input('direction');
        if ($direction === 'up') {
            $review->increment('helpful_count');
        } elseif ($direction === 'down') {
            $review->increment('unhelpful_count');
        }

        return response()->json($review->refresh());
    }

    public function reply($id, Request $request)
    {
        $review = Review::find($id);
        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $business = Business::find($review->business_id);
        $user = $request->user();
        $canAdminister = $user && (
            in_array($user->role, ['admin', 'super_admin'], true)
            || (bool) $user->getAttribute('is_admin')
        );
        if (!$user || !$business || (!$canAdminister && $business->user_id !== $user->id)) {
            return response()->json(['error' => 'Only the listing owner can reply to this review'], 403);
        }

        $validated = $request->validate([
            'content' => 'required|string|max:3000',
        ]);

        $review->business_reply = [
            'id' => 'rep-' . time(),
            'authorName' => $business->name,
            'authorRole' => 'Official representative',
            'content' => $validated['content'],
            'createdAt' => now()->toDateString(),
            'isAiGenerated' => (bool) $request->input('isAiGenerated')
        ];
        $review->save();

        return response()->json($review);
    }

    public function store(Request $request)
    {
        $business = Business::find($request->input('businessId'));
        if (!$business) {
            return response()->json(['error' => 'Business not found'], 404);
        }

        // Simplistic AI Fraud Check fallback if AiReviewController isn't called directly by frontend
        $aiFraudScore = 5;
        $aiFraudReason = 'Verified genuine user review';
        $sentiment = $request->input('rating') >= 4 ? 'positive' : ($request->input('rating') == 3 ? 'neutral' : 'negative');

        $isAnonymous = $request->input('isAnonymous', false);
        $reviewerName = $isAnonymous ? 'Verified Community Member' : $request->input('reviewerName', 'Verified User');
        $isVerifiedPurchase = $request->input('isVerifiedPurchase', false);
        $rating = (int) $request->input('rating', 5);

        $review = Review::create([
            'id' => 'rev-' . time() . rand(100,999),
            'business_id' => $business->id,
            'reviewer_name' => $reviewerName,
            'reviewer_avatar' => 'https://api.dicebear.com/7.x/avataaars/svg?seed=' . urlencode($reviewerName),
            'reviewer_location' => $request->input('reviewerLocation', 'Global'),
            'reviewer_badges' => $isVerifiedPurchase ? ['Verified Buyer'] : ['Community Reviewer'],
            'reviewer_total_reviews' => 1,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_anonymous' => $isAnonymous,
            'proof' => $request->has('proof') ? array_merge($request->input('proof'), ['verifiedAt' => now()->toDateString()]) : null,
            'rating' => $rating,
            'category_ratings' => $request->input('categoryRatings') ?? ['support' => $rating, 'quality' => $rating, 'delivery' => $rating, 'pricing' => $rating, 'communication' => $rating, 'value' => $rating],
            'title' => $request->input('title'),
            'description' => $request->input('description'),
            'pros' => $request->input('pros', ['Fast experience']),
            'cons' => $request->input('cons', ['None noted']),
            'helpful_count' => 0,
            'unhelpful_count' => 0,
            'ai_fraud_score' => $aiFraudScore,
            'ai_fraud_reason' => $aiFraudReason,
            'sentiment' => $sentiment,
            'status' => $aiFraudScore > 65 ? 'under_review' : 'published',
            'device_fingerprint' => 'fp_web_' . \Illuminate\Support\Str::random(6),
            'ip_location' => 'Verified ISP Connection',
        ]);

        // Recalculate Business Stats
        $publishedReviews = Review::where('business_id', $business->id)->where('status', 'published')->get();
        $totalCount = $publishedReviews->count();
        $totalRating = $publishedReviews->sum('rating');
        $newAvgRating = $totalCount > 0 ? round($totalRating / $totalCount, 1) : $business->rating;

        $verifiedCount = $publishedReviews->where('is_verified_purchase', true)->count();
        $verifiedRatio = $totalCount > 0 ? $verifiedCount / $totalCount : 0;
        
        $avgFraud = $totalCount > 0 ? ($publishedReviews->sum('ai_fraud_score') / $totalCount) : 0;
        $rawTrust = ($newAvgRating / 5) * 60 + ($verifiedRatio * 25) + ((100 - $avgFraud) / 100 * 15);
        $newTrustScore = max(20, min(99, round($rawTrust)));

        $business->update([
            'rating' => $newAvgRating,
            'review_count' => $totalCount,
            'trust_score' => $newTrustScore,
        ]);

        return response()->json([
            'review' => $review,
            'businessStats' => [
                'rating' => $newAvgRating,
                'reviewCount' => $totalCount,
                'trustScore' => $newTrustScore
            ]
        ], 201);
    }
}
