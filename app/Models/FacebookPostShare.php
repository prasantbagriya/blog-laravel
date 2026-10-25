<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FacebookPostShare extends Model
{
    use HasFactory;

    protected $fillable = [
        'post_id',
        'facebook_page_id',
        'caption',
        'image_url',
        'target_link',
        'status',
        'fb_post_id',
        'fb_permalink',
        'published_by',
        'published_at',
        'error_message',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function page(): BelongsTo
    {
        return $this->belongsTo(FacebookPage::class, 'facebook_page_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class, 'post_id');
    }
}
