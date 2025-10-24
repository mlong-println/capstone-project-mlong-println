<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role', // added for runner/trainer distinction
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relationship: User has one Profile
     */
    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    /**
     * Relationship: User has many PlanAssignments (for runners)
     */
    public function planAssignments(): HasMany
    {
        return $this->hasMany(PlanAssignment::class);
    }

    /**
     * Relationship: User has many TrainingPlans (for trainers - plans they created)
     */
    public function createdPlans(): HasMany
    {
        return $this->hasMany(TrainingPlan::class, 'created_by');
    }

    /**
     * Helper: Check if user is a trainer
     */
    public function isTrainer(): bool
    {
        return $this->role === 'trainer';
    }

    /**
     * Helper: Check if user is a runner
     */
    public function isRunner(): bool
    {
        return $this->role === 'runner';
    }

    /**
     * Helper: Get active plan assignment (for runners)
     */
    public function activePlanAssignment()
    {
        return $this->planAssignments()->where('status', 'active')->first();
    }

    /**
     * Helper: Check if user has a profile
     */
    public function hasProfile(): bool
    {
        return $this->profile()->exists();
    }
}