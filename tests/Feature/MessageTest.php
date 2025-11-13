<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Message;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class MessageTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can send a message
     */
    public function test_user_can_send_message(): void
    {
        $sender = User::factory()->create(['role' => 'runner']);
        $recipient = User::factory()->create(['role' => 'trainer']);

        $response = $this->actingAs($sender)
            ->post('/messages', [
                'recipient_id' => $recipient->id,
                'subject' => 'Test Subject',
                'body' => 'Test message body',
            ]);

        $response->assertRedirect(route('messages.sent'));
        
        $this->assertDatabaseHas('messages', [
            'sender_id' => $sender->id,
            'recipient_id' => $recipient->id,
            'subject' => 'Test Subject',
            'body' => 'Test message body',
        ]);
    }

    /**
     * Test sending message creates notification for recipient
     */
    public function test_sending_message_creates_notification(): void
    {
        $sender = User::factory()->create(['role' => 'runner', 'name' => 'John Doe']);
        $recipient = User::factory()->create(['role' => 'trainer']);

        $this->actingAs($sender)
            ->post('/messages', [
                'recipient_id' => $recipient->id,
                'subject' => 'Test Subject',
                'body' => 'Test message body',
            ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $recipient->id,
            'type' => 'message',
            'title' => 'New Message from John Doe',
        ]);
    }

    /**
     * Test user cannot send message to themselves
     */
    public function test_user_cannot_send_message_to_self(): void
    {
        $user = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($user)
            ->post('/messages', [
                'recipient_id' => $user->id,
                'subject' => 'Test',
                'body' => 'Test',
            ]);

        $response->assertSessionHasErrors('recipient_id');
    }

    /**
     * Test user can view received messages
     */
    public function test_user_can_view_inbox(): void
    {
        $this->markTestSkipped('Frontend component not yet created');
        
        $user = User::factory()->create(['role' => 'runner']);
        
        Message::factory()->count(3)->create(['recipient_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/messages/inbox');

        $response->assertStatus(200);
    }

    /**
     * Test user can view sent messages
     */
    public function test_user_can_view_sent_messages(): void
    {
        $this->markTestSkipped('Frontend component not yet created');
        
        $user = User::factory()->create(['role' => 'runner']);
        
        Message::factory()->count(3)->create(['sender_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/messages/sent');

        $response->assertStatus(200);
    }

    /**
     * Test user can view a specific message they received
     */
    public function test_user_can_view_received_message(): void
    {
        $this->markTestSkipped('Frontend component not yet created');
        
        $user = User::factory()->create(['role' => 'runner']);
        $message = Message::factory()->create(['recipient_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get("/messages/{$message->id}");

        $response->assertStatus(200);
    }

    /**
     * Test viewing message marks it as read
     */
    public function test_viewing_message_marks_as_read(): void
    {
        $this->markTestSkipped('Frontend component not yet created');
        
        $user = User::factory()->create(['role' => 'runner']);
        $message = Message::factory()->unread()->create(['recipient_id' => $user->id]);

        $this->assertFalse($message->read);

        $this->actingAs($user)
            ->get("/messages/{$message->id}");

        $message->refresh();
        $this->assertTrue($message->read);
    }

    /**
     * Test user cannot view other users' messages
     */
    public function test_user_cannot_view_other_users_messages(): void
    {
        $user1 = User::factory()->create(['role' => 'runner']);
        $user2 = User::factory()->create(['role' => 'trainer']);
        $user3 = User::factory()->create(['role' => 'runner']);
        
        $message = Message::factory()->create([
            'sender_id' => $user2->id,
            'recipient_id' => $user3->id,
        ]);

        $response = $this->actingAs($user1)
            ->get("/messages/{$message->id}");

        $response->assertStatus(403);
    }

    /**
     * Test user can delete a message they sent
     */
    public function test_user_can_delete_sent_message(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $message = Message::factory()->create(['sender_id' => $user->id]);

        $this->assertDatabaseHas('messages', ['id' => $message->id]);

        $response = $this->actingAs($user)
            ->delete("/messages/{$message->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
    }

    /**
     * Test user can delete a message they received
     */
    public function test_user_can_delete_received_message(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $message = Message::factory()->create(['recipient_id' => $user->id]);

        $this->assertDatabaseHas('messages', ['id' => $message->id]);

        $response = $this->actingAs($user)
            ->delete("/messages/{$message->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('messages', ['id' => $message->id]);
    }

    /**
     * Test user cannot delete other users' messages
     */
    public function test_user_cannot_delete_other_users_messages(): void
    {
        $user1 = User::factory()->create(['role' => 'runner']);
        $user2 = User::factory()->create(['role' => 'trainer']);
        $user3 = User::factory()->create(['role' => 'runner']);
        
        $message = Message::factory()->create([
            'sender_id' => $user2->id,
            'recipient_id' => $user3->id,
        ]);

        $response = $this->actingAs($user1)
            ->delete("/messages/{$message->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('messages', ['id' => $message->id]);
    }

    /**
     * Test get unread messages count
     */
    public function test_user_can_get_unread_messages_count(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Message::factory()->count(5)->unread()->create(['recipient_id' => $user->id]);
        Message::factory()->count(3)->read()->create(['recipient_id' => $user->id]);

        $response = $this->actingAs($user)
            ->get('/messages/unread/count');

        $response->assertStatus(200);
        $response->assertJson(['count' => 5]);
    }

    /**
     * Test mark message as read
     */
    public function test_user_can_mark_message_as_read(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $message = Message::factory()->unread()->create(['recipient_id' => $user->id]);

        $this->assertFalse($message->read);

        $response = $this->actingAs($user)
            ->post("/messages/{$message->id}/read");

        $response->assertRedirect();
        
        $message->refresh();
        $this->assertTrue($message->read);
        $this->assertNotNull($message->read_at);
    }

    /**
     * Test only recipient can mark message as read
     */
    public function test_only_recipient_can_mark_message_as_read(): void
    {
        $sender = User::factory()->create(['role' => 'runner']);
        $recipient = User::factory()->create(['role' => 'trainer']);
        
        $message = Message::factory()->unread()->create([
            'sender_id' => $sender->id,
            'recipient_id' => $recipient->id,
        ]);

        $response = $this->actingAs($sender)
            ->post("/messages/{$message->id}/read");

        $response->assertStatus(403);
    }

    /**
     * Test mark all messages as read
     */
    public function test_user_can_mark_all_messages_as_read(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Message::factory()->count(5)->unread()->create(['recipient_id' => $user->id]);

        $this->assertEquals(5, $user->unreadMessagesCount());

        $response = $this->actingAs($user)
            ->post('/messages/mark-all-read');

        $response->assertRedirect();
        $this->assertEquals(0, $user->unreadMessagesCount());
    }

    /**
     * Test unread messages count helper method
     */
    public function test_unread_messages_count_helper(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        
        Message::factory()->count(8)->unread()->create(['recipient_id' => $user->id]);
        Message::factory()->count(4)->read()->create(['recipient_id' => $user->id]);

        $this->assertEquals(8, $user->unreadMessagesCount());
    }
}
