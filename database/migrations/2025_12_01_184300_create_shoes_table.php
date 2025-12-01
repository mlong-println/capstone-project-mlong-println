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
        Schema::create('shoes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('brand'); // Nike, Adidas, Brooks, etc.
            $table->string('model'); // User-entered shoe name/model
            $table->string('color')->nullable(); // Optional color
            $table->decimal('distance', 8, 2)->default(0); // Total distance in km
            $table->date('purchase_date')->nullable();
            $table->boolean('is_active')->default(true); // Active or retired
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shoes');
    }
};
