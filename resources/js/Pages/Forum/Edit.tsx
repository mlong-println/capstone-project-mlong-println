import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface ForumPost {
    id: number;
    title: string;
    content: string;
    category: string;
}

interface EditProps {
    post: ForumPost;
    categories: string[];
}

export default function Edit({ post, categories }: EditProps) {
    const { data, setData, put, processing, errors } = useForm({
        title: post.title,
        content: post.content,
        category: post.category,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/forum/${post.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Forum Post
                    </h2>
                    <Link
                        href={`/forum/${post.id}`}
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title="Edit Forum Post" />

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
                                />
                                <InputError message={errors.content} className="mt-2" />
                                <p className="mt-1 text-xs text-gray-500">
                                    Maximum 10,000 characters
                                </p>
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Link
                                    href={`/forum/${post.id}`}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Post'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
