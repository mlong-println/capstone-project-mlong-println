<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAchievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'achievement_id',
        'year',
        'month',
        'value_achieved',
        'achieved_at',
    ];

    protected $casts = [
        'year' => 'integer',
        'month' => 'integer',
        'value_achieved' => 'decimal:2',
        'achieved_at' => 'datetime',
    ];

    /**
     * Get the user who earned this achievement
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the achievement
     */
    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }
}
