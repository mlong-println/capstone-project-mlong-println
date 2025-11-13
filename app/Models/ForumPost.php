<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class ForumPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'content',
        'category',
        'pinned',
        'locked',
    ];

    protected $casts = [
        'pinned' => 'boolean',
        'locked' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created the post.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the comments for the post.
     */
    public function comments(): HasMany
    {
        return $this->hasMany(ForumComment::class, 'post_id')->orderBy('created_at', 'asc');
    }

    /**
     * Get the likes for the post.
     */
    public function likes(): MorphMany
    {
        return $this->morphMany(ForumLike::class, 'likeable');
    }

    /**
     * Get the like count.
     */
    public function likeCount(): int
    {
        return $this->likes()->count();
    }

    /**
     * Check if user has liked the post.
     */
    public function isLikedBy(int $userId): bool
    {
        return $this->likes()->where('user_id', $userId)->exists();
    }

    /**
     * Get comment count.
     */
    public function commentCount(): int
    {
        return $this->comments()->count();
    }

    /**
     * Scope a query to only include pinned posts.
     */
    public function scopePinned($query)
    {
        return $query->where('pinned', true);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeCategory($query, string $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to order by latest activity.
     */
    public function scopeLatestActivity($query)
    {
        return $query->withCount('comments')
            ->orderBy('pinned', 'desc')
            ->orderBy('updated_at', 'desc');
    }
}
