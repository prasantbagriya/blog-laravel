<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReviewSystemSeeder extends Seeder
{
    public function run(): void
    {
        $jsonPath = database_path('seeders/mockData.json');
        if (!file_exists($jsonPath)) {
            $this->command->error("mockData.json not found.");
            return;
        }

        $data = json_decode(file_get_contents($jsonPath), true);
        
        foreach ($data['businesses'] as $biz) {
            \App\Models\Business::updateOrCreate(
                ['id' => $biz['id']],
                [
                    'name' => $biz['name'],
                    'slug' => $biz['slug'],
                    'logo' => $biz['logo'] ?? null,
                    'cover_image' => $biz['coverImage'] ?? null,
                    'category' => $biz['category'] ?? null,
                    'category_name' => $biz['categoryName'] ?? null,
                    'subcategory' => $biz['subcategory'] ?? null,
                    'description' => $biz['description'] ?? null,
                    'website' => $biz['website'] ?? null,
                    'phone' => $biz['phone'] ?? null,
                    'email' => $biz['email'] ?? null,
                    'address' => $biz['address'] ?? null,
                    'city' => $biz['city'] ?? null,
                    'country' => $biz['country'] ?? null,
                    'opening_hours' => $biz['openingHours'] ?? null,
                    'social_links' => $biz['socialLinks'] ?? null,
                    'rating' => $biz['rating'] ?? 0,
                    'review_count' => $biz['reviewCount'] ?? 0,
                    'trust_score' => $biz['trustScore'] ?? 0,
                    'is_verified' => $biz['isVerified'] ?? false,
                    'claimed_by_owner' => $biz['claimedByOwner'] ?? false,
                    'verified_badge_type' => $biz['verifiedBadgeType'] ?? null,
                    'rating_distribution' => $biz['ratingDistribution'] ?? null,
                    'category_averages' => $biz['categoryAverages'] ?? null,
                    'followers_count' => $biz['followersCount'] ?? 0,
                    'ai_summary' => $biz['aiSummary'] ?? null,
                    'products' => $biz['products'] ?? null,
                    'faqs' => $biz['faqs'] ?? null,
                    'tags' => $biz['tags'] ?? null,
                    'monthly_visitors_count' => $biz['monthlyVisitorsCount'] ?? null,
                ]
            );
        }

        foreach ($data['reviews'] as $rev) {
            \App\Models\Review::updateOrCreate(
                ['id' => $rev['id']],
                [
                    'business_id' => $rev['businessId'],
                    'reviewer_name' => $rev['reviewerName'],
                    'reviewer_avatar' => $rev['reviewerAvatar'] ?? null,
                    'reviewer_location' => $rev['reviewerLocation'] ?? null,
                    'reviewer_badges' => $rev['reviewerBadges'] ?? null,
                    'reviewer_total_reviews' => $rev['reviewerTotalReviews'] ?? 0,
                    'is_verified_purchase' => $rev['isVerifiedPurchase'] ?? false,
                    'is_anonymous' => $rev['isAnonymous'] ?? false,
                    'proof' => $rev['proof'] ?? null,
                    'rating' => $rev['rating'] ?? 0,
                    'category_ratings' => $rev['categoryRatings'] ?? null,
                    'title' => $rev['title'] ?? null,
                    'description' => $rev['description'] ?? null,
                    'pros' => $rev['pros'] ?? null,
                    'cons' => $rev['cons'] ?? null,
                    'images' => $rev['images'] ?? null,
                    'helpful_count' => $rev['helpfulCount'] ?? 0,
                    'unhelpful_count' => $rev['unhelpfulCount'] ?? 0,
                    'business_reply' => $rev['businessReply'] ?? null,
                    'ai_fraud_score' => $rev['aiFraudScore'] ?? 0,
                    'ai_fraud_reason' => $rev['aiFraudReason'] ?? null,
                    'sentiment' => $rev['sentiment'] ?? null,
                    'status' => $rev['status'] ?? 'published',
                    'device_fingerprint' => $rev['deviceFingerprint'] ?? null,
                    'ip_location' => $rev['ipLocation'] ?? null,
                    'created_at' => isset($rev['createdAt']) ? \Carbon\Carbon::parse($rev['createdAt']) : now(),
                ]
            );
        }

        foreach ($data['campaigns'] as $camp) {
            \App\Models\ReviewCampaign::updateOrCreate(
                ['id' => $camp['id']],
                [
                    'business_id' => $camp['businessId'],
                    'name' => $camp['name'],
                    'type' => $camp['type'],
                    'status' => $camp['status'],
                    'total_sent' => $camp['totalSent'] ?? 0,
                    'reviews_collected' => $camp['reviewsCollected'] ?? 0,
                    'conversion_rate' => $camp['conversionRate'] ?? 0,
                    'created_at' => isset($camp['createdAt']) ? \Carbon\Carbon::parse($camp['createdAt']) : now(),
                ]
            );
        }

        $this->command->info("Review System Seeded!");
    }
}
