<?php

namespace Database\Factories;

use App\Models\ForumComment;
use App\Models\ForumPost;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ForumComment>
 */
class ForumCommentFactory extends Factory
{
    protected $model = ForumComment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => ForumPost::factory(),
            'user_id' => User::factory(),
            'content' => fake()->paragraph(),
        ];
    }

    /**
     * Set the post.
     */
    public function forPost(ForumPost $post): static
    {
        return $this->state(fn (array $attributes) => [
            'post_id' => $post->id,
        ]);
    }

    /**
     * Set the author.
     */
    public function by(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
        ]);
    }
}
