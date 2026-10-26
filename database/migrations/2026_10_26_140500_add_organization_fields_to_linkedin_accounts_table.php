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
        if (Schema::hasTable('linkedin_accounts')) {
            Schema::table('linkedin_accounts', function (Blueprint $table) {
                if (!Schema::hasColumn('linkedin_accounts', 'organization_id')) {
                    $table->string('organization_id')->nullable()->after('headline');
                }
                if (!Schema::hasColumn('linkedin_accounts', 'organization_name')) {
                    $table->string('organization_name')->nullable()->after('organization_id');
                }
                if (!Schema::hasColumn('linkedin_accounts', 'organization_vanity_name')) {
                    $table->string('organization_vanity_name')->nullable()->after('organization_name');
                }
                if (!Schema::hasColumn('linkedin_accounts', 'organization_logo_url')) {
                    $table->text('organization_logo_url')->nullable()->after('organization_vanity_name');
                }
                if (!Schema::hasColumn('linkedin_accounts', 'post_as')) {
                    $table->string('post_as')->default('organization')->after('organization_logo_url');
                }
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('linkedin_accounts')) {
            Schema::table('linkedin_accounts', function (Blueprint $table) {
                $cols = [];
                foreach (['organization_id', 'organization_name', 'organization_vanity_name', 'organization_logo_url', 'post_as'] as $c) {
                    if (Schema::hasColumn('linkedin_accounts', $c)) {
                        $cols[] = $c;
                    }
                }
                if (!empty($cols)) {
                    $table->dropColumn($cols);
                }
            });
        }
    }
};
