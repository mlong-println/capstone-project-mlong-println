<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * HandleInertiaRequests Middleware
 * Manages server-side setup for Inertia.js integration
 * Handles asset versioning and shared data props
 */
class HandleInertiaRequests extends Middleware
{
    /**
     * Root template loaded on first page visit
     * This template contains the app-level HTML structure
     * 
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version
     * Used for cache-busting when assets change
     * 
     * @param Request $request Current HTTP request
     * @return string|null Version identifier
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define props shared across all pages
     * Includes authentication state and user data
     * Available in all Inertia components
     * 
     * @param Request $request Current HTTP request
     * @return array<string, mixed> Shared data props
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),  // Current authenticated user
            ],
            'canLogin' => true,
            'canRegister' => true,
        ];
    }
}