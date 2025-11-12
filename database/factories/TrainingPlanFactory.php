<?php

namespace Database\Factories;

use App\Models\TrainingPlan;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TrainingPlan>
 */
class TrainingPlanFactory extends Factory
{
    protected $model = TrainingPlan::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $distanceType = fake()->randomElement(['5k', '10k', 'half_marathon', 'full_marathon']);
        $experienceLevel = fake()->randomElement(['beginner', 'intermediate', 'advanced']);
        $durationWeeks = fake()->randomElement([8, 10, 12, 16, 20]);

        return [
            'name' => ucfirst($experienceLevel) . ' ' . strtoupper(str_replace('_', ' ', $distanceType)) . ' Training Plan',
            'description' => fake()->paragraph(),
            'distance_type' => $distanceType,
            'experience_level' => $experienceLevel,
            'duration_weeks' => $durationWeeks,
            'is_template' => true,
            'is_public' => true,
            'created_by' => User::factory()->create(['role' => 'trainer'])->id,
            'weekly_structure' => $this->generateWeeklyStructure($durationWeeks),
            'weekly_mileage_peak' => fake()->numberBetween(20, 70),
            'prerequisites' => fake()->sentence(),
            'goals' => fake()->sentence(),
        ];
    }

    /**
     * Generate a basic weekly structure for the plan.
     */
    protected function generateWeeklyStructure(int $weeks): array
    {
        $structure = [];
        for ($i = 1; $i <= $weeks; $i++) {
            $structure["week_{$i}"] = [
                ['type' => 'easy_run', 'distance' => 5, 'description' => 'Easy recovery run'],
                ['type' => 'tempo_run', 'distance' => 8, 'description' => 'Tempo run at moderate pace'],
                ['type' => 'interval_training', 'distance' => 6, 'description' => 'Speed intervals'],
                ['type' => 'long_run', 'distance' => 12, 'description' => 'Long endurance run'],
            ];
        }
        return $structure;
    }

    /**
     * Indicate that the plan is for a specific distance.
     */
    public function forDistance(string $distance): static
    {
        return $this->state(fn (array $attributes) => [
            'distance_type' => $distance,
            'name' => ucfirst($attributes['experience_level']) . ' ' . strtoupper(str_replace('_', ' ', $distance)) . ' Training Plan',
        ]);
    }

    /**
     * Indicate that the plan is for a specific experience level.
     */
    public function forLevel(string $level): static
    {
        return $this->state(fn (array $attributes) => [
            'experience_level' => $level,
            'name' => ucfirst($level) . ' ' . strtoupper(str_replace('_', ' ', $attributes['distance_type'])) . ' Training Plan',
        ]);
    }
}
