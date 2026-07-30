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
            $table->string('factCheckedBy')->nullable();
            $table->string('factCheckerRole')->nullable();
            $table->string('authorJobTitle')->nullable();
            $table->text('authorBio')->nullable();
            $table->text('researchMethodology')->nullable();
            $table->text('sources')->nullable();
            $table->string('searchIntent')->nullable();
            $table->integer('seoScore')->nullable();
            $table->string('targetRegion')->nullable();
            $table->string('targetLanguage')->nullable();
            $table->string('contentScope')->nullable();
            $table->integer('authorExperienceYears')->nullable();
            $table->json('authorAwards')->nullable();
            $table->json('authorAlumniOf')->nullable();
            $table->json('authorKnowsAbout')->nullable();
            $table->json('keyTakeaways')->nullable();
            $table->json('semanticMentions')->nullable();
            $table->integer('reviewCycleDays')->nullable();
            $table->timestamp('nextReviewDate')->nullable();
            $table->boolean('isNoIndex')->nullable();
            $table->boolean('isSponsored')->nullable();
            $table->boolean('isPillarPage')->nullable();
            $table->boolean('isAiAssisted')->nullable();
            $table->json('corrections')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn([
                'factCheckedBy', 'factCheckerRole', 'authorJobTitle', 'authorBio', 
                'researchMethodology', 'sources', 'searchIntent', 'seoScore', 
                'targetRegion', 'targetLanguage', 'contentScope', 'authorExperienceYears', 
                'authorAwards', 'authorAlumniOf', 'authorKnowsAbout', 'keyTakeaways', 
                'semanticMentions', 'reviewCycleDays', 'nextReviewDate', 'isNoIndex', 
                'isSponsored', 'isPillarPage', 'isAiAssisted', 'corrections'
            ]);
        });
    }
};
