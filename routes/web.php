<?php

/**
 * Web Routes Configuration
 * Defines all web routes for RunConnect application
 * Includes role-based routing for runners and trainers
 */

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/**
 * Public landing page
 * Accessible without authentication
 * Shows login/register options
 */
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'auth' => [
            'user' => auth()->user(),  // Pass current user (null if not logged in)
        ],
        'canLogin' => true,
        'canRegister' => true,
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
        // Redirect to role-specific dashboard
        return redirect()->route(
            $user->role === 'runner' ? 'runner.dashboard' : 'trainer.dashboard'
        );
    })->name('dashboard');

    // Runner-specific dashboard
    Route::get('/runner/dashboard', function () {
        return Inertia::render('RunnerDashboard');
    })->middleware('role:runner')->name('runner.dashboard');

    // Trainer-specific dashboard
    Route::get('/trainer/dashboard', function () {
        return Inertia::render('TrainerDashboard');
    })->middleware('role:trainer')->name('trainer.dashboard');

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

// Include Laravel's authentication routes
require __DIR__.'/auth.php';