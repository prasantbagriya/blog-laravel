<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            if (Schema::hasTable('linkedin_post_shares') && Schema::hasColumn('linkedin_post_shares', 'linkedin_account_id')) {
                Schema::table('linkedin_post_shares', function (Blueprint $table) {
                    $table->unsignedBigInteger('linkedin_account_id')->nullable()->change();
                });
            }
        } catch (\Throwable $e) {}

        try {
            if (Schema::hasTable('instagram_post_shares') && Schema::hasColumn('instagram_post_shares', 'instagram_account_id')) {
                Schema::table('instagram_post_shares', function (Blueprint $table) {
                    $table->unsignedBigInteger('instagram_account_id')->nullable()->change();
                });
            }
        } catch (\Throwable $e) {}

        try {
            if (Schema::hasTable('facebook_post_shares') && Schema::hasColumn('facebook_post_shares', 'facebook_page_id')) {
                Schema::table('facebook_post_shares', function (Blueprint $table) {
                    $table->unsignedBigInteger('facebook_page_id')->nullable()->change();
                });
            }
        } catch (\Throwable $e) {}
    }

    public function down(): void
    {
    }
};
