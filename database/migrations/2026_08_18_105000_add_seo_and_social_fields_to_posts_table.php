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
            if (!Schema::hasColumn('posts', 'seoTitle')) {
                $table->string('seoTitle')->nullable();
            }
            if (!Schema::hasColumn('posts', 'ogTitle')) {
                $table->string('ogTitle')->nullable();
            }
            if (!Schema::hasColumn('posts', 'ogDescription')) {
                $table->text('ogDescription')->nullable();
            }
            if (!Schema::hasColumn('posts', 'canonicalUrl')) {
                $table->string('canonicalUrl')->nullable();
            }
            if (!Schema::hasColumn('posts', 'keywords')) {
                $table->string('keywords')->nullable();
            }
            if (!Schema::hasColumn('posts', 'faqs')) {
                $table->json('faqs')->nullable();
            }
            if (!Schema::hasColumn('posts', 'authorImage')) {
                $table->string('authorImage')->nullable();
            }
            if (!Schema::hasColumn('posts', 'authorSocials')) {
                $table->json('authorSocials')->nullable();
            }
            if (!Schema::hasColumn('posts', 'metaDescription')) {
                $table->text('metaDescription')->nullable();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'seoTitle',
                'ogTitle',
                'ogDescription',
                'canonicalUrl',
                'keywords',
                'faqs',
                'authorImage',
                'authorSocials'
            ]);
        });
    }
};
