<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Event extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'organizer_id',
        'title',
        'description',
        'location',
        'latitude',
        'longitude',
        'event_date',
        'max_participants',
        'status',
        'difficulty',
        'distance_km',
        'photos',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'event_date' => 'datetime',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'distance_km' => 'decimal:2',
        'max_participants' => 'integer',
        'photos' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the organizer of the event.
     */
    public function organizer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    /**
     * Get the participants of the event.
     */
    public function participants(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'event_participants')
            ->withPivot('status')
            ->withTimestamps();
    }

    /**
     * Get participants who have joined.
     */
    public function joinedParticipants(): BelongsToMany
    {
        return $this->participants()->wherePivot('status', 'joined');
    }

    /**
     * Check if event is full.
     */
    public function isFull(): bool
    {
        if (!$this->max_participants) {
            return false;
        }

        return $this->joinedParticipants()->count() >= $this->max_participants;
    }

    /**
     * Check if user is participating in the event.
     */
    public function hasParticipant(int $userId): bool
    {
        return $this->participants()->where('user_id', $userId)->exists();
    }

    /**
     * Check if user has joined the event.
     */
    public function hasJoined(int $userId): bool
    {
        return $this->joinedParticipants()->where('user_id', $userId)->exists();
    }

    /**
     * Get participant count.
     */
    public function participantCount(): int
    {
        return $this->joinedParticipants()->count();
    }

    /**
     * Scope a query to only include upcoming events.
     */
    public function scopeUpcoming($query)
    {
        return $query->where('status', 'upcoming')
            ->where('event_date', '>', now());
    }

    /**
     * Scope a query to only include past events.
     */
    public function scopePast($query)
    {
        return $query->where(function ($q) {
            $q->where('status', 'completed')
              ->orWhere('event_date', '<', now());
        });
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Check if event can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->status === 'upcoming' && $this->event_date > now();
    }

    /**
     * Check if event can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['upcoming', 'ongoing']);
    }
}
