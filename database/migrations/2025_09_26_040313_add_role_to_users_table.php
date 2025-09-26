<?php

use Illuminate\Database\Migrations\Migration;
use App\Services\DatabaseService;

/**
 * Add role column to Laravel's default users table
 * Allows distinguishing between runners and trainers
 */
class AddRoleToUsersTable extends Migration
{
    /**
     * Add role column to users table
     */
    public function up()
    {
        $db = app(DatabaseService::class);
        
        // Add ENUM column for user roles
        $sql = "ALTER TABLE users 
                ADD COLUMN role ENUM('runner', 'trainer') NOT NULL 
                DEFAULT 'runner'";
        
        $db->executeQuery($sql);
    }

    /**
     * Remove role column from users table
     */
    public function down()
    {
        $db = app(DatabaseService::class);
        $db->executeQuery("ALTER TABLE users DROP COLUMN role");
    }
}