<?php

namespace Database\Factories;

use App\Models\ForumPost;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ForumPost>
 */
class ForumPostFactory extends Factory
{
    protected $model = ForumPost::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(),
            'content' => fake()->paragraphs(3, true),
            'category' => fake()->randomElement(['general', 'training', 'gear', 'nutrition', 'races', 'routes']),
            'pinned' => false,
            'locked' => false,
        ];
    }

    /**
     * Indicate that the post is pinned.
     */
    public function pinned(): static
    {
        return $this->state(fn (array $attributes) => [
            'pinned' => true,
        ]);
    }

    /**
     * Indicate that the post is locked.
     */
    public function locked(): static
    {
        return $this->state(fn (array $attributes) => [
            'locked' => true,
        ]);
    }

    /**
     * Set the category.
     */
    public function category(string $category): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => $category,
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
