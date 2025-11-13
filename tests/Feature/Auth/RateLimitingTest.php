<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RateLimitingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test login rate limiting blocks after 5 attempts
     */
    public function test_login_rate_limiting_blocks_after_five_attempts(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'role' => 'runner',
        ]);

        // Make 5 failed login attempts (should be allowed)
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post('/login', [
                'email' => 'test@example.com',
                'password' => 'wrong-password',
            ]);
            
            // Should get validation error, not rate limit error
            $response->assertSessionHasErrors('email');
        }

        // 6th attempt should be rate limited
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'wrong-password',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }

    /**
     * Test registration rate limiting blocks after 5 attempts
     */
    public function test_registration_rate_limiting_blocks_after_five_attempts(): void
    {
        // Make 5 registration attempts with invalid data (should be allowed but fail validation)
        for ($i = 0; $i < 5; $i++) {
            $this->post('/register', [
                'name' => "Test User $i",
                'email' => 'invalid-email', // Invalid email to trigger validation error
                'role' => 'runner',
                'password' => 'password',
                'password_confirmation' => 'password',
            ]);
        }

        // 6th attempt should be rate limited
        $response = $this->post('/register', [
            'name' => 'Test User 6',
            'email' => 'invalid-email',
            'role' => 'runner',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }

    /**
     * Test password reset rate limiting blocks after 3 attempts
     */
    public function test_password_reset_rate_limiting_blocks_after_three_attempts(): void
    {
        // Make 3 password reset requests (should be allowed)
        for ($i = 0; $i < 3; $i++) {
            $this->post('/forgot-password', [
                'email' => 'test@example.com',
            ]);
        }

        // 4th attempt should be rate limited
        $response = $this->post('/forgot-password', [
            'email' => 'test@example.com',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }

    /**
     * Test rate limit applies to all login attempts (successful or failed)
     */
    public function test_rate_limit_applies_to_all_login_attempts(): void
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => bcrypt('password'),
            'role' => 'runner',
        ]);

        // Make 5 successful login attempts (should be allowed)
        for ($i = 0; $i < 5; $i++) {
            $response = $this->post('/login', [
                'email' => 'test@example.com',
                'password' => 'password',
            ]);

            $response->assertRedirect('/dashboard');
            
            // Logout for next attempt
            $this->post('/logout');
        }

        // 6th login attempt should be rate limited (even if credentials are correct)
        $response = $this->post('/login', [
            'email' => 'test@example.com',
            'password' => 'password',
        ]);

        $response->assertStatus(429); // Too Many Requests
    }
}
