<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstagramPostShare extends Model
{
    use HasFactory;

    protected $table = 'instagram_post_shares';

    protected $fillable = [
        'post_id',
        'instagram_account_id',
        'caption',
        'image_url',
        'ig_container_id',
        'ig_media_id',
        'ig_permalink',
        'status',
        'error_message',
        'published_by',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function account(): BelongsTo
    {
        return $this->belongsTo(InstagramAccount::class, 'instagram_account_id');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
