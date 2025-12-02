<?php

namespace App\Http\Controllers;

use App\Models\SafetyAlert;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class SafetyAlertController extends Controller
{
    /**
     * Display a listing of active safety alerts
     */
    public function index()
    {
        $alerts = SafetyAlert::with('user')
            ->active()
            ->orderBy('severity', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('SafetyAlerts/Index', [
            'alerts' => $alerts,
        ]);
    }

    /**
     * Show the form for creating a new safety alert
     */
    public function create()
    {
        return Inertia::render('SafetyAlerts/Create');
    }

    /**
     * Store a newly created safety alert
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
                $path = $file->store('safety-alerts', 'public');
                $mediaPaths[] = $path;
            }
        }

        $alert = SafetyAlert::create([
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

        return redirect()->route('safety-alerts.index')
            ->with('success', 'Safety alert created successfully!');
    }

    /**
     * Display the specified safety alert
     */
    public function show(SafetyAlert $safetyAlert)
    {
        $safetyAlert->load('user');

        return Inertia::render('SafetyAlerts/Show', [
            'alert' => $safetyAlert,
        ]);
    }

    /**
     * Update the specified safety alert (mark as inactive)
     */
    public function update(Request $request, SafetyAlert $safetyAlert)
    {
        // Only the creator can update
        if ($safetyAlert->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $safetyAlert->update($validated);

        return back()->with('success', 'Alert updated successfully!');
    }

    /**
     * Remove the specified safety alert
     */
    public function destroy(SafetyAlert $safetyAlert)
    {
        // Only the creator or admin can delete
        if ($safetyAlert->user_id !== auth()->id() && auth()->user()->role !== 'admin') {
            abort(403);
        }

        // Delete associated media files
        if ($safetyAlert->media) {
            foreach ($safetyAlert->media as $mediaPath) {
                Storage::disk('public')->delete($mediaPath);
            }
        }

        $safetyAlert->delete();

        return redirect()->route('safety-alerts.index')
            ->with('success', 'Safety alert deleted successfully!');
    }
}
