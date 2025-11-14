import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState, useMemo } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    recipient?: User | null;
    users: User[];
}

export default function Create({ recipient, users }: CreateProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        recipient_id: recipient?.id?.toString() || '',
        subject: '',
        body: '',
    });

    // Filter users based on search term
    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        const term = searchTerm.toLowerCase();
        return users.filter(user => 
            user.name.toLowerCase().includes(term) || 
            user.email.toLowerCase().includes(term)
        );
    }, [searchTerm, users]);

    // Get selected user
    const selectedUser = users.find(u => u.id.toString() === data.recipient_id);

    const selectUser = (user: User) => {
        setData('recipient_id', user.id.toString());
        setSearchTerm('');
        setShowDropdown(false);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/messages');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Compose Message
                    </h2>
                    <Link
                        href="/messages/inbox"
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title="Compose Message" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Recipient */}
                            <div className="relative">
                                <InputLabel htmlFor="recipient" value="Recipient *" />
                                
                                {recipient ? (
                                    <div className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 px-3 py-2">
                                        <p className="text-sm text-gray-900">
                                            <span className="font-medium">{recipient.name}</span>
                                            <span className="text-gray-500 ml-2">({recipient.email})</span>
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {selectedUser ? (
                                            <div className="mt-1 flex items-center justify-between border border-gray-300 rounded-md shadow-sm bg-white px-3 py-2">
                                                <div>
                                                    <span className="font-medium text-gray-900">{selectedUser.name}</span>
                                                    <span className="text-gray-500 text-sm ml-2">({selectedUser.email})</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setData('recipient_id', '')}
                                                    className="text-red-600 hover:text-red-800 text-sm"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <input
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e) => {
                                                        setSearchTerm(e.target.value);
                                                        setShowDropdown(true);
                                                    }}
                                                    onFocus={() => setShowDropdown(true)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    placeholder="Search by name or email..."
                                                />
                                                
                                                {showDropdown && filteredUsers.length > 0 && (
                                                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                                                        {filteredUsers.map(user => (
                                                            <button
                                                                key={user.id}
                                                                type="button"
                                                                onClick={() => selectUser(user)}
                                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                                                            >
                                                                <div className="font-medium text-gray-900">{user.name}</div>
                                                                <div className="text-sm text-gray-500">{user.email}</div>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </>
                                )}
                                
                                <InputError message={errors.recipient_id} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    {recipient ? 'Replying to this user' : 'Type to search for a user by name or email'}
                                </p>
                            </div>

                            {/* Subject */}
                            <div>
                                <InputLabel htmlFor="subject" value="Subject" />
                                <TextInput
                                    id="subject"
                                    type="text"
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="Enter message subject (optional)"
                                />
                                <InputError message={errors.subject} className="mt-2" />
                            </div>

                            {/* Message Body */}
                            <div>
                                <InputLabel htmlFor="body" value="Message *" />
                                <textarea
                                    id="body"
                                    value={data.body}
                                    onChange={(e) => setData('body', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={10}
                                    required
                                    placeholder="Type your message here..."
                                />
                                <InputError message={errors.body} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Maximum 5000 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between">
                                <Link
                                    href="/messages/inbox"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Sending...' : 'Send Message'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                            Messaging Tips:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Search for users by typing their name or email</li>
                            <li>Messages are private between you and the recipient</li>
                            <li>You'll receive a notification when someone messages you</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
