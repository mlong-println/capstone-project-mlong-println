<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Event>
 */
class EventFactory extends Factory
{
    protected $model = Event::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'organizer_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(),
            'location' => fake()->address(),
            'latitude' => fake()->latitude(),
            'longitude' => fake()->longitude(),
            'event_date' => fake()->dateTimeBetween('+1 day', '+30 days'),
            'max_participants' => fake()->optional()->numberBetween(5, 50),
            'status' => 'upcoming',
            'difficulty' => fake()->randomElement(['easy', 'moderate', 'hard']),
            'distance_km' => fake()->randomFloat(2, 1, 42),
            'photos' => null,
        ];
    }

    /**
     * Indicate that the event is upcoming.
     */
    public function upcoming(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'upcoming',
            'event_date' => fake()->dateTimeBetween('+1 day', '+30 days'),
        ]);
    }

    /**
     * Indicate that the event is past.
     */
    public function past(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'event_date' => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the event is cancelled.
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
        ]);
    }

    /**
     * Set the organizer.
     */
    public function organizedBy(User $organizer): static
    {
        return $this->state(fn (array $attributes) => [
            'organizer_id' => $organizer->id,
        ]);
    }

    /**
     * Set max participants.
     */
    public function withMaxParticipants(int $max): static
    {
        return $this->state(fn (array $attributes) => [
            'max_participants' => $max,
        ]);
    }
}
