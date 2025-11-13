<?php

/**
 * Web Routes Configuration
 * Defines all web routes for RunConnect application
 * Includes role-based routing for runners and trainers
 */

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TrainerDashboardController;
use App\Http\Controllers\RunnerProfileController;
use App\Http\Controllers\RunnerPlanController;
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
        $user = auth()->user();
        $user->load('profile');
        
        return Inertia::render('RunnerDashboard', [
            'auth' => ['user' => $user],
            'user' => $user,
            'profile' => $user->profile,
            'activePlan' => $user->activePlanAssignment(),
            'stats' => [
                'total_runs' => $user->profile->total_runs ?? 0,
                'total_distance' => $user->profile->total_distance ?? 0,
                'current_weekly_mileage' => $user->profile->current_weekly_mileage ?? 0,
            ],
        ]);
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
     * Runner-specific routes
     * For profile management and training plan selection
     */
    Route::middleware(CheckRole::class . ':runner')->prefix('runner')->name('runner.')->group(function () {
        // Profile management
        Route::get('/profile/edit', [RunnerProfileController::class, 'edit'])
            ->name('profile.edit');
        Route::post('/profile', [RunnerProfileController::class, 'update'])
            ->name('profile.store');
        Route::patch('/profile', [RunnerProfileController::class, 'update'])
            ->name('profile.update');
        Route::put('/profile/{id}', [RunnerProfileController::class, 'update'])
            ->name('profile.update.id');
        Route::get('/profile', [RunnerProfileController::class, 'show'])
            ->name('profile.show');
        
        // Training plan browsing and selection
        Route::get('/plans', [RunnerPlanController::class, 'index'])
            ->name('plans.index');
        Route::get('/plans/{plan}', [RunnerPlanController::class, 'show'])
            ->name('plans.show');
        Route::post('/plans/{plan}/assign', [RunnerPlanController::class, 'assign'])
            ->name('plans.assign');
        
        // Active plan management
        Route::get('/my-plan', [RunnerPlanController::class, 'viewActive'])
            ->name('plans.active');
        Route::post('/my-plan/{assignment}/complete-workout', [RunnerPlanController::class, 'completeWorkout'])
            ->name('plans.complete-workout');
        Route::post('/my-plan/{assignment}/pause', [RunnerPlanController::class, 'pause'])
            ->name('plans.pause');
        Route::post('/my-plan/{assignment}/resume', [RunnerPlanController::class, 'resume'])
            ->name('plans.resume');
        Route::post('/my-plan/{assignment}/abandon', [RunnerPlanController::class, 'abandon'])
            ->name('plans.abandon');
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

/**
 * Notification routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('notifications')->group(function () {
    Route::get('/', [App\Http\Controllers\NotificationController::class, 'index'])
        ->name('notifications.index');
    
    Route::get('/unread-count', [App\Http\Controllers\NotificationController::class, 'unreadCount'])
        ->name('notifications.unread-count');
    
    Route::post('/{notification}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])
        ->name('notifications.read');
    
    Route::post('/mark-all-read', [App\Http\Controllers\NotificationController::class, 'markAllAsRead'])
        ->name('notifications.mark-all-read');
    
    Route::delete('/{notification}', [App\Http\Controllers\NotificationController::class, 'destroy'])
        ->name('notifications.destroy');
    
    Route::delete('/read/all', [App\Http\Controllers\NotificationController::class, 'deleteAllRead'])
        ->name('notifications.delete-all-read');
});

/**
 * Message routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('messages')->group(function () {
    Route::get('/inbox', [App\Http\Controllers\MessageController::class, 'inbox'])
        ->name('messages.inbox');
    
    Route::get('/sent', [App\Http\Controllers\MessageController::class, 'sent'])
        ->name('messages.sent');
    
    Route::get('/create', [App\Http\Controllers\MessageController::class, 'create'])
        ->name('messages.create');
    
    Route::post('/', [App\Http\Controllers\MessageController::class, 'store'])
        ->name('messages.store');
    
    Route::get('/{message}', [App\Http\Controllers\MessageController::class, 'show'])
        ->name('messages.show');
    
    Route::delete('/{message}', [App\Http\Controllers\MessageController::class, 'destroy'])
        ->name('messages.destroy');
    
    Route::get('/unread/count', [App\Http\Controllers\MessageController::class, 'unreadCount'])
        ->name('messages.unread-count');
    
    Route::post('/{message}/read', [App\Http\Controllers\MessageController::class, 'markAsRead'])
        ->name('messages.read');
    
    Route::post('/mark-all-read', [App\Http\Controllers\MessageController::class, 'markAllAsRead'])
        ->name('messages.mark-all-read');
});

/**
 * Event routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('events')->group(function () {
    Route::get('/', [App\Http\Controllers\EventController::class, 'index'])
        ->name('events.index');
    
    Route::get('/create', [App\Http\Controllers\EventController::class, 'create'])
        ->name('events.create');
    
    Route::post('/', [App\Http\Controllers\EventController::class, 'store'])
        ->name('events.store');
    
    Route::get('/{event}', [App\Http\Controllers\EventController::class, 'show'])
        ->name('events.show');
    
    Route::get('/{event}/edit', [App\Http\Controllers\EventController::class, 'edit'])
        ->name('events.edit');
    
    Route::put('/{event}', [App\Http\Controllers\EventController::class, 'update'])
        ->name('events.update');
    
    Route::post('/{event}/cancel', [App\Http\Controllers\EventController::class, 'cancel'])
        ->name('events.cancel');
    
    Route::post('/{event}/join', [App\Http\Controllers\EventController::class, 'join'])
        ->name('events.join');
    
    Route::post('/{event}/leave', [App\Http\Controllers\EventController::class, 'leave'])
        ->name('events.leave');
});

/**
 * Forum routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('forum')->group(function () {
    Route::get('/', [App\Http\Controllers\ForumController::class, 'index'])
        ->name('forum.index');
    
    Route::get('/create', [App\Http\Controllers\ForumController::class, 'create'])
        ->name('forum.create');
    
    Route::post('/', [App\Http\Controllers\ForumController::class, 'store'])
        ->name('forum.store');
    
    Route::get('/{post}', [App\Http\Controllers\ForumController::class, 'show'])
        ->name('forum.show');
    
    Route::get('/{post}/edit', [App\Http\Controllers\ForumController::class, 'edit'])
        ->name('forum.edit');
    
    Route::put('/{post}', [App\Http\Controllers\ForumController::class, 'update'])
        ->name('forum.update');
    
    Route::delete('/{post}', [App\Http\Controllers\ForumController::class, 'destroy'])
        ->name('forum.destroy');
    
    Route::post('/{post}/comments', [App\Http\Controllers\ForumController::class, 'storeComment'])
        ->name('forum.comments.store');
    
    Route::delete('/comments/{comment}', [App\Http\Controllers\ForumController::class, 'destroyComment'])
        ->name('forum.comments.destroy');
    
    Route::post('/{post}/like', [App\Http\Controllers\ForumController::class, 'toggleLike'])
        ->name('forum.like');
    
    Route::post('/comments/{comment}/like', [App\Http\Controllers\ForumController::class, 'toggleCommentLike'])
        ->name('forum.comments.like');
});

// Include Laravel's authentication routes (login, register, etc.)
require __DIR__.'/auth.php';