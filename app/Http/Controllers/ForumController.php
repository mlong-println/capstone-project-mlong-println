<?php

namespace App\Http\Controllers;

use App\Models\ForumPost;
use App\Models\ForumComment;
use App\Models\ForumLike;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ForumController extends Controller
{
    /**
     * Display a listing of forum posts
     */
    public function index(Request $request)
    {
        $query = ForumPost::with(['user', 'comments', 'likes'])
            ->withCount(['comments', 'likes']);

        // Filter by category if provided
        if ($request->has('category') && $request->category !== '') {
            $query->category($request->category);
        }

        $posts = $query->latestActivity()->paginate(20);

        $categories = ['general', 'training', 'gear', 'nutrition', 'races', 'routes'];

        return Inertia::render('Forum/Index', [
            'posts' => $posts,
            'categories' => $categories,
            'currentCategory' => $request->category ?? '',
        ]);
    }

    /**
     * Show the form for creating a new post
     */
    public function create()
    {
        $categories = ['general', 'training', 'gear', 'nutrition', 'races', 'routes'];

        return Inertia::render('Forum/Create', [
            'categories' => $categories,
        ]);
    }

    /**
     * Store a newly created post
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'category' => 'required|in:general,training,gear,nutrition,races,routes',
        ]);

        $post = ForumPost::create([
            ...$validated,
            'user_id' => auth()->id(),
        ]);

        return Redirect::route('forum.show', $post)->with('success', 'Post created successfully!');
    }

    /**
     * Display the specified post
     */
    public function show(ForumPost $post)
    {
        $post->load(['user', 'comments.user', 'comments.likes', 'likes']);

        return Inertia::render('Forum/Show', [
            'post' => $post,
            'likeCount' => $post->likeCount(),
            'commentCount' => $post->commentCount(),
            'userHasLiked' => auth()->check() ? $post->isLikedBy(auth()->id()) : false,
            'isAuthor' => auth()->check() && $post->user_id === auth()->id(),
        ]);
    }

    /**
     * Show the form for editing the specified post
     */
    public function edit(ForumPost $post)
    {
        // Only author can edit
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $categories = ['general', 'training', 'gear', 'nutrition', 'races', 'routes'];

        return Inertia::render('Forum/Edit', [
            'post' => $post,
            'categories' => $categories,
        ]);
    }

    /**
     * Update the specified post
     */
    public function update(Request $request, ForumPost $post)
    {
        // Only author can update
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:10000',
            'category' => 'required|in:general,training,gear,nutrition,races,routes',
        ]);

        $post->update($validated);

        return Redirect::route('forum.show', $post)->with('success', 'Post updated successfully!');
    }

    /**
     * Remove the specified post
     */
    public function destroy(ForumPost $post)
    {
        // Only author can delete
        if ($post->user_id !== auth()->id()) {
            abort(403);
        }

        $post->delete();

        return Redirect::route('forum.index')->with('success', 'Post deleted successfully!');
    }

    /**
     * Store a comment on a post
     */
    public function storeComment(Request $request, ForumPost $post)
    {
        $validated = $request->validate([
            'content' => 'required|string|max:5000',
        ]);

        $comment = ForumComment::create([
            'post_id' => $post->id,
            'user_id' => auth()->id(),
            'content' => $validated['content'],
        ]);

        // Update post's updated_at to bump it in activity
        $post->touch();

        // Notify post author if someone else commented
        if ($post->user_id !== auth()->id()) {
            Notification::create([
                'user_id' => $post->user_id,
                'type' => 'forum_reply',
                'title' => 'New Comment on Your Post',
                'message' => auth()->user()->name . ' commented on "' . $post->title . '"',
                'data' => ['post_id' => $post->id, 'comment_id' => $comment->id],
                'action_url' => route('forum.show', $post->id),
            ]);
        }

        return Redirect::back()->with('success', 'Comment added successfully!');
    }

    /**
     * Delete a comment
     */
    public function destroyComment(ForumComment $comment)
    {
        // Only author can delete
        if ($comment->user_id !== auth()->id()) {
            abort(403);
        }

        $comment->delete();

        return Redirect::back()->with('success', 'Comment deleted successfully!');
    }

    /**
     * Toggle like on a post
     */
    public function toggleLike(ForumPost $post)
    {
        $user = auth()->user();

        $existingLike = ForumLike::where('user_id', $user->id)
            ->where('likeable_id', $post->id)
            ->where('likeable_type', ForumPost::class)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            ForumLike::create([
                'user_id' => $user->id,
                'likeable_id' => $post->id,
                'likeable_type' => ForumPost::class,
            ]);
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likeCount' => $post->likeCount(),
        ]);
    }

    /**
     * Toggle like on a comment
     */
    public function toggleCommentLike(ForumComment $comment)
    {
        $user = auth()->user();

        $existingLike = ForumLike::where('user_id', $user->id)
            ->where('likeable_id', $comment->id)
            ->where('likeable_type', ForumComment::class)
            ->first();

        if ($existingLike) {
            $existingLike->delete();
            $liked = false;
        } else {
            ForumLike::create([
                'user_id' => $user->id,
                'likeable_id' => $comment->id,
                'likeable_type' => ForumComment::class,
            ]);
            $liked = true;
        }

        return response()->json([
            'liked' => $liked,
            'likeCount' => $comment->likeCount(),
        ]);
    }
}
