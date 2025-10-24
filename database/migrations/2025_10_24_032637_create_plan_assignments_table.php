<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates plan_assignments table to track which runners are on which training plans
     * Includes progress tracking and status
     */
    public function up(): void
    {
        Schema::create('plan_assignments', function (Blueprint $table) {
            $table->id();
            
            // Links to runner and training plan
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // the runner
            $table->foreignId('training_plan_id')->constrained()->onDelete('cascade'); // the plan they're following
            
            // Assignment metadata
            $table->date('start_date'); // when the runner started this plan
            $table->date('target_end_date'); // calculated based on plan duration
            $table->date('actual_end_date')->nullable(); // when they actually completed it
            
            // Status tracking
            $table->enum('status', ['active', 'completed', 'paused', 'abandoned'])->default('active');
            $table->integer('current_week')->default(1); // which week of the plan they're on
            
            // Progress tracking
            $table->json('completed_workouts')->nullable(); // tracks which workouts are done: { "week_1": [true, false, true, ...], ... }
            $table->integer('total_workouts_completed')->default(0);
            $table->integer('total_workouts_in_plan')->default(0); // cached for quick progress calculation
            
            // Notes and adjustments
            $table->text('runner_notes')->nullable(); // runner's personal notes about the plan
            $table->text('trainer_notes')->nullable(); // trainer's notes/adjustments for this specific assignment
            
            // Performance tracking
            $table->decimal('completion_percentage', 5, 2)->default(0); // calculated field for progress
            
            $table->timestamps();
            
            // A runner can only be assigned to one plan at a time (per active status)
            // But can have multiple historical assignments
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_assignments');
    }
};