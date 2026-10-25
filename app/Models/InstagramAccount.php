<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InstagramAccount extends Model
{
    use HasFactory;

    protected $table = 'instagram_accounts';

    protected $fillable = [
        'user_id',
        'instagram_business_id',
        'facebook_page_id',
        'username',
        'name',
        'profile_picture_url',
        'bio',
        'followers_count',
        'media_count',
        'access_token',
        'token_expires_at',
        'is_active',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'followers_count' => 'integer',
        'media_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shares(): HasMany
    {
        return $this->hasMany(InstagramPostShare::class, 'instagram_account_id');
    }

    public static function active(): ?self
    {
        return static::where('is_active', true)->latest()->first();
    }
}
