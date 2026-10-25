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
        if (DB::getDriverName() === 'mysql') {
            DB::statement('ALTER TABLE pages MODIFY seo_keywords TEXT');
            DB::statement('ALTER TABLE pages MODIFY seo_description TEXT');
            DB::statement('ALTER TABLE pages MODIFY og_description TEXT');
        } else {
            Schema::table('pages', function (Blueprint $table) {
                $table->text('seo_keywords')->nullable()->change();
                $table->text('seo_description')->nullable()->change();
                $table->text('og_description')->nullable()->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // We can leave them as TEXT, no harm
    }
};
