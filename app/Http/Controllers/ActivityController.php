<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Follow;
use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    /**
     * Display social activity (follow requests, likes, comments)
     */
    public function index(): Response
    {
        $user = auth()->user();
        
        // Get pending follow requests
        $pendingFollowRequests = Follow::where('following_id', $user->id)
            ->where('status', 'pending')
            ->with('follower')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn($follow) => [
                'id' => $follow->id,
                'type' => 'follow_request',
                'user' => [
                    'id' => $follow->follower->id,
                    'name' => $follow->follower->name,
                    'email' => $follow->follower->email,
                ],
                'message' => $follow->follower->name . ' wants to follow you',
                'created_at' => $follow->created_at,
            ]);
        
        // Get social notifications (follow_request, follow_approved, likes, comments)
        $socialNotifications = Notification::where('user_id', $user->id)
            ->whereIn('type', ['follow_request', 'follow_approved', 'like', 'comment'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);
        
        // Count unread social activity
        $unreadCount = Follow::where('following_id', $user->id)
            ->where('status', 'pending')
            ->count();
        
        return Inertia::render('Activity/Index', [
            'pendingFollowRequests' => $pendingFollowRequests,
            'socialNotifications' => $socialNotifications,
            'unreadCount' => $unreadCount,
        ]);
    }
    
    /**
     * Get pending activity count (for heart icon)
     * Includes: pending follow requests, unread likes, unread follow approvals
     */
    public function pendingCount()
    {
        $user = auth()->user();
        
        // Count pending follow requests
        $pendingFollows = Follow::where('following_id', $user->id)
            ->where('status', 'pending')
            ->count();
        
        // Count unread social notifications (likes, follow approvals)
        $unreadSocialNotifications = Notification::where('user_id', $user->id)
            ->whereIn('type', ['follow_approved', 'like'])
            ->whereNull('read_at')
            ->count();
        
        $totalCount = $pendingFollows + $unreadSocialNotifications;
        
        return response()->json([
            'count' => $totalCount,
        ]);
    }
    
    /**
     * Mark all social notifications as read
     */
    public function markAllAsRead()
    {
        $user = auth()->user();
        
        Notification::where('user_id', $user->id)
            ->whereIn('type', ['follow_approved', 'like'])
            ->whereNull('read_at')
            ->update(['read_at' => now()]);
        
        return redirect()->back()->with('success', 'All activity marked as read');
    }
}
