<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

#[Fillable(['name', 'email', 'password', 'username', 'bio', 'profile_picture', 'banner_image', 'social_links', 'settings', 'flair', 'role', 'business_id'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    public function communities()
    {
        return $this->belongsToMany(Community::class, 'community_members');
    }

    public function moderatedCommunities()
    {
        return $this->belongsToMany(Community::class, 'community_moderators');
    }

    public function savedPosts()
    {
        return $this->belongsToMany(Post::class, 'saved_posts')->withTimestamps();
    }

    public function business()
    {
        return $this->belongsTo(Business::class);
    }

    public function isVisitor() { return $this->role === 'visitor'; }
    public function isReviewer() { return $this->role === 'reviewer'; }
    public function isBusinessOwner() { return $this->role === 'business_owner'; }
    public function isModerator() { return $this->role === 'moderator'; }
    public function isSuperAdmin() { return $this->role === 'super_admin' || $this->is_admin; }

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
}
