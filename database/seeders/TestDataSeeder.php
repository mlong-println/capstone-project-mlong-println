<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Services\DatabaseService;

/**
 * TestDataSeeder - Adds ratings to existing routes
 * Preserves existing routes and runs data
 * Links ratings to runner and route IDs
 */
class TestDataSeeder extends Seeder
{
    public function run()
    {
        // Initialize database service
        $db = app(DatabaseService::class);

        // Get existing runner ID for linking ratings
        $runner = $db->fetch("SELECT id FROM users WHERE email = ?", ['runner@test.com']);
        
        // Skip if no runner found
        if (!$runner) {
            $this->command->warn('No runner@test.com user found. Skipping route ratings.');
            return;
        }
        
        // Get existing routes in difficulty order
        // This ensures we rate easy->moderate->hard in order
        $routes = $db->fetchAll("SELECT id, difficulty FROM routes ORDER BY difficulty");
        
        // Skip if no routes exist
        if (count($routes) < 3) {
            $this->command->warn('Not enough routes found. Skipping route ratings.');
            return;
        }
        
        // SQL for creating all three ratings at once
        // Uses single query for better performance
        $sql = "INSERT INTO route_ratings (route_id, user_id, rating, comment, created_at) VALUES 
            (?, ?, ?, ?, NOW()),  -- Easy route rating
            (?, ?, ?, ?, NOW()),  -- Moderate route rating
            (?, ?, ?, ?, NOW())"; // Hard route rating
        
        // Add ratings with detailed feedback
        $db->executeQuery($sql, [
            // 5-star rating for easy route
            $routes[0]['id'],          // route_id (easy)
            $runner['id'],             // user_id
            5,                         // rating
            'Perfect for beginners, well-marked path',

            // 3-star rating for moderate route
            $routes[1]['id'],          // route_id (moderate)
            $runner['id'],             // user_id
            3,                         // rating
            'Good challenge, but some unclear markers',

            // 4-star rating for hard route
            $routes[2]['id'],          // route_id (hard)
            $runner['id'],             // user_id
            4,                         // rating
            'Great training route, tough but rewarding'
        ]);
        
        $this->command->info('Route ratings added successfully!');
    }
}