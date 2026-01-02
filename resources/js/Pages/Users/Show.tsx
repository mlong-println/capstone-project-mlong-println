import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
}

interface PendingRequest {
    id: number;
    follower: User;
    created_at: string;
}

interface UserProfileProps {
    profileUser: User & { role: string; location?: string };
    followStatus: string | null;
    followId: number | null;
    followers: User[];
    following: User[];
    pendingRequests: PendingRequest[];
    stats: {
        followers_count: number;
        following_count: number;
        total_runs: number;
        total_distance: number;
    };
    isOwnProfile: boolean;
    canViewFullProfile: boolean;
}

export default function Show({ 
    profileUser, 
    followStatus, 
    followId,
    followers, 
    following, 
    pendingRequests,
    stats, 
    isOwnProfile,
    canViewFullProfile
}: UserProfileProps) {
    
    const handleFollow = () => {
        router.post(`/users/${profileUser.id}/follow`, {}, {
            preserveScroll: true,
        });
    };

    const handleUnfollow = () => {
        if (confirm('Are you sure you want to unfollow this user?')) {
            router.delete(`/users/${profileUser.id}/unfollow`, {
                preserveScroll: true,
            });
        }
    };

    const handleApprove = (followId: number) => {
        router.post(`/follows/${followId}/approve`, {}, {
            preserveScroll: true,
        });
    };

    const handleReject = (followId: number) => {
        router.post(`/follows/${followId}/reject`, {}, {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    {profileUser.name}'s Profile
                </h2>
            }
        >
            <Head title={`${profileUser.name}'s Profile`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Profile Header */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{profileUser.name}</h3>
                                {canViewFullProfile && profileUser.email && (
                                    <p className="text-sm text-gray-600 mt-1">{profileUser.email}</p>
                                )}
                                {profileUser.location && (
                                    <p className="text-sm text-gray-600 mt-1">📍 {profileUser.location}</p>
                                )}
                                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full capitalize">
                                    {profileUser.role}
                                </span>
                            </div>
                            
                            {/* Follow Button */}
                            {!isOwnProfile && (
                                <div>
                                    {followStatus === null && (
                                        <button
                                            onClick={handleFollow}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
                                        >
                                            Follow
                                        </button>
                                    )}
                                    {followStatus === 'pending' && (
                                        <button
                                            onClick={handleUnfollow}
                                            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 font-medium"
                                        >
                                            Request Pending
                                        </button>
                                    )}
                                    {followStatus === 'approved' && (
                                        <button
                                            onClick={handleUnfollow}
                                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                                        >
                                            Unfollow
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-blue-900">{stats.followers_count}</div>
                                <div className="text-sm text-blue-600">Followers</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-2xl font-bold text-green-900">{stats.following_count}</div>
                                <div className="text-sm text-green-600">Following</div>
                            </div>
                            {canViewFullProfile && (
                                <>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-purple-900">{stats.total_runs}</div>
                                        <div className="text-sm text-purple-600">Total Runs</div>
                                    </div>
                                    <div className="bg-orange-50 rounded-lg p-4">
                                        <div className="text-2xl font-bold text-orange-900">{stats.total_distance} km</div>
                                        <div className="text-sm text-orange-600">Total Distance</div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Restricted Profile Message */}
                    {!canViewFullProfile && !isOwnProfile && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                            <p className="text-yellow-800 font-medium">
                                🔒 This profile is private
                            </p>
                            <p className="text-sm text-yellow-700 mt-2">
                                Follow this user to see their full profile, runs, and activity
                            </p>
                        </div>
                    )}

                    {/* Pending Follow Requests (only for own profile) */}
                    {isOwnProfile && pendingRequests.length > 0 && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Pending Follow Requests ({pendingRequests.length})
                            </h4>
                            <div className="space-y-3">
                                {pendingRequests.map((request) => (
                                    <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <Link
                                                href={`/users/${request.follower.id}`}
                                                className="font-medium text-gray-900 hover:text-indigo-600"
                                            >
                                                {request.follower.name}
                                            </Link>
                                            <p className="text-sm text-gray-600">{request.follower.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApprove(request.id)}
                                                className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(request.id)}
                                                className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Followers and Following */}
                    {canViewFullProfile && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Followers */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Followers ({followers.length})
                            </h4>
                            {followers.length > 0 ? (
                                <div className="space-y-2">
                                    {followers.map((follower) => (
                                        <Link
                                            key={follower.id}
                                            href={`/users/${follower.id}`}
                                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <div className="font-medium text-gray-900">{follower.name}</div>
                                            <div className="text-sm text-gray-600">{follower.email}</div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">No followers yet</p>
                            )}
                        </div>

                        {/* Following */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                                Following ({following.length})
                            </h4>
                            {following.length > 0 ? (
                                <div className="space-y-2">
                                    {following.map((user) => (
                                        <Link
                                            key={user.id}
                                            href={`/users/${user.id}`}
                                            className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                        >
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-600">{user.email}</div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-500">Not following anyone yet</p>
                            )}
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
