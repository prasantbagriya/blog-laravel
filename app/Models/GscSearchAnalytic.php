<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GscSearchAnalytic extends Model
{
    protected $guarded = [];

    protected $casts = [
        'date' => 'date',
        'clicks' => 'integer',
        'impressions' => 'integer',
        'ctr' => 'float',
        'position' => 'float',
    ];
}
