import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RouteMap from '@/Components/RouteMap';
import { useState } from 'react';

interface Comment {
    id: number;
    comment: string;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface Run {
    id: number;
    start_time: string;
    end_time: string;
    completion_time: number;
    formatted_time: string;
    formatted_pace: string;
    elevation_gain: number | null;
    notes: string | null;
    photo: string | null;
    is_public: boolean;
    route: {
        id: number;
        name: string;
        distance: number;
        coordinates: Array<{ lat: number; lng: number }>;
        start_location: string;
        end_location: string;
    };
    user: {
        id: number;
        name: string;
    };
    comments: Comment[];
    likes_count: number;
    user_has_liked: boolean;
}

interface ShowRunProps {
    run: Run;
    auth: {
        user: {
            id: number;
        };
    };
}

export default function Show({ run, auth }: ShowRunProps) {
    const [deleting, setDeleting] = useState(false);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this run?')) {
            setDeleting(true);
            router.delete(`/runs/${run.id}`);
        }
    };

    const handleLike = () => {
        router.post(`/runs/${run.id}/like`, {}, {
            preserveScroll: true,
        });
    };

    const handleComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;

        setSubmitting(true);
        router.post(`/runs/${run.id}/comment`, 
            { comment },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setComment('');
                    setSubmitting(false);
                },
                onError: () => {
                    setSubmitting(false);
                },
            }
        );
    };

    const handleDeleteComment = (commentId: number) => {
        if (confirm('Are you sure you want to delete this comment?')) {
            router.delete(`/runs/comments/${commentId}`, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Run Details
                    </h2>
                    <Link
                        href="/runs"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Runs
                    </Link>
                </div>
            }
        >
            <Head title={`Run - ${run.route.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Run Summary Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{run.route.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{formatDate(run.start_time)}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Link
                                    href={`/runs/${run.id}/edit`}
                                    className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                                >
                                    Edit Run
                                </Link>
                                <button
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                                >
                                    {deleting ? 'Deleting...' : 'Delete Run'}
                                </button>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-blue-600 mb-1">Distance</div>
                                <div className="text-2xl font-bold text-blue-900">{run.route.distance} km</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-green-600 mb-1">Time</div>
                                <div className="text-2xl font-bold text-green-900">{run.formatted_time}</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-purple-600 mb-1">Pace</div>
                                <div className="text-2xl font-bold text-purple-900">{run.formatted_pace}</div>
                            </div>
                            {run.elevation_gain !== null && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm font-medium text-orange-600 mb-1">Elevation</div>
                                    <div className="text-2xl font-bold text-orange-900">{Math.round(run.elevation_gain)}m</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Route Map */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h4>
                        <div className="rounded-lg overflow-hidden">
                            <RouteMap coordinates={run.route.coordinates} />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Route:</span>
                                <Link
                                    href={`/routes/${run.route.id}`}
                                    className="ml-2 text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                    {run.route.name}
                                </Link>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Start:</span>
                                <span className="ml-2 text-sm text-gray-900">{run.route.start_location}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">End:</span>
                                <span className="ml-2 text-sm text-gray-900">{run.route.end_location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {run.notes && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{run.notes}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Started:</div>
                                <div className="text-sm text-gray-900">{formatDate(run.start_time)}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Finished:</div>
                                <div className="text-sm text-gray-900">{formatDate(run.end_time)}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Duration:</div>
                                <div className="text-sm text-gray-900">{run.formatted_time}</div>
                            </div>
                        </div>
                    </div>

                    {/* Likes and Comments */}
                    <div className="bg-white rounded-lg shadow p-6">
                        {/* Like Button */}
                        <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                            <button
                                onClick={handleLike}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                                    run.user_has_liked
                                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                <svg className="w-5 h-5" fill={run.user_has_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="font-medium">{run.likes_count}</span>
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">Comments ({run.comments.length})</h4>
                            
                            {/* Comment Form */}
                            <form onSubmit={handleComment} className="mb-6">
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Add a comment..."
                                    rows={3}
                                    maxLength={500}
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-xs text-gray-500">{comment.length}/500</span>
                                    <button
                                        type="submit"
                                        disabled={submitting || !comment.trim()}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {submitting ? 'Posting...' : 'Post Comment'}
                                    </button>
                                </div>
                            </form>

                            {/* Comments List */}
                            <div className="space-y-4">
                                {run.comments.length === 0 ? (
                                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                                ) : (
                                    run.comments.map((c) => (
                                        <div key={c.id} className="bg-gray-50 rounded-lg p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1">
                                                    <span className="font-semibold text-gray-900">{c.user.name}</span>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {new Date(c.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </span>
                                                </div>
                                                {c.user.id === auth.user.id && (
                                                    <button
                                                        onClick={() => handleDeleteComment(c.id)}
                                                        className="text-red-600 hover:text-red-800 text-sm"
                                                    >
                                                        Delete
                                                    </button>
                                                )}
                                            </div>
                                            <p className="text-gray-700">{c.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
