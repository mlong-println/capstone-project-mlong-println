import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import InputError from '@/Components/InputError';

interface Comment {
    id: number;
    user_id: number;
    content: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
    likes: any[];
}

interface ForumPost {
    id: number;
    user_id: number;
    title: string;
    content: string;
    category: string;
    pinned: boolean;
    locked: boolean;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
    };
    comments: Comment[];
    likes: any[];
}

interface ShowProps {
    post: ForumPost;
    likeCount: number;
    commentCount: number;
    userHasLiked: boolean;
    isAuthor: boolean;
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
}

export default function Show({ post, likeCount, commentCount, userHasLiked, isAuthor, auth }: ShowProps) {
    const page = usePage<any>();
    const flash = page.props.flash;

    const { data, setData, post: postComment, processing, errors, reset } = useForm({
        content: '',
    });

    const toggleLike = () => {
        router.post(`/forum/${post.id}/like`, {}, {
            preserveScroll: true,
        });
    };

    const toggleCommentLike = (commentId: number) => {
        router.post(`/forum/comments/${commentId}/like`, {}, {
            preserveScroll: true,
        });
    };

    const submitComment = (e: React.FormEvent) => {
        e.preventDefault();
        postComment(`/forum/${post.id}/comments`, {
            preserveScroll: true,
            onSuccess: () => {
                reset();
            },
        });
    };

    const deletePost = () => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/forum/${post.id}`);
        }
    };

    const deleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/forum/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            general: 'bg-gray-100 text-gray-800',
            training: 'bg-blue-100 text-blue-800',
            gear: 'bg-purple-100 text-purple-800',
            nutrition: 'bg-green-100 text-green-800',
            races: 'bg-red-100 text-red-800',
            routes: 'bg-yellow-100 text-yellow-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Forum Post
                    </h2>
                    <div className="flex gap-2">
                        {isAuthor && (
                            <>
                                <Link
                                    href={`/forum/${post.id}/edit`}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={deletePost}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                        <Link
                            href="/forum"
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                        >
                            Back to Forum
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={post.title} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-800">{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-800">{flash.error}</p>
                        </div>
                    )}

                    {/* Post Card */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/20">
                        <div className="p-6">
                            {/* Title and Badges */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h1 className="text-3xl font-bold text-gray-900 mb-3">
                                        {post.title}
                                    </h1>
                                    <div className="flex gap-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
                                            {post.category}
                                        </span>
                                        {post.pinned && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Pinned
                                            </span>
                                        )}
                                        {post.locked && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                Locked
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Author and Date */}
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b">
                                <div className="flex items-center">
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium mr-2">
                                        {post.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-900">{post.user.name}</span>
                                </div>
                                <span>•</span>
                                <span>{new Date(post.created_at).toLocaleString()}</span>
                            </div>

                            {/* Content */}
                            <div className="prose max-w-none mb-6">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {post.content}
                                </p>
                            </div>

                            {/* Like Button */}
                            <div className="pt-6 border-t">
                                <button
                                    onClick={toggleLike}
                                    className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition ${
                                        userHasLiked
                                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    <svg className="h-5 w-5 mr-2" fill={userHasLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    {userHasLiked ? 'Unlike' : 'Like'} ({likeCount})
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/20">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">
                                Comments ({commentCount})
                            </h2>

                            {/* Add Comment Form */}
                            {!post.locked && (
                                <form onSubmit={submitComment} className="mb-6">
                                    <textarea
                                        value={data.content}
                                        onChange={(e) => setData('content', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        rows={3}
                                        placeholder="Add a comment..."
                                        required
                                    />
                                    <InputError message={errors.content} className="mt-2" />
                                    <div className="mt-2 flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition disabled:opacity-50"
                                        >
                                            {processing ? 'Posting...' : 'Post Comment'}
                                        </button>
                                    </div>
                                </form>
                            )}

                            {post.locked && (
                                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                                    <p className="text-sm text-yellow-800">
                                        This post is locked. No new comments can be added.
                                    </p>
                                </div>
                            )}

                            {/* Comments List */}
                            {post.comments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No comments yet. Be the first to comment!</p>
                            ) : (
                                <div className="space-y-4">
                                    {post.comments.map((comment) => (
                                        <div key={comment.id} className="border-l-2 border-gray-200 pl-4 py-2">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="h-6 w-6 rounded-full bg-gray-600 flex items-center justify-center text-white text-xs font-medium">
                                                            {comment.user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="font-medium text-gray-900">{comment.user.name}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {new Date(comment.created_at).toLocaleString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-700 whitespace-pre-wrap mb-2">
                                                        {comment.content}
                                                    </p>
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={() => toggleCommentLike(comment.id)}
                                                            className={`inline-flex items-center text-sm ${
                                                                comment.likes.some(like => like.user_id === auth.user.id)
                                                                    ? 'text-red-600 hover:text-red-700'
                                                                    : 'text-gray-500 hover:text-gray-700'
                                                            }`}
                                                        >
                                                            <svg className="h-4 w-4 mr-1" fill={comment.likes.some(like => like.user_id === auth.user.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                            </svg>
                                                            {comment.likes.length}
                                                        </button>
                                                        {comment.user_id === auth.user.id && (
                                                            <button
                                                                onClick={() => deleteComment(comment.id)}
                                                                className="text-sm text-red-600 hover:text-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
