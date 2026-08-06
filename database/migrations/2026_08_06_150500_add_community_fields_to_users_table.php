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
        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'username')) {
                $table->string('username')->unique()->nullable();
            }
            if (!Schema::hasColumn('users', 'bio')) {
                $table->text('bio')->nullable();
            }
            if (!Schema::hasColumn('users', 'profile_picture')) {
                $table->string('profile_picture')->nullable();
            }
            if (!Schema::hasColumn('users', 'banner_image')) {
                $table->string('banner_image')->nullable();
            }
            if (!Schema::hasColumn('users', 'karma')) {
                $table->integer('karma')->default(0);
            }
            if (!Schema::hasColumn('users', 'cake_day')) {
                $table->timestamp('cake_day')->useCurrent();
            }
            if (!Schema::hasColumn('users', 'social_links')) {
                $table->json('social_links')->nullable();
            }
            if (!Schema::hasColumn('users', 'settings')) {
                $table->json('settings')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
