<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * TrainingPlan Model
 * Represents structured running training programs
 * Created by trainer (Michael Long) and assigned to runners
 */
class TrainingPlan extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'distance_type',
        'experience_level',
        'duration_weeks',
        'is_template',
        'created_by',
        'weekly_structure',
        'weekly_mileage_peak',
        'prerequisites',
        'goals',
        'is_public',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'is_template' => 'boolean',
        'is_public' => 'boolean',
        'duration_weeks' => 'integer',
        'weekly_mileage_peak' => 'integer',
        'weekly_structure' => 'array', // JSON field
    ];

    /**
     * Relationship: TrainingPlan belongs to a User (the trainer who created it)
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Relationship: TrainingPlan has many PlanAssignments
     */
    public function assignments(): HasMany
    {
        return $this->hasMany(PlanAssignment::class);
    }

    /**
     * Helper: Get active assignments (runners currently on this plan)
     */
    public function activeAssignments()
    {
        return $this->assignments()->where('status', 'active');
    }

    /**
     * Helper: Get formatted plan name with distance and level
     */
    public function getFullNameAttribute(): string
    {
        $level = $this->experience_level ? ucfirst($this->experience_level) . ' ' : '';
        $distance = strtoupper(str_replace('_', ' ', $this->distance_type));
        return "{$level}{$distance} - {$this->duration_weeks} Weeks";
    }

    /**
     * Helper: Check if plan is suitable for a given experience level
     */
    public function isSuitableFor(string $experienceLevel): bool
    {
        // Ultra plans are suitable for all (assumes advanced)
        if ($this->distance_type === 'ultra') {
            return true;
        }
        
        return $this->experience_level === $experienceLevel;
    }

    /**
     * Helper: Get total number of workouts in the plan
     */
    public function getTotalWorkoutsAttribute(): int
    {
        if (!$this->weekly_structure) {
            return 0;
        }

        $total = 0;
        foreach ($this->weekly_structure as $week) {
            if (is_array($week)) {
                $total += count($week);
            }
        }
        return $total;
    }
}