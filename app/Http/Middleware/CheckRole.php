<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * CheckRole Middleware
 * Verifies that authenticated users can only access routes matching their role
 */
class CheckRole
{
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

        // Get user's role using Eloquent
        $userRole = $request->user()->role;

        // If role doesn't match, return 403 forbidden
        if ($userRole !== $role) {
            abort(403, 'Unauthorized access. You do not have permission to access this resource.');
        }

        // Role matches, continue to next middleware/handler
        return $next($request);
    }
}