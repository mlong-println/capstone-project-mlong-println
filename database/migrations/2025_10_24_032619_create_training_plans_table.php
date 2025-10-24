<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates training_plans table for structured running programs
     * Plans are created by the trainer (Michael Long) and assigned to runners
     */
    public function up(): void
    {
        Schema::create('training_plans', function (Blueprint $table) {
            $table->id();
            
            // Plan metadata
            $table->string('name'); // e.g., "Beginner 5K - 8 Weeks"
            $table->text('description'); // overview of the plan
            
            // Plan categorization
            $table->enum('distance_type', ['5k', '10k', 'half_marathon', 'full_marathon', 'ultra']); // race distance
            $table->enum('experience_level', ['beginner', 'intermediate', 'advanced'])->nullable(); // null for ultra (assumes advanced)
            $table->integer('duration_weeks'); // how many weeks the plan runs
            
            // Plan type
            $table->boolean('is_template')->default(true); // true = reusable template, false = custom one-off
            
            // Creator (trainer who made this plan)
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade'); // links to trainer user
            
            // Plan structure (JSON for flexibility)
            // Will store weekly breakdown: { "week_1": [...workouts], "week_2": [...workouts], ... }
            $table->json('weekly_structure')->nullable(); // detailed workout schedule
            
            // Additional metadata
            $table->integer('weekly_mileage_peak')->nullable(); // peak weekly mileage in km
            $table->text('prerequisites')->nullable(); // e.g., "Must be able to run 5K comfortably"
            $table->text('goals')->nullable(); // e.g., "Complete a 5K race", "Sub-2 hour half marathon"
            
            // Visibility (for future if adding more trainers or community plans)
            $table->boolean('is_public')->default(true); // visible to all runners
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('training_plans');
    }
};