<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * RouteRating Model
 * Represents a user's rating and review of a route
 */
class RouteRating extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     */
    protected $table = 'route_ratings';

    /**
     * Disable updated_at timestamp (table only has created_at)
     */
    public $timestamps = false;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'route_id',
        'user_id',
        'rating',
        'comment',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
    ];

    /**
     * Get the route that was rated
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the user who created the rating
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
