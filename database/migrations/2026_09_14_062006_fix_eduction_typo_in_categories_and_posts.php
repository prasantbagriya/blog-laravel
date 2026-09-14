<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasTable('categories')) {
            DB::table('categories')
                ->where('name', 'Eduction')
                ->update(['name' => 'Education', 'slug' => 'education']);
        }
        
        if (Schema::hasTable('posts')) {
            DB::table('posts')
                ->where('category', 'Eduction')
                ->update(['category' => 'Education']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('categories')) {
            DB::table('categories')
                ->where('name', 'Education')
                ->update(['name' => 'Eduction', 'slug' => 'eduction']);
        }
        
        if (Schema::hasTable('posts')) {
            DB::table('posts')
                ->where('category', 'Education')
                ->update(['category' => 'Eduction']);
        }
    }
};
