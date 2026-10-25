<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LinkedInPostShare extends Model
{
    use HasFactory;

    protected $table = 'linkedin_post_shares';

    protected $fillable = [
        'post_id',
        'linkedin_account_id',
        'commentary',
        'media_url',
        'share_urn',
        'permalink',
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
        return $this->belongsTo(LinkedInAccount::class, 'linkedin_account_id');
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
