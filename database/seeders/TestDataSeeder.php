<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\DatabaseService;

/**
 * TestDataSeeder - Creates sample routes for development
 * Uses raw SQL through DatabaseService for all operations
 */
class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Get database service instance for raw SQL operations
        $db = app(DatabaseService::class);

        // Retrieve trainer's ID for creating routes
        // Routes must be linked to a valid trainer
        $trainer = $db->fetch("SELECT id FROM users WHERE email = ?", ['trainer@test.com']);
        
        // SQL for creating sample routes with varying difficulties
        // Each route is linked to the trainer via foreign key
        $sql = "INSERT INTO routes (name, description, distance, difficulty, created_by) VALUES 
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?),
            (?, ?, ?, ?, ?)";
        
        // Execute query with route data
        // Distance is in kilometers, difficulty is enum value
        $db->executeQuery($sql, [
            // Beginner-friendly route
            'Beginner Park Loop',      // name
            'Easy loop around the central park, perfect for beginners', // description
            2.5,                       // distance in km
            'easy',                    // difficulty
            $trainer['id'],           // created_by (trainer)

            // Intermediate route
            'Hill Challenge',          // name
            'Moderate route with some elevation changes', // description
            5.0,                       // distance in km
            'moderate',                // difficulty
            $trainer['id'],           // created_by (trainer)

            // Advanced route
            'Marathon Training',       // name
            'Long distance route for advanced runners', // description
            10.0,                      // distance in km
            'hard',                    // difficulty
            $trainer['id']            // created_by (trainer)
        ]);
    }
}