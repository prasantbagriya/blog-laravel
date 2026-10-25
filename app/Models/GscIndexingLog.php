<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GscIndexingLog extends Model
{
    protected $guarded = [];

    protected $casts = [
        'http_code' => 'integer',
        'created_at' => 'datetime',
    ];
}
