<?php

use Illuminate\Database\Migrations\Migration;
use App\Services\DatabaseService;

/**
 * Migration for creating the route_ratings table
 * Stores user feedback and ratings for running routes
 * Links users' ratings to specific routes
 */
class CreateRouteRatingsTable extends Migration
{
    /**
     * Run the migrations - creates route_ratings table
     * Uses raw SQL through DatabaseService
     */
    public function up()
    {
        $db = app(DatabaseService::class);
        
        // SQL to create route_ratings table with required fields
        // Includes foreign keys to both users and routes tables
        $sql = "CREATE TABLE route_ratings (
            -- Primary identifier for ratings
            id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            
            -- Links to the rated route
            route_id BIGINT UNSIGNED NOT NULL,
            
            -- Links to user who provided the rating
            user_id BIGINT UNSIGNED NOT NULL,
            
            -- Rating value between 1 and 5
            rating INT CHECK (rating BETWEEN 1 AND 5),
            
            -- Optional user feedback
            comment TEXT,
            
            -- Automatically set when record is created
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Ensure route exists in routes table
            FOREIGN KEY (route_id) REFERENCES routes(id),
            
            -- Ensure user exists in users table
            FOREIGN KEY (user_id) REFERENCES users(id)
        )";
        
        // Execute the creation query
        $db->executeQuery($sql);
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the route_ratings table if it exists
     */
    public function down()
    {
        $db = app(DatabaseService::class);
        
        // Drop the table if it exists
        $db->executeQuery("DROP TABLE IF EXISTS route_ratings");
    }
}
