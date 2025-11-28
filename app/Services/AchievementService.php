<?php

namespace App\Services;

use App\Models\Achievement;
use App\Models\User;
use App\Models\UserAchievement;
use App\Models\Run;
use App\Models\Notification;
use Carbon\Carbon;

class AchievementService
{
    /**
     * Check and award achievements for a user after logging a run
     */
    public function checkAchievements(User $user, Run $run): array
    {
        $newAchievements = [];
        
        // Get the month and year of the run
        $runDate = Carbon::parse($run->start_time);
        $year = $runDate->year;
        $month = $runDate->month;
        
        // Check distance achievements
        $newAchievements = array_merge(
            $newAchievements,
            $this->checkDistanceAchievements($user, $year, $month)
        );
        
        // Check elevation achievements (if we add elevation to routes later)
        // $newAchievements = array_merge(
        //     $newAchievements,
        //     $this->checkElevationAchievements($user, $year, $month)
        // );
        
        return $newAchievements;
    }
    
    /**
     * Check distance achievements for a specific month
     */
    protected function checkDistanceAchievements(User $user, int $year, int $month): array
    {
        $newAchievements = [];
        
        // Calculate total distance for the month
        $totalDistance = Run::where('user_id', $user->id)
            ->whereYear('start_time', $year)
            ->whereMonth('start_time', $month)
            ->join('routes', 'runs.route_id', '=', 'routes.id')
            ->sum('routes.distance');
        
        // Get all distance achievements
        $achievements = Achievement::where('type', 'distance')
            ->orderBy('target_value', 'asc')
            ->get();
        
        foreach ($achievements as $achievement) {
            // Check if user has reached the target
            if ($totalDistance >= $achievement->target_value) {
                // Check if user already has this achievement for this month
                $exists = UserAchievement::where('user_id', $user->id)
                    ->where('achievement_id', $achievement->id)
                    ->where('year', $year)
                    ->where('month', $month)
                    ->exists();
                
                if (!$exists) {
                    // Award the achievement
                    $userAchievement = UserAchievement::create([
                        'user_id' => $user->id,
                        'achievement_id' => $achievement->id,
                        'year' => $year,
                        'month' => $month,
                        'value_achieved' => $totalDistance,
                        'achieved_at' => now(),
                    ]);
                    
                    // Create notification
                    Notification::create([
                        'user_id' => $user->id,
                        'type' => 'achievement',
                        'title' => 'Achievement Unlocked! 🏆',
                        'message' => "Congratulations! You've earned the '{$achievement->name}' achievement!",
                        'data' => json_encode([
                            'achievement_id' => $achievement->id,
                            'achievement_name' => $achievement->name,
                            'value_achieved' => $totalDistance,
                        ]),
                        'is_read' => false,
                    ]);
                    
                    $newAchievements[] = $achievement;
                }
            }
        }
        
        return $newAchievements;
    }
    
    /**
     * Get user's progress towards all achievements for current month
     */
    public function getUserProgress(User $user): array
    {
        $now = Carbon::now();
        $year = $now->year;
        $month = $now->month;
        
        // Calculate current month's distance
        $currentDistance = Run::where('user_id', $user->id)
            ->whereYear('start_time', $year)
            ->whereMonth('start_time', $month)
            ->join('routes', 'runs.route_id', '=', 'routes.id')
            ->sum('routes.distance');
        
        // Get all achievements with progress
        $achievements = Achievement::all()->map(function($achievement) use ($user, $year, $month, $currentDistance) {
            $isEarned = UserAchievement::where('user_id', $user->id)
                ->where('achievement_id', $achievement->id)
                ->where('year', $year)
                ->where('month', $month)
                ->exists();
            
            $currentValue = $achievement->type === 'distance' ? $currentDistance : 0;
            $progress = min(100, ($currentValue / $achievement->target_value) * 100);
            
            return [
                'id' => $achievement->id,
                'name' => $achievement->name,
                'description' => $achievement->description,
                'type' => $achievement->type,
                'target_value' => $achievement->target_value,
                'current_value' => round($currentValue, 2),
                'progress' => round($progress, 1),
                'icon' => $achievement->icon,
                'is_earned' => $isEarned,
            ];
        });
        
        return $achievements->toArray();
    }
    
    /**
     * Get all achievements earned by a user
     */
    public function getUserAchievements(User $user): array
    {
        return UserAchievement::where('user_id', $user->id)
            ->with('achievement')
            ->orderBy('achieved_at', 'desc')
            ->get()
            ->map(function($userAchievement) {
                return [
                    'id' => $userAchievement->id,
                    'achievement' => [
                        'id' => $userAchievement->achievement->id,
                        'name' => $userAchievement->achievement->name,
                        'description' => $userAchievement->achievement->description,
                        'icon' => $userAchievement->achievement->icon,
                    ],
                    'year' => $userAchievement->year,
                    'month' => $userAchievement->month,
                    'value_achieved' => $userAchievement->value_achieved,
                    'achieved_at' => $userAchievement->achieved_at->format('M d, Y'),
                ];
            })
            ->toArray();
    }
}
