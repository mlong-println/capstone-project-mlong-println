<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the routes table
 * Stores running routes with distance and difficulty info
 * Links to users table for route creators
 * 
 * Note: Converted from raw SQL (DatabaseService) to Laravel Schema Builder
 * to support both MySQL (production) and SQLite (testing) databases.
 * Reference: Laravel Migrations Documentation
 * https://laravel.com/docs/10.x/migrations#creating-tables
 */
class CreateRoutesTable extends Migration
{
    /**
     * Run the migrations - creates routes table
     */
    public function up()
    {
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->text('description')->nullable();
            $table->decimal('distance', 5, 2);
            $table->enum('difficulty', ['easy', 'moderate', 'hard']);
            $table->unsignedBigInteger('created_by')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('created_by')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the routes table if it exists
     */
    public function down()
    {
        Schema::dropIfExists('routes');
    }
}