<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserChallengeEnrollment extends Model
{
    protected $fillable = [
        'user_id',
        'achievement_id',
        'year',
        'month',
    ];

    /**
     * Get the user who enrolled
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the achievement/challenge
     */
    public function achievement(): BelongsTo
    {
        return $this->belongsTo(Achievement::class);
    }
}
