import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

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
    recipient: {
        id: number;
        name: string;
        email: string;
    };
}

interface ShowProps {
    message: Message;
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
        };
    };
}

export default function Show({ message, auth }: ShowProps) {
    const isRecipient = message.recipient_id === auth.user.id;
    const isSender = message.sender_id === auth.user.id;

    const deleteMessage = () => {
        if (confirm('Are you sure you want to delete this message?')) {
            router.delete(`/messages/${message.id}`, {
                onSuccess: () => {
                    router.visit(isRecipient ? '/messages/inbox' : '/messages/sent');
                },
            });
        }
    };

    const replyToMessage = () => {
        router.visit(`/messages/create?recipient=${message.sender_id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Message
                    </h2>
                    <div className="flex gap-2">
                        {isRecipient && (
                            <button
                                onClick={replyToMessage}
                                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                            >
                                Reply
                            </button>
                        )}
                        <button
                            onClick={deleteMessage}
                            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                        >
                            Delete
                        </button>
                        <Link
                            href={isRecipient ? '/messages/inbox' : '/messages/sent'}
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                        >
                            Back
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={message.subject} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-white/20">
                        {/* Message Header */}
                        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4">
                                {message.subject}
                            </h1>
                            <div className="flex items-center justify-between text-sm">
                                <div>
                                    <p className="text-gray-700">
                                        <span className="font-medium">From:</span>{' '}
                                        <Link
                                            href={`/users/${message.sender.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            {message.sender.name}
                                        </Link>
                                        {' '}({message.sender.email})
                                    </p>
                                    <p className="text-gray-700 mt-1">
                                        <span className="font-medium">To:</span>{' '}
                                        <Link
                                            href={`/users/${message.recipient.id}`}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            {message.recipient.name}
                                        </Link>
                                        {' '}({message.recipient.email})
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-500">
                                        {new Date(message.created_at).toLocaleString()}
                                    </p>
                                    {message.read && message.read_at && (
                                        <p className="text-xs text-green-600 mt-1">
                                            Read on {new Date(message.read_at).toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="px-6 py-8">
                            <div className="prose max-w-none">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                                    {message.body}
                                </p>
                            </div>
                        </div>

                        {/* Message Footer */}
                        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-500">
                                    {isRecipient ? 'Received message' : 'Sent message'}
                                </div>
                                <div className="flex gap-2">
                                    {isRecipient && (
                                        <button
                                            onClick={replyToMessage}
                                            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Reply to {message.sender.name}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
