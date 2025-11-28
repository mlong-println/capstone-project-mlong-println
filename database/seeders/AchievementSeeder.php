<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AchievementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $achievements = [
            // Distance achievements (in km per month)
            [
                'name' => '50km Warrior',
                'description' => 'Run 50 kilometers in a calendar month',
                'type' => 'distance',
                'target_value' => 50,
                'icon' => 'trophy-bronze',
            ],
            [
                'name' => '100km Champion',
                'description' => 'Run 100 kilometers in a calendar month',
                'type' => 'distance',
                'target_value' => 100,
                'icon' => 'trophy-silver',
            ],
            [
                'name' => '200km Legend',
                'description' => 'Run 200 kilometers in a calendar month',
                'type' => 'distance',
                'target_value' => 200,
                'icon' => 'trophy-gold',
            ],
            [
                'name' => '250km Master',
                'description' => 'Run 250 kilometers in a calendar month',
                'type' => 'distance',
                'target_value' => 250,
                'icon' => 'trophy-platinum',
            ],
            [
                'name' => '300km Elite',
                'description' => 'Run 300 kilometers in a calendar month',
                'type' => 'distance',
                'target_value' => 300,
                'icon' => 'trophy-diamond',
            ],
            
            // Elevation achievements (in meters per month)
            [
                'name' => 'Hill Climber',
                'description' => 'Accumulate 250 meters of elevation gain in a calendar month',
                'type' => 'elevation',
                'target_value' => 250,
                'icon' => 'mountain-bronze',
            ],
            [
                'name' => 'Mountain Goat',
                'description' => 'Accumulate 500 meters of elevation gain in a calendar month',
                'type' => 'elevation',
                'target_value' => 500,
                'icon' => 'mountain-silver',
            ],
            [
                'name' => 'Peak Performer',
                'description' => 'Accumulate 1000 meters of elevation gain in a calendar month',
                'type' => 'elevation',
                'target_value' => 1000,
                'icon' => 'mountain-gold',
            ],
            [
                'name' => 'Summit Seeker',
                'description' => 'Accumulate 2000 meters of elevation gain in a calendar month',
                'type' => 'elevation',
                'target_value' => 2000,
                'icon' => 'mountain-platinum',
            ],
        ];

        foreach ($achievements as $achievement) {
            DB::table('achievements')->insert([
                'name' => $achievement['name'],
                'description' => $achievement['description'],
                'type' => $achievement['type'],
                'target_value' => $achievement['target_value'],
                'icon' => $achievement['icon'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
