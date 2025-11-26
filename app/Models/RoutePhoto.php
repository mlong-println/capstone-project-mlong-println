<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RoutePhoto extends Model
{
    protected $fillable = [
        'route_id',
        'user_id',
        'photo_path',
        'caption',
    ];

    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
