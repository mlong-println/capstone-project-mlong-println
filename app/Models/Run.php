<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * Run Model
 * Represents a single running session by a user on a specific route
 */
class Run extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'route_id',
        'shoe_id',
        'start_time',
        'end_time',
        'completion_time',
        'notes',
        'elevation_gain',
        'is_public',
        'photo',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'completion_time' => 'integer',
        'is_public' => 'boolean',
    ];

    /**
     * Get the user who completed this run
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the route that was run
     */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /**
     * Get the shoe used for this run
     */
    public function shoe(): BelongsTo
    {
        return $this->belongsTo(Shoe::class);
    }

    /**
     * Get comments for this run
     */
    public function comments(): HasMany
    {
        return $this->hasMany(RunComment::class)->with('user')->latest();
    }

    /**
     * Get users who liked this run
     */
    public function likes(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'run_likes')->withTimestamps();
    }

    /**
     * Get likes count
     */
    public function likesCount(): int
    {
        return $this->likes()->count();
    }

    /**
     * Get pace in minutes per kilometer
     */
    public function getPaceAttribute(): ?float
    {
        if (!$this->completion_time || !$this->route || !$this->route->distance) {
            return null;
        }

        // completion_time is in seconds, convert to minutes
        $minutes = $this->completion_time / 60;
        return $minutes / $this->route->distance;
    }

    /**
     * Get formatted pace (e.g., "5:30 /km")
     */
    public function getFormattedPaceAttribute(): string
    {
        $pace = $this->pace;
        if (!$pace) {
            return 'N/A';
        }

        $minutes = floor($pace);
        $seconds = round(($pace - $minutes) * 60);
        
        // Handle case where rounding gives 60 seconds
        if ($seconds >= 60) {
            $minutes++;
            $seconds = 0;
        }
        
        return sprintf('%d:%02d /km', $minutes, $seconds);
    }

    /**
     * Get formatted completion time (e.g., "45:30")
     */
    public function getFormattedTimeAttribute(): string
    {
        if (!$this->completion_time) {
            return 'N/A';
        }

        $totalSeconds = $this->completion_time;
        $hours = floor($totalSeconds / 3600);
        $minutes = floor(($totalSeconds % 3600) / 60);
        $seconds = $totalSeconds % 60;
        
        // Format based on duration
        if ($hours > 0) {
            return sprintf('%d:%02d:%02d', $hours, $minutes, $seconds);
        }
        
        return sprintf('%d:%02d', $minutes, $seconds);
    }
}
