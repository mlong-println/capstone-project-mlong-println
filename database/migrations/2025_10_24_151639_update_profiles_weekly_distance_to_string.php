<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     * Changes current_weekly_mileage from decimal to string to allow ranges like "35-45"
     * Also renames it to current_weekly_distance for clarity
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the old column
            $table->dropColumn('current_weekly_mileage');
        });

        Schema::table('profiles', function (Blueprint $table) {
            // Add new string column
            $table->string('current_weekly_distance', 50)->nullable()->after('current_goal');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            // Drop the new column
            $table->dropColumn('current_weekly_distance');
        });

        Schema::table('profiles', function (Blueprint $table) {
            // Restore the old column
            $table->decimal('current_weekly_mileage', 5, 2)->nullable()->after('current_goal');
        });
    }
};