import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    location: string | null;
    follow_status: string | null;
    follow_id: number | null;
}

interface IndexProps {
    users: User[];
    search: string;
}

export default function Index({ users, search: initialSearch }: IndexProps) {
    const [search, setSearch] = useState(initialSearch);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/users', { search }, { preserveState: true });
    };

    const handleFollow = async (userId: number) => {
        try {
            await window.axios.post(`/users/${userId}/follow`);
            router.reload({ only: ['users'] });
        } catch (error) {
            console.error('Failed to follow user:', error);
        }
    };

    const handleUnfollow = async (userId: number) => {
        try {
            await window.axios.delete(`/users/${userId}/unfollow`);
            router.reload({ only: ['users'] });
        } catch (error) {
            console.error('Failed to unfollow user:', error);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Find Users
                </h2>
            }
        >
            <Head title="Find Users" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="mb-6 bg-white rounded-lg shadow p-6">
                        <form onSubmit={handleSearch} className="flex gap-3">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by name or email..."
                                className="flex-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Users List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {users.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No users found. Try a different search.
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-200">
                                {users.map((user) => (
                                    <div key={user.id} className="p-6 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex-1">
                                            <Link
                                                href={`/users/${user.id}`}
                                                className="text-lg font-semibold text-indigo-600 hover:text-indigo-800"
                                            >
                                                {user.name}
                                            </Link>
                                            <p className="text-sm text-gray-600">{user.email}</p>
                                            {user.location && (
                                                <p className="text-sm text-gray-500 mt-1">
                                                    📍 {user.location}
                                                </p>
                                            )}
                                            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                                                user.role === 'admin' 
                                                    ? 'bg-purple-100 text-purple-800' 
                                                    : 'bg-blue-100 text-blue-800'
                                            }`}>
                                                {user.role}
                                            </span>
                                        </div>
                                        <div>
                                            {user.follow_status === 'approved' ? (
                                                <button
                                                    onClick={() => handleUnfollow(user.id)}
                                                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                                                >
                                                    Following
                                                </button>
                                            ) : user.follow_status === 'pending' ? (
                                                <button
                                                    disabled
                                                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-md cursor-not-allowed"
                                                >
                                                    Pending
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleFollow(user.id)}
                                                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                                >
                                                    Follow
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
