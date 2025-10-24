<?php

/**
 * Web Routes Configuration
 * Defines all web routes for RunConnect application
 * Includes role-based routing for runners and trainers
 */

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrainerDashboardController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Add the role middleware class import so I can reference it directly (Laravel 12 friendly)
use App\Http\Middleware\CheckRole;

/**
 * Public landing page
 * Accessible without authentication
 * Shows login/register options
 */
Route::get('/', function () {
    return Inertia::render('Welcome', [
        // Pass current user (null if not logged in)
        'auth' => [
            'user' => auth()->user(),
        ],
        // Flags (kept true during debugging to ensure visibility)
        'canLogin' => true,
        'canRegister' => true,
        // Version info (optional use on the page)
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

/**
 * Role-based dashboard routes
 * Protected by authentication middleware
 * Redirects to appropriate dashboard based on user role
 */
Route::middleware(['auth'])->group(function () {
    // Main dashboard - redirects based on role
    Route::get('/dashboard', function () {
        $user = auth()->user();

        // Safety: if somehow no user, send to login
        if (!$user) {
            return redirect()->route('login');
        }

        // Redirect to role-specific dashboard
        return redirect()->route(
            $user->role === 'runner' ? 'runner.dashboard' : 'trainer.dashboard'
        );
    })->name('dashboard');

    // Runner-specific dashboard
    // IMPORTANT: Reference middleware by CLASS with parameter, avoids alias resolution issues.
    Route::get('/runner/dashboard', function () {
        return Inertia::render('RunnerDashboard');
    })
        ->middleware(CheckRole::class . ':runner') // use class + parameter
        ->name('runner.dashboard');

    // Trainer-specific dashboard
    // IMPORTANT: Reference middleware by CLASS with parameter, avoids alias resolution issues.
    Route::get('/trainer/dashboard', [TrainerDashboardController::class, 'index'])
        ->middleware(CheckRole::class . ':trainer') // use class + parameter
        ->name('trainer.dashboard');

    /**
     * Trainer-specific routes
     * For viewing and managing runners and training plans
     */
    Route::middleware(CheckRole::class . ':trainer')->prefix('trainer')->name('trainer.')->group(function () {
        // View all runners
        Route::get('/runners', [TrainerDashboardController::class, 'viewRunners'])
            ->name('runners');
        
        // View specific runner detail
        Route::get('/runners/{runner}', [TrainerDashboardController::class, 'viewRunner'])
            ->name('runners.show');
        
        // View all training plans
        Route::get('/plans', [TrainerDashboardController::class, 'viewPlans'])
            ->name('plans');
        
        // View specific plan detail
        Route::get('/plans/{plan}', [TrainerDashboardController::class, 'viewPlan'])
            ->name('plans.show');
    });

    /**
     * User profile management routes
     * Available to both runners and trainers
     * Handles profile viewing, updating, and deletion
     */
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

// Include Laravel's authentication routes (login, register, etc.)
require __DIR__.'/auth.php';