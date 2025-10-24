<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Profile;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;

/**
 * RunnerProfileController
 * Handles runner profile viewing and editing
 * Allows runners to manage their extended profile information
 */
class RunnerProfileController extends Controller
{
    /**
     * Show the runner's profile edit form
     */
    public function edit()
    {
        $user = auth()->user();
        
        // Get or create profile
        $profile = $user->profile ?? new Profile(['user_id' => $user->id]);

        return Inertia::render('Runner/EditProfile', [
            'user' => $user,
            'profile' => $profile,
        ]);
    }
/**
 * Update the runner's profile
 */
public function update(Request $request)
{
    $user = auth()->user();

    // Validate input
    $validated = $request->validate([
        'bio' => 'nullable|string|max:1000',
        'location' => 'nullable|string|max:255',
        'experience_level' => 'required|in:beginner,intermediate,advanced',
        'current_goal' => 'nullable|string|max:255',
        'current_weekly_distance' => 'nullable|string|max:50', // Changed to string to allow ranges
    ]);

    // Update or create profile
    $user->profile()->updateOrCreate(
        ['user_id' => $user->id],
        $validated
    );

    return Redirect::route('runner.dashboard')->with('success', 'Profile updated successfully!');
}

    /**
     * View the runner's public profile
     */
    public function show()
    {
        $user = auth()->user();
        $user->load(['profile', 'planAssignments.trainingPlan']);

        return Inertia::render('Runner/ViewProfile', [
            'user' => $user,
            'profile' => $user->profile,
            'activePlan' => $user->activePlanAssignment(),
            'planHistory' => $user->planAssignments()->with('trainingPlan')->orderBy('created_at', 'desc')->get(),
        ]);
    }
}