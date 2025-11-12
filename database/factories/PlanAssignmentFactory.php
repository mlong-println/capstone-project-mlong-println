<?php

namespace Database\Factories;

use App\Models\PlanAssignment;
use App\Models\TrainingPlan;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PlanAssignment>
 */
class PlanAssignmentFactory extends Factory
{
    protected $model = PlanAssignment::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $startDate = Carbon::now()->subWeeks(fake()->numberBetween(0, 8));
        $plan = TrainingPlan::factory()->create();
        $targetEndDate = $startDate->copy()->addWeeks($plan->duration_weeks);

        return [
            'user_id' => User::factory()->create(['role' => 'runner'])->id,
            'training_plan_id' => $plan->id,
            'start_date' => $startDate,
            'target_end_date' => $targetEndDate,
            'actual_end_date' => null,
            'status' => 'active',
            'current_week' => 1,
            'completed_workouts' => [],
            'total_workouts_completed' => 0,
            'total_workouts_in_plan' => $plan->duration_weeks * 4, // 4 workouts per week
            'completion_percentage' => 0,
            'runner_notes' => fake()->optional()->sentence(),
            'trainer_notes' => fake()->optional()->sentence(),
        ];
    }

    /**
     * Indicate that the assignment is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
            'actual_end_date' => null,
        ]);
    }

    /**
     * Indicate that the assignment is paused.
     */
    public function paused(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paused',
        ]);
    }

    /**
     * Indicate that the assignment is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'actual_end_date' => Carbon::now(),
            'completion_percentage' => 100,
            'total_workouts_completed' => $attributes['total_workouts_in_plan'],
        ]);
    }

    /**
     * Indicate that the assignment is abandoned.
     */
    public function abandoned(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'abandoned',
            'actual_end_date' => Carbon::now(),
        ]);
    }
}
