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
            $table->string('twitterCard')->nullable();
            $table->string('twitterTitle')->nullable();
            $table->text('twitterDescription')->nullable();
            $table->string('coverImageAlt')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn(['twitterCard', 'twitterTitle', 'twitterDescription', 'coverImageAlt']);
        });
    }
};
