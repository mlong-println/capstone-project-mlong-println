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
        Schema::create('trail_alerts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('description');
            $table->string('location'); // Trail/area name
            $table->enum('severity', ['low', 'medium', 'high', 'critical'])->default('medium');
            $table->enum('alert_type', ['closure', 'hazard', 'construction', 'weather', 'wildlife', 'other'])->default('other');
            $table->json('media')->nullable(); // Array of photo/video paths
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamp('expires_at')->nullable(); // Optional expiration
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trail_alerts');
    }
};
