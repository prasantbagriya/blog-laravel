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
        Schema::create('businesses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('logo')->nullable();
            $table->string('cover_image')->nullable();
            $table->string('category')->nullable();
            $table->string('category_name')->nullable();
            $table->string('subcategory')->nullable();
            $table->text('description')->nullable();
            $table->string('website')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('address')->nullable();
            $table->string('city')->nullable();
            $table->string('country')->nullable();
            $table->string('opening_hours')->nullable();
            $table->json('social_links')->nullable();
            $table->decimal('rating', 3, 1)->default(0);
            $table->integer('review_count')->default(0);
            $table->integer('trust_score')->default(0);
            $table->boolean('is_verified')->default(false);
            $table->boolean('claimed_by_owner')->default(false);
            $table->string('verified_badge_type')->nullable();
            $table->json('rating_distribution')->nullable();
            $table->json('category_averages')->nullable();
            $table->integer('followers_count')->default(0);
            $table->json('ai_summary')->nullable();
            $table->json('products')->nullable();
            $table->json('faqs')->nullable();
            $table->json('tags')->nullable();
            $table->integer('monthly_visitors_count')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};
