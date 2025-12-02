<?php

namespace App\Http\Controllers;

use App\Models\TrailAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class TrailAlertController extends Controller
{
    /**
     * Display a listing of active trail alerts
     */
    public function index()
    {
        $alerts = TrailAlert::with('user')
            ->active()
            ->orderBy('severity', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('TrailAlerts/Index', [
            'alerts' => $alerts,
        ]);
    }

    /**
     * Show the form for creating a new trail alert
     */
    public function create()
    {
        return Inertia::render('TrailAlerts/Create');
    }

    /**
     * Store a newly created trail alert
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'location' => 'required|string|max:255',
            'severity' => 'required|in:low,medium,high,critical',
            'alert_type' => 'required|in:closure,hazard,construction,weather,wildlife,other',
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'expires_at' => 'nullable|date|after:now',
            'media' => 'nullable|array',
            'media.*' => 'file|mimes:jpg,jpeg,png,gif,mp4,mov|max:10240', // 10MB max
        ]);

        // Handle media uploads
        $mediaPaths = [];
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $file) {
                $path = $file->store('trail-alerts', 'public');
                $mediaPaths[] = $path;
            }
        }

        $alert = TrailAlert::create([
            'user_id' => auth()->id(),
            'title' => $validated['title'],
            'description' => $validated['description'],
            'location' => $validated['location'],
            'severity' => $validated['severity'],
            'alert_type' => $validated['alert_type'],
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'expires_at' => $validated['expires_at'] ?? null,
            'media' => $mediaPaths,
        ]);

        return redirect()->route('trail-alerts.index')
            ->with('success', 'Trail alert created successfully!');
    }

    /**
     * Display the specified trail alert
     */
    public function show(TrailAlert $trailAlert)
    {
        $trailAlert->load('user');

        return Inertia::render('TrailAlerts/Show', [
            'alert' => $trailAlert,
        ]);
    }

    /**
     * Update the specified trail alert (mark as inactive)
     */
    public function update(Request $request, TrailAlert $trailAlert)
    {
        // Only the creator can update
        if ($trailAlert->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $trailAlert->update($validated);

        return back()->with('success', 'Alert updated successfully!');
    }

    /**
     * Remove the specified trail alert
     */
    public function destroy(TrailAlert $trailAlert)
    {
        // Only the creator or admin can delete
        if ($trailAlert->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        // Delete associated media files
        if ($trailAlert->media) {
            foreach ($trailAlert->media as $mediaPath) {
                Storage::disk('public')->delete($mediaPath);
            }
        }

        $trailAlert->delete();

        return redirect()->route('trail-alerts.index')
            ->with('success', 'Trail alert deleted successfully!');
    }
}
