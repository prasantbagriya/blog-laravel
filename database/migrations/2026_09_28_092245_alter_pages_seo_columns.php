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
        // Use raw SQL to alter columns to TEXT to avoid requiring doctrine/dbal
        DB::statement('ALTER TABLE pages MODIFY seo_keywords TEXT');
        DB::statement('ALTER TABLE pages MODIFY seo_description TEXT');
        DB::statement('ALTER TABLE pages MODIFY og_description TEXT');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We can leave them as TEXT, no harm
    }
};
