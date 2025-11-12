<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Profile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RunnerProfileTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test runner can view their profile edit page
     */
    public function test_runner_can_view_profile_edit_page(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this
            ->actingAs($runner)
            ->get('/runner/profile/edit');

        $response->assertOk();
    }

    /**
     * Test runner can create their profile
     */
    public function test_runner_can_create_profile(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this
            ->actingAs($runner)
            ->post('/runner/profile', [
                'bio' => 'Test runner bio',
                'experience_level' => 'beginner',
                'current_goal' => 'Complete my first 5K',
                'location' => 'Hamilton, ON',
                'current_weekly_distance' => '10-15',
                'total_runs' => 5,
                'total_distance' => 25,
                'profile_public' => true,
                'show_stats' => true,
            ]);

        $response->assertRedirect('/runner/dashboard');
        $this->assertDatabaseHas('profiles', [
            'user_id' => $runner->id,
            'experience_level' => 'beginner',
            'current_goal' => 'Complete my first 5K',
        ]);
    }

    /**
     * Test runner can update their profile
     */
    public function test_runner_can_update_profile(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);
        $profile = Profile::factory()->create([
            'user_id' => $runner->id,
            'experience_level' => 'beginner',
        ]);

        $response = $this
            ->actingAs($runner)
            ->put("/runner/profile/{$profile->id}", [
                'bio' => 'Updated bio',
                'experience_level' => 'intermediate',
                'current_goal' => 'Run a sub-2 hour half marathon',
                'location' => 'Toronto, ON',
                'current_weekly_distance' => '30-40',
                'total_runs' => 50,
                'total_distance' => 300,
                'profile_public' => true,
                'show_stats' => true,
            ]);

        $response->assertRedirect('/runner/dashboard');
        $this->assertDatabaseHas('profiles', [
            'user_id' => $runner->id,
            'experience_level' => 'intermediate',
            'current_goal' => 'Run a sub-2 hour half marathon',
        ]);
    }

    /**
     * Test profile requires valid experience level
     */
    public function test_profile_requires_valid_experience_level(): void
    {
        $runner = User::factory()->create(['role' => 'runner']);

        $response = $this
            ->actingAs($runner)
            ->post('/runner/profile', [
                'bio' => 'Test bio',
                'experience_level' => 'invalid_level',
                'current_goal' => 'Test goal',
                'location' => 'Hamilton, ON',
            ]);

        $response->assertSessionHasErrors('experience_level');
    }

    /**
     * Test trainer cannot access runner profile routes
     */
    public function test_trainer_cannot_access_runner_profile_routes(): void
    {
        $trainer = User::factory()->create(['role' => 'trainer']);

        $response = $this
            ->actingAs($trainer)
            ->get('/runner/profile/edit');

        $response->assertForbidden();
    }
}
