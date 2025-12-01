import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { FormEventHandler, useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface Message {
    id: number;
    sender_id: number;
    recipient_id: number;
    sender: User;
    recipient: User;
    subject: string;
    body: string;
    read_at: string | null;
    created_at: string;
}

interface ConversationProps {
    otherUser: User;
    messages: Message[];
}

export default function Conversation({ otherUser, messages }: ConversationProps) {
    const [body, setBody] = useState('');
    const [sending, setSending] = useState(false);

    const handleSubmit: FormEventHandler = (e) => {
        e.preventDefault();
        
        if (!body.trim()) return;
        
        setSending(true);
        
        router.post('/messages', {
            recipient_id: otherUser.id,
            subject: 'Re: Conversation',
            body: body,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setBody('');
                setSending(false);
            },
            onError: () => {
                setSending(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Conversation with{' '}
                        <Link 
                            href={`/users/${otherUser.id}`}
                            className="text-indigo-600 hover:text-indigo-800"
                        >
                            {otherUser.name}
                        </Link>
                    </h2>
                    <Link
                        href="/messages/inbox"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Inbox
                    </Link>
                </div>
            }
        >
            <Head title={`Conversation with ${otherUser.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Messages Thread */}
                    <div className="bg-white rounded-lg shadow mb-6">
                        <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto">
                            {messages.length === 0 ? (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No messages yet. Start the conversation below!</p>
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const isCurrentUser = message.sender_id === (window as any).Laravel?.user?.id;
                                    
                                    return (
                                        <div
                                            key={message.id}
                                            className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg p-4 ${
                                                    isCurrentUser
                                                        ? 'bg-indigo-600 text-white'
                                                        : 'bg-gray-100 text-gray-900'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="font-semibold text-sm">
                                                        {message.sender.name}
                                                    </span>
                                                    <span className={`text-xs ${isCurrentUser ? 'text-indigo-200' : 'text-gray-500'}`}>
                                                        {new Date(message.created_at).toLocaleString()}
                                                    </span>
                                                </div>
                                                <p className="whitespace-pre-wrap">{message.body}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Reply Form */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Send a Message</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Type your message..."
                                    required
                                />
                            </div>
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={sending || !body.trim()}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? 'Sending...' : 'Send Message'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
