<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the runs table
 * Records actual running sessions by users on specific routes
 * Tracks timing and completion data
 */
class CreateRunsTable extends Migration
{
    /**
     * Run the migrations - creates runs table
     */
    public function up()
    {
        Schema::create('runs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('route_id');
            $table->timestamp('start_time');
            $table->timestamp('end_time')->nullable();
            $table->integer('completion_time')->nullable();
            
            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('route_id')->references('id')->on('routes');
        });
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the runs table if it exists
     */
    public function down()
    {
        Schema::dropIfExists('runs');
    }
}