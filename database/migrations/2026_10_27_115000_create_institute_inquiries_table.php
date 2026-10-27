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
        if (Schema::hasTable('institute_inquiries')) {
            Schema::dropIfExists('institute_inquiries');
        }

        Schema::create('institute_inquiries', function (Blueprint $table) {
            $table->id();
            $table->string('business_id', 64)->nullable()->index();
            $table->string('business_name')->nullable();
            $table->string('student_name');
            $table->string('phone');
            $table->string('course')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new'); // new, contacted, admitted, closed
            $table->string('source')->default('profile_direct');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('institute_inquiries');
    }
};
