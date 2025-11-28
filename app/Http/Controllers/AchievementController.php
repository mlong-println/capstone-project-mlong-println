<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\AchievementService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AchievementController extends Controller
{
    protected $achievementService;

    public function __construct(AchievementService $achievementService)
    {
        $this->achievementService = $achievementService;
    }

    /**
     * Display user's achievements and progress
     */
    public function index(): Response
    {
        $user = auth()->user();
        
        // Get current month progress
        $progress = $this->achievementService->getUserProgress($user);
        
        // Get earned achievements
        $earnedAchievements = $this->achievementService->getUserAchievements($user);
        
        return Inertia::render('Achievements/Index', [
            'progress' => $progress,
            'earnedAchievements' => $earnedAchievements,
        ]);
    }
}
