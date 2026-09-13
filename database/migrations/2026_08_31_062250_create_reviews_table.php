<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('business_id')->index();
            $table->string('reviewer_name');
            $table->string('reviewer_avatar')->nullable();
            $table->string('reviewer_location')->nullable();
            $table->json('reviewer_badges')->nullable();
            $table->integer('reviewer_total_reviews')->default(0);
            $table->boolean('is_verified_purchase')->default(false);
            $table->boolean('is_anonymous')->default(false);
            $table->json('proof')->nullable();
            $table->integer('rating')->default(0);
            $table->json('category_ratings')->nullable();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->json('pros')->nullable();
            $table->json('cons')->nullable();
            $table->json('images')->nullable();
            $table->integer('helpful_count')->default(0);
            $table->integer('unhelpful_count')->default(0);
            $table->json('business_reply')->nullable();
            $table->integer('ai_fraud_score')->default(0);
            $table->string('ai_fraud_reason')->nullable();
            $table->string('sentiment')->nullable();
            $table->string('status')->default('published');
            $table->string('device_fingerprint')->nullable();
            $table->string('ip_location')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
