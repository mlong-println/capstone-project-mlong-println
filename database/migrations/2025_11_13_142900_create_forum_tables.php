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
        // Forum posts table
        Schema::create('forum_posts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('category', ['general', 'training', 'gear', 'nutrition', 'races', 'routes'])->default('general');
            $table->boolean('pinned')->default(false);
            $table->boolean('locked')->default(false);
            $table->timestamps();

            $table->index('user_id');
            $table->index('category');
            $table->index('created_at');
            $table->index('pinned');
        });

        // Forum comments table
        Schema::create('forum_comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('post_id')->constrained('forum_posts')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('content');
            $table->timestamps();

            $table->index('post_id');
            $table->index('user_id');
            $table->index('created_at');
        });

        // Forum likes table (for posts and comments)
        Schema::create('forum_likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->morphs('likeable'); // likeable_id and likeable_type
            $table->timestamps();

            $table->unique(['user_id', 'likeable_id', 'likeable_type']);
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('forum_likes');
        Schema::dropIfExists('forum_comments');
        Schema::dropIfExists('forum_posts');
    }
};
