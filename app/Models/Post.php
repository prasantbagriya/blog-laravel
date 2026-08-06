<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'authorSocials' => 'array',
        'tags' => 'array',
        'faqs' => 'array',
        'sources' => 'array',
        'published' => 'boolean',
        'date' => 'datetime',
        'authorAwards' => 'array',
        'authorAlumniOf' => 'array',
        'authorKnowsAbout' => 'array',
        'keyTakeaways' => 'array',
        'semanticMentions' => 'array',
        'corrections' => 'array',
        'isNoIndex' => 'boolean',
        'isSponsored' => 'boolean',
        'isPillarPage' => 'boolean',
        'isAiAssisted' => 'boolean',
        'nextReviewDate' => 'datetime',
    ];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function comments()
    {
        return $this->hasMany(Comment::class);
    }

    public function savedByUsers()
    {
        return $this->belongsToMany(User::class, 'saved_posts')->withTimestamps();
    }
}
