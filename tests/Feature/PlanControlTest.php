<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Profile;
use App\Models\TrainingPlan;
use App\Models\PlanAssignment;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanControlTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test runner can pause their active plan
     */
    public function test_runner_can_pause_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/pause");

        $response->assertRedirect();
        $this->assertDatabaseHas('plan_assignments', [
            'id' => $assignment->id,
            'status' => 'paused',
        ]);
    }

    /**
     * Test runner can resume a paused plan
     */
    public function test_runner_can_resume_paused_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'paused',
        ]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/resume");

        $response->assertRedirect();
        $this->assertDatabaseHas('plan_assignments', [
            'id' => $assignment->id,
            'status' => 'active',
        ]);
    }

    /**
     * Test runner can abandon their plan
     */
    public function test_runner_can_abandon_plan(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'active',
        ]);

        $response = $this
            ->actingAs($runner)
            ->post("/runner/my-plan/{$assignment->id}/abandon");

        $response->assertRedirect('/runner/dashboard');
        
        $assignment->refresh();
        $this->assertEquals('abandoned', $assignment->status);
        $this->assertNotNull($assignment->actual_end_date);
    }

    /**
     * Test paused plan remains visible to runner
     */
    public function test_paused_plan_remains_visible(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        $assignment = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'paused',
        ]);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/my-plan');

        $response->assertOk();
    }

    /**
     * Test abandoned plan is not visible as active
     */
    public function test_abandoned_plan_not_visible_as_active(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $plan = TrainingPlan::factory()->create();
        PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan->id,
            'status' => 'abandoned',
        ]);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/my-plan');

        $response->assertRedirect('/runner/plans');
    }

    /**
     * Test runner cannot pause another user's plan
     */
    public function test_runner_cannot_pause_other_users_plan(): void
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
            ->post("/runner/my-plan/{$assignment->id}/pause");

        $response->assertForbidden();
    }

    /**
     * Test runner can select new plan after abandoning
     */
    public function test_runner_can_select_new_plan_after_abandoning(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        Profile::factory()->create([
            'user_id' => $runner->id,
            'experience_level' => 'beginner',
        ]);
        
        $plan1 = TrainingPlan::factory()->create(['is_public' => true]);
        $plan2 = TrainingPlan::factory()->create(['is_public' => true]);
        
        // Create and abandon first plan
        $assignment1 = PlanAssignment::factory()->create([
            'user_id' => $runner->id,
            'training_plan_id' => $plan1->id,
            'status' => 'abandoned',
        ]);

        // Should be able to assign new plan
        $response = $this
            ->actingAs($runner)
            ->post("/runner/plans/{$plan2->id}/assign");

        $response->assertRedirect('/runner/dashboard');
        $this->assertDatabaseHas('plan_assignments', [
            'user_id' => $runner->id,
            'training_plan_id' => $plan2->id,
            'status' => 'active',
        ]);
    }
}
