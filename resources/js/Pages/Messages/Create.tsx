import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface User {
    id: number;
    name: string;
    email: string;
}

interface CreateProps {
    recipient?: User | null;
}

export default function Create({ recipient }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        recipient_id: recipient?.id?.toString() || '',
        subject: '',
        body: '',
    });

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
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Recipient */}
                            <div>
                                <InputLabel htmlFor="recipient_id" value="Recipient User ID *" />
                                <TextInput
                                    id="recipient_id"
                                    type="number"
                                    value={data.recipient_id}
                                    onChange={(e) => setData('recipient_id', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    disabled={!!recipient}
                                />
                                {recipient && (
                                    <p className="mt-2 text-sm text-gray-600">
                                        Sending to: <span className="font-medium">{recipient.name}</span> ({recipient.email})
                                    </p>
                                )}
                                <InputError message={errors.recipient_id} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Enter the user ID of the person you want to message
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
                            How to find a user's ID:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>User IDs are displayed in the user directory (coming soon)</li>
                            <li>You can also find them in event participant lists</li>
                            <li>Or ask the person directly for their user ID</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
