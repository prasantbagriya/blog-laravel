<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PinterestPinShare extends Model
{
    use HasFactory;

    protected $table = 'pinterest_pin_shares';

    protected $fillable = [
        'post_id',
        'pinterest_account_id',
        'pinterest_board_id',
        'pin_id',
        'title',
        'description',
        'image_url',
        'target_link',
        'status',
        'pin_url',
        'published_by',
        'error_message',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(PinterestAccount::class, 'pinterest_account_id');
    }

    public function board(): BelongsTo
    {
        return $this->belongsTo(PinterestBoard::class, 'pinterest_board_id');
    }

    public function publisher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'published_by');
    }
}
