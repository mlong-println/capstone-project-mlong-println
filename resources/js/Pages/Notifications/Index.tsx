import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Notification {
    id: number;
    type: string;
    title: string;
    message: string;
    read: boolean;
    read_at: string | null;
    action_url: string | null;
    created_at: string;
}

interface NotificationsIndexProps {
    notifications: {
        data: Notification[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
}

export default function Index({ notifications }: NotificationsIndexProps) {
    const [localNotifications, setLocalNotifications] = useState(notifications.data);

    const markAsRead = (notificationId: number) => {
        router.post(`/notifications/${notificationId}/read`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev =>
                    prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
                );
            },
        });
    };

    const markAllAsRead = () => {
        router.post('/notifications/mark-all-read', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalNotifications(prev =>
                    prev.map(n => ({ ...n, read: true }))
                );
            },
        });
    };

    const deleteNotification = (notificationId: number) => {
        if (confirm('Are you sure you want to delete this notification?')) {
            router.delete(`/notifications/${notificationId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalNotifications(prev =>
                        prev.filter(n => n.id !== notificationId)
                    );
                },
            });
        }
    };

    const deleteAllRead = () => {
        if (confirm('Are you sure you want to delete all read notifications?')) {
            router.delete('/notifications/read/all', {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalNotifications(prev =>
                        prev.filter(n => !n.read)
                    );
                },
            });
        }
    };

    const unreadCount = localNotifications.filter(n => !n.read).length;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Notifications
                    </h2>
                    <div className="flex gap-2">
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                                Mark All Read
                            </button>
                        )}
                        <button
                            onClick={deleteAllRead}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                        >
                            Delete All Read
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Notifications" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {localNotifications.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow">
                            <p className="text-gray-500">No notifications yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {localNotifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`bg-white rounded-lg shadow p-4 transition ${
                                        !notification.read ? 'border-l-4 border-blue-500' : ''
                                    }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-gray-900">
                                                    {notification.title}
                                                </h3>
                                                {!notification.read && (
                                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                                                        New
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {notification.message}
                                            </p>
                                            <p className="mt-2 text-xs text-gray-400">
                                                {new Date(notification.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            {notification.action_url && (
                                                <Link
                                                    href={notification.action_url}
                                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                                >
                                                    View
                                                </Link>
                                            )}
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-sm text-green-600 hover:text-green-800 font-medium"
                                                >
                                                    Mark Read
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification.id)}
                                                className="text-sm text-red-600 hover:text-red-800 font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {notifications.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: notifications.last_page }, (_, i) => i + 1).map(page => (
                                <Link
                                    key={page}
                                    href={`/notifications?page=${page}`}
                                    className={`px-4 py-2 rounded-md ${
                                        page === notifications.current_page
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {page}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
