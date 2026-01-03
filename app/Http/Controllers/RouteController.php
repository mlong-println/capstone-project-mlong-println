<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Models\RouteRating;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

/**
 * RouteController
 * Handles CRUD operations for running routes and map features
 */
class RouteController extends Controller
{
    /**
     * Display a listing of all routes with search/filter
     * Separated into My Routes (private) and RunConnect Routes (public)
     */
    public function index(Request $request): Response
    {
        $user = auth()->user();

        // My Routes (created by user, can be private or public)
        $myRoutesQuery = Route::with(['creator', 'ratings'])
            ->withCount('ratings')
            ->where('created_by', $user->id);

        // Public Routes (created by others)
        // Admins can see all routes, regular users only see public routes
        $publicRoutesQuery = Route::with(['creator', 'ratings'])
            ->withCount('ratings')
            ->where('created_by', '!=', $user->id);
        
        // Non-admin users can only see public routes
        if (!$user->isAdmin()) {
            $publicRoutesQuery->where('is_public', true);
        }

        // Apply filters to both queries
        $applyFilters = function ($query) use ($request) {
            // Search by name
            if ($request->filled('search')) {
                $query->where('name', 'like', '%' . $request->search . '%');
            }

            // Filter by distance range
            if ($request->filled('distance_range')) {
                switch ($request->distance_range) {
                    case '1-5':
                        $query->whereBetween('distance', [1, 5]);
                        break;
                    case '5-10':
                        $query->whereBetween('distance', [5, 10]);
                        break;
                    case '10-21':
                        $query->whereBetween('distance', [10, 21]);
                        break;
                    case '21-30':
                        $query->whereBetween('distance', [21, 30]);
                        break;
                    case '30+':
                        $query->where('distance', '>=', 30);
                        break;
                }
            }

            // Filter by difficulty (terrain)
            if ($request->filled('difficulty')) {
                $query->where('difficulty', $request->difficulty);
            }

            return $query;
        };

        $myRoutesQuery = $applyFilters($myRoutesQuery);
        $publicRoutesQuery = $applyFilters($publicRoutesQuery);

        $formatRoute = function ($route) {
            return [
                'id' => $route->id,
                'name' => $route->name,
                'description' => $route->description,
                'distance' => $route->distance,
                'difficulty' => $route->difficulty,
                'is_public' => $route->is_public,
                'created_at' => $route->created_at->format('M d, Y'),
                'creator' => [
                    'id' => $route->creator->id,
                    'name' => $route->creator->name,
                ],
                'average_rating' => round($route->averageRating(), 1),
                'ratings_count' => $route->ratings_count,
            ];
        };

        $myRoutes = $myRoutesQuery->get()->map($formatRoute);
        $publicRoutes = $publicRoutesQuery->get()->map($formatRoute);

        return Inertia::render('Routes/Index', [
            'myRoutes' => $myRoutes,
            'publicRoutes' => $publicRoutes,
            'filters' => [
                'search' => $request->search,
                'distance_range' => $request->distance_range,
                'difficulty' => $request->difficulty,
            ],
        ]);
    }

    /**
     * Show the form for creating a new route
     */
    public function create(): Response
    {
        return Inertia::render('Routes/Create');
    }

