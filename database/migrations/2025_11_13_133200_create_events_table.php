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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location');
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->dateTime('event_date');
            $table->integer('max_participants')->nullable();
            $table->enum('status', ['upcoming', 'ongoing', 'completed', 'cancelled'])->default('upcoming');
            $table->enum('difficulty', ['easy', 'moderate', 'hard'])->nullable();
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->json('photos')->nullable(); // Array of photo URLs
            $table->timestamps();

            $table->index('organizer_id');
            $table->index('event_date');
            $table->index('status');
        });

        // Pivot table for event participants
        Schema::create('event_participants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['joined', 'maybe', 'declined'])->default('joined');
            $table->timestamps();

            $table->unique(['event_id', 'user_id']);
            $table->index('event_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_participants');
        Schema::dropIfExists('events');
    }
};
