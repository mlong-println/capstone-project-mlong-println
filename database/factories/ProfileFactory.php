<?php

namespace Database\Factories;

use App\Models\Profile;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Profile>
 */
class ProfileFactory extends Factory
{
    protected $model = Profile::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'bio' => fake()->paragraph(),
            'location' => fake()->city() . ', ' . fake()->stateAbbr(),
            'experience_level' => fake()->randomElement(['beginner', 'intermediate', 'advanced']),
            'current_goal' => fake()->randomElement([
                'Complete my first 5K',
                'Run a sub-30 minute 5K',
                'Complete a half marathon',
                'Run a sub-2 hour half marathon',
                'Complete my first marathon',
                'Qualify for Boston Marathon',
            ]),
            'current_weekly_distance' => fake()->randomElement(['10-15', '15-20', '20-30', '30-40', '40-50', '50+']),
            'total_runs' => fake()->numberBetween(5, 500),
            'total_distance' => fake()->randomFloat(2, 50, 5000),
            'total_time_minutes' => fake()->numberBetween(300, 50000),
            'pr_5k_minutes' => fake()->randomFloat(2, 15, 40),
            'pr_10k_minutes' => fake()->randomFloat(2, 35, 90),
            'pr_half_marathon_minutes' => fake()->randomFloat(2, 75, 180),
            'pr_full_marathon_minutes' => fake()->randomFloat(2, 150, 360),
            'profile_public' => fake()->boolean(80),
            'show_stats' => fake()->boolean(70),
        ];
    }

    /**
     * Indicate that the profile is for a runner.
     */
    public function runner(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory()->create(['role' => 'runner'])->id,
        ]);
    }

    /**
     * Indicate that the profile is for a trainer.
     */
    public function trainer(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => User::factory()->create(['role' => 'trainer'])->id,
            'certifications' => fake()->randomElement([
                'RRCA Certified Running Coach',
                'USATF Level 1 Coach',
                'NASM Certified Personal Trainer',
            ]),
            'years_experience' => fake()->numberBetween(1, 20),
            'specialties' => fake()->randomElement([
                'Marathon Training',
                'Speed Work',
                'Injury Prevention',
                'Beginner Runners',
            ]),
        ]);
    }
}
