<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\Notification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ForumTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test user can create a forum post
     */
    public function test_user_can_create_post(): void
    {
        $user = User::factory()->create(['role' => 'runner']);

        $response = $this->actingAs($user)
            ->post('/forum', [
                'title' => 'Best Running Shoes',
                'content' => 'What are your favorite running shoes?',
                'category' => 'gear',
            ]);

        $this->assertDatabaseHas('forum_posts', [
            'user_id' => $user->id,
            'title' => 'Best Running Shoes',
            'category' => 'gear',
        ]);
    }

    /**
     * Test user can comment on a post
     */
    public function test_user_can_comment_on_post(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $commenter = User::factory()->create(['role' => 'trainer']);
        
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($commenter)
            ->post("/forum/{$post->id}/comments", [
                'content' => 'Great post!',
            ]);

        $this->assertDatabaseHas('forum_comments', [
            'post_id' => $post->id,
            'user_id' => $commenter->id,
            'content' => 'Great post!',
        ]);
    }

    /**
     * Test commenting creates notification for post author
     */
    public function test_commenting_creates_notification(): void
    {
        $author = User::factory()->create(['role' => 'runner', 'name' => 'Jane Doe']);
        $commenter = User::factory()->create(['role' => 'trainer', 'name' => 'John Smith']);
        
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $this->actingAs($commenter)
            ->post("/forum/{$post->id}/comments", [
                'content' => 'Great post!',
            ]);

        $this->assertDatabaseHas('notifications', [
            'user_id' => $author->id,
            'type' => 'forum_reply',
        ]);
    }

    /**
     * Test commenting does not notify self
     */
    public function test_commenting_does_not_notify_self(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $post = ForumPost::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user)
            ->post("/forum/{$post->id}/comments", [
                'content' => 'My own comment',
            ]);

        $this->assertDatabaseMissing('notifications', [
            'user_id' => $user->id,
            'type' => 'forum_reply',
        ]);
    }

    /**
     * Test user can like a post
     */
    public function test_user_can_like_post(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $post = ForumPost::factory()->create();

        $response = $this->actingAs($user)
            ->post("/forum/{$post->id}/like");

        $response->assertStatus(200);
        $response->assertJson(['liked' => true]);

        $this->assertDatabaseHas('forum_likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => ForumPost::class,
        ]);
    }

    /**
     * Test user can unlike a post
     */
    public function test_user_can_unlike_post(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $post = ForumPost::factory()->create();

        // Like first
        ForumLike::create([
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => ForumPost::class,
        ]);

        // Unlike
        $response = $this->actingAs($user)
            ->post("/forum/{$post->id}/like");

        $response->assertStatus(200);
        $response->assertJson(['liked' => false]);

        $this->assertDatabaseMissing('forum_likes', [
            'user_id' => $user->id,
            'likeable_id' => $post->id,
            'likeable_type' => ForumPost::class,
        ]);
    }

    /**
     * Test user can like a comment
     */
    public function test_user_can_like_comment(): void
    {
        $user = User::factory()->create(['role' => 'runner']);
        $comment = ForumComment::factory()->create();

        $response = $this->actingAs($user)
            ->post("/forum/comments/{$comment->id}/like");

        $response->assertStatus(200);
        $response->assertJson(['liked' => true]);

        $this->assertDatabaseHas('forum_likes', [
            'user_id' => $user->id,
            'likeable_id' => $comment->id,
            'likeable_type' => ForumComment::class,
        ]);
    }

    /**
     * Test only author can update post
     */
    public function test_only_author_can_update_post(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $otherUser = User::factory()->create(['role' => 'trainer']);
        
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($otherUser)
            ->put("/forum/{$post->id}", [
                'title' => 'Updated Title',
                'content' => 'Updated content',
                'category' => 'general',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test author can update post
     */
    public function test_author_can_update_post(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($author)
            ->put("/forum/{$post->id}", [
                'title' => 'Updated Title',
                'content' => 'Updated content',
                'category' => 'training',
            ]);

        $post->refresh();
        $this->assertEquals('Updated Title', $post->title);
        $this->assertEquals('training', $post->category);
    }

    /**
     * Test only author can delete post
     */
    public function test_only_author_can_delete_post(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $otherUser = User::factory()->create(['role' => 'trainer']);
        
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($otherUser)
            ->delete("/forum/{$post->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('forum_posts', ['id' => $post->id]);
    }

    /**
     * Test author can delete post
     */
    public function test_author_can_delete_post(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $post = ForumPost::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($author)
            ->delete("/forum/{$post->id}");

        $this->assertDatabaseMissing('forum_posts', ['id' => $post->id]);
    }

    /**
     * Test only author can delete comment
     */
    public function test_only_author_can_delete_comment(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $otherUser = User::factory()->create(['role' => 'trainer']);
        
        $comment = ForumComment::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($otherUser)
            ->delete("/forum/comments/{$comment->id}");

        $response->assertStatus(403);
        $this->assertDatabaseHas('forum_comments', ['id' => $comment->id]);
    }

    /**
     * Test author can delete comment
     */
    public function test_author_can_delete_comment(): void
    {
        $author = User::factory()->create(['role' => 'runner']);
        $comment = ForumComment::factory()->create(['user_id' => $author->id]);

        $response = $this->actingAs($author)
            ->delete("/forum/comments/{$comment->id}");

        $this->assertDatabaseMissing('forum_comments', ['id' => $comment->id]);
    }

    /**
     * Test post helper methods
     */
    public function test_post_helper_methods(): void
    {
        $post = ForumPost::factory()->create();
        
        // Test like count
        $user1 = User::factory()->create();
        $user2 = User::factory()->create();
        
        ForumLike::create([
            'user_id' => $user1->id,
            'likeable_id' => $post->id,
            'likeable_type' => ForumPost::class,
        ]);
        
        ForumLike::create([
            'user_id' => $user2->id,
            'likeable_id' => $post->id,
            'likeable_type' => ForumPost::class,
        ]);

        $this->assertEquals(2, $post->likeCount());
        $this->assertTrue($post->isLikedBy($user1->id));
        $this->assertFalse($post->isLikedBy(999));
    }

    /**
     * Test comment count
     */
    public function test_comment_count(): void
    {
        $post = ForumPost::factory()->create();
        
        ForumComment::factory()->count(5)->create(['post_id' => $post->id]);

        $this->assertEquals(5, $post->commentCount());
    }

    /**
     * Test category filter
     */
    public function test_category_filter(): void
    {
        $user = User::factory()->create();
        
        ForumPost::factory()->count(3)->create(['category' => 'training']);
        ForumPost::factory()->count(2)->create(['category' => 'gear']);

        $trainingPosts = ForumPost::category('training')->get();
        $gearPosts = ForumPost::category('gear')->get();

        $this->assertCount(3, $trainingPosts);
        $this->assertCount(2, $gearPosts);
    }
}
