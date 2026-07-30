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
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('slug')->unique()->nullable();
            $table->string('title')->nullable();
            $table->longText('content')->nullable();
            $table->text('metaDescription')->nullable();
            $table->text('excerpt')->nullable();
            $table->string('coverImage')->nullable();
            $table->string('authorImage')->nullable();
            $table->json('authorSocials')->nullable();
            $table->string('seoTitle')->nullable();
            $table->string('ogTitle')->nullable();
            $table->text('ogDescription')->nullable();
            $table->string('canonicalUrl')->nullable();
            $table->string('keywords')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->json('faqs')->nullable();
            $table->boolean('published')->default(false);
            $table->timestamp('date')->nullable();
            $table->string('author')->nullable(); // Adding author name reference
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};
