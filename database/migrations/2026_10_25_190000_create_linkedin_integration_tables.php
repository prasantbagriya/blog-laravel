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
        Schema::create('linkedin_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('linkedin_person_id')->unique();
            $table->string('name');
            $table->string('given_name')->nullable();
            $table->string('family_name')->nullable();
            $table->string('email')->nullable();
            $table->text('profile_picture_url')->nullable();
            $table->string('headline')->nullable();
            $table->string('organization_id')->nullable();
            $table->string('organization_name')->nullable();
            $table->string('organization_vanity_name')->nullable();
            $table->text('organization_logo_url')->nullable();
            $table->string('post_as')->default('organization');
            $table->text('access_token')->nullable();
            $table->text('refresh_token')->nullable();
            $table->dateTime('token_expires_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('linkedin_post_shares', function (Blueprint $table) {
            $table->id();
            $table->uuid('post_id')->nullable()->index();
            $table->foreignId('linkedin_account_id')->nullable()->constrained('linkedin_accounts')->cascadeOnDelete();
            $table->text('commentary');
            $table->text('media_url')->nullable();
            $table->string('share_urn')->nullable();
            $table->string('permalink')->nullable();
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
        Schema::dropIfExists('linkedin_post_shares');
        Schema::dropIfExists('linkedin_accounts');
    }
};
