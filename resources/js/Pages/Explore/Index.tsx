import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface TopRunner {
    rank: number;
    user_name: string;
    formatted_time: string;
    formatted_pace: string;
}

interface PublicRoute {
    id: number;
    name: string;
    description: string | null;
    distance: number;
    difficulty: string;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
    total_runs: number;
    top_runners: TopRunner[];
}

interface ExploreIndexProps {
    routes: PublicRoute[];
}

export default function Index({ routes }: ExploreIndexProps) {
    const getMedalEmoji = (rank: number) => {
        if (rank === 1) return '🥇';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Explore Public Routes
                </h2>
            }
        >
            <Head title="Explore Routes" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {routes.length === 0 ? (
                        <div className="bg-white rounded-lg shadow p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">No public routes yet</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Check back later for public routes to explore!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {routes.map((route) => (
                                <div key={route.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <Link
                                                    href={`/explore/${route.id}`}
                                                    className="text-xl font-bold text-gray-900 hover:text-indigo-600"
                                                >
                                                    {route.name}
                                                </Link>
                                                <p className="mt-1 text-sm text-gray-600">
                                                    {route.description || 'No description'}
                                                </p>
                                            </div>
                                            <span className={`ml-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getDifficultyColor(route.difficulty)}`}>
                                                {route.difficulty}
                                            </span>
                                        </div>

                                        <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                                </svg>
                                                <span className="font-medium">{route.distance} km</span>
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                                <span>{route.total_runs} runs</span>
                                            </div>
                                        </div>

                                        {route.top_runners.length > 0 && (
                                            <div className="mt-4 border-t pt-4">
                                                <h4 className="text-sm font-semibold text-gray-700 mb-2">Top Runners</h4>
                                                <div className="space-y-2">
                                                    {route.top_runners.map((runner) => (
                                                        <div key={runner.rank} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center">
                                                                <span className="text-lg mr-2">{getMedalEmoji(runner.rank)}</span>
                                                                <span className="font-medium text-gray-900">{runner.user_name}</span>
                                                            </div>
                                                            <div className="text-gray-600">
                                                                <span className="font-semibold">{runner.formatted_time}</span>
                                                                <span className="ml-2 text-xs">({runner.formatted_pace})</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <div className="mt-4">
                                            <Link
                                                href={`/explore/${route.id}`}
                                                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800"
                                            >
                                                View Full Leaderboard →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
