<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Migration for creating the route_ratings table
 * Stores user feedback and ratings for running routes
 * Links users' ratings to specific routes
 */
class CreateRouteRatingsTable extends Migration
{
    /**
     * Run the migrations - creates route_ratings table
     */
    public function up()
    {
        Schema::create('route_ratings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('route_id');
            $table->unsignedBigInteger('user_id');
            $table->integer('rating');
            $table->text('comment')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            $table->foreign('route_id')->references('id')->on('routes');
            $table->foreign('user_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations - cleanup
     * Removes the route_ratings table if it exists
     */
    public function down()
    {
        Schema::dropIfExists('route_ratings');
    }
}
