<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Creates profiles table for extended user information
     * Supports both runner and trainer profiles
     */
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            
            // Link to users table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Basic profile info
            $table->text('bio')->nullable();
            $table->string('location')->nullable();
            $table->string('profile_picture')->nullable(); // path to uploaded image
            
            // Runner-specific fields
            $table->enum('experience_level', ['beginner', 'intermediate', 'advanced'])->nullable();
            $table->string('current_goal')->nullable(); // e.g., "Complete first 5K", "Sub-4 hour marathon"
            $table->decimal('current_weekly_mileage', 5, 2)->nullable(); // average miles per week
            
            // Running stats (tracked over time)
            $table->integer('total_runs')->default(0);
            $table->decimal('total_distance', 8, 2)->default(0); // in kilometers
            $table->integer('total_time_minutes')->default(0); // total running time in minutes
            
            // Personal records (will be updated as runs are logged)
            $table->decimal('pr_5k_minutes', 5, 2)->nullable();
            $table->decimal('pr_10k_minutes', 5, 2)->nullable();
            $table->decimal('pr_half_marathon_minutes', 5, 2)->nullable();
            $table->decimal('pr_full_marathon_minutes', 5, 2)->nullable();
            
            // Trainer-specific fields (for future expansion or if adding more trainers)
            $table->text('certifications')->nullable(); // JSON or text list of certifications
            $table->integer('years_experience')->nullable();
            $table->text('specialties')->nullable(); // e.g., "Marathon training, Injury prevention"
            
            // Privacy settings (for future social features)
            $table->boolean('profile_public')->default(true); // public vs private profile
            $table->boolean('show_stats')->default(true); // show running stats publicly
            
            $table->timestamps();
            
            // Ensure one profile per user
            $table->unique('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};