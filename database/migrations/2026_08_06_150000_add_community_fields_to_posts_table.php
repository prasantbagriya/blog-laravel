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
        Schema::table('posts', function (Blueprint $table) {
            if (!Schema::hasColumn('posts', 'type')) {
                $table->enum('type', ['TEXT', 'IMAGE', 'VIDEO', 'LINK', 'POLL'])->default('TEXT');
            }
            if (!Schema::hasColumn('posts', 'media_urls')) {
                $table->json('media_urls')->nullable();
            }
            if (!Schema::hasColumn('posts', 'link_url')) {
                $table->string('link_url')->nullable();
            }
            if (!Schema::hasColumn('posts', 'poll_options')) {
                $table->json('poll_options')->nullable();
            }
            if (!Schema::hasColumn('posts', 'score')) {
                $table->integer('score')->default(0);
            }
            if (!Schema::hasColumn('posts', 'author_id')) {
                $table->foreignId('author_id')->nullable()->constrained('users')->onDelete('cascade');
            }
            if (!Schema::hasColumn('posts', 'community_id')) {
                $table->foreignId('community_id')->nullable()->constrained('communities')->onDelete('cascade');
            }
            if (!Schema::hasColumn('posts', 'is_pinned')) {
                $table->boolean('is_pinned')->default(false);
            }
            if (!Schema::hasColumn('posts', 'is_locked')) {
                $table->boolean('is_locked')->default(false);
            }
            if (!Schema::hasColumn('posts', 'is_nsfw')) {
                $table->boolean('is_nsfw')->default(false);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Safe down migration
    }
};
