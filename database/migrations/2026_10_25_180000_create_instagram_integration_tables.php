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
        Schema::create('instagram_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('instagram_business_id')->unique();
            $table->string('facebook_page_id')->nullable();
            $table->string('username');
            $table->string('name')->nullable();
            $table->text('profile_picture_url')->nullable();
            $table->text('bio')->nullable();
            $table->unsignedInteger('followers_count')->default(0);
            $table->unsignedInteger('media_count')->default(0);
            $table->text('access_token')->nullable();
            $table->dateTime('token_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('instagram_post_shares', function (Blueprint $table) {
            $table->id();
            $table->uuid('post_id')->nullable()->index();
            $table->foreignId('instagram_account_id')->nullable()->constrained('instagram_accounts')->cascadeOnDelete();
            $table->text('caption');
            $table->text('image_url');
            $table->string('ig_container_id')->nullable();
            $table->string('ig_media_id')->nullable();
            $table->string('ig_permalink')->nullable();
            $table->string('status')->default('pending_approval')->index();
            $table->text('error_message')->nullable();
            $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
            $table->dateTime('published_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('instagram_post_shares');
        Schema::dropIfExists('instagram_accounts');
    }
};
