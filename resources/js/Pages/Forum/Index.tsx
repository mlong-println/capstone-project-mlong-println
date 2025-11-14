import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface ForumPost {
    id: number;
    user_id: number;
    title: string;
    content: string;
    category: string;
    pinned: boolean;
    locked: boolean;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
    };
    comments_count: number;
    likes_count: number;
}

interface ForumIndexProps {
    posts: {
        data: ForumPost[];
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: string[];
    currentCategory: string;
}

export default function Index({ posts, categories, currentCategory }: ForumIndexProps) {
    const page = usePage<any>();
    const flash = page.props.flash;
    const [selectedCategory, setSelectedCategory] = useState(currentCategory);

    const filterByCategory = (category: string) => {
        setSelectedCategory(category);
        if (category === '') {
            router.visit('/forum');
        } else {
            router.visit(`/forum?category=${category}`);
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            general: 'bg-gray-100 text-gray-800',
            training: 'bg-blue-100 text-blue-800',
            gear: 'bg-purple-100 text-purple-800',
            nutrition: 'bg-green-100 text-green-800',
            races: 'bg-red-100 text-red-800',
            routes: 'bg-yellow-100 text-yellow-800',
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Forum
                    </h2>
                    <Link
                        href="/forum/create"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                        Create Post
                    </Link>
                </div>
            }
        >
            <Head title="Forum" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-800">{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-800">{flash.error}</p>
                        </div>
                    )}

                    {/* Category Filter */}
                    <div className="mb-6 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-white/20 p-4">
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => filterByCategory('')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                                    selectedCategory === ''
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All Categories
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    onClick={() => filterByCategory(category)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition capitalize ${
                                        selectedCategory === category
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Posts List */}
                    {posts.data.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm p-8 text-center rounded-lg shadow-lg border border-white/20">
                            <p className="text-gray-500">
                                {selectedCategory 
                                    ? `No posts in the ${selectedCategory} category yet.`
                                    : 'No posts yet.'
                                }
                            </p>
                            <Link
                                href="/forum/create"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Create the first post
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {posts.data.map((post) => (
                                <div
                                    key={post.id}
                                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition p-6 border border-white/20"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            {/* Title and Badges */}
                                            <div className="flex items-center gap-2 mb-2">
                                                <Link
                                                    href={`/forum/${post.id}`}
                                                    className="text-xl font-semibold text-gray-900 hover:text-blue-600"
                                                >
                                                    {post.title}
                                                </Link>
                                                {post.pinned && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                                        Pinned
                                                    </span>
                                                )}
                                                {post.locked && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                        Locked
                                                    </span>
                                                )}
                                            </div>

                                            {/* Category */}
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getCategoryColor(post.category)}`}>
                                                {post.category}
                                            </span>

                                            {/* Content Preview */}
                                            <p className="mt-3 text-gray-600 line-clamp-2">
                                                {post.content}
                                            </p>

                                            {/* Meta Information */}
                                            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    {post.user.name}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                    </svg>
                                                    {post.comments_count} {post.comments_count === 1 ? 'comment' : 'comments'}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    {post.likes_count} {post.likes_count === 1 ? 'like' : 'likes'}
                                                </div>
                                                <div className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    {new Date(post.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <Link
                                            href={`/forum/${post.id}`}
                                            className="ml-4 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                                        >
                                            View
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: posts.last_page }, (_, i) => i + 1).map(page => (
                                <Link
                                    key={page}
                                    href={`/forum?page=${page}${selectedCategory ? `&category=${selectedCategory}` : ''}`}
                                    className={`px-4 py-2 rounded-md ${
                                        page === posts.current_page
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
