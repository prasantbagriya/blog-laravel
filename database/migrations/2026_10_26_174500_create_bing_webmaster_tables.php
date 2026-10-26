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
        if (!Schema::hasTable('bing_webmaster_settings')) {
            Schema::create('bing_webmaster_settings', function (Blueprint $table) {
                $table->id();
                $table->string('site_url')->default('https://coachingsinsikar.com/');
                $table->string('client_id')->nullable();
                $table->text('client_secret')->nullable();
                $table->text('access_token')->nullable();
                $table->text('refresh_token')->nullable();
                $table->timestamp('token_expires_at')->nullable();
                $table->string('api_key')->nullable();
                $table->boolean('is_connected')->default(false);
                $table->boolean('auto_index_posts')->default(true);
                $table->unsignedInteger('daily_quota_remaining')->default(10000);
                $table->timestamp('last_synced_at')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable('bing_submission_logs')) {
            Schema::create('bing_submission_logs', function (Blueprint $table) {
                $table->id();
                $table->string('url', 500);
                $table->string('method', 50)->default('oauth_api');
                $table->string('status', 50)->default('success');
                $table->unsignedInteger('http_code')->nullable();
                $table->text('response_message')->nullable();
                $table->unsignedBigInteger('submitted_by')->nullable();
                $table->timestamps();

                $table->index('url');
                $table->index('status');
                $table->index('created_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bing_submission_logs');
        Schema::dropIfExists('bing_webmaster_settings');
    }
};
