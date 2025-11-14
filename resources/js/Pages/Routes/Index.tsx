import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface RunningRoute {
    id: number;
    name: string;
    description: string;
    distance: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
    average_rating: number;
    ratings_count: number;
}

interface IndexProps {
    routes: RunningRoute[];
}

export default function Index({ routes }: IndexProps) {
    const page = usePage<any>();
    const flash = page.props.flash;

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

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">
                    ({rating.toFixed(1)})
                </span>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight">
                        Running Routes
                    </h2>
                    <Link
                        href={route('routes.create')}
                        className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                    >
                        Create New Route
                    </Link>
                </div>
            }
        >
            <Head title="Routes" />

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

                    {routes.length === 0 ? (
                        <div className="bg-white p-8 text-center rounded-lg shadow">
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
                            <h3 className="mt-2 text-sm font-semibold text-gray-900">
                                No routes yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Get started by creating a new running route.
                            </p>
                            <div className="mt-6">
                                <Link
                                    href={route('routes.create')}
                                    className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                >
                                    Create Route
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {routes.map((runningRoute) => (
                                <Link
                                    key={runningRoute.id}
                                    href={route('routes.show', runningRoute.id)}
                                    className="bg-white rounded-lg shadow hover:shadow-xl transition p-6"
                                >
                                    <div className="flex items-start justify-between">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {runningRoute.name}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getDifficultyColor(
                                                runningRoute.difficulty
                                            )}`}
                                        >
                                            {runningRoute.difficulty}
                                        </span>
                                    </div>

                                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                        {runningRoute.description || 'No description'}
                                    </p>

                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg
                                                className="mr-1.5 h-5 w-5 text-gray-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                                />
                                            </svg>
                                            {runningRoute.distance} km
                                        </div>
                                    </div>

                                    <div className="mt-3">
                                        {runningRoute.ratings_count > 0 ? (
                                            renderStars(runningRoute.average_rating)
                                        ) : (
                                            <span className="text-sm text-gray-500">
                                                No ratings yet
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                                        <span>By {runningRoute.creator.name}</span>
                                        <span>{runningRoute.created_at}</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
