import { Head, Link, useForm, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

interface Rating {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
    };
}

interface RunningRoute {
    id: number;
    name: string;
    description: string | null;
    distance: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    coordinates: any;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
    average_rating: number;
    ratings_count: number;
    ratings: Rating[];
}

interface ShowProps {
    route: RunningRoute;
    userRating: {
        id: number;
        rating: number;
        comment: string | null;
    } | null;
    canEdit: boolean;
}

export default function Show({ route: runningRoute, userRating, canEdit }: ShowProps) {
    const page = usePage<any>();
    const flash = page.props.flash;
    const [showRatingForm, setShowRatingForm] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        rating: userRating?.rating || 5,
        comment: userRating?.comment || '',
    });

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

    const renderStars = (rating: number, interactive: boolean = false, onChange?: (rating: number) => void) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        onClick={() => interactive && onChange && onChange(star)}
                        className={`w-6 h-6 ${
                            star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        } ${interactive ? 'cursor-pointer hover:text-yellow-300' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const submitRating = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('routes.rate', runningRoute.id), {
            onSuccess: () => {
                setShowRatingForm(false);
                reset();
            },
        });
    };

    const deleteRoute = () => {
        if (confirm('Are you sure you want to delete this route?')) {
            router.delete(route('routes.destroy', runningRoute.id));
        }
    };

    const deleteRating = (ratingId: number) => {
        if (confirm('Are you sure you want to delete your rating?')) {
            router.delete(route('routes.ratings.destroy', [runningRoute.id, ratingId]));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        {runningRoute.name}
                    </h2>
                    {canEdit && (
                        <div className="flex gap-2">
                            <Link
                                href={route('routes.edit', runningRoute.id)}
                                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={deleteRoute}
                                className="inline-flex items-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            <Head title={runningRoute.name} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Flash Messages */}
                    {flash?.success && (
                        <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                            <p className="text-sm text-green-800">{flash.success}</p>
                        </div>
                    )}
                    {flash?.error && (
                        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                            <p className="text-sm text-red-800">{flash.error}</p>
                        </div>
                    )}

                    {/* Route Details */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            {runningRoute.name}
                                        </h1>
                                        <span
                                            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getDifficultyColor(
                                                runningRoute.difficulty
                                            )}`}
                                        >
                                            {runningRoute.difficulty}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-gray-600">
                                        {runningRoute.description || 'No description provided'}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 text-gray-400 mr-2"
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
                                    <span className="text-sm text-gray-600">
                                        <strong className="text-gray-900">{runningRoute.distance} km</strong> distance
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 text-gray-400 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-600">
                                        Created by <strong className="text-gray-900">{runningRoute.creator.name}</strong>
                                    </span>
                                </div>
                                <div className="flex items-center">
                                    <svg
                                        className="h-5 w-5 text-gray-400 mr-2"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="text-sm text-gray-600">{runningRoute.created_at}</span>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-6">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
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
                                    <p className="mt-2 text-sm text-gray-500">
                                        Interactive map view coming soon
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ratings Section */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        Ratings & Reviews
                                    </h3>
                                    {runningRoute.ratings_count > 0 && (
                                        <div className="mt-2 flex items-center gap-2">
                                            {renderStars(runningRoute.average_rating)}
                                            <span className="text-sm text-gray-600">
                                                {runningRoute.ratings_count} {runningRoute.ratings_count === 1 ? 'rating' : 'ratings'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                {!userRating && (
                                    <button
                                        onClick={() => setShowRatingForm(!showRatingForm)}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
                                    >
                                        {showRatingForm ? 'Cancel' : 'Add Rating'}
                                    </button>
                                )}
                            </div>

                            {/* Rating Form */}
                            {(showRatingForm || userRating) && (
                                <form onSubmit={submitRating} className="mb-6 p-4 bg-gray-50 rounded-lg">
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Your Rating
                                            </label>
                                            {renderStars(data.rating, true, (rating) => setData('rating', rating))}
                                            <InputError message={errors.rating} className="mt-2" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Comment (Optional)
                                            </label>
                                            <textarea
                                                value={data.comment}
                                                onChange={(e) => setData('comment', e.target.value)}
                                                className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                rows={3}
                                                placeholder="Share your experience with this route..."
                                            />
                                            <InputError message={errors.comment} className="mt-2" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <PrimaryButton disabled={processing}>
                                                {userRating ? 'Update Rating' : 'Submit Rating'}
                                            </PrimaryButton>
                                            {userRating && (
                                                <button
                                                    type="button"
                                                    onClick={() => deleteRating(userRating.id)}
                                                    className="text-sm text-red-600 hover:text-red-800"
                                                >
                                                    Delete Rating
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Ratings List */}
                            {runningRoute.ratings.length === 0 ? (
                                <p className="text-center text-gray-500 py-8">
                                    No ratings yet. Be the first to rate this route!
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {runningRoute.ratings.map((rating: Rating) => (
                                        <div key={rating.id} className="border-b border-gray-200 pb-4 last:border-0">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">
                                                            {rating.user.name}
                                                        </span>
                                                        {renderStars(rating.rating)}
                                                    </div>
                                                    {rating.comment && (
                                                        <p className="mt-2 text-sm text-gray-600">
                                                            {rating.comment}
                                                        </p>
                                                    )}
                                                    <p className="mt-1 text-xs text-gray-500">
                                                        {rating.created_at}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back Button */}
                    <div>
                        <Link
                            href={route('routes.index')}
                            className="text-sm text-indigo-600 hover:text-indigo-800"
                        >
                            ← Back to all routes
                        </Link>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
