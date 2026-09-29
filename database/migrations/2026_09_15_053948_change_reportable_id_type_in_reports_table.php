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
        if (Schema::hasColumn('reports', 'reportable_id')) {
            Schema::table('reports', function (Blueprint $table) {
                $table->string('reportable_id', 36)->change();
            });
        } else {
            Schema::table('reports', function (Blueprint $table) {
                $table->string('reportable_id', 36)->nullable();
                if (!Schema::hasColumn('reports', 'reportable_type')) {
                    $table->string('reportable_type')->nullable();
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasColumn('reports', 'reportable_id')) {
            Schema::table('reports', function (Blueprint $table) {
                $table->unsignedBigInteger('reportable_id')->change();
            });
        }
    }
};
