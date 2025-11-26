<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Route Model
 * Represents a running route with distance, difficulty, and map coordinates
 */
class Route extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     * Using 'routes' table (not Laravel's default routing)
     */
    protected $table = 'routes';

    /**
     * Disable updated_at timestamp (table only has created_at)
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'distance',
        'difficulty',
        'created_by',
        'coordinates', // JSON field for map polyline
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'distance' => 'decimal:2',
        'coordinates' => 'array', // Store map coordinates as JSON
        'created_at' => 'datetime',
    ];

    /**
     * Get the user who created this route
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all ratings for this route
     */
    public function ratings(): HasMany
    {
        return $this->hasMany(RouteRating::class);
    }

    /**
     * Get all photos for this route
     */
    public function photos(): HasMany
    {
        return $this->hasMany(RoutePhoto::class);
    }

    /**
     * Get average rating for this route
     */
    public function averageRating(): float
    {
        return $this->ratings()->avg('rating') ?? 0.0;
    }

    /**
     * Get total number of ratings
     */
    public function ratingsCount(): int
    {
        return $this->ratings()->count();
    }

    /**
     * Check if a user has rated this route
     */
    public function isRatedBy(int $userId): bool
    {
        return $this->ratings()->where('user_id', $userId)->exists();
    }

    /**
     * Get user's rating for this route
     */
    public function getUserRating(int $userId): ?RouteRating
    {
        return $this->ratings()->where('user_id', $userId)->first();
    }
}
