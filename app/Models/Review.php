<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    protected $casts = [
        'reviewer_badges' => 'array',
        'proof' => 'array',
        'category_ratings' => 'array',
        'pros' => 'array',
        'cons' => 'array',
        'images' => 'array',
        'business_reply' => 'array',
        'is_verified_purchase' => 'boolean',
        'is_anonymous' => 'boolean',
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
