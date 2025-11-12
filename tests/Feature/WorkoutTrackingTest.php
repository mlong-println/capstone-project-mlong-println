<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TrainingPlan;
use App\Models\PlanAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class WorkoutTrackingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test runner can mark workout as complete
     */
    public function test_runner_can_mark_workout_complete(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create([
            'duration_weeks' => 8,
            'total_workouts' => 56, // 8 weeks * 7 days
        ]);
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
            'current_week' => 1,
            'total_workouts_in_plan' => 56,
            'total_workouts_completed' => 0,
        ]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 1,
                'workout_index' => 0,
            ]);

        $response->assertRedirect();
        
        $assignment->refresh();
        $completedWorkouts = $assignment->completed_workouts ?? [];
        $this->assertTrue($completedWorkouts['week_1'][0] ?? false);
        $this->assertEquals(1, $assignment->total_workouts_completed);
    }

    /**
     * Test workout completion updates progress percentage
     */
    public function test_workout_completion_updates_progress(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create([
            'total_workouts' => 10,
        ]);
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
            'current_week' => 1,
            'total_workouts_in_plan' => 10,
            'total_workouts_completed' => 0,
            'completion_percentage' => 0,
        ]);

        // Complete first workout
        $this
            ->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 1,
                'workout_index' => 0,
            ]);

        $assignment->refresh();
        $this->assertEquals(10, $assignment->completion_percentage); // 1/10 = 10%
    }

    /**
     * Test runner cannot mark another user's workout complete
     */
    public function test_runner_cannot_mark_other_users_workout_complete(): void
    {
        $runner1 = User::factory()->create(['role' => 'runner']);
        $runner2 = User::factory()->create(['role' => 'runner']);
        
        $plan = TrainingPlan::factory()->create();
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner2->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($runner1)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 1,
                'workout_index' => 0,
            ]);

        $response->assertForbidden();
    }

    /**
     * Test completing all workouts in a week advances to next week
     */
    public function test_completing_week_advances_to_next_week(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create([
            'duration_weeks' => 8,
            'weekly_structure' => [
                'week_1' => [
                    ['day' => 'Monday', 'workout' => 'Rest'],
                    ['day' => 'Tuesday', 'workout' => '3 mile run'],
                ],
            ],
        ]);
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
            'current_week' => 1,
            'total_workouts_in_plan' => 16, // 2 workouts per week * 8 weeks
        ]);

        // Complete both workouts in week 1
        $this->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 1,
                'workout_index' => 0,
            ]);

        $this->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 1,
                'workout_index' => 1,
            ]);

        $assignment->refresh();
        $this->assertEquals(2, $assignment->current_week); // Should advance to week 2
    }

    /**
     * Test completing final week marks plan as completed
     */
    public function test_completing_final_week_marks_plan_completed(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create([
            'duration_weeks' => 2,
            'weekly_structure' => [
                'week_2' => [
                    ['day' => 'Monday', 'workout' => 'Final run'],
                ],
            ],
        ]);
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
            'current_week' => 2,
            'total_workouts_in_plan' => 2,
            'total_workouts_completed' => 1,
            'completion_percentage' => 50,
        ]);

        // Complete final workout
        $this->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/complete-workout", [
                'week' => 2,
                'workout_index' => 0,
            ]);

        $assignment->refresh();
        $this->assertEquals('completed', $assignment->status);
        $this->assertNotNull($assignment->actual_end_date);
    }
}
