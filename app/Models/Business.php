<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

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
        'claimed_by_owner' => 'boolean',
        'is_verified' => 'boolean',
    ];

    public function toArray()
    {
        $array = parent::toArray();
        $camelArray = [];
        foreach ($array as $key => $value) {
            $camelArray[Str::camel($key)] = $value;
        }
        return $camelArray;
    }

    public static function publicColumns(): array
    {
        return [
            'id', 'name', 'slug', 'logo', 'cover_image', 'category', 'category_name', 'subcategory',
            'description', 'detailed_description', 'website', 'phone', 'address', 'city', 'country',
            'opening_hours', 'social_links', 'rating', 'review_count', 'trust_score', 'is_verified',
            'verified_badge_type', 'rating_distribution', 'category_averages', 'followers_count',
            'ai_summary', 'products', 'faqs', 'tags', 'monthly_visitors_count', 'created_at', 'updated_at',
        ];
    }

    /**
     * Fields that may be embedded in public pages or returned from public APIs.
     * Owner identifiers and contact email remain server-side.
     */
    public function publicPayload(?User $user = null): array
    {
        $payload = Arr::only($this->toArray(), array_map(Str::camel(...), self::publicColumns()));
        $payload['canEdit'] = $user !== null && (
            $this->user_id === $user->id
            || in_array($user->role, ['admin', 'super_admin'], true)
            || (bool) $user->getAttribute('is_admin')
        );

        return $payload;
    }
}
