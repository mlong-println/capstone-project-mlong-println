<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Achievement;
use App\Models\UserChallengeEnrollment;
use App\Services\AchievementService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
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
     * Display all available challenges and user's enrolled challenges
     */
    public function index(): Response
    {
        $user = auth()->user();
        $currentYear = now()->year;
        $currentMonth = now()->month;
        
        // Get all challenges
        $allChallenges = Achievement::all();
        
        // Get user's enrolled challenges for current month
        $enrolledChallengeIds = UserChallengeEnrollment::where('user_id', $user->id)
            ->where('year', $currentYear)
            ->where('month', $currentMonth)
            ->pluck('achievement_id')
            ->toArray();
        
        // Get progress for enrolled challenges
        $progress = $this->achievementService->getUserProgress($user);
        
        // Get leaderboard for each enrolled challenge
        $leaderboards = [];
        foreach ($enrolledChallengeIds as $challengeId) {
            $leaderboards[$challengeId] = $this->achievementService->getChallengeLeaderboard($challengeId, $currentYear, $currentMonth);
        }
        
        // Get earned achievements (trophy case)
        $earnedAchievements = $this->achievementService->getUserAchievements($user);
        
        return Inertia::render('Achievements/Index', [
            'challenges' => $allChallenges,
            'enrolledChallengeIds' => $enrolledChallengeIds,
            'progress' => $progress,
            'leaderboards' => $leaderboards,
            'earnedAchievements' => $earnedAchievements,
        ]);
    }

    /**
     * Join a challenge
     */
    public function join(Request $request, Achievement $achievement)
    {
        $user = auth()->user();
        $currentYear = now()->year;
        $currentMonth = now()->month;

        UserChallengeEnrollment::firstOrCreate([
            'user_id' => $user->id,
            'achievement_id' => $achievement->id,
            'year' => $currentYear,
            'month' => $currentMonth,
        ]);

        return Redirect::back()->with('success', "You've joined the {$achievement->name} challenge!");
    }

    /**
     * Leave a challenge
     */
    public function leave(Request $request, Achievement $achievement)
    {
        $user = auth()->user();
        $currentYear = now()->year;
        $currentMonth = now()->month;

        UserChallengeEnrollment::where('user_id', $user->id)
            ->where('achievement_id', $achievement->id)
            ->where('year', $currentYear)
            ->where('month', $currentMonth)
            ->delete();

        return Redirect::back()->with('success', "You've left the {$achievement->name} challenge.");
    }
}
