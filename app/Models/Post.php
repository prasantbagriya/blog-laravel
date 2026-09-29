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
    protected $appends = ['url_path'];

    protected $casts = [
        'authorSocials' => 'array',
        'tags' => 'array',
        'faqs' => 'array',
        'howToSteps' => 'array',
        'localBusiness' => 'array',
        'sources' => 'array',
        'published' => 'boolean',
        'is_live_discussion' => 'boolean',
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
        'lsiKeywords' => 'array',
        'seoRating' => 'array',
    ];

    public function getUrlPathAttribute()
    {
        $format = $this->url_format ?? 'blog/{slug}';
        
        $path = str_replace('{slug}', $this->slug ?? '', $format);
        if (str_contains($path, '{category}')) {
            $catSlug = $this->category ? strtolower(str_replace(' ', '-', $this->category)) : 'general';
            $path = str_replace('{category}', $catSlug, $path);
        }
        
        return '/' . ltrim($path, '/');
    }

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

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function scopePublished($query)
    {
        return $query->where('published', true);
    }

    protected static function booted()
    {
        static::saved(function ($post) {
            \Illuminate\Support\Facades\Cache::forget('blog_all_posts');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
            \Illuminate\Support\Facades\Cache::forget('blog_recent_posts_5'); // added for recent posts sidebar
        });

        static::deleted(function ($post) {
            \Illuminate\Support\Facades\Cache::forget('blog_all_posts');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
            \Illuminate\Support\Facades\Cache::forget('blog_recent_posts_5'); // added for recent posts sidebar
        });
    }
}
