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
        // 1. Connected Pinterest Accounts
        if (!Schema::hasTable('pinterest_accounts')) {
            Schema::create('pinterest_accounts', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
                $table->string('pinterest_user_id')->index();
                $table->string('username')->index();
                $table->string('name')->default('');
                $table->text('profile_image')->nullable();
                $table->text('bio')->nullable();
                $table->unsignedInteger('follower_count')->default(0);
                $table->unsignedInteger('pin_count')->default(0);
                $table->unsignedInteger('board_count')->default(0);
                $table->text('access_token')->nullable();
                $table->text('refresh_token')->nullable();
                $table->timestamp('token_expires_at')->nullable();
                $table->boolean('is_active')->default(true)->index();
                $table->timestamps();
            });
        }

        // 2. Pinterest Boards belonging to Connected Account
        if (!Schema::hasTable('pinterest_boards')) {
            Schema::create('pinterest_boards', function (Blueprint $table) {
                $table->id();
                $table->foreignId('pinterest_account_id')->constrained('pinterest_accounts')->cascadeOnDelete();
                $table->string('board_id')->unique();
                $table->string('name');
                $table->text('description')->nullable();
                $table->string('privacy')->default('PUBLIC');
                $table->unsignedInteger('pin_count')->default(0);
                $table->boolean('is_default')->default(false)->index();
                $table->timestamps();
            });
        }

        // 3. Pinterest Pin Approvals Queue & Publish Log
        if (!Schema::hasTable('pinterest_pin_shares')) {
            Schema::create('pinterest_pin_shares', function (Blueprint $table) {
                $table->id();
                $table->foreignId('post_id')->nullable()->constrained('posts')->nullOnDelete();
                $table->foreignId('pinterest_account_id')->nullable()->constrained('pinterest_accounts')->cascadeOnDelete();
                $table->foreignId('pinterest_board_id')->nullable()->constrained('pinterest_boards')->nullOnDelete();
                $table->string('pin_id')->nullable()->index();
                $table->string('title', 150);
                $table->text('description')->nullable();
                $table->text('image_url');
                $table->text('target_link')->nullable();
                $table->string('status')->default('pending_approval')->index(); // draft, pending_approval, published, failed
                $table->text('pin_url')->nullable();
                $table->foreignId('published_by')->nullable()->constrained('users')->nullOnDelete();
                $table->text('error_message')->nullable();
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
        Schema::dropIfExists('pinterest_pin_shares');
        Schema::dropIfExists('pinterest_boards');
        Schema::dropIfExists('pinterest_accounts');
    }
};
