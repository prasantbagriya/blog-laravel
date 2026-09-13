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
            if (Schema::hasColumn('posts', 'keywords')) {
                $table->text('keywords')->nullable()->change();
            }
            if (Schema::hasColumn('posts', 'focusKeyword')) {
                $table->text('focusKeyword')->nullable()->change();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            if (Schema::hasColumn('posts', 'keywords')) {
                $table->string('keywords', 255)->nullable()->change();
            }
            if (Schema::hasColumn('posts', 'focusKeyword')) {
                $table->string('focusKeyword', 255)->nullable()->change();
            }
        });
    }
};
