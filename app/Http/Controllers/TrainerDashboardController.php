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
}