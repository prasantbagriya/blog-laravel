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
        Schema::create('review_campaigns', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('business_id')->index();
            $table->string('name');
            $table->string('type'); // 'email', 'whatsapp', 'sms', 'qr_code'
            $table->string('status')->default('draft'); // 'active', 'completed', 'draft'
            $table->integer('total_sent')->default(0);
            $table->integer('reviews_collected')->default(0);
            $table->decimal('conversion_rate', 5, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('review_campaigns');
    }
};
