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
        Schema::create('user_achievements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('achievement_id')->constrained()->onDelete('cascade');
            $table->integer('year'); // Year achieved
            $table->integer('month'); // Month achieved (1-12)
            $table->decimal('value_achieved', 10, 2); // Actual value achieved
            $table->timestamp('achieved_at');
            $table->timestamps();
            
            // Ensure a user can only earn the same achievement once per month
            $table->unique(['user_id', 'achievement_id', 'year', 'month']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_achievements');
    }
};
