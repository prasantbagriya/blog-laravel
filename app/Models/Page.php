<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Page extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'title',
        'slug',
        'type',
        'category_id',
        'content',
        'schema_type',
        'seo_title',
        'seo_description',
        'seo_keywords',
        'og_title',
        'og_description',
        'og_image',
        'faqs',
    ];

    protected $casts = [
        'faqs' => 'array',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->{$model->getKeyName()})) {
                $model->{$model->getKeyName()} = (string) Str::uuid();
            }
        });
    }
}
