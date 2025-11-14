<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class MessageController extends Controller
{
    /**
     * Display inbox (received messages)
     */
    public function inbox()
    {
        $user = auth()->user();
        
        $messages = $user->receivedMessages()
            ->with('sender')
            ->paginate(20);

        return Inertia::render('Messages/Inbox', [
            'messages' => $messages,
            'unreadCount' => $user->unreadMessagesCount(),
        ]);
    }

    /**
     * Display sent messages
     */
    public function sent()
    {
        $user = auth()->user();
        
        $messages = $user->sentMessages()
            ->with('recipient')
            ->paginate(20);

        return Inertia::render('Messages/Sent', [
            'messages' => $messages,
        ]);
    }

    /**
     * Show the form for creating a new message
     */
    public function create(Request $request)
    {
        $recipientId = $request->query('recipient');
        $recipient = $recipientId ? User::find($recipientId) : null;

        // Get all users except the current user for the recipient dropdown
        $users = User::where('id', '!=', auth()->id())
            ->select('id', 'name', 'email')
            ->orderBy('name')
            ->get();

        return Inertia::render('Messages/Create', [
            'recipient' => $recipient,
            'users' => $users,
        ]);
    }

    /**
     * Store a newly created message
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'nullable|string|max:255',
            'body' => 'required|string|max:5000',
        ]);

        // Prevent sending message to self
        if ($validated['recipient_id'] == auth()->id()) {
            return Redirect::back()->withErrors(['recipient_id' => 'You cannot send a message to yourself.']);
        }

        $message = Message::create([
            'sender_id' => auth()->id(),
            'recipient_id' => $validated['recipient_id'],
            'subject' => $validated['subject'] ?? 'No Subject',
            'body' => $validated['body'],
        ]);

        // Create notification for recipient
        Notification::create([
            'user_id' => $validated['recipient_id'],
            'type' => 'message',
            'title' => 'New Message from ' . auth()->user()->name,
            'message' => substr($validated['body'], 0, 100) . (strlen($validated['body']) > 100 ? '...' : ''),
            'data' => ['message_id' => $message->id],
            'action_url' => route('messages.show', $message->id),
        ]);

        return Redirect::route('messages.sent')->with('success', 'Message sent successfully!');
    }

    /**
     * Display a specific message
     */
    public function show(Message $message)
    {
        $user = auth()->user();

        // Ensure user is sender or recipient
        if ($message->sender_id !== $user->id && $message->recipient_id !== $user->id) {
            abort(403);
        }

        // Mark as read if user is the recipient
        if ($message->recipient_id === $user->id) {
            $message->markAsRead();
        }

        $message->load(['sender', 'recipient']);

        return Inertia::render('Messages/Show', [
            'message' => $message,
        ]);
    }

    /**
     * Delete a message
     */
    public function destroy(Message $message)
    {
        $user = auth()->user();

        // Only sender or recipient can delete
        if ($message->sender_id !== $user->id && $message->recipient_id !== $user->id) {
            abort(403);
        }

        $message->delete();

        return Redirect::back()->with('success', 'Message deleted successfully!');
    }

    /**
     * Get unread messages count
     */
    public function unreadCount()
    {
        return response()->json([
            'count' => auth()->user()->unreadMessagesCount(),
        ]);
    }

    /**
     * Mark message as read
     */
    public function markAsRead(Message $message)
    {
        // Ensure user is the recipient
        if ($message->recipient_id !== auth()->id()) {
            abort(403);
        }

        $message->markAsRead();

        return Redirect::back();
    }

    /**
     * Mark all messages as read
     */
    public function markAllAsRead()
    {
        auth()->user()->receivedMessages()->unread()->update([
            'read' => true,
            'read_at' => now(),
        ]);

        return Redirect::back()->with('success', 'All messages marked as read');
    }
}
