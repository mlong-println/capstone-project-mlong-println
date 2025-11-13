<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can view their notifications
     */
    public function test_user_can_view_notifications(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Notification::factory()->count(3)->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/notifications');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Notifications/Index')
            ->has('notifications.data', 3)
        );
    }

    /**
     * Test user can get unread notifications count
     */
    public function test_user_can_get_unread_count(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Notification::factory()->count(5)->unread()->create(['user_id' => $user->id]);
        Notification::factory()->count(3)->read()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/notifications/unread-count');

        $response->assertStatus(200);
        $response->assertJson(['count' => 5]);
    }

    /**
     * Test user can mark notification as read
     */
    public function test_user_can_mark_notification_as_read(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $notification = Notification::factory()->unread()->create(['user_id' => $user->id]);

        $this->assertFalse($notification->read);

        $response = $this->actingAs($user)
            ->post("/notifications/{$notification->id}/read");

        $response->assertRedirect();
        
        $notification->refresh();
        $this->assertTrue($notification->read);
        $this->assertNotNull($notification->read_at);
    }

    /**
     * Test user cannot mark another user's notification as read
     */
    public function test_user_cannot_mark_other_users_notification_as_read(): void
    {
        $user1 = User::factory()->create(['role' => 'runner']);
        $user2 = User::factory()->create(['role' => 'runner']);
        
        $notification = Notification::factory()->unread()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)
            ->post("/notifications/{$notification->id}/read");

        $response->assertStatus(403);
    }

    /**
     * Test user can mark all notifications as read
     */
    public function test_user_can_mark_all_notifications_as_read(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Notification::factory()->count(5)->unread()->create(['user_id' => $user->id]);

        $this->assertEquals(5, $user->unreadNotificationsCount());

        $response = $this->actingAs($user)
            ->post('/notifications/mark-all-read');

        $response->assertRedirect();
        $this->assertEquals(0, $user->unreadNotificationsCount());
    }

    /**
     * Test user can delete a notification
     */
    public function test_user_can_delete_notification(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $notification = Notification::factory()->create(['user_id' => $user->id]);

        $this->assertDatabaseHas('notifications', ['id' => $notification->id]);

        $response = $this->actingAs($user)
            ->delete("/notifications/{$notification->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
    }

    /**
     * Test user cannot delete another user's notification
     */
    public function test_user_cannot_delete_other_users_notification(): void
    {
        $user1 = User::factory()->create(['role' => 'runner']);
        $user2 = User::factory()->create(['role' => 'runner']);
        
        $notification = Notification::factory()->create(['user_id' => $user2->id]);

        $response = $this->actingAs($user1)
            ->delete("/notifications/{$notification->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('notifications', ['id' => $notification->id]);
    }

    /**
     * Test user can delete all read notifications
     */
    public function test_user_can_delete_all_read_notifications(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        $readNotifications = Notification::factory()->count(3)->read()->create(['user_id' => $user->id]);
        $unreadNotifications = Notification::factory()->count(2)->unread()->create(['user_id' => $user->id]);

        $response = $this->actingAs($user)
            ->delete('/notifications/read/all');

        $response->assertRedirect();
        
        // Read notifications should be deleted
        foreach ($readNotifications as $notification) {
            $this->assertDatabaseMissing('notifications', ['id' => $notification->id]);
        }
        
        // Unread notifications should still exist
        foreach ($unreadNotifications as $notification) {
            $this->assertDatabaseHas('notifications', ['id' => $notification->id]);
        }
    }

    /**
     * Test notification redirects to action URL when marked as read
     */
    public function test_notification_redirects_to_action_url_when_marked_as_read(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $notification = Notification::factory()->create([
            'user_id' => $user->id,
            'action_url' => '/dashboard',
        ]);

        $response = $this->actingAs($user)
            ->post("/notifications/{$notification->id}/read");

        $response->assertRedirect('/dashboard');
    }

    /**
     * Test unread notifications count helper method
     */
    public function test_unread_notifications_count_helper(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Notification::factory()->count(7)->unread()->create(['user_id' => $user->id]);
        Notification::factory()->count(3)->read()->create(['user_id' => $user->id]);

        $this->assertEquals(7, $user->unreadNotificationsCount());
    }
}
