<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First, add 'admin' to the enum alongside existing values
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'trainer', 'runner') NOT NULL DEFAULT 'runner'");
        
        // Update existing 'trainer' roles to 'admin'
        DB::table('users')->where('role', 'trainer')->update(['role' => 'admin']);
        
        // Now remove 'trainer' from the enum
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'runner') NOT NULL DEFAULT 'runner'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert admin back to trainer
        DB::table('users')->where('role', 'admin')->update(['role' => 'trainer']);
        
        // Change role enum back to (trainer, runner)
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('trainer', 'runner') NOT NULL DEFAULT 'runner'");
    }
};
