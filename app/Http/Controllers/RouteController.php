<?php

namespace App\Http\Controllers;

use App\Models\Route;
use App\Models\RouteRating;
use Illuminate\Http\Request;
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
     */
    public function index(Request $request): Response
    {
        $query = Route::with(['creator', 'ratings'])
            ->withCount('ratings');

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

        $routes = $query->get()
            ->map(function ($route) {
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
                    'average_rating' => round($route->averageRating(), 1),
                    'ratings_count' => $route->ratings_count,
                ];
            });

        return Inertia::render('Routes/Index', [
            'routes' => $routes,
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
        if (auth()->check()) {
            $userRating = $route->getUserRating(auth()->id());
        }

        return Inertia::render('Routes/Show', [
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
            'canEdit' => auth()->check() && auth()->id() === $route->created_by,
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

        return redirect()->route('routes.show', $route)
            ->with('success', 'Route updated successfully!');
    }

    /**
     * Remove the specified route from storage
     */
    public function destroy(Route $route): RedirectResponse
    {
        // Only the creator can delete
        if (auth()->id() !== $route->created_by) {
            return redirect()->route('routes.show', $route)
                ->with('error', 'You can only delete routes you created.');
        }

        $route->delete();

        return redirect()->route('routes.index')
            ->with('success', 'Route deleted successfully!');
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
}
