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
     * Relationship: User has many Notifications
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class)->orderBy('created_at', 'desc');
    }

    /**
     * Get unread notifications count
     */
    public function unreadNotificationsCount(): int
    {
        return $this->notifications()->unread()->count();
    }

    /**
     * Relationship: User has many sent Messages
     */
    public function sentMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'sender_id')->orderBy('created_at', 'desc');
    }

    /**
     * Relationship: User has many received Messages
     */
    public function receivedMessages(): HasMany
    {
        return $this->hasMany(Message::class, 'recipient_id')->orderBy('created_at', 'desc');
    }

    /**
     * Get unread messages count
     */
    public function unreadMessagesCount(): int
    {
        return $this->receivedMessages()->unread()->count();
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
     * Includes both 'active' and 'paused' plans
     */
    public function activePlanAssignment()
    {
        return $this->planAssignments()
            ->whereIn('status', ['active', 'paused'])
            ->first();
    }

    /**
     * Helper: Check if user has a profile
     */
    public function hasProfile(): bool
    {
        return $this->profile()->exists();
    }
}