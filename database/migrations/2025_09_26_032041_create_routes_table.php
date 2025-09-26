<?php

use Illuminate\Database\Migrations\Migration;
use App\Services\DatabaseService;

/**
 * Migration for creating the routes table
 * Stores running routes with distance and difficulty info
 * Links to users table for route creators
 */
class CreateRoutesTable extends Migration
{
    /**
     * Run the migrations - creates routes table
     * Uses raw SQL through DatabaseService
     */
    public function up()
    {
        $db = app(DatabaseService::class);
        
        // SQL to create routes table with required fields
        // Includes foreign key to users table
        $sql = "CREATE TABLE routes (
            -- Primary identifier for routes
            id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            
            -- Route name with reasonable length
            name VARCHAR(100) NOT NULL,
            
            -- Detailed route description
            description TEXT,
            
            -- Distance in kilometers, 2 decimal precision
            distance DECIMAL(5,2) NOT NULL,
            
            -- Predefined difficulty levels
            difficulty ENUM('easy', 'moderate', 'hard') NOT NULL,
            
            -- Links to user who created the route
            created_by BIGINT UNSIGNED,
            
            -- Automatically set when record is created
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            
            -- Ensure creator exists in users table
            FOREIGN KEY (created_by) REFERENCES users(id)
        )";
        
        // Execute the creation query
        $db->executeQuery($sql);
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the routes table if it exists
     */
    public function down()
    {
        $db = app(DatabaseService::class);
        
        // Drop the table if it exists
        $db->executeQuery("DROP TABLE IF EXISTS routes");
    }
}