<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RunComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'run_id',
        'user_id',
        'comment',
    ];

    /**
     * Get the run that owns the comment
     */
    public function run(): BelongsTo
    {
        return $this->belongsTo(Run::class);
    }

    /**
     * Get the user who made the comment
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
