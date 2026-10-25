<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (Schema::hasColumn('posts', 'category')) {
            DB::table('posts')
                ->where('category', 'Eduction')
                ->update(['category' => 'Education']);
        }

        if (Schema::hasColumn('posts', 'author')) {
            DB::table('posts')
                ->where('author', 'Prasant')
                ->update(['author' => 'Prashant']);
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            //
        });
    }
};
