<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\TrainingPlan;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PlanSearchFilterTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test filtering plans by distance type
     */
    public function test_can_filter_plans_by_distance_type(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        // Create plans with different distance types
        TrainingPlan::factory()->create([
            'distance_type' => '5k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'distance_type' => '10k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'distance_type' => 'half_marathon',
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?distance_type=5k');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->has('plans.5k', 1)
            ->missing('plans.10k')
            ->missing('plans.half_marathon')
        );
    }

    /**
     * Test filtering plans by experience level
     */
    public function test_can_filter_plans_by_experience_level(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        // Create plans with different experience levels
        $beginnerPlan = TrainingPlan::factory()->create([
            'experience_level' => 'beginner',
            'distance_type' => '5k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'experience_level' => 'intermediate',
            'distance_type' => '10k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'experience_level' => 'advanced',
            'distance_type' => 'half_marathon',
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?experience_level=beginner');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->where('filters.experience_level', 'beginner')
            ->has('plans.5k', 1) // Should have the beginner 5k plan
            ->missing('plans.10k') // Should not have intermediate 10k
            ->missing('plans.half_marathon') // Should not have advanced half marathon
        );
    }

    /**
     * Test filtering plans by duration
     */
    public function test_can_filter_plans_by_duration(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        // Create plans with different durations
        TrainingPlan::factory()->create([
            'duration_weeks' => 8,
            'distance_type' => '5k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'duration_weeks' => 12,
            'distance_type' => '10k',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'duration_weeks' => 16,
            'distance_type' => 'half_marathon',
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?duration_weeks=12');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->where('filters.duration_weeks', '12')
            ->has('plans.10k', 1) // Should have the 12-week 10k plan
            ->missing('plans.5k') // Should not have 8-week 5k
            ->missing('plans.half_marathon') // Should not have 16-week half marathon
        );
    }

    /**
     * Test searching plans by name
     */
    public function test_can_search_plans_by_name(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        // Create plans with specific names
        TrainingPlan::factory()->create([
            'name' => 'Beginner Marathon Training',
            'distance_type' => 'full_marathon',
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'name' => 'Advanced 5K Speed Plan',
            'distance_type' => '5k',
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?search=Marathon');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->where('filters.search', 'Marathon')
            ->has('plans.full_marathon', 1) // Should have the marathon plan
            ->missing('plans.5k') // Should not have the 5k plan
        );
    }

    /**
     * Test combining multiple filters
     */
    public function test_can_combine_multiple_filters(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        // Create various plans
        TrainingPlan::factory()->create([
            'distance_type' => '5k',
            'experience_level' => 'beginner',
            'duration_weeks' => 8,
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'distance_type' => '5k',
            'experience_level' => 'intermediate',
            'duration_weeks' => 8,
            'is_public' => true,
            'is_template' => true,
        ]);
        TrainingPlan::factory()->create([
            'distance_type' => '10k',
            'experience_level' => 'beginner',
            'duration_weeks' => 8,
            'is_public' => true,
            'is_template' => true,
        ]);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?distance_type=5k&experience_level=beginner');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->where('filters.distance_type', '5k')
            ->where('filters.experience_level', 'beginner')
            ->has('plans.5k', 1) // Should have exactly 1 beginner 5k plan
            ->missing('plans.10k') // Should not have 10k plans
        );
    }

    /**
     * Test that filter options are provided to the view
     */
    public function test_filter_options_are_provided(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($runner)
            ->get('/runner/plans');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->has('filterOptions')
            ->has('filterOptions.distance_types')
            ->has('filterOptions.experience_levels')
            ->has('filterOptions.duration_weeks')
        );
    }

    /**
     * Test that current filters are preserved in response
     */
    public function test_current_filters_are_preserved(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($runner)
            ->get('/runner/plans?distance_type=5k&experience_level=beginner&search=test');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Runner/BrowsePlans')
            ->where('filters.distance_type', '5k')
            ->where('filters.experience_level', 'beginner')
            ->where('filters.search', 'test')
        );
    }
}
