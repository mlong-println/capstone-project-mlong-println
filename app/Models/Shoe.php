<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Shoe extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'brand',
        'model',
        'color',
        'distance',
        'purchase_date',
        'is_active',
        'notes',
    ];

    protected $casts = [
        'purchase_date' => 'date',
        'is_active' => 'boolean',
        'distance' => 'decimal:2',
    ];

    /**
     * Get the user that owns the shoe
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Check if shoe needs replacement (typically 500-800km)
     */
    public function needsReplacement(): bool
    {
        return $this->distance >= 600; // Alert at 600km
    }

    /**
     * Get the wear percentage (based on 800km lifespan)
     */
    public function getWearPercentageAttribute(): int
    {
        return min(100, (int)(($this->distance / 800) * 100));
    }

    /**
     * Get remaining distance before replacement
     */
    public function getRemainingDistanceAttribute(): float
    {
        return max(0, 800 - $this->distance);
    }
}
