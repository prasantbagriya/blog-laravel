<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Business extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'social_links' => 'array',
        'rating_distribution' => 'array',
        'category_averages' => 'array',
        'ai_summary' => 'array',
        'products' => 'array',
        'faqs' => 'array',
        'tags' => 'array',
        'rating' => 'float',
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $camelArray = [];
        foreach ($array as $key => $value) {
            $camelArray[\Illuminate\Support\Str::camel($key)] = $value;
        }
        return $camelArray;
    }
}
