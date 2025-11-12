<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['runner', 'trainer'])->default('runner')->after('email');
        });
    }

    /**
     * Remove role column from users table
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('role');
        });
    }
}