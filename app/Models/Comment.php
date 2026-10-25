<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $guarded = [];

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')
            ->where('is_spam', false)
            ->with('author', 'replies')
            ->orderBy('is_pinned', 'desc')
            ->orderByRaw('CASE WHEN author_id = (SELECT author_id FROM posts WHERE posts.id = comments.post_id) THEN 1 ELSE 0 END DESC')
            ->orderBy('created_at', 'asc');
    }

    public function reports()
    {
        return $this->morphMany(Report::class, 'reportable');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }
}
