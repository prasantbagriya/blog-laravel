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
            if (!Schema::hasColumn('posts', 'focusKeyword')) {
                $table->string('focusKeyword')->nullable();
            }
            if (!Schema::hasColumn('posts', 'lsiKeywords')) {
                $table->json('lsiKeywords')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            if (Schema::hasColumn('posts', 'focusKeyword')) {
                $table->dropColumn('focusKeyword');
            }
            if (Schema::hasColumn('posts', 'lsiKeywords')) {
                $table->dropColumn('lsiKeywords');
            }
        });
    }
};
