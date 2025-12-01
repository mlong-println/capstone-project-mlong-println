<?php

/**
 * Web Routes Configuration
 * Defines all web routes for RunConnect application
 * Includes role-based routing for runners and admins
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
            $user->role === 'runner' ? 'runner.dashboard' : 'admin.dashboard'
        );
    })->name('dashboard');

    // Runner-specific dashboard
    // IMPORTANT: Reference middleware by CLASS with parameter, avoids alias resolution issues.
    Route::get('/runner/dashboard', function () {
        $user = auth()->user();
        $user->load('profile');

        // Calculate real stats from runs
        $totalRuns = \App\Models\Run::where('user_id', $user->id)->count();
        $totalDistance = \App\Models\Run::where('user_id', $user->id)
            ->join('routes', 'runs.route_id', '=', 'routes.id')
            ->sum('routes.distance');

        // Calculate this week's distance
        $startOfWeek = \Carbon\Carbon::now()->startOfWeek();
        $weekDistance = \App\Models\Run::where('user_id', $user->id)
            ->where('start_time', '>=', $startOfWeek)
            ->join('routes', 'runs.route_id', '=', 'routes.id')
            ->sum('routes.distance');
        
        return Inertia::render('RunnerDashboard', [
            'auth' => ['user' => $user],
            'user' => $user,
            'profile' => $user->profile,
            'activePlan' => $user->activePlanAssignment(),
            'stats' => [
                'total_runs' => $totalRuns,
                'total_distance' => round($totalDistance, 2),
                'current_weekly_mileage' => round($weekDistance, 2),
            ],
        ]);
    })
        ->middleware(CheckRole::class . ':runner') // use class + parameter
        ->name('runner.dashboard');

    // Admin-specific dashboard
    // IMPORTANT: Reference middleware by CLASS with parameter, avoids alias resolution issues.
    Route::get('/admin/dashboard', [TrainerDashboardController::class, 'index'])
        ->middleware(CheckRole::class . ':admin') // use class + parameter
        ->name('admin.dashboard');

    /**
     * Admin-specific routes
     * For viewing and managing runners and training plans
     */
    Route::middleware(CheckRole::class . ':admin')->prefix('admin')->name('admin.')->group(function () {
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
    
    Route::get('/user/{user}', [App\Http\Controllers\MessageController::class, 'conversation'])
        ->name('messages.conversation');
    
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

/**
 * Route (running routes/maps) routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('routes')->group(function () {
    Route::get('/', [App\Http\Controllers\RouteController::class, 'index'])
        ->name('routes.index');
    
    Route::get('/create', [App\Http\Controllers\RouteController::class, 'create'])
        ->name('routes.create');
    
    Route::post('/', [App\Http\Controllers\RouteController::class, 'store'])
        ->name('routes.store');
    
    Route::get('/{route}', [App\Http\Controllers\RouteController::class, 'show'])
        ->name('routes.show');
    
    Route::get('/{route}/edit', [App\Http\Controllers\RouteController::class, 'edit'])
        ->name('routes.edit');
    
    Route::put('/{route}', [App\Http\Controllers\RouteController::class, 'update'])
        ->name('routes.update');
    
    Route::delete('/{route}', [App\Http\Controllers\RouteController::class, 'destroy'])
        ->name('routes.destroy');
    
    Route::post('/{route}/rate', [App\Http\Controllers\RouteController::class, 'rate'])
        ->name('routes.rate');
    
    Route::delete('/{route}/ratings/{rating}', [App\Http\Controllers\RouteController::class, 'deleteRating'])
        ->name('routes.ratings.destroy');
    
    Route::post('/{route}/toggle-public', [App\Http\Controllers\RouteController::class, 'togglePublic'])
        ->name('routes.toggle-public')
        ->middleware(CheckRole::class . ':admin');
});

/**
 * Run (running logs) routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('runs')->group(function () {
    Route::get('/', [App\Http\Controllers\RunController::class, 'index'])
        ->name('runs.index');
    
    Route::get('/create', [App\Http\Controllers\RunController::class, 'create'])
        ->name('runs.create');
    
    Route::post('/', [App\Http\Controllers\RunController::class, 'store'])
        ->name('runs.store');
    
    Route::get('/stats', [App\Http\Controllers\RunController::class, 'stats'])
        ->name('runs.stats');
    
    Route::get('/{run}', [App\Http\Controllers\RunController::class, 'show'])
        ->name('runs.show');
    
    Route::delete('/{run}', [App\Http\Controllers\RunController::class, 'destroy'])
        ->name('runs.destroy');
});

/**
 * Explore (public routes) routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('explore')->group(function () {
    Route::get('/', [App\Http\Controllers\ExploreController::class, 'index'])
        ->name('explore.index');
    
    Route::get('/{route}', [App\Http\Controllers\ExploreController::class, 'show'])
        ->name('explore.show');
});

/**
 * Achievements routes
 * Protected by authentication middleware
 * Accessible to all authenticated users
 */
Route::middleware(['auth'])->prefix('achievements')->group(function () {
    Route::get('/', [App\Http\Controllers\AchievementController::class, 'index'])
        ->name('achievements.index');
    
    Route::post('/{achievement}/join', [App\Http\Controllers\AchievementController::class, 'join'])
        ->name('achievements.join');
    
    Route::delete('/{achievement}/leave', [App\Http\Controllers\AchievementController::class, 'leave'])
        ->name('achievements.leave');
});

// User Profile Routes
Route::get('/users/{user}', [App\Http\Controllers\UserProfileController::class, 'show'])
    ->name('users.show');

// Activity Routes (social interactions)
Route::middleware('auth')->group(function () {
    Route::get('/activity', [App\Http\Controllers\ActivityController::class, 'index'])
        ->name('activity.index');
    
    Route::get('/activity/pending-count', [App\Http\Controllers\ActivityController::class, 'pendingCount'])
        ->name('activity.pending-count');
    
    Route::post('/activity/mark-all-read', [App\Http\Controllers\ActivityController::class, 'markAllAsRead'])
        ->name('activity.mark-all-read');
});

// Follow/Unfollow Routes
Route::middleware('auth')->group(function () {
    Route::post('/users/{user}/follow', [App\Http\Controllers\FollowController::class, 'follow'])
        ->name('users.follow');
    
    Route::delete('/users/{user}/unfollow', [App\Http\Controllers\FollowController::class, 'unfollow'])
        ->name('users.unfollow');
    
    Route::post('/follows/{follow}/approve', [App\Http\Controllers\FollowController::class, 'approve'])
        ->name('follows.approve');
    
    Route::post('/follows/{follow}/reject', [App\Http\Controllers\FollowController::class, 'reject'])
        ->name('follows.reject');
    
    Route::delete('/follows/{follow}/remove', [App\Http\Controllers\FollowController::class, 'removeFollower'])
        ->name('follows.remove');
    
    Route::get('/follows/pending', [App\Http\Controllers\FollowController::class, 'pendingRequests'])
        ->name('follows.pending');
});

// Include Laravel's authentication routes (login, register, etc.)
require __DIR__.'/auth.php';