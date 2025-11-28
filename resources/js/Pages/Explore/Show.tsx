import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RouteMap from '@/Components/RouteMap';
import { useState } from 'react';

interface LeaderboardEntry {
    rank: number;
    user_id: number;
    user_name: string;
    user_gender: string;
    best_time: number;
    formatted_time: string;
    formatted_pace: string;
    run_count: number;
    medal: 'gold' | 'silver' | 'bronze' | null;
}

interface PublicRoute {
    id: number;
    name: string;
    description: string | null;
    distance: number;
    difficulty: string;
    coordinates: any;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
}

interface ExploreShowProps {
    route: PublicRoute;
    leaderboard: LeaderboardEntry[];
    currentFilter: string;
    totalRuns: number;
}

export default function Show({ route, leaderboard, currentFilter, totalRuns }: ExploreShowProps) {
    const [filter, setFilter] = useState(currentFilter);

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        router.get(`/explore/${route.id}`, { filter: newFilter }, { preserveState: true });
    };

    const getMedalEmoji = (medal: string | null) => {
        if (medal === 'gold') return '🥇';
        if (medal === 'silver') return '🥈';
        if (medal === 'bronze') return '🥉';
        return '';
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'easy':
                return 'bg-green-100 text-green-800';
            case 'moderate':
                return 'bg-yellow-100 text-yellow-800';
            case 'hard':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {route.name}
                    </h2>
                    <Link
                        href="/explore"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Explore
                    </Link>
                </div>
            }
        >
            <Head title={`${route.name} - Leaderboard`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Route Info */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{route.name}</h3>
                                <p className="mt-1 text-sm text-gray-600">{route.description || 'No description'}</p>
                            </div>
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(route.difficulty)}`}>
                                {route.difficulty}
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-blue-600 mb-1">Distance</div>
                                <div className="text-2xl font-bold text-blue-900">{route.distance} km</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-green-600 mb-1">Total Runs</div>
                                <div className="text-2xl font-bold text-green-900">{totalRuns}</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-purple-600 mb-1">Runners</div>
                                <div className="text-2xl font-bold text-purple-900">{leaderboard.length}</div>
                            </div>
                        </div>

                        {/* Route Map */}
                        {route.coordinates && route.coordinates.length > 0 && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-900 mb-3">Route Map</h4>
                                <RouteMap
                                    coordinates={route.coordinates}
                                    editable={false}
                                />
                            </div>
                        )}
                    </div>

                    {/* Leaderboard */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Leaderboard</h3>
                            
                            {/* Filter Buttons */}
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleFilterChange('overall')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        filter === 'overall'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Overall
                                </button>
                                <button
                                    onClick={() => handleFilterChange('male')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        filter === 'male'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Male
                                </button>
                                <button
                                    onClick={() => handleFilterChange('female')}
                                    className={`px-4 py-2 text-sm font-medium rounded-md ${
                                        filter === 'female'
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Female
                                </button>
                            </div>
                        </div>

                        {leaderboard.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No runs recorded yet. Be the first!</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rank
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Runner
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Best Time
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Pace
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Runs
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {leaderboard.map((entry) => (
                                            <tr 
                                                key={entry.user_id} 
                                                className={entry.medal ? 'bg-yellow-50' : ''}
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {entry.medal && (
                                                            <span className="text-2xl mr-2">
                                                                {getMedalEmoji(entry.medal)}
                                                            </span>
                                                        )}
                                                        <span className="text-sm font-medium text-gray-900">
                                                            #{entry.rank}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {entry.user_name}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`text-sm font-semibold ${entry.medal ? 'text-yellow-700' : 'text-gray-900'}`}>
                                                        {entry.formatted_time}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {entry.formatted_pace}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                    {entry.run_count} {entry.run_count === 1 ? 'run' : 'runs'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
