<?php

use Illuminate\Database\Migrations\Migration;
use App\Services\DatabaseService;

/**
 * Migration for creating the runs table
 * Records actual running sessions by users on specific routes
 * Tracks timing and completion data
 */
class CreateRunsTable extends Migration
{
    /**
     * Run the migrations - creates runs table
     * Uses raw SQL through DatabaseService
     */
    public function up()
    {
        $db = app(DatabaseService::class);
        
        // SQL to create runs table with required fields
        // Includes foreign keys to both users and routes tables
        $sql = "CREATE TABLE runs (
            -- Primary identifier for runs
            id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
            
            -- Links to user who completed the run
            user_id BIGINT UNSIGNED NOT NULL,
            
            -- Links to the route that was run
            route_id BIGINT UNSIGNED NOT NULL,
            
            -- When the run started
            start_time TIMESTAMP NOT NULL,
            
            -- When the run finished (NULL if not completed)
            end_time TIMESTAMP NULL,
            
            -- Total time taken in seconds (NULL if not completed)
            completion_time INT NULL,
            
            -- Ensure user exists in users table
            FOREIGN KEY (user_id) REFERENCES users(id),
            
            -- Ensure route exists in routes table
            FOREIGN KEY (route_id) REFERENCES routes(id)
        )";
        
        // Execute the creation query
        $db->executeQuery($sql);
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the runs table if it exists
     */
    public function down()
    {
        $db = app(DatabaseService::class);
        
        // Drop the table if it exists
        $db->executeQuery("DROP TABLE IF EXISTS runs");
    }
}