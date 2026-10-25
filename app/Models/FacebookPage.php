<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FacebookPage extends Model
{
    use HasFactory;

    protected $fillable = [
        'facebook_account_id',
        'page_id',
        'name',
        'category',
        'page_access_token',
        'picture_url',
        'fan_count',
        'followers_count',
        'is_default',
        'auto_publish_enabled',
    ];

    protected $casts = [
        'fan_count' => 'integer',
        'followers_count' => 'integer',
        'is_default' => 'boolean',
        'auto_publish_enabled' => 'boolean',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(FacebookAccount::class, 'facebook_account_id');
    }

    public function shares(): HasMany
    {
        return $this->hasMany(FacebookPostShare::class, 'facebook_page_id');
    }

    /**
     * Mark this page as default and unset other pages.
     */
    public function makeDefault(): void
    {
        static::where('facebook_account_id', $this->facebook_account_id)
            ->where('id', '!=', $this->id)
            ->update(['is_default' => false]);

        $this->update(['is_default' => true]);
    }
}
