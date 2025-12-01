<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class FollowController extends Controller
{
    /**
     * Send a follow request to a user
     */
    public function follow(User $user)
    {
        $currentUser = auth()->user();

        // Can't follow yourself
        if ($currentUser->id === $user->id) {
            return Redirect::back()->with('error', 'You cannot follow yourself.');
        }

        // Check if already following or has pending request
        $existingFollow = Follow::where('follower_id', $currentUser->id)
            ->where('following_id', $user->id)
            ->first();

        if ($existingFollow) {
            if ($existingFollow->status === 'approved') {
                return Redirect::back()->with('error', 'You are already following this user.');
            } elseif ($existingFollow->status === 'pending') {
                return Redirect::back()->with('error', 'You already have a pending follow request.');
            }
        }

        // Create follow request
        $follow = Follow::create([
            'follower_id' => $currentUser->id,
            'following_id' => $user->id,
            'status' => 'pending',
        ]);

        // Create notification for the user being followed
        \App\Models\Notification::create([
            'user_id' => $user->id,
            'type' => 'follow_request',
            'title' => 'New Follow Request',
            'message' => $currentUser->name . ' wants to follow you',
            'data' => json_encode([
                'follow_id' => $follow->id,
                'follower_id' => $currentUser->id,
                'follower_name' => $currentUser->name,
            ]),
        ]);

        return Redirect::back()->with('success', 'Follow request sent!');
    }

    /**
     * Unfollow a user or cancel follow request
     */
    public function unfollow(User $user)
    {
        $currentUser = auth()->user();

        Follow::where('follower_id', $currentUser->id)
            ->where('following_id', $user->id)
            ->delete();

        return Redirect::back()->with('success', 'Unfollowed successfully.');
    }

    /**
     * Approve a follow request
     */
    public function approve(Follow $follow)
    {
        // Ensure the authenticated user is the one being followed
        if ($follow->following_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $follow->update(['status' => 'approved']);

        // Create notification for the follower
        \App\Models\Notification::create([
            'user_id' => $follow->follower_id,
            'type' => 'follow_approved',
            'title' => 'Follow Request Approved',
            'message' => auth()->user()->name . ' accepted your follow request',
            'data' => json_encode([
                'user_id' => auth()->id(),
                'user_name' => auth()->user()->name,
            ]),
        ]);

        return Redirect::back()->with('success', 'Follow request approved!');
    }

    /**
     * Reject a follow request
     */
    public function reject(Follow $follow)
    {
        // Ensure the authenticated user is the one being followed
        if ($follow->following_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $follow->update(['status' => 'rejected']);

        return Redirect::back()->with('success', 'Follow request rejected.');
    }

    /**
     * Remove a follower
     */
    public function removeFollower(Follow $follow)
    {
        // Ensure the authenticated user is the one being followed
        if ($follow->following_id !== auth()->id()) {
            abort(403, 'Unauthorized action.');
        }

        $follow->delete();

        return Redirect::back()->with('success', 'Follower removed.');
    }

    /**
     * Get pending follow requests for the authenticated user
     */
    public function pendingRequests()
    {
        $pendingRequests = Follow::where('following_id', auth()->id())
            ->where('status', 'pending')
            ->with('follower')
            ->get();

        return response()->json($pendingRequests);
    }
}
