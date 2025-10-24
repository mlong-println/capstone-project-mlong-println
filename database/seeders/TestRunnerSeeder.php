<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;
use Illuminate\Support\Facades\Hash;

/**
 * TestRunnerSeeder
 * Creates test runner accounts with profiles for development and testing
 * All runners are based in Hamilton, ON, Canada area
 */
class TestRunnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $runners = [
            [
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'experience_level' => 'beginner',
                'current_goal' => 'Complete my first 5K',
                'bio' => 'New to running, excited to start my fitness journey!',
                'location' => 'Hamilton, ON',
            ],
            [
                'name' => 'Mike Chen',
                'email' => 'mike@example.com',
                'experience_level' => 'intermediate',
                'current_goal' => 'Run a sub-2 hour half marathon',
                'bio' => 'Been running for 2 years, looking to improve my times.',
                'location' => 'Dundas, ON',
            ],
            [
                'name' => 'Emily Rodriguez',
                'email' => 'emily@example.com',
                'experience_level' => 'advanced',
                'current_goal' => 'Boston Marathon qualifier',
                'bio' => 'Experienced marathoner aiming for a BQ.',
                'location' => 'Ancaster, ON',
            ],
        ];

        foreach ($runners as $runnerData) {
            // Create user account
            $user = User::create([
                'name' => $runnerData['name'],
                'email' => $runnerData['email'],
                'password' => Hash::make('password'),
                'role' => 'runner',
                'email_verified_at' => now(),
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'bio' => $runnerData['bio'],
                'experience_level' => $runnerData['experience_level'],
                'current_goal' => $runnerData['current_goal'],
                'location' => $runnerData['location'],
                'current_weekly_mileage' => rand(10, 40),
                'total_runs' => rand(0, 50),
                'total_distance' => rand(0, 500),
                'profile_public' => true,
                'show_stats' => true,
            ]);
        }

        $this->command->info('Test runners created successfully!');
        $this->command->info('All test runners have password: password');
        $this->command->info('All runners based in Hamilton, ON area');
    }
}