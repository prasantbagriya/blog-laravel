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
        // 1. GSC Settings & Credentials Table
        if (!Schema::hasTable('gsc_settings')) {
            Schema::create('gsc_settings', function (Blueprint $table) {
                $table->id();
                $table->string('property_id')->default('https://coachingsinsikar.com/');
                $table->string('client_id')->nullable();
                $table->text('client_secret')->nullable(); // encrypted
                $table->string('redirect_uri')->nullable();
                $table->text('refresh_token')->nullable(); // encrypted
                $table->text('access_token')->nullable();  // encrypted
                $table->timestamp('token_expires_at')->nullable();
                $table->text('service_account_json')->nullable(); // encrypted fallback
                $table->string('auth_mode')->default('oauth'); // 'oauth' or 'service_account'
                $table->boolean('is_connected')->default(false);
                $table->boolean('auto_index_posts')->default(true);
                $table->boolean('auto_index_businesses')->default(true);
                $table->boolean('auto_index_stories')->default(true);
                $table->timestamp('last_synced_at')->nullable();
                $table->text('last_error')->nullable();
                $table->timestamps();
            });
        }

        // 2. GSC Search Analytics Cache Table
        if (!Schema::hasTable('gsc_search_analytics')) {
            Schema::create('gsc_search_analytics', function (Blueprint $table) {
                $table->id();
                $table->date('date')->index();
                $table->string('query', 191)->nullable()->index();
                $table->string('page', 255)->nullable()->index();
                $table->string('country', 10)->nullable()->index();
                $table->string('device', 20)->nullable(); // DESKTOP, MOBILE, TABLET
                $table->integer('clicks')->default(0);
                $table->integer('impressions')->default(0);
                $table->decimal('ctr', 8, 4)->default(0);
                $table->decimal('position', 8, 2)->default(0);
                $table->timestamps();

                $table->index(['date', 'clicks']);
                $table->index(['query', 'clicks']);
            });
        }

        // 3. Google Instant Indexing Logs Table
        if (!Schema::hasTable('gsc_indexing_logs')) {
            Schema::create('gsc_indexing_logs', function (Blueprint $table) {
                $table->id();
                $table->string('url', 500);
                $table->enum('action', ['URL_UPDATED', 'URL_DELETED'])->default('URL_UPDATED');
                $table->enum('status', ['success', 'failed'])->default('success');
                $table->integer('http_code')->default(200);
                $table->text('response_message')->nullable();
                $table->string('triggered_by')->default('manual'); // 'manual', 'auto_post', 'auto_business'
                $table->timestamps();

                $table->index('created_at');
            });
        }

        // 4. URL Inspection Cache Table
        if (!Schema::hasTable('gsc_inspections')) {
            Schema::create('gsc_inspections', function (Blueprint $table) {
                $table->id();
                $table->string('url', 255)->index();
                $table->string('verdict')->nullable(); // PASS, NEUTRAL, FAIL
                $table->string('coverage_state')->nullable();
                $table->string('crawled_as')->nullable(); // Googlebot smartphone, desktop
                $table->timestamp('last_crawl_time')->nullable();
                $table->string('mobile_usability')->nullable(); // PASS, FAIL
                $table->json('rich_results')->nullable();
                $table->json('raw_response')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gsc_inspections');
        Schema::dropIfExists('gsc_indexing_logs');
        Schema::dropIfExists('gsc_search_analytics');
        Schema::dropIfExists('gsc_settings');
    }
};
