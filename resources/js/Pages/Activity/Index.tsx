import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface FollowRequest {
    id: number;
    type: string;
    user: User;
    message: string;
    created_at: string;
}

interface SocialNotification {
    id: number;
    type: string;
    title: string;
    message: string;
    data: string | null;
    created_at: string;
}

interface ActivityIndexProps {
    pendingFollowRequests: FollowRequest[];
    socialNotifications: {
        data: SocialNotification[];
        current_page: number;
        last_page: number;
    };
    unreadCount: number;
}

export default function Index({ pendingFollowRequests, socialNotifications, unreadCount }: ActivityIndexProps) {
    const [localRequests, setLocalRequests] = useState(pendingFollowRequests);

    const handleApprove = (followId: number) => {
        router.post(`/follows/${followId}/approve`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalRequests(prev => prev.filter(r => r.id !== followId));
            },
        });
    };

    const handleReject = (followId: number) => {
        router.post(`/follows/${followId}/reject`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalRequests(prev => prev.filter(r => r.id !== followId));
            },
        });
    };

    const markAllAsRead = () => {
        router.post('/activity/mark-all-read', {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Activity {unreadCount > 0 && `(${unreadCount} pending)`}
                    </h2>
                    {socialNotifications.data.length > 0 && (
                        <button
                            onClick={markAllAsRead}
                            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
                        >
                            Mark All Read
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Activity" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Pending Follow Requests */}
                    {localRequests.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                Follow Requests ({localRequests.length})
                            </h3>
                            <div className="space-y-3">
                                {localRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">👤</span>
                                            <div>
                                                <Link
                                                    href={`/users/${request.user.id}`}
                                                    className="font-medium text-gray-900 hover:text-indigo-600"
                                                >
                                                    {request.user.name}
                                                </Link>
                                                <p className="text-sm text-gray-600">{request.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {new Date(request.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Recent Activity */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Recent Activity
                        </h3>
                        {socialNotifications.data.length === 0 ? (
                            <p className="text-gray-500 text-center py-8">No recent activity</p>
                        ) : (
                            <div className="space-y-3">
                                {socialNotifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                    >
                                        <span className="text-2xl">
                                            {notification.type === 'follow_approved' && '✅'}
                                            {notification.type === 'like' && '❤️'}
                                            {notification.type === 'comment' && '💬'}
                                        </span>
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Pagination */}
                        {socialNotifications.last_page > 1 && (
                            <div className="mt-6 flex justify-center gap-2">
                                {Array.from({ length: socialNotifications.last_page }, (_, i) => i + 1).map(page => (
                                    <Link
                                        key={page}
                                        href={`/activity?page=${page}`}
                                        className={`px-4 py-2 rounded-md ${
                                            page === socialNotifications.current_page
                                                ? 'bg-indigo-600 text-white'
                                                : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {localRequests.length === 0 && socialNotifications.data.length === 0 && (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <span className="text-6xl">💙</span>
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No activity yet</h3>
                            <p className="mt-2 text-sm text-gray-600">
                                When people follow you or interact with your content, you'll see it here
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
