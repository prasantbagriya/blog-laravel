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
        Schema::create('facebook_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('fb_user_id')->unique();
            $table->string('name');
            $table->string('email')->nullable();
            $table->text('avatar')->nullable();
            $table->text('user_access_token');
            $table->timestamp('token_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('facebook_pages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('facebook_account_id')->constrained('facebook_accounts')->cascadeOnDelete();
            $table->string('page_id')->unique();
            $table->string('name');
            $table->string('category')->nullable();
            $table->text('page_access_token');
            $table->text('picture_url')->nullable();
            $table->unsignedInteger('fan_count')->default(0);
            $table->unsignedInteger('followers_count')->default(0);
            $table->boolean('is_default')->default(false);
            $table->boolean('auto_publish_enabled')->default(false);
            $table->timestamps();
        });

        Schema::create('facebook_post_shares', function (Blueprint $table) {
            $table->id();
            $table->string('post_id')->nullable();
            $table->foreignId('facebook_page_id')->constrained('facebook_pages')->cascadeOnDelete();
            $table->text('caption');
            $table->text('image_url')->nullable();
            $table->text('target_link')->nullable();
            $table->string('status')->default('pending_approval');
            $table->string('fb_post_id')->nullable();
            $table->text('fb_permalink')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['post_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('facebook_post_shares');
        Schema::dropIfExists('facebook_pages');
        Schema::dropIfExists('facebook_accounts');
    }
};
