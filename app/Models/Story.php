<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Story extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];

    protected $casts = [
        'pages' => 'array',
        'seo_meta' => 'array',
        'tags' => 'array',
        'authorSocials' => 'array',
        'isSponsored' => 'boolean',
        'isNoIndex' => 'boolean',
        'published' => 'boolean',
        'date' => 'datetime',
    ];
}
