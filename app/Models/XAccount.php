<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class XAccount extends Model
{
    use HasFactory;

    protected $table = 'x_accounts';

    protected $fillable = [
        'user_id',
        'x_user_id',
        'username',
        'name',
        'profile_image_url',
        'bio',
        'followers_count',
        'following_count',
        'tweet_count',
        'auth_mode',
        'access_token',
        'access_token_secret',
        'refresh_token',
        'token_expires_at',
        'is_active',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'followers_count' => 'integer',
        'following_count' => 'integer',
        'tweet_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function shares(): HasMany
    {
        return $this->hasMany(XPostShare::class, 'x_account_id');
    }

    /**
     * Get active primary X account.
     */
    public static function active(): ?self
    {
        return self::where('is_active', true)->latest()->first();
    }
}
