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
        if (!Schema::hasTable('pagespeed_audits')) {
            Schema::create('pagespeed_audits', function (Blueprint $table) {
                $table->id();
                $table->string('url')->index();
                $table->string('strategy')->default('mobile')->index(); // 'mobile' or 'desktop'
                
                // Lighthouse Category Scores (0 to 100)
                $table->unsignedTinyInteger('performance_score')->nullable();
                $table->unsignedTinyInteger('accessibility_score')->nullable();
                $table->unsignedTinyInteger('best_practices_score')->nullable();
                $table->unsignedTinyInteger('seo_score')->nullable();
                
                // Core Web Vitals (Lab)
                $table->float('fcp_value')->nullable(); // First Contentful Paint (s)
                $table->string('fcp_display')->nullable();
                $table->float('lcp_value')->nullable(); // Largest Contentful Paint (s)
                $table->string('lcp_display')->nullable();
                $table->float('tbt_value')->nullable(); // Total Blocking Time (ms)
                $table->string('tbt_display')->nullable();
                $table->float('cls_value')->nullable(); // Cumulative Layout Shift
                $table->string('cls_display')->nullable();
                $table->float('speed_index_value')->nullable(); // Speed Index (s)
                $table->string('speed_index_display')->nullable();
                $table->float('ttfb_value')->nullable(); // Time to First Byte (ms)
                $table->string('ttfb_display')->nullable();

                // Field Data (CrUX) Assessment
                $table->string('field_overall_category')->nullable(); // 'FAST', 'AVERAGE', 'SLOW', 'NONE'
                $table->json('field_metrics')->nullable();
                
                // Opportunities & Diagnostics
                $table->json('opportunities')->nullable();
                $table->json('diagnostics')->nullable();
                
                // Metadata
                $table->string('lighthouse_version')->nullable();
                $table->foreignId('tested_by')->nullable()->constrained('users')->nullOnDelete();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pagespeed_audits');
    }
};
