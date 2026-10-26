<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    use HasUuids, \Illuminate\Database\Eloquent\Factories\HasFactory;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $guarded = [];
    protected $appends = ['url_path'];

    protected $casts = [
        'media_urls' => 'array',
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
        $format = !empty($this->url_format) ? trim($this->url_format) : '{slug}';
        if ($format === 'direct' || $format === '/' || $format === '{slug}' || $format === '/{slug}') {
            return '/' . ltrim($this->slug ?? '', '/');
        }
        
        $path = str_replace('{slug}', $this->slug ?? '', $format);
        if (str_contains($path, '{category}')) {
            $catSlug = $this->category ? \Illuminate\Support\Str::slug($this->category) : 'general';
            $path = str_replace('{category}', $catSlug, $path);
        }
        
        return '/' . ltrim($path, '/');
    }

    public function getFocusKeywordAttribute()
    {
        return $this->attributes['focusKeyword'] ?? $this->attributes['focus_keyword'] ?? null;
    }

    protected static function booted()
    {
        static::saved(function ($post) {
            $newUrl = url($post->url_path);
            \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($newUrl . '_0'));
            \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($newUrl . '_1'));
            \Illuminate\Support\Facades\Cache::forget('blog_all_posts');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
            \Illuminate\Support\Facades\Cache::forget('recent_posts_sidebar_v2');

            if ($post->wasChanged(['url_format', 'slug', 'category'])) {
                $oldFormat = !empty($post->getOriginal('url_format')) ? $post->getOriginal('url_format') : 'blog/{slug}';
                $oldSlug = $post->getOriginal('slug') ?: '';
                $oldCat = $post->getOriginal('category') ? \Illuminate\Support\Str::slug($post->getOriginal('category')) : 'general';
                $oldPath = str_replace(['{slug}', '{category}'], [$oldSlug, $oldCat], $oldFormat);
                $oldUrl = url('/' . ltrim($oldPath, '/'));
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($oldUrl . '_0'));
                \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($oldUrl . '_1'));
            }

            // Auto-generate pending social post drafts (LinkedIn, Pinterest, etc.)
            try {
                \App\Services\Social\SocialAutoDraftService::syncDraftsForPost($post);
            } catch (\Throwable $ignore) {}
        });

        static::deleted(function ($post) {
            $url = url($post->url_path);
            \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($url . '_0'));
            \Illuminate\Support\Facades\Cache::forget('public_page_cache_v2_' . md5($url . '_1'));
            \Illuminate\Support\Facades\Cache::forget('blog_all_posts');
            \Illuminate\Support\Facades\Cache::forget('homepage_data_v6');
            \Illuminate\Support\Facades\Cache::forget('recent_posts_sidebar_v2');
        });
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

    public function facebookShares(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(FacebookPostShare::class);
    }

    public function xShares(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(XPostShare::class);
    }

    public function pinterestShares(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(PinterestPinShare::class);
    }

    public function instagramShares(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(InstagramPostShare::class);
    }

    public function linkedinShares(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(LinkedInPostShare::class);
    }
}
