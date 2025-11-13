<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['message', 'event_update', 'forum_reply', 'plan_update', 'system'];
        
        return [
            'user_id' => User::factory(),
            'type' => fake()->randomElement($types),
            'title' => fake()->sentence(),
            'message' => fake()->paragraph(),
            'data' => null,
            'read' => false,
            'read_at' => null,
            'action_url' => fake()->boolean(50) ? '/dashboard' : null,
        ];
    }

    /**
     * Indicate that the notification is read.
     */
    public function read(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => true,
            'read_at' => now(),
        ]);
    }

    /**
     * Indicate that the notification is unread.
     */
    public function unread(): static
    {
        return $this->state(fn (array $attributes) => [
            'read' => false,
            'read_at' => null,
        ]);
    }

    /**
     * Set the notification type.
     */
    public function ofType(string $type): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => $type,
        ]);
    }

    /**
     * Set the notification data.
     */
    public function withData(array $data): static
    {
        return $this->state(fn (array $attributes) => [
            'data' => $data,
        ]);
    }
}
