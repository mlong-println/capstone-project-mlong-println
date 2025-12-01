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
            ->get()
            ->map(function($run) {
                return [
                    'id' => $run->id,
                    'start_time' => $run->start_time,
                    'completion_time' => $run->completion_time,
                    'formatted_time' => $run->formatted_time,
                    'formatted_pace' => $run->formatted_pace,
                    'notes' => $run->notes,
                    'route' => $run->route,
                ];
            });

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
        // Log incoming data for debugging
        \Log::info('Run store request data:', $request->all());

        $validated = $request->validate([
            'route_id' => 'required|exists:routes,id',
            'start_time' => 'required|date',
            'completion_time' => 'required|integer', // in seconds
            'notes' => 'nullable|string|max:250',
        ]);

        \Log::info('Validated data:', $validated);

        $startTime = Carbon::parse($validated['start_time']);
        $endTime = $startTime->copy()->addSeconds($validated['completion_time']);

        // Calculate elevation gain from route coordinates
        $route = \App\Models\Route::find($validated['route_id']);
        $elevationGain = null;
        
        if ($route && $route->coordinates) {
            \Log::info('Attempting to calculate elevation for route: ' . $route->id);
            $elevationGain = $this->calculateElevationGain($route->coordinates);
            \Log::info('Elevation calculated: ' . ($elevationGain ?? 'null'));
        }

        $run = Run::create([
            'user_id' => auth()->id(),
            'route_id' => $validated['route_id'],
            'start_time' => $startTime,
            'end_time' => $endTime,
            'completion_time' => $validated['completion_time'],
            'notes' => $validated['notes'] ?? null,
            'elevation_gain' => $elevationGain,
        ]);

        \Log::info('Created run:', $run->toArray());

        // Check for achievements
        $achievementService = new \App\Services\AchievementService();
        $newAchievements = $achievementService->checkAchievements(auth()->user(), $run);
        
        $message = 'Run logged successfully!';
        if (count($newAchievements) > 0) {
            $achievementNames = implode(', ', array_map(fn($a) => $a->name, $newAchievements));
            $message .= " 🏆 Achievement unlocked: {$achievementNames}!";
        }

        return Redirect::route('runs.index')->with('success', $message);
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
            'run' => [
                'id' => $run->id,
                'start_time' => $run->start_time,
                'end_time' => $run->end_time,
                'completion_time' => $run->completion_time,
                'formatted_time' => $run->formatted_time,
                'formatted_pace' => $run->formatted_pace,
                'notes' => $run->notes,
                'route' => $run->route,
            ],
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

    /**
     * Calculate elevation gain from route coordinates using Open-Elevation API
     */
    private function calculateElevationGain($coordinates)
    {
        try {
            // If coordinates is a string, decode it
            if (is_string($coordinates)) {
                $coordinates = json_decode($coordinates, true);
            }
            
            if (!$coordinates || !is_array($coordinates) || count($coordinates) < 2) {
                return 0;
            }

            // Prepare locations for API
            $locations = array_map(function($coord) {
                return [
                    'latitude' => $coord['lat'],
                    'longitude' => $coord['lng']
                ];
            }, $coordinates);

            // Call Open-Elevation API
            \Log::info('Calling elevation API with ' . count($locations) . ' locations');
            $response = \Http::timeout(15)->post('https://api.open-elevation.com/api/v1/lookup', [
                'locations' => $locations
            ]);

            if (!$response->successful()) {
                \Log::warning('Elevation API failed with status: ' . $response->status());
                return null;
            }

            $data = $response->json();
            \Log::info('Elevation API response received');
            
            if (!isset($data['results']) || !is_array($data['results'])) {
                \Log::warning('Invalid elevation API response structure');
                return null;
            }
            
            $elevations = array_map(fn($r) => $r['elevation'], $data['results']);

            // Calculate total elevation change (both up and down)
            $totalElevationChange = 0;
            for ($i = 1; $i < count($elevations); $i++) {
                $diff = abs($elevations[$i] - $elevations[$i - 1]);
                $totalElevationChange += $diff;
            }

            \Log::info('Total elevation change calculated: ' . $totalElevationChange);
            return round($totalElevationChange, 2);
        } catch (\Exception $e) {
            \Log::error('Failed to calculate elevation: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return null;
        }
    }
}
