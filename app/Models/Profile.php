<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Profile Model
 * Extended user information for runners and trainers
 * One-to-one relationship with User
 */
class Profile extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'bio',
        'location',
        'profile_picture',
        'experience_level',
        'current_goal',
        'current_weekly_mileage',
        'total_runs',
        'total_distance',
        'total_time_minutes',
        'pr_5k_minutes',
        'pr_10k_minutes',
        'pr_half_marathon_minutes',
        'pr_full_marathon_minutes',
        'certifications',
        'years_experience',
        'specialties',
        'profile_public',
        'show_stats',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'current_weekly_mileage' => 'decimal:2',
        'total_distance' => 'decimal:2',
        'pr_5k_minutes' => 'decimal:2',
        'pr_10k_minutes' => 'decimal:2',
        'pr_half_marathon_minutes' => 'decimal:2',
        'pr_full_marathon_minutes' => 'decimal:2',
        'profile_public' => 'boolean',
        'show_stats' => 'boolean',
        'total_runs' => 'integer',
        'total_time_minutes' => 'integer',
        'years_experience' => 'integer',
    ];

    /**
     * Relationship: Profile belongs to a User
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Helper: Get formatted total distance (with units)
     */
    public function getFormattedTotalDistanceAttribute(): string
    {
        return number_format($this->total_distance, 2) . ' km';
    }

    /**
     * Helper: Get average pace (minutes per km)
     */
    public function getAveragePaceAttribute(): ?float
    {
        if ($this->total_distance > 0 && $this->total_time_minutes > 0) {
            return round($this->total_time_minutes / $this->total_distance, 2);
        }
        return null;
    }

    /**
     * Helper: Check if profile is complete enough for plan assignment
     */
    public function isCompleteForTraining(): bool
    {
        return !empty($this->experience_level) && !empty($this->current_goal);
    }
}