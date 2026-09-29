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
            $table->enum('type', ['TEXT', 'IMAGE', 'VIDEO', 'LINK', 'POLL'])->default('TEXT');
            $table->longText('content')->nullable();
            $table->json('media_urls')->nullable();
            $table->string('link_url')->nullable();
            $table->json('poll_options')->nullable();
            
            $table->integer('score')->default(0);
            
            $table->foreignId('author_id')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('community_id')->nullable()->constrained('communities')->onDelete('cascade');
            
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_locked')->default(false);
            $table->boolean('is_nsfw')->default(false);
            
            // Legacy blog fields
            $table->text('excerpt')->nullable();
            $table->string('coverImage')->nullable();
            $table->string('category')->nullable();
            $table->json('tags')->nullable();
            $table->boolean('published')->default(false);
            $table->timestamp('date')->nullable();
            
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
