<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Route;
use App\Models\Run;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ExploreController extends Controller
{
    /**
     * Display public routes for exploration
     */
    public function index(Request $request): Response
    {
        $query = Route::where('is_public', true)
            ->with(['creator', 'runs.user']);

        // Get all public routes with leaderboard data
        $routes = $query->get()->map(function($route) {
            // Get top 3 public runs overall
            $topRuns = $route->runs()
                ->where('is_public', true)
                ->with('user')
                ->orderBy('completion_time', 'asc')
                ->take(3)
                ->get();

            return [
                'id' => $route->id,
                'name' => $route->name,
                'description' => $route->description,
                'distance' => $route->distance,
                'difficulty' => $route->difficulty,
                'created_at' => $route->created_at->format('M d, Y'),
                'creator' => [
                    'id' => $route->creator->id,
                    'name' => $route->creator->name,
                ],
                'total_runs' => $route->runs()->count(),
                'top_runners' => $topRuns->map(function($run, $index) {
                    return [
                        'rank' => $index + 1,
                        'user_name' => $run->user->name,
                        'formatted_time' => $run->formatted_time,
                        'formatted_pace' => $run->formatted_pace,
                    ];
                }),
            ];
        });

        return Inertia::render('Explore/Index', [
            'routes' => $routes,
        ]);
    }

    /**
     * Show a public route with full leaderboard
     */
    public function show(Route $route): Response
    {
        // Ensure route is public
        if (!$route->is_public) {
            abort(403, 'This route is not public.');
        }

        $route->load(['creator', 'runs.user']);

        // Get filter from request
        $filter = request('filter', 'overall'); // overall, male, female

        // Build leaderboard query - only public runs
        $leaderboardQuery = $route->runs()
            ->where('is_public', true)
            ->with('user')
            ->orderBy('completion_time', 'asc');

        // Apply gender filter if needed
        if ($filter === 'male' || $filter === 'female') {
            $leaderboardQuery->whereHas('user', function($q) use ($filter) {
                $q->where('gender', $filter);
            });
        }

        $allRuns = $leaderboardQuery->get();

        // Group by user to get best time per user
        $leaderboard = $allRuns->groupBy('user_id')->map(function($userRuns, $userId) {
            $bestRun = $userRuns->sortBy('completion_time')->first();
            $runCount = $userRuns->count();
            
            return [
                'user_id' => $userId,
                'user_name' => $bestRun->user->name,
                'user_gender' => $bestRun->user->gender ?? 'other',
                'best_time' => $bestRun->completion_time,
                'formatted_time' => $bestRun->formatted_time,
                'formatted_pace' => $bestRun->formatted_pace,
                'run_count' => $runCount,
            ];
        })->sortBy('best_time')->values()->take(50); // Top 50

        // Add medals to top 3
        $leaderboard = $leaderboard->map(function($entry, $index) {
            $entry['rank'] = $index + 1;
            $entry['medal'] = null;
            if ($index === 0) $entry['medal'] = 'gold';
            if ($index === 1) $entry['medal'] = 'silver';
            if ($index === 2) $entry['medal'] = 'bronze';
            return $entry;
        });

        return Inertia::render('Explore/Show', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'description' => $route->description,
                'distance' => $route->distance,
                'difficulty' => $route->difficulty,
                'coordinates' => $route->coordinates,
                'created_at' => $route->created_at->format('M d, Y'),
                'creator' => [
                    'id' => $route->creator->id,
                    'name' => $route->creator->name,
                ],
            ],
            'leaderboard' => $leaderboard,
            'currentFilter' => $filter,
            'totalRuns' => $route->runs()->count(),
        ]);
    }
}