    /**
     * Store a newly created route in storage
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'distance' => 'required|numeric|min:0.1|max:999.99',
            'difficulty' => 'required|in:easy,moderate,hard',
            'coordinates' => 'nullable|array',
        ]);

        $route = Route::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'distance' => $validated['distance'],
            'difficulty' => $validated['difficulty'],
            'coordinates' => $validated['coordinates'] ?? null,
            'created_by' => auth()->id(),
            'is_public' => true, // Default to public
        ]);

        return redirect()->route('routes.index')
            ->with('success', 'Route created successfully!');
    }

    /**
     * Display the specified route
     */
    public function show(Route $route): Response
    {
        $route->load(['creator', 'ratings.user']);

        $userRating = null;
        $userRuns = [];
        $personalBest = null;
        
        if (auth()->check()) {
            $userRating = $route->getUserRating(auth()->id());
            
            // Get user's runs on this route, sorted by fastest time
            $runs = \App\Models\Run::where('user_id', auth()->id())
                ->where('route_id', $route->id)
                ->orderBy('completion_time', 'asc')
                ->get();
            
            if ($runs->isNotEmpty()) {
                $personalBest = $runs->first()->completion_time;
                
                $userRuns = $runs->map(function($run, $index) use ($personalBest) {
                    return [
                        'id' => $run->id,
                        'start_time' => $run->start_time,
                        'completion_time' => $run->completion_time,
                        'formatted_time' => $run->formatted_time,
                        'formatted_pace' => $run->formatted_pace,
                        'notes' => $run->notes,
                        'is_personal_best' => $run->completion_time === $personalBest,
                        'rank' => $index + 1,
                    ];
                })->toArray();
            }
        }

        return Inertia::render('Routes/Show', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'description' => $route->description,
                'distance' => $route->distance,
                'difficulty' => $route->difficulty,
                'coordinates' => $route->coordinates,
                'is_public' => $route->is_public,
                'created_at' => $route->created_at->format('M d, Y'),
                'creator' => [
                    'id' => $route->creator->id,
                    'name' => $route->creator->name,
                ],
                'average_rating' => round($route->averageRating(), 1),
                'ratings_count' => $route->ratingsCount(),
                'ratings' => $route->ratings->map(function ($rating) {
                    return [
                        'id' => $rating->id,
                        'rating' => $rating->rating,
                        'comment' => $rating->comment,
                        'created_at' => $rating->created_at->format('M d, Y'),
                        'user' => [
                            'id' => $rating->user->id,
                            'name' => $rating->user->name,
                        ],
                    ];
                }),
            ],
            'userRating' => $userRating ? [
                'id' => $userRating->id,
                'rating' => $userRating->rating,
                'comment' => $userRating->comment,
            ] : null,
            'userRuns' => $userRuns,
            'canEdit' => auth()->check() && auth()->id() === $route->created_by,
            'isAdmin' => auth()->check() && auth()->user()->role === 'admin',
        ]);
    }

    /**
     * Show the form for editing the specified route
     */
    public function edit(Route $route): Response|RedirectResponse
    {
        // Only the creator can edit
        if (auth()->id() !== $route->created_by) {
            return redirect()->route('routes.show', $route)
                ->with('error', 'You can only edit routes you created.');
        }

        return Inertia::render('Routes/Edit', [
            'route' => [
                'id' => $route->id,
                'name' => $route->name,
                'description' => $route->description,
                'distance' => $route->distance,
                'difficulty' => $route->difficulty,
                'coordinates' => $route->coordinates,
            ],
        ]);
    }

    /**
     * Update the specified route in storage
     */
    public function update(Request $request, Route $route): RedirectResponse
    {
        // Only the creator can update
        if (auth()->id() !== $route->created_by) {
            return redirect()->route('routes.show', $route)
                ->with('error', 'You can only edit routes you created.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'description' => 'nullable|string',
            'distance' => 'required|numeric|min:0.1|max:999.99',
            'difficulty' => 'required|in:easy,moderate,hard',
            'coordinates' => 'nullable|array',
        ]);

        $route->update($validated);

        return Redirect::route('routes.show', $route)->with('success', 'Route updated successfully!');
    }

    /**
     * Remove the specified route
     */
    public function destroy(Route $route): RedirectResponse
    {
        // Only the creator can delete
        if (auth()->id() !== $route->created_by) {
            abort(403, 'Unauthorized');
        }

        $route->delete();

        return Redirect::route('routes.index')->with('success', 'Route deleted successfully!');
    }

    /**
     * Rate a route
     */
    public function rate(Request $request, Route $route): RedirectResponse
    {
        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:500',
        ]);

        // Check if user already rated this route
        $existingRating = $route->getUserRating(auth()->id());

        if ($existingRating) {
            // Update existing rating
            $existingRating->update($validated);
            $message = 'Rating updated successfully!';
        } else {
            // Create new rating
            RouteRating::create([
                'route_id' => $route->id,
                'user_id' => auth()->id(),
                'rating' => $validated['rating'],
                'comment' => $validated['comment'] ?? null,
            ]);
            $message = 'Rating submitted successfully!';
        }

        return redirect()->route('routes.show', $route)
            ->with('success', $message);
    }

    /**
     * Delete a rating
     */
    public function deleteRating(Route $route, RouteRating $rating): RedirectResponse
    {
        // Only the rating creator can delete it
        if (auth()->id() !== $rating->user_id) {
            return redirect()->route('routes.show', $route)
                ->with('error', 'You can only delete your own ratings.');
        }

        $rating->delete();

        return redirect()->route('routes.show', $route)
            ->with('success', 'Rating deleted successfully!');
    }

    /**
     * Toggle public status of a route (Admin only)
     */
    public function togglePublic(Route $route): RedirectResponse
    {
        // Only admins can toggle public status
        if (auth()->user()->role !== 'admin') {
            abort(403, 'Unauthorized');
        }

        $route->is_public = !$route->is_public;
        $route->save();

        $status = $route->is_public ? 'public' : 'private';
        return back()->with('success', "Route is now {$status}!");
    }
}
