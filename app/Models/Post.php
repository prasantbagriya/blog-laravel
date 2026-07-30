<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'authorSocials' => 'array',
        'tags' => 'array',
        'faqs' => 'array',
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
}
