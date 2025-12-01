<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Display all notifications for the authenticated user
     */
    public function index()
    {
        $user = auth()->user();
        
        // Exclude social notifications (they go to Activity page)
        $notifications = $user->notifications()
            ->whereNotIn('type', ['follow_request', 'follow_approved', 'like', 'comment'])
            ->paginate(20);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount' => $user->unreadNotificationsCount(),
        ]);
    }

    /**
     * Get unread notifications count (for bell icon)
     */
    public function unreadCount()
    {
        return response()->json([
            'count' => auth()->user()->unreadNotificationsCount(),
        ]);
    }

    /**
     * Mark a specific notification as read
     */
    public function markAsRead(Notification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->markAsRead();

        // If there's an action URL, redirect to it
        if ($notification->action_url) {
            return Redirect::to($notification->action_url);
        }

        return Redirect::back();
    }

    /**
     * Mark all notifications as read
     */
    public function markAllAsRead()
    {
        auth()->user()->notifications()->unread()->update([
            'read' => true,
            'read_at' => now(),
        ]);

        return Redirect::back()->with('success', 'All notifications marked as read');
    }

    /**
     * Delete a specific notification
     */
    public function destroy(Notification $notification)
    {
        // Ensure the notification belongs to the authenticated user
        if ($notification->user_id !== auth()->id()) {
            abort(403);
        }

        $notification->delete();

        return Redirect::back()->with('success', 'Notification deleted');
    }

    /**
     * Delete all read notifications
     */
    public function deleteAllRead()
    {
        auth()->user()->notifications()->read()->delete();

        return Redirect::back()->with('success', 'All read notifications deleted');
    }
}
