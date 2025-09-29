<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\DatabaseService;

/**
 * CheckRole Middleware
 * Verifies that authenticated users can only access routes matching their role
 * Uses raw SQL through DatabaseService for role verification
 */
class CheckRole
{
    /** @var DatabaseService */
    protected $db;

    /**
     * Initialize middleware with DatabaseService for raw SQL queries
     */
    public function __construct(DatabaseService $db)
    {
        $this->db = $db;
    }

    /**
     * Handle an incoming request.
     * Verifies user role matches required role for route
     * Redirects to appropriate dashboard if role doesn't match
     *
     * @param Request $request Current HTTP request
     * @param Closure $next Next middleware/handler in pipeline
     * @param string $role Required role for this route
     * @return mixed
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return redirect()->route('login');
        }

        // Get user's role from database using raw SQL
        $user = $this->db->fetch(
            "SELECT role FROM users WHERE id = ?",
            [$request->user()->id]  // Get ID from authenticated user
        );

        // If role doesn't match, redirect to appropriate dashboard
        if ($user['role'] !== $role) {
            // Determine redirect based on user's actual role
            return redirect()->route(
                $user['role'] === 'runner' 
                    ? 'runner.dashboard'   // Redirect runners to runner dashboard
                    : 'trainer.dashboard'  // Redirect trainers to trainer dashboard
            );
        }

        // Role matches, continue to next middleware/handler
        return $next($request);
    }
}