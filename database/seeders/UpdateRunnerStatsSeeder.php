<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Profile;

/**
 * UpdateRunnerStatsSeeder
 * Updates existing runner profiles with realistic stats
 */
class UpdateRunnerStatsSeeder extends Seeder
{
    public function run(): void
    {
        // Update Sarah (Beginner)
        $sarah = User::where('email', 'sarah@example.com')->first();
        if ($sarah && $sarah->profile) {
            $sarah->profile->update([
                'current_weekly_distance' => '5-10',
                'total_runs' => 3,
                'total_distance' => 12,
                'pr_5k_minutes' => null,
                'pr_10k_minutes' => null,
                'pr_half_marathon_minutes' => null,
                'pr_full_marathon_minutes' => null,
            ]);
            $this->command->info('Updated Sarah\'s profile');
        }

        // Update Mike (Intermediate)
        $mike = User::where('email', 'mike@example.com')->first();
        if ($mike && $mike->profile) {
            $mike->profile->update([
                'current_weekly_distance' => '30-40',
                'total_runs' => 85,
                'total_distance' => 520,
                'pr_5k_minutes' => 24.5,
                'pr_10k_minutes' => 52.0,
                'pr_half_marathon_minutes' => 125.0,
                'pr_full_marathon_minutes' => null,
            ]);
            $this->command->info('Updated Mike\'s profile');
        }

        // Update Emily (Advanced)
        $emily = User::where('email', 'emily@example.com')->first();
        if ($emily && $emily->profile) {
            $emily->profile->update([
                'current_weekly_distance' => '60-70',
                'total_runs' => 240,
                'total_distance' => 2850,
                'pr_5k_minutes' => 20.5,
                'pr_10k_minutes' => 43.0,
                'pr_half_marathon_minutes' => 95.0,
                'pr_full_marathon_minutes' => 205.0,
            ]);
            $this->command->info('Updated Emily\'s profile');
        }

        $this->command->info('Runner stats updated successfully!');
    }
}
