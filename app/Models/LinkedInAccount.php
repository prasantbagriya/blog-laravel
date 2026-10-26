<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Artisan;

class LinkedInAccount extends Model
{
    use HasFactory;

    protected $table = 'linkedin_accounts';

    protected $fillable = [
        'user_id',
        'linkedin_person_id',
        'name',
        'given_name',
        'family_name',
        'email',
        'profile_picture_url',
        'headline',
        'organization_id',
        'organization_name',
        'organization_vanity_name',
        'organization_logo_url',
        'post_as',
        'access_token',
        'refresh_token',
        'token_expires_at',
        'is_active',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Auto-heal database schema if organization columns are missing in live MySQL.
     */
    public static function ensureSchema(): void
    {
        try {
            if (!Schema::hasTable('linkedin_accounts')) {
                Artisan::call('migrate', ['--force' => true]);
                return;
            }

            $cols = [
                'organization_id' => "ALTER TABLE `linkedin_accounts` ADD COLUMN `organization_id` VARCHAR(255) NULL",
                'organization_name' => "ALTER TABLE `linkedin_accounts` ADD COLUMN `organization_name` VARCHAR(255) NULL",
                'organization_vanity_name' => "ALTER TABLE `linkedin_accounts` ADD COLUMN `organization_vanity_name` VARCHAR(255) NULL",
                'organization_logo_url' => "ALTER TABLE `linkedin_accounts` ADD COLUMN `organization_logo_url` TEXT NULL",
                'post_as' => "ALTER TABLE `linkedin_accounts` ADD COLUMN `post_as` VARCHAR(50) NOT NULL DEFAULT 'organization'",
            ];

            foreach ($cols as $col => $sql) {
                try {
                    if (!Schema::hasColumn('linkedin_accounts', $col)) {
                        DB::statement($sql);
                    }
                } catch (\Throwable $e) {}
            }
        } catch (\Throwable $e) {}
    }

    /**
     * Safe update that ensures columns exist before updating, preventing 1054 errors.
     */
    public function safeUpdate(array $attributes): bool
    {
        self::ensureSchema();
        $safe = [];
        foreach ($attributes as $col => $val) {
            try {
                if (Schema::hasColumn($this->getTable(), $col)) {
                    $safe[$col] = $val;
                }
            } catch (\Throwable $e) {}
        }
        if (empty($safe)) {
            return true;
        }
        return $this->update($safe);
    }

    public function getOrganizationIdAttribute($value): ?string
    {
        return $value ?: config('services.linkedin.organization_id');
    }

    public function getOrganizationNameAttribute($value): ?string
    {
        return $value ?: config('services.linkedin.organization_name', 'Coachings in Sikar');
    }

    public function getEffectiveAuthorUrnAttribute(): string
    {
        $orgId = $this->organization_id;
        $postAs = $this->post_as ?: 'organization';

        if ($postAs === 'organization' && !empty($orgId)) {
            $orgId = trim($orgId);
            return str_starts_with($orgId, 'urn:li:organization:') ? $orgId : "urn:li:organization:{$orgId}";
        }
        return $this->linkedin_person_id;
    }

    public function getEffectiveNameAttribute(): string
    {
        $orgName = $this->organization_name;
        $postAs = $this->post_as ?: 'organization';

        if ($postAs === 'organization' && !empty($orgName)) {
            return $orgName;
        }
        return $this->name;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shares(): HasMany
    {
        return $this->hasMany(LinkedInPostShare::class, 'linkedin_account_id');
    }

    public static function active(): ?self
    {
        self::ensureSchema();
        return static::where('is_active', true)->latest()->first();
    }
}
