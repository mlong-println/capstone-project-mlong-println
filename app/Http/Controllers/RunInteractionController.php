<?php

namespace App\Http\Controllers;

use App\Models\Run;
use App\Models\RunComment;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class RunInteractionController extends Controller
{
    /**
     * Toggle like on a run
     */
    public function toggleLike(Run $run)
    {
        $user = auth()->user();
        
        if ($run->likes()->where('user_id', $user->id)->exists()) {
            // Unlike
            $run->likes()->detach($user->id);
        } else {
            // Like
            $run->likes()->attach($user->id);
            
            // Create notification for run owner (if not liking own run)
            if ($run->user_id !== $user->id) {
                Notification::create([
                    'user_id' => $run->user_id,
                    'type' => 'like',
                    'title' => 'Run Liked',
                    'data' => [
                        'user_name' => $user->name,
                        'user_id' => $user->id,
                        'run_id' => $run->id,
                        'message' => "{$user->name} liked your run",
                    ],
                ]);
            }
        }
        
        return Redirect::back();
    }

    /**
     * Add comment to a run
     */
    public function addComment(Request $request, Run $run)
    {
        $validated = $request->validate([
            'comment' => 'required|string|max:500',
        ]);

        $comment = RunComment::create([
            'run_id' => $run->id,
            'user_id' => auth()->id(),
            'comment' => $validated['comment'],
        ]);

        // Create notification for run owner (if not commenting on own run)
        if ($run->user_id !== auth()->id()) {
            Notification::create([
                'user_id' => $run->user_id,
                'type' => 'comment',
                'title' => 'New Comment',
                'data' => [
                    'user_name' => auth()->user()->name,
                    'user_id' => auth()->id(),
                    'run_id' => $run->id,
                    'message' => auth()->user()->name . " commented on your run",
                ],
            ]);
        }

        return Redirect::back();
    }

    /**
     * Delete a comment
     */
    public function deleteComment(RunComment $comment)
    {
        // Ensure user owns the comment
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return Redirect::back();
    }
}
