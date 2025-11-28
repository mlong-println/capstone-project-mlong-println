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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('gender', ['male', 'female', 'other'])->default('other')->after('email');
        });

        // Set genders for existing users based on their names
        DB::table('users')->where('name', 'Michael Long')->update(['gender' => 'male']);
        DB::table('users')->where('name', 'Sarah Johnson')->update(['gender' => 'female']);
        DB::table('users')->where('name', 'Mike Chen')->update(['gender' => 'male']);
        DB::table('users')->where('name', 'Emily Rodriguez')->update(['gender' => 'female']);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
