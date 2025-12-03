<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\TrainingPlan;
use App\Models\PlanAssignment;
use Inertia\Inertia;

/**
 * TrainerDashboardController
 * Handles trainer-specific dashboard views and actions
 * Allows trainer to view runners, manage training plans, and track progress
 */
class TrainerDashboardController extends Controller
{
    /**
     * Display the main trainer dashboard
     */
    public function index()
    {
        $trainer = auth()->user();

        // Get all runners with their profiles and active plan assignments
        $runners = User::where('role', 'runner')
            ->with(['profile', 'planAssignments.trainingPlan'])
            ->get()
            ->map(function ($runner) {
                return [
                    'id' => $runner->id,
                    'name' => $runner->name,
                    'email' => $runner->email,
                    'profile' => $runner->profile,
                    'active_plan' => $runner->activePlanAssignment(),
                    'total_plans_completed' => $runner->planAssignments()->where('status', 'completed')->count(),
                ];
            });

        // Get trainer's training plans with assignment counts
        $trainingPlans = TrainingPlan::where('created_by', $trainer->id)
            ->withCount(['assignments', 'activeAssignments'])
            ->get()
            ->map(function ($plan) {
                return [
                    'id' => $plan->id,
                    'name' => $plan->name,
                    'full_name' => $plan->full_name,
                    'distance_type' => $plan->distance_type,
                    'experience_level' => $plan->experience_level,
                    'duration_weeks' => $plan->duration_weeks,
                    'is_template' => $plan->is_template,
                    'total_assignments' => $plan->assignments_count,
                    'active_assignments' => $plan->active_assignments_count,
                ];
            });

        // Dashboard stats
        $stats = [
            'active_runners' => $runners->filter(fn($r) => $r['active_plan'])->count(),
            'total_plans' => $trainingPlans->count(),
            'total_active_assignments' => PlanAssignment::where('status', 'active')->count(),
        ];

        return Inertia::render('TrainerDashboard', [
            'auth' => ['user' => $trainer],
            'runners' => $runners,
            'trainingPlans' => $trainingPlans,
            'stats' => $stats,
        ]);
    }

    /**
     * View all registered runners
{{ ... }}
    public function viewRunners()
    {
        $runners = User::where('role', 'runner')
            ->with(['profile', 'planAssignments.trainingPlan'])
            ->get()
            ->map(function ($runner) {
                return [
                    'id' => $runner->id,
                    'name' => $runner->name,
                    'email' => $runner->email,
                    'profile' => $runner->profile,
                    'active_plan' => $runner->activePlanAssignment(),
                    'plan_history' => $runner->planAssignments()->with('trainingPlan')->get(),
                ];
            });

        return Inertia::render('Trainer/ViewRunners', [
            'runners' => $runners,
        ]);
    }

    /**
     * View all training plans
     */
    public function viewPlans()
    {
        $trainer = auth()->user();

        $plans = TrainingPlan::where('created_by', $trainer->id)
            ->withCount(['assignments', 'activeAssignments'])
            ->orderBy('distance_type')
            ->orderBy('experience_level')
            ->get();

        return Inertia::render('Trainer/ViewPlans', [
            'plans' => $plans,
        ]);
    }

    /**
     * View a specific runner's profile and progress
     */
    public function viewRunner(User $runner)
    {
        // Ensure the user is a runner
        if (!$runner->isRunner()) {
            abort(404);
        }

        $runner->load(['profile', 'planAssignments.trainingPlan']);

        return Inertia::render('Trainer/RunnerDetail', [
            'runner' => [
                'id' => $runner->id,
                'name' => $runner->name,
                'email' => $runner->email,
                'profile' => $runner->profile,
                'active_plan' => $runner->activePlanAssignment(),
                'plan_history' => $runner->planAssignments()->with('trainingPlan')->orderBy('created_at', 'desc')->get(),
            ],
        ]);
    }

    /**
     * View a specific training plan with details
     */
    public function viewPlan(TrainingPlan $plan)
    {
        // Ensure the plan belongs to this trainer
        if ($plan->created_by !== auth()->id()) {
            abort(403);
        }

        $plan->load(['assignments.user.profile']);

        return Inertia::render('Trainer/PlanDetail', [
            'plan' => $plan,
            'assignments' => $plan->assignments,
        ]);
    }

    /**
     * Show the form for creating a new training plan
     */
    public function createPlan()
    {
        return Inertia::render('Trainer/CreatePlan');
    }

    /**
     * Store a newly created training plan
     */
    public function storePlan(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'distance_type' => 'required|in:5k,10k,half_marathon,full_marathon,ultra',
            'experience_level' => 'required|in:beginner,intermediate,advanced',
            'duration_weeks' => 'required|integer|min:1|max:52',
            'weekly_mileage_peak' => 'nullable|numeric|min:0',
            'prerequisites' => 'nullable|string',
            'goals' => 'nullable|string',
            'weekly_structure' => 'nullable|string', // JSON string from frontend
        ]);

        // Decode weekly_structure if provided
        $weeklyStructure = [];
        if (!empty($validated['weekly_structure'])) {
            $weeklyStructure = json_decode($validated['weekly_structure'], true) ?? [];
        }

        $plan = TrainingPlan::create([
            'name' => $validated['name'],
            'description' => $validated['description'],
            'distance_type' => $validated['distance_type'],
            'experience_level' => $validated['experience_level'],
            'duration_weeks' => $validated['duration_weeks'],
            'weekly_mileage_peak' => $validated['weekly_mileage_peak'] ?? null,
            'prerequisites' => $validated['prerequisites'] ?? null,
            'goals' => $validated['goals'] ?? null,
            'weekly_structure' => $weeklyStructure,
            'created_by' => auth()->id(),
            'is_template' => true, // Admin-created plans are templates
        ]);

        return redirect()->route('admin.plans.show', $plan->id)
            ->with('success', 'Training plan created successfully!');
    }
}