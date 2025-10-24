<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\TrainingPlan;

/**
 * TrainingPlanSeeder
 * Seeds the database with sample training plan templates
 * Creates plans for various distances and experience levels
 */
class TrainingPlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get the trainer (Michael Long)
        $trainer = User::where('email', 'michael.long@runconnect.com')->first();
        
        if (!$trainer) {
            $this->command->error('Trainer account not found. Run TrainerSeeder first.');
            return;
        }

        // Sample training plans
        $plans = [
            // 5K Plans
            [
                'name' => 'Beginner 5K - 8 Weeks',
                'description' => 'Perfect for first-time runners or those returning after a break. Focuses on building endurance gradually with a mix of walking and running.',
                'distance_type' => '5k',
                'experience_level' => 'beginner',
                'duration_weeks' => 8,
                'weekly_mileage_peak' => 15,
                'prerequisites' => 'Ability to walk continuously for 30 minutes',
                'goals' => 'Complete a 5K race comfortably',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => $this->getBeginner5kStructure(),
            ],
            [
                'name' => 'Intermediate 5K - 6 Weeks',
                'description' => 'For runners who can already complete a 5K. Focuses on improving speed and endurance with tempo runs and intervals.',
                'distance_type' => '5k',
                'experience_level' => 'intermediate',
                'duration_weeks' => 6,
                'weekly_mileage_peak' => 25,
                'prerequisites' => 'Ability to run 5K continuously',
                'goals' => 'Improve 5K time by 2-3 minutes',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null, // Will add detailed structure later
            ],
            [
                'name' => 'Advanced 5K - 6 Weeks',
                'description' => 'High-intensity plan for experienced runners targeting a PR. Includes speed work, hill training, and race-pace runs.',
                'distance_type' => '5k',
                'experience_level' => 'advanced',
                'duration_weeks' => 6,
                'weekly_mileage_peak' => 35,
                'prerequisites' => 'Consistent running base of 20+ miles per week',
                'goals' => 'Achieve a personal record in 5K',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            
            // 10K Plans
            [
                'name' => 'Beginner 10K - 10 Weeks',
                'description' => 'Build up to your first 10K with gradual mileage increases and rest days for recovery.',
                'distance_type' => '10k',
                'experience_level' => 'beginner',
                'duration_weeks' => 10,
                'weekly_mileage_peak' => 25,
                'prerequisites' => 'Ability to run 5K continuously',
                'goals' => 'Complete a 10K race',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Intermediate 10K - 8 Weeks',
                'description' => 'Improve your 10K time with structured speed work and tempo runs.',
                'distance_type' => '10k',
                'experience_level' => 'intermediate',
                'duration_weeks' => 8,
                'weekly_mileage_peak' => 35,
                'prerequisites' => 'Ability to run 10K continuously',
                'goals' => 'Improve 10K time and build endurance',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Advanced 10K - 8 Weeks',
                'description' => 'Peak performance plan with high-intensity intervals and race-specific workouts.',
                'distance_type' => '10k',
                'experience_level' => 'advanced',
                'duration_weeks' => 8,
                'weekly_mileage_peak' => 45,
                'prerequisites' => 'Consistent running base of 30+ miles per week',
                'goals' => 'Achieve a personal record in 10K',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            
            // Half Marathon Plans
            [
                'name' => 'Beginner Half Marathon - 12 Weeks',
                'description' => 'Complete your first half marathon with a safe, gradual build-up in mileage.',
                'distance_type' => 'half_marathon',
                'experience_level' => 'beginner',
                'duration_weeks' => 12,
                'weekly_mileage_peak' => 35,
                'prerequisites' => 'Ability to run 10K continuously',
                'goals' => 'Complete a half marathon',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Intermediate Half Marathon - 12 Weeks',
                'description' => 'Improve your half marathon time with tempo runs, long runs, and recovery weeks.',
                'distance_type' => 'half_marathon',
                'experience_level' => 'intermediate',
                'duration_weeks' => 12,
                'weekly_mileage_peak' => 45,
                'prerequisites' => 'Ability to run half marathon distance',
                'goals' => 'Improve half marathon time',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Advanced Half Marathon - 12 Weeks',
                'description' => 'High-volume training with speed work and race-pace runs for a PR.',
                'distance_type' => 'half_marathon',
                'experience_level' => 'advanced',
                'duration_weeks' => 12,
                'weekly_mileage_peak' => 55,
                'prerequisites' => 'Consistent running base of 35+ miles per week',
                'goals' => 'Achieve a personal record in half marathon',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            
            // Full Marathon Plans
            [
                'name' => 'Beginner Full Marathon - 16 Weeks',
                'description' => 'Complete your first marathon with a structured plan emphasizing endurance and injury prevention.',
                'distance_type' => 'full_marathon',
                'experience_level' => 'beginner',
                'duration_weeks' => 16,
                'weekly_mileage_peak' => 45,
                'prerequisites' => 'Ability to run half marathon distance',
                'goals' => 'Complete a full marathon',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Intermediate Full Marathon - 16 Weeks',
                'description' => 'Improve your marathon time with structured long runs and tempo work.',
                'distance_type' => 'full_marathon',
                'experience_level' => 'intermediate',
                'duration_weeks' => 16,
                'weekly_mileage_peak' => 55,
                'prerequisites' => 'Completed at least one marathon',
                'goals' => 'Improve marathon time',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            [
                'name' => 'Advanced Full Marathon - 18 Weeks',
                'description' => 'High-volume training plan for experienced marathoners targeting a PR or Boston Qualifier.',
                'distance_type' => 'full_marathon',
                'experience_level' => 'advanced',
                'duration_weeks' => 18,
                'weekly_mileage_peak' => 70,
                'prerequisites' => 'Consistent running base of 45+ miles per week',
                'goals' => 'Achieve a personal record or Boston Qualifier',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
            
            // Ultra Marathon Plan
            [
                'name' => 'Ultra Marathon (50K+) - 20 Weeks',
                'description' => 'Comprehensive ultra training plan focusing on endurance, back-to-back long runs, and mental preparation.',
                'distance_type' => 'ultra',
                'experience_level' => null, // Ultra assumes advanced
                'duration_weeks' => 20,
                'weekly_mileage_peak' => 80,
                'prerequisites' => 'Completed at least one full marathon, consistent 50+ mile weeks',
                'goals' => 'Complete an ultra marathon (50K or longer)',
                'is_template' => true,
                'is_public' => true,
                'created_by' => $trainer->id,
                'weekly_structure' => null,
            ],
        ];

        // Create all plans
        foreach ($plans as $planData) {
            TrainingPlan::create($planData);
        }

        $this->command->info('Training plans seeded successfully!');
        $this->command->info('Created ' . count($plans) . ' training plan templates.');
    }

    /**
     * Sample weekly structure for Beginner 5K plan
     * This is a detailed example - others can be added later
     */
    private function getBeginner5kStructure(): array
    {
        return [
            'week_1' => [
                ['day' => 'Monday', 'workout' => 'Rest'],
                ['day' => 'Tuesday', 'workout' => 'Walk 5 min, Run 1 min / Walk 2 min (repeat 5x), Walk 5 min'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Walk 5 min, Run 1 min / Walk 2 min (repeat 5x), Walk 5 min'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Walk 5 min, Run 2 min / Walk 2 min (repeat 4x), Walk 5 min'],
                ['day' => 'Sunday', 'workout' => 'Rest or easy walk 20 min'],
            ],
            'week_2' => [
                ['day' => 'Monday', 'workout' => 'Rest'],
                ['day' => 'Tuesday', 'workout' => 'Walk 5 min, Run 2 min / Walk 2 min (repeat 5x), Walk 5 min'],
                ['day' => 'Wednesday', 'workout' => 'Rest or cross-training'],
                ['day' => 'Thursday', 'workout' => 'Walk 5 min, Run 2 min / Walk 2 min (repeat 5x), Walk 5 min'],
                ['day' => 'Friday', 'workout' => 'Rest'],
                ['day' => 'Saturday', 'workout' => 'Walk 5 min, Run 3 min / Walk 2 min (repeat 4x), Walk 5 min'],
                ['day' => 'Sunday', 'workout' => 'Rest or easy walk 25 min'],
            ],
            // Weeks 3-8 would continue with progressive increases
            // For now, this demonstrates the structure
        ];
    }
}