<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacebookAccount extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fb_user_id',
        'name',
        'email',
        'avatar',
        'user_access_token',
        'token_expires_at',
        'is_active',
    ];

    protected $casts = [
        'token_expires_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function pages(): HasMany
    {
        return $this->hasMany(FacebookPage::class, 'facebook_account_id');
    }

    public function defaultPage()
    {
        return $this->pages()->where('is_default', true)->first() ?: $this->pages()->first();
    }
}
