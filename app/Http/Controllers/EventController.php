<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of upcoming events
     */
    public function index()
    {
        $events = Event::with(['organizer', 'participants'])
            ->upcoming()
            ->orderBy('event_date', 'asc')
            ->paginate(20);

        return Inertia::render('Events/Index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        return Inertia::render('Events/Create');
    }

    /**
     * Store a newly created event
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'location' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'event_date' => 'required|date|after:now',
            'max_participants' => 'nullable|integer|min:1',
            'difficulty' => 'nullable|in:easy,moderate,hard',
            'distance_km' => 'nullable|numeric|min:0',
        ]);

        $event = Event::create([
            ...$validated,
            'organizer_id' => auth()->id(),
            'status' => 'upcoming',
        ]);

        return Redirect::route('events.show', $event)->with('success', 'Event created successfully!');
    }

    /**
     * Display the specified event
     */
    public function show(Event $event)
    {
        $event->load(['organizer', 'participants']);
        
        $userParticipation = null;
        if (auth()->check()) {
            $userParticipation = $event->participants()
                ->where('user_id', auth()->id())
                ->first();
        }

        return Inertia::render('Events/Show', [
            'event' => $event,
            'participantCount' => $event->participantCount(),
            'isFull' => $event->isFull(),
            'userParticipation' => $userParticipation,
            'isOrganizer' => auth()->check() && $event->organizer_id === auth()->id(),
        ]);
    }

    /**
     * Show the form for editing the specified event
     */
    public function edit(Event $event)
    {
        // Only organizer can edit
        if ($event->organizer_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return Redirect::route('events.show', $event)
                ->with('error', 'This event can no longer be edited.');
        }

        return Inertia::render('Events/Edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event
     */
    public function update(Request $request, Event $event)
    {
        // Only organizer can update
        if ($event->organizer_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeEdited()) {
            return Redirect::route('events.show', $event)
                ->with('error', 'This event can no longer be edited.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string|max:5000',
            'location' => 'required|string|max:255',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'event_date' => 'required|date|after:now',
            'max_participants' => 'nullable|integer|min:1',
            'difficulty' => 'nullable|in:easy,moderate,hard',
            'distance_km' => 'nullable|numeric|min:0',
        ]);

        $event->update($validated);

        // Notify all participants about the update
        $this->notifyParticipants($event, 'Event Updated', 'The event "' . $event->title . '" has been updated.');

        return Redirect::route('events.show', $event)->with('success', 'Event updated successfully!');
    }

    /**
     * Cancel the specified event
     */
    public function cancel(Event $event)
    {
        // Only organizer can cancel
        if ($event->organizer_id !== auth()->id()) {
            abort(403);
        }

        if (!$event->canBeCancelled()) {
            return Redirect::route('events.show', $event)
                ->with('error', 'This event cannot be cancelled.');
        }

        $event->update(['status' => 'cancelled']);

        // Notify all participants about cancellation
        $this->notifyParticipants($event, 'Event Cancelled', 'The event "' . $event->title . '" has been cancelled.');

        return Redirect::route('events.show', $event)->with('success', 'Event cancelled successfully.');
    }

    /**
     * Join an event
     */
    public function join(Event $event)
    {
        $user = auth()->user();

        // Check if event is full
        if ($event->isFull()) {
            return Redirect::back()->with('error', 'This event is full.');
        }

        // Check if already joined
        if ($event->hasParticipant($user->id)) {
            return Redirect::back()->with('error', 'You are already registered for this event.');
        }

        // Add participant
        $event->participants()->attach($user->id, ['status' => 'joined']);

        // Notify organizer
        Notification::create([
            'user_id' => $event->organizer_id,
            'type' => 'event_update',
            'title' => 'New Participant',
            'message' => $user->name . ' has joined your event "' . $event->title . '"',
            'data' => ['event_id' => $event->id],
            'action_url' => route('events.show', $event->id),
        ]);

        return Redirect::back()->with('success', 'You have successfully joined the event!');
    }

    /**
     * Leave an event
     */
    public function leave(Event $event)
    {
        $user = auth()->user();

        if (!$event->hasParticipant($user->id)) {
            return Redirect::back()->with('error', 'You are not registered for this event.');
        }

        $event->participants()->detach($user->id);

        // Notify organizer
        Notification::create([
            'user_id' => $event->organizer_id,
            'type' => 'event_update',
            'title' => 'Participant Left',
            'message' => $user->name . ' has left your event "' . $event->title . '"',
            'data' => ['event_id' => $event->id],
            'action_url' => route('events.show', $event->id),
        ]);

        return Redirect::back()->with('success', 'You have left the event.');
    }

    /**
     * Helper: Notify all participants
     */
    private function notifyParticipants(Event $event, string $title, string $message)
    {
        $participants = $event->joinedParticipants()->get();

        foreach ($participants as $participant) {
            Notification::create([
                'user_id' => $participant->id,
                'type' => 'event_update',
                'title' => $title,
                'message' => $message,
                'data' => ['event_id' => $event->id],
                'action_url' => route('events.show', $event->id),
            ]);
        }
    }
}
