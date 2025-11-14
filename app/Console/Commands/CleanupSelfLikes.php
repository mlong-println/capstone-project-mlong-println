<?php

namespace App\Console\Commands;

use App\Models\ForumLike;
use Illuminate\Console\Command;

class CleanupSelfLikes extends Command
{
    protected $signature = 'forum:cleanup-self-likes';
    protected $description = 'Remove self-likes from forum posts and comments';

    public function handle()
    {
        $this->info('Cleaning up self-likes...');

        // Get all likes
        $likes = ForumLike::with(['likeable'])->get();
        $removed = 0;

        foreach ($likes as $like) {
            // Check if the like is on the user's own content
            if ($like->likeable && $like->likeable->user_id === $like->user_id) {
                $like->delete();
                $removed++;
            }
        }

        $this->info("Removed {$removed} self-likes.");
        return 0;
    }
}
