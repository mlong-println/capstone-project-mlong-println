<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

/**
 * DatabaseSeeder
 * Main seeder that calls all other seeders in the correct order
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            TrainerSeeder::class,        // Create trainer account first
            TrainingPlanSeeder::class,   // Then create training plan templates
            TestRunnerSeeder::class,     // Create test runner accounts
            TestDataSeeder::class,       // Existing test data
            AchievementSeeder::class,    // Seed achievements
        ]);
    }
}