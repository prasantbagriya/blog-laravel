<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        try {
            if (Schema::hasTable('instagram_post_shares') && Schema::hasColumn('instagram_post_shares', 'image_url')) {
                Schema::table('instagram_post_shares', function (Blueprint $table) {
                    $table->text('image_url')->nullable()->change();
                });
            }
        } catch (\Throwable $e) {}
    }

    public function down(): void
    {
    }
};
