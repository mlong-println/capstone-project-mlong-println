<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

/**
 * PlanAssignment Model
 * Tracks which runners are assigned to which training plans
 * Includes progress tracking and status management
 */
class PlanAssignment extends Model
{
    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'training_plan_id',
        'start_date',
        'target_end_date',
        'actual_end_date',
        'status',
        'current_week',
        'completed_workouts',
        'total_workouts_completed',
        'total_workouts_in_plan',
        'runner_notes',
        'trainer_notes',
        'completion_percentage',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'start_date' => 'date',
        'target_end_date' => 'date',
        'actual_end_date' => 'date',
        'current_week' => 'integer',
        'total_workouts_completed' => 'integer',
        'total_workouts_in_plan' => 'integer',
        'completion_percentage' => 'decimal:2',
        'completed_workouts' => 'array', // JSON field
    ];

    /**
     * Relationship: PlanAssignment belongs to a User (the runner)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relationship: PlanAssignment belongs to a TrainingPlan
     */
    public function trainingPlan(): BelongsTo
    {
        return $this->belongsTo(TrainingPlan::class);
    }

    /**
     * Helper: Calculate and update completion percentage
     */
    public function updateCompletionPercentage(): void
    {
        if ($this->total_workouts_in_plan > 0) {
            $this->completion_percentage = ($this->total_workouts_completed / $this->total_workouts_in_plan) * 100;
            $this->save();
        }
    }

    /**
     * Helper: Mark a workout as completed
     */
    public function markWorkoutComplete(int $week, int $workoutIndex): void
    {
        $completed = $this->completed_workouts ?? [];
        
        if (!isset($completed["week_{$week}"])) {
            $completed["week_{$week}"] = [];
        }
        
        $completed["week_{$week}"][$workoutIndex] = true;
        
        $this->completed_workouts = $completed;
        $this->total_workouts_completed++;
        $this->updateCompletionPercentage();
    }

    /**
     * Helper: Check if a specific workout is completed
     */
    public function isWorkoutCompleted(int $week, int $workoutIndex): bool
    {
        $completed = $this->completed_workouts ?? [];
        return $completed["week_{$week}"][$workoutIndex] ?? false;
    }

    /**
     * Helper: Get days remaining in plan
     */
    public function getDaysRemainingAttribute(): int
    {
        if ($this->status !== 'active') {
            return 0;
        }
        
        return max(0, Carbon::now()->diffInDays($this->target_end_date, false));
    }

    /**
     * Helper: Check if plan is overdue
     */
    public function isOverdue(): bool
    {
        return $this->status === 'active' && Carbon::now()->isAfter($this->target_end_date);
    }

    /**
     * Helper: Get formatted status with color
     */
    public function getStatusBadgeAttribute(): array
    {
        return match($this->status) {
            'active' => ['text' => 'Active', 'color' => 'green'],
            'completed' => ['text' => 'Completed', 'color' => 'blue'],
            'paused' => ['text' => 'Paused', 'color' => 'yellow'],
            'abandoned' => ['text' => 'Abandoned', 'color' => 'red'],
            default => ['text' => 'Unknown', 'color' => 'gray'],
        };
    }
}