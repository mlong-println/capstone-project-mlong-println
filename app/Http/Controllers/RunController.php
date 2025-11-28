<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Run;
use App\Models\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Redirect;
use Carbon\Carbon;

/**
 * RunController
 * Handles logging and viewing running sessions
 */
class RunController extends Controller
{
    /**
     * Display a list of user's runs
     */
    public function index()
    {
        $user = auth()->user();
        
        $runs = Run::where('user_id', $user->id)
            ->with('route')
            ->orderBy('start_time', 'desc')
            ->get();

        return Inertia::render('Runs/Index', [
            'runs' => $runs,
        ]);
    }

    /**
     * Show the form for creating a new run
     */
    public function create()
    {
        $user = auth()->user();
        
        // Get all routes for the dropdown
        $routes = Route::where('created_by', $user->id)
            ->orWhere(function($query) {
                // Add public routes or routes the user has access to
                $query->whereNotNull('id');
            })
            ->orderBy('name')
            ->get(['id', 'name', 'distance']);

        return Inertia::render('Runs/Create', [
            'routes' => $routes,
        ]);
    }

    /**
     * Store a newly created run
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'start_time' => 'required|date',
            'completion_time' => 'required|integer|min:1', // in seconds
        ]);

        $startTime = Carbon::parse($validated['start_time']);
        $endTime = $startTime->copy()->addSeconds($validated['completion_time']);

        Run::create([
            'user_id' => auth()->id(),
            'route_id' => $validated['route_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'completion_time' => $validated['completion_time'],
        ]);

        return Redirect::route('runs.index')->with('success', 'Run logged successfully!');
    }

    /**
     * Display a specific run
     */
    public function show(Run $run)
    {
        // Ensure user owns this run
        if ($run->user_id !== auth()->id()) {
            abort(403);
        }

        $run->load('route');

        return Inertia::render('Runs/Show', [
            'run' => $run,
        ]);
    }

    /**
     * Remove a run
     */
    public function destroy(Run $run)
    {
        // Ensure user owns this run
        if ($run->user_id !== auth()->id()) {
            abort(403);
        }

        $run->delete();

        return Redirect::route('runs.index')->with('success', 'Run deleted successfully!');
    }

    /**
     * Get user's running statistics
     */
    public function stats()
    {
        $user = auth()->user();
        
        $runs = Run::where('user_id', $user->id)
            ->with('route')
            ->get();

        // Calculate stats
        $totalRuns = $runs->count();
        $totalDistance = $runs->sum(function($run) {
            return $run->route->distance ?? 0;
        });
        
        // Runs this week
        $weekStart = Carbon::now()->startOfWeek();
        $runsThisWeek = $runs->filter(function($run) use ($weekStart) {
            return $run->start_time >= $weekStart;
        })->count();
        
        $distanceThisWeek = $runs->filter(function($run) use ($weekStart) {
            return $run->start_time >= $weekStart;
        })->sum(function($run) {
            return $run->route->distance ?? 0;
        });

        // Best pace (fastest)
        $bestPace = $runs->filter(function($run) {
            return $run->pace !== null;
        })->min('pace');

        // Personal records by distance
        $prs = [];
        foreach ($runs as $run) {
            if (!$run->route || !$run->completion_time) continue;
            
            $distance = $run->route->distance;
            if (!isset($prs[$distance]) || $run->completion_time < $prs[$distance]) {
                $prs[$distance] = $run->completion_time;
            }
        }

        return response()->json([
            'total_runs' => $totalRuns,
            'total_distance' => round($totalDistance, 2),
            'runs_this_week' => $runsThisWeek,
            'distance_this_week' => round($distanceThisWeek, 2),
            'best_pace' => $bestPace ? sprintf('%d:%02d /km', floor($bestPace), round(($bestPace - floor($bestPace)) * 60)) : 'N/A',
            'personal_records' => $prs,
        ]);
    }
}
