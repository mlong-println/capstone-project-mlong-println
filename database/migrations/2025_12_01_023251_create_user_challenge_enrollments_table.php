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
        Schema::create('user_challenge_enrollments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->integer('year');
            $table->integer('month');
            $table->timestamps();
            
            // Prevent duplicate enrollments for same user/challenge/month
            $table->unique(['user_id', 'achievement_id', 'year', 'month'], 'user_challenge_enrollment_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_challenge_enrollments');
    }
};
