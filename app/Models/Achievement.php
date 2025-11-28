<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Achievement extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'type',
        'target_value',
        'icon',
    ];

    protected $casts = [
        'target_value' => 'integer',
    ];

    /**
     * Users who have earned this achievement
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_achievements')
            ->withPivot(['year', 'month', 'value_achieved', 'achieved_at'])
            ->withTimestamps();
    }
}
