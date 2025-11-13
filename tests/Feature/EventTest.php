<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Event;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can create an event
     */
    public function test_user_can_create_event(): void
    {
        $user = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($user)
            ->post('/events', [
                'title' => 'Morning Run',
                'description' => 'Join us for a morning run!',
                'location' => 'Central Park',
                'latitude' => 40.785091,
                'longitude' => -73.968285,
                'event_date' => now()->addDays(7)->format('Y-m-d H:i:s'),
                'max_participants' => 20,
                'difficulty' => 'moderate',
                'distance_km' => 5.0,
            ]);

        $this->assertDatabaseHas('events', [
            'organizer_id' => $user->id,
            'title' => 'Morning Run',
            'location' => 'Central Park',
        ]);
    }

    /**
     * Test event date must be in the future
     */
    public function test_event_date_must_be_in_future(): void
    {
        $user = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($user)
            ->post('/events', [
                'title' => 'Past Event',
                'description' => 'This should fail',
                'location' => 'Somewhere',
                'event_date' => now()->subDays(1)->format('Y-m-d H:i:s'),
            ]);

        $response->assertSessionHasErrors('event_date');
    }

    /**
     * Test user can join an event
     */
    public function test_user_can_join_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $participant = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($participant)
            ->post("/events/{$event->id}/join");

        $response->assertRedirect();
        $this->assertTrue($event->hasParticipant($participant->id));
    }

    /**
     * Test joining event creates notification for organizer
     */
    public function test_joining_event_creates_notification(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer', 'name' => 'Jane Doe']);
        $participant = User::factory()->create(['role' => 'runner', 'name' => 'John Smith']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $this->actingAs($participant)
            ->post("/events/{$event->id}/join");

        $this->assertDatabaseHas('notifications', [
            'user_id' => $organizer->id,
            'type' => 'event_update',
        ]);
    }

    /**
     * Test user cannot join event twice
     */
    public function test_user_cannot_join_event_twice(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $participant = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        // Join first time
        $this->actingAs($participant)
            ->post("/events/{$event->id}/join");

        // Try to join again
        $response = $this->actingAs($participant)
            ->post("/events/{$event->id}/join");

        $response->assertSessionHas('error');
    }

    /**
     * Test user cannot join full event
     */
    public function test_user_cannot_join_full_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $event = Event::factory()->withMaxParticipants(2)->create(['organizer_id' => $organizer->id]);

        // Fill the event
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        $event->participants()->attach($user1->id, ['status' => 'joined']);
        $event->participants()->attach($user2->id, ['status' => 'joined']);

        // Try to join when full
        $user3 = User::factory()->create();
        $response = $this->actingAs($user3)
            ->post("/events/{$event->id}/join");

        $response->assertSessionHas('error');
        $this->assertFalse($event->hasParticipant($user3->id));
    }

    /**
     * Test user can leave an event
     */
    public function test_user_can_leave_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $participant = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);
        $event->participants()->attach($participant->id, ['status' => 'joined']);

        $this->assertTrue($event->hasParticipant($participant->id));

        $response = $this->actingAs($participant)
            ->post("/events/{$event->id}/leave");

        $response->assertRedirect();
        $this->assertFalse($event->hasParticipant($participant->id));
    }

    /**
     * Test only organizer can update event
     */
    public function test_only_organizer_can_update_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $otherUser = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($otherUser)
            ->put("/events/{$event->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated description',
                'location' => 'New Location',
                'event_date' => now()->addDays(10)->format('Y-m-d H:i:s'),
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test organizer can update event
     */
    public function test_organizer_can_update_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($organizer)
            ->put("/events/{$event->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated description',
                'location' => 'New Location',
                'event_date' => now()->addDays(10)->format('Y-m-d H:i:s'),
            ]);

        $event->refresh();
        $this->assertEquals('Updated Title', $event->title);
    }

    /**
     * Test updating event notifies participants
     */
    public function test_updating_event_notifies_participants(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $participant = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);
        $event->participants()->attach($participant->id, ['status' => 'joined']);

        $this->actingAs($organizer)
            ->put("/events/{$event->id}", [
                'title' => 'Updated Title',
                'description' => 'Updated description',
                'location' => 'New Location',
                'event_date' => now()->addDays(10)->format('Y-m-d H:i:s'),
            ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $participant->id,
            'type' => 'event_update',
        ]);
    }

    /**
     * Test organizer can cancel event
     */
    public function test_organizer_can_cancel_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($organizer)
            ->post("/events/{$event->id}/cancel");

        $event->refresh();
        $this->assertEquals('cancelled', $event->status);
    }

    /**
     * Test cancelling event notifies participants
     */
    public function test_cancelling_event_notifies_participants(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $participant = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);
        $event->participants()->attach($participant->id, ['status' => 'joined']);

        $this->actingAs($organizer)
            ->post("/events/{$event->id}/cancel");

        $this->assertDatabaseHas('notifications', [
            'user_id' => $participant->id,
            'type' => 'event_update',
        ]);
    }

    /**
     * Test only organizer can cancel event
     */
    public function test_only_organizer_can_cancel_event(): void
    {
        $organizer = User::factory()->create(['role' => 'trainer']);
        $otherUser = User::factory()->create(['role' => 'runner']);
        
        $event = Event::factory()->create(['organizer_id' => $organizer->id]);

        $response = $this->actingAs($otherUser)
            ->post("/events/{$event->id}/cancel");

        $response->assertStatus(403);
    }

    /**
     * Test event helper methods
     */
    public function test_event_helper_methods(): void
    {
        $organizer = User::factory()->create();
        $event = Event::factory()->withMaxParticipants(5)->create(['organizer_id' => $organizer->id]);

        // Test isFull
        $this->assertFalse($event->isFull());
        
        // Add participants
        for ($i = 0; $i < 5; $i++) {
            $user = User::factory()->create();
            $event->participants()->attach($user->id, ['status' => 'joined']);
        }

        $this->assertTrue($event->isFull());
        $this->assertEquals(5, $event->participantCount());
    }
}
