<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Profile;
use App\Models\TrainingPlan;
use App\Models\PlanAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanAssignmentTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test runner can browse training plans
     */
    public function test_runner_can_browse_training_plans(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/plans');

        $response->assertOk();
    }

    /**
     * Test runner can view a specific training plan
     */
    public function test_runner_can_view_specific_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create([
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this
            ->actingAs($runner)
            ->get("/runner/plans/{$plan->id}");

        $response->assertOk();
    }

    /**
     * Test runner can assign a plan to themselves
     */
    public function test_runner_can_assign_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        Profile::factory()->create([
            'user_id' => $runner->id,
            'experience_level' => 'beginner',
            'current_goal' => 'Complete my first 5K',
        ]);

        $plan = TrainingPlan::factory()->create([
            'is_public' => true,
            'is_template' => true,
            'duration_weeks' => 8,
        ]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/plans/{$plan->id}/assign");

        $response->assertRedirect('/runner/dashboard');
        $this->assertDatabaseHas('plan_assignments', [
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
            'current_week' => 1,
        ]);
    }

    /**
     * Test runner cannot assign multiple active plans
     */
    public function test_runner_cannot_assign_multiple_active_plans(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        Profile::factory()->create([
            'user_id' => $runner->id,
            'experience_level' => 'beginner',
        ]);

        $plan1 = TrainingPlan::factory()->create(['is_public' => true]);
        $plan2 = TrainingPlan::factory()->create(['is_public' => true]);

        // Assign first plan
        PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan1->id,
            'status' => 'active',
        ]);

        // Try to assign second plan
        $response = $this
            ->actingAs($runner)
            ->post("/runner/plans/{$plan2->id}/assign");

        $response->assertSessionHasErrors();
        $this->assertDatabaseMissing('plan_assignments', [
            'user_id' => $runner->id,
            'training_plan_id' => $plan2->id,
        ]);
    }

    /**
     * Test runner must have complete profile to assign plan
     */
    public function test_runner_must_have_complete_profile_to_assign_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        // No profile created

        $plan = TrainingPlan::factory()->create(['is_public' => true]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/plans/{$plan->id}/assign");

        $response->assertRedirect('/runner/profile/edit');
    }

    /**
     * Test runner can view their active plan
     */
    public function test_runner_can_view_active_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/my-plan');

        $response->assertOk();
    }

    /**
     * Test runner without active plan is redirected
     */
    public function test_runner_without_active_plan_is_redirected(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/my-plan');

        $response->assertRedirect('/runner/plans');
    }
}
