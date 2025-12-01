import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    subject: string;
    body: string;
    read: boolean;
    read_at: string | null;
    created_at: string;
    sender: {
        id: number;
        name: string;
        email: string;
    };
}

interface InboxProps {
    messages: {
        data: Message[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    unreadCount: number;
}

export default function Inbox({ messages, unreadCount }: InboxProps) {
    const [localMessages, setLocalMessages] = useState(messages.data);

    const deleteMessage = (messageId: number) => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(`/messages/${messageId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalMessages(prev => prev.filter(m => m.id !== messageId));
                },
            });
        }
    };

    const markAllAsRead = () => {
        router.post('/messages/mark-all-read', {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalMessages(prev =>
                    prev.map(m => ({ ...m, read: true }))
                );
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Inbox {unreadCount > 0 && `(${unreadCount} unread)`}
                    </h2>
                    <div className="flex gap-2">
                        <Link
                            href="/messages/create"
                            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                        >
                            Compose
                        </Link>
                        <Link
                            href="/messages/sent"
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                        >
                            Sent Messages
                        </Link>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                            >
                                Mark All Read
                            </button>
                        )}
                    </div>
                </div>
            }
        >
            <Head title="Inbox" />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8">
                    {localMessages.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm p-8 text-center rounded-lg shadow-lg border border-white/20">
                            <p className="text-gray-500">No messages in your inbox.</p>
                            <Link
                                href="/messages/create"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Send your first message
                            </Link>
                        </div>
                    ) : (
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/20">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            From
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Subject
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {localMessages.map((message) => (
                                        <tr
                                            key={message.id}
                                            className={`hover:bg-gray-50 transition ${
                                                !message.read ? 'bg-blue-50' : ''
                                            }`}
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {!message.read && (
                                                        <span className="inline-block h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                                                    )}
                                                    <Link
                                                        href={`/messages/user/${message.sender.id}`}
                                                        className="font-medium text-indigo-600 hover:text-indigo-800"
                                                    >
                                                        {message.sender.name}
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Link
                                                    href={`/messages/${message.id}`}
                                                    className="text-sm text-gray-900 hover:text-blue-600"
                                                >
                                                    <div className={!message.read ? 'font-semibold' : ''}>
                                                        {message.subject}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 truncate max-w-md">
                                                        {message.body.substring(0, 80)}...
                                                    </div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {new Date(message.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={`/messages/${message.id}`}
                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                >
                                                    View
                                                </Link>
                                                <button
                                                    onClick={() => deleteMessage(message.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Pagination */}
                    {messages.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: messages.last_page }, (_, i) => i + 1).map(page => (
                                <Link
                                    key={page}
                                    href={`/messages/inbox?page=${page}`}
                                    className={`px-4 py-2 rounded-md ${
                                        page === messages.current_page
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
