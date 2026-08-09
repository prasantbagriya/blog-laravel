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
        Schema::table('community_members', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('community_id')->constrained('communities')->onDelete('cascade');
            $table->unique(['user_id', 'community_id']);
        });

        Schema::table('community_moderators', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('community_id')->constrained('communities')->onDelete('cascade');
            $table->unique(['user_id', 'community_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('community_members', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['community_id']);
            $table->dropUnique(['user_id', 'community_id']);
            $table->dropColumn(['user_id', 'community_id']);
        });

        Schema::table('community_moderators', function (Blueprint $table) {
            $table->dropForeign(['user_id']);
            $table->dropForeign(['community_id']);
            $table->dropUnique(['user_id', 'community_id']);
            $table->dropColumn(['user_id', 'community_id']);
        });
    }
};
