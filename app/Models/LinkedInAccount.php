<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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

    public function getEffectiveAuthorUrnAttribute(): string
    {
        if ($this->post_as === 'organization' && !empty($this->organization_id)) {
            $orgId = trim($this->organization_id);
            return str_starts_with($orgId, 'urn:li:organization:') ? $orgId : "urn:li:organization:{$orgId}";
        }
        return $this->linkedin_person_id;
    }

    public function getEffectiveNameAttribute(): string
    {
        if ($this->post_as === 'organization' && !empty($this->organization_name)) {
            return $this->organization_name;
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
        return static::where('is_active', true)->latest()->first();
    }
}
