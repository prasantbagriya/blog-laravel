<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class XPostShare extends Model
{
    use HasFactory;

    protected $table = 'x_post_shares';

    protected $fillable = [
        'post_id',
        'x_account_id',
        'tweet_id',
        'text',
        'media_url',
        'x_media_id',
        'target_link',
        'status',
        'published_by',
        'error_message',
        'tweet_permalink',
        'likes_count',
        'retweets_count',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'likes_count' => 'integer',
        'retweets_count' => 'integer',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(XAccount::class, 'x_account_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
