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
        Schema::table('stories', function (Blueprint $table) {
            $table->json('tags')->nullable()->after('category');
            $table->string('articleLink')->nullable()->after('pages');
            $table->string('squarePoster')->nullable()->after('posterImage');
            $table->string('landscapePoster')->nullable()->after('squarePoster');
            $table->text('authorBio')->nullable()->after('author');
            $table->string('authorImage')->nullable()->after('authorBio');
            $table->json('authorSocials')->nullable()->after('authorImage');
            $table->boolean('isSponsored')->default(false)->after('published');
            $table->boolean('isNoIndex')->default(false)->after('isSponsored');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stories', function (Blueprint $table) {
            $table->dropColumn([
                'tags',
                'articleLink',
                'squarePoster',
                'landscapePoster',
                'authorBio',
                'authorImage',
                'authorSocials',
                'isSponsored',
                'isNoIndex'
            ]);
        });
    }
};
