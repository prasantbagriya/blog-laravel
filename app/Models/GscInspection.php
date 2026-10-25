<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GscInspection extends Model
{
    protected $guarded = [];

    protected $casts = [
        'rich_results' => 'array',
        'raw_response' => 'array',
        'last_crawl_time' => 'datetime',
    ];
}
