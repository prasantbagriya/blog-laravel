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
        Schema::create('institute_inquiries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('business_id')->nullable()->index();
            $table->string('business_name')->nullable();
            $table->string('student_name');
            $table->string('phone');
            $table->string('course')->nullable();
            $table->text('message')->nullable();
            $table->string('status')->default('new'); // new, contacted, admitted, closed
            $table->string('source')->default('profile_direct');
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            $table->foreign('business_id')->references('id')->on('businesses')->nullOnDelete();
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
