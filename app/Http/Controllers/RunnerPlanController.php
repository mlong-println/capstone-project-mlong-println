<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\TrainingPlan;
use App\Models\PlanAssignment;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;

/**
 * RunnerPlanController
 * Handles runner interactions with training plans
 * Allows runners to browse, select, and track training plans
 */
class RunnerPlanController extends Controller
{
    /**
     * Browse all available training plans
     */
    public function index()
    {
        $user = auth()->user();
        
        // Get all public template plans
        $plans = TrainingPlan::where('is_public', true)
            ->where('is_template', true)
            ->orderBy('distance_type')
            ->orderBy('experience_level')
            ->get()
            ->groupBy('distance_type');

        return Inertia::render('Runner/BrowsePlans', [
            'plans' => $plans,
            'userProfile' => $user->profile,
            'activePlan' => $user->activePlanAssignment(),
        ]);
    }

    /**
     * View a specific training plan
     */
    public function show(TrainingPlan $plan)
    {
        $user = auth()->user();

        return Inertia::render('Runner/PlanDetail', [
            'plan' => $plan,
            'userProfile' => $user->profile,
            'activePlan' => $user->activePlanAssignment(),
            'canSelect' => !$user->activePlanAssignment(), // can only select if no active plan
        ]);
    }

    /**
     * Assign a training plan to the runner
     */
    public function assign(Request $request, TrainingPlan $plan)
    {
        $user = auth()->user();

        // Check if runner already has an active plan
        if ($user->activePlanAssignment()) {
            throw ValidationException::withMessages([
                'plan' => 'You already have an active training plan. Complete or abandon it first.',
            ]);
        }

        // Check if profile is complete
        if (!$user->profile || !$user->profile->isCompleteForTraining()) {
            return Redirect::route('runner.profile.edit')->with('error', 'Please complete your profile before selecting a training plan.');
        }

        // Create plan assignment
        $startDate = $request->input('start_date', Carbon::now()->toDateString());
        $targetEndDate = Carbon::parse($startDate)->addWeeks($plan->duration_weeks)->toDateString();

        PlanAssignment::create([
            'user_id' => $user->id,
            'training_plan_id' => $plan->id,
            'start_date' => $startDate,
            'target_end_date' => $targetEndDate,
            'status' => 'active',
            'current_week' => 1,
            'total_workouts_in_plan' => $plan->total_workouts ?? 0,
            'total_workouts_completed' => 0,
            'completion_percentage' => 0,
        ]);

        return Redirect::route('runner.dashboard')->with('success', 'Training plan assigned successfully! Let\'s get started!');
    }

    /**
     * View the runner's active plan with progress
     */
    public function viewActive()
    {
        $user = auth()->user();
        $assignment = $user->activePlanAssignment();

        if (!$assignment) {
            return Redirect::route('runner.plans.index')->with('error', 'You don\'t have an active training plan.');
        }

        $assignment->load('trainingPlan');

        return Inertia::render('Runner/ActivePlan', [
            'assignment' => $assignment,
            'plan' => $assignment->trainingPlan,
        ]);
    }

    /**
     * Mark a workout as completed
     */
    public function completeWorkout(Request $request, PlanAssignment $assignment)
    {
        // Ensure the assignment belongs to the authenticated user
        if ($assignment->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'week' => 'required|integer|min:1',
            'workout_index' => 'required|integer|min:0',
        ]);

        $assignment->markWorkoutComplete($validated['week'], $validated['workout_index']);

        return Redirect::back()->with('success', 'Workout marked as complete!');
    }

    /**
     * Pause the active plan
     */
    public function pause(PlanAssignment $assignment)
    {
        // Ensure the assignment belongs to the authenticated user
        if ($assignment->user_id !== auth()->id()) {
            abort(403);
        }

        $assignment->status = 'paused';
        $assignment->save();

        return Redirect::back()->with('success', 'Training plan paused.');
    }

    /**
     * Resume a paused plan
     */
    public function resume(PlanAssignment $assignment)
    {
        // Ensure the assignment belongs to the authenticated user
        if ($assignment->user_id !== auth()->id()) {
            abort(403);
        }

        $assignment->status = 'active';
        $assignment->save();

        return Redirect::back()->with('success', 'Training plan resumed!');
    }

    /**
     * Abandon the active plan
     */
    public function abandon(PlanAssignment $assignment)
    {
        // Ensure the assignment belongs to the authenticated user
        if ($assignment->user_id !== auth()->id()) {
            abort(403);
        }

        $assignment->update([
            'status' => 'abandoned',
            'actual_end_date' => now(),
        ]);

        return Redirect::route('runner.dashboard')->with('success', 'Training plan abandoned. You can select a new plan anytime.');
    }
}