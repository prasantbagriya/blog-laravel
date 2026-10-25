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
        // 1. Connected X (Twitter) Accounts & Profiles
        if (!Schema::hasTable('x_accounts')) {
            Schema::create('x_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('x_user_id')->index();
                $table->string('username')->index();
                $table->string('name')->default('');
                $table->text('profile_image_url')->nullable();
                $table->text('bio')->nullable();
                $table->unsignedInteger('followers_count')->default(0);
                $table->unsignedInteger('following_count')->default(0);
                $table->unsignedInteger('tweet_count')->default(0);
                $table->string('auth_mode')->default('oauth2'); // oauth1 or oauth2
                $table->text('access_token')->nullable();
                $table->text('access_token_secret')->nullable();
                $table->text('refresh_token')->nullable();
                $table->timestamp('token_expires_at')->nullable();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });
        }

        // 2. X Post Shares, Approval Queue & Publish Audit Trail
        if (!Schema::hasTable('x_post_shares')) {
            Schema::create('x_post_shares', function (Blueprint $table) {
                $table->id();
                $table->foreignId('post_id')->nullable()->constrained('posts')->nullOnDelete();
                $table->foreignId('x_account_id')->nullable()->constrained('x_accounts')->cascadeOnDelete();
                $table->string('tweet_id')->nullable()->index();
                $table->text('text');
                $table->text('media_url')->nullable();
                $table->string('x_media_id')->nullable();
                $table->text('target_link')->nullable();
                $table->string('status')->default('pending_approval')->index(); // draft, pending_approval, published, failed
                $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
                $table->text('error_message')->nullable();
                $table->text('tweet_permalink')->nullable();
                $table->unsignedInteger('likes_count')->default(0);
                $table->unsignedInteger('retweets_count')->default(0);
                $table->timestamp('published_at')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('x_post_shares');
        Schema::dropIfExists('x_accounts');
    }
};
