import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface CreateProps {
    categories: string[];
}

export default function Create({ categories }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        content: '',
        category: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/forum');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Forum Post
                    </h2>
                    <Link
                        href="/forum"
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title="Create Forum Post" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-6 border border-white/20">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    placeholder="Enter a descriptive title..."
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Category */}
                            <div>
                                <InputLabel htmlFor="category" value="Category *" />
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) => setData('category', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map((category) => (
                                        <option key={category} value={category} className="capitalize">
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.category} className="mt-2" />
                            </div>

                            {/* Content */}
                            <div>
                                <InputLabel htmlFor="content" value="Content *" />
                                <textarea
                                    id="content"
                                    value={data.content}
                                    onChange={(e) => setData('content', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={12}
                                    required
                                    placeholder="Share your thoughts, questions, or experiences..."
                                />
                                <InputError message={errors.content} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Maximum 10,000 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Link
                                    href="/forum"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Post'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Category Descriptions */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-3">
                            Category Guide:
                        </h3>
                        <dl className="text-sm text-blue-800 space-y-2">
                            <div>
                                <dt className="font-medium capitalize">General</dt>
                                <dd className="text-blue-700">General running discussions and topics</dd>
                            </div>
                            <div>
                                <dt className="font-medium capitalize">Training</dt>
                                <dd className="text-blue-700">Training tips, plans, and advice</dd>
                            </div>
                            <div>
                                <dt className="font-medium capitalize">Gear</dt>
                                <dd className="text-blue-700">Running shoes, clothing, and equipment</dd>
                            </div>
                            <div>
                                <dt className="font-medium capitalize">Nutrition</dt>
                                <dd className="text-blue-700">Diet, hydration, and supplements</dd>
                            </div>
                            <div>
                                <dt className="font-medium capitalize">Races</dt>
                                <dd className="text-blue-700">Race discussions, reviews, and results</dd>
                            </div>
                            <div>
                                <dt className="font-medium capitalize">Routes</dt>
                                <dd className="text-blue-700">Route recommendations and reviews</dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
