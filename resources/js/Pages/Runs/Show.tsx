import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import RouteMap from '@/Components/RouteMap';
import { useState } from 'react';

interface Run {
    id: number;
    start_time: string;
    end_time: string;
    completion_time: number;
    formatted_time: string;
    formatted_pace: string;
    elevation_gain: number | null;
    notes: string | null;
    route: {
        id: number;
        name: string;
        distance: number;
        coordinates: Array<{ lat: number; lng: number }>;
        start_location: string;
        end_location: string;
    };
    user: {
        id: number;
        name: string;
    };
}

interface ShowRunProps {
    run: Run;
}

export default function Show({ run }: ShowRunProps) {
    const [deleting, setDeleting] = useState(false);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this run?')) {
            setDeleting(true);
            router.delete(`/runs/${run.id}`);
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Run Details
                    </h2>
                    <Link
                        href="/runs"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Runs
                    </Link>
                </div>
            }
        >
            <Head title={`Run - ${run.route.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Run Summary Card */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-900">{run.route.name}</h3>
                                <p className="text-sm text-gray-600 mt-1">{formatDate(run.start_time)}</p>
                            </div>
                            <button
                                onClick={handleDelete}
                                disabled={deleting}
                                className="text-red-600 hover:text-red-900 text-sm font-medium"
                            >
                                {deleting ? 'Deleting...' : 'Delete Run'}
                            </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-blue-600 mb-1">Distance</div>
                                <div className="text-2xl font-bold text-blue-900">{run.route.distance} km</div>
                            </div>
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-green-600 mb-1">Time</div>
                                <div className="text-2xl font-bold text-green-900">{run.formatted_time}</div>
                            </div>
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="text-sm font-medium text-purple-600 mb-1">Pace</div>
                                <div className="text-2xl font-bold text-purple-900">{run.formatted_pace}</div>
                            </div>
                            {run.elevation_gain !== null && (
                                <div className="bg-orange-50 rounded-lg p-4">
                                    <div className="text-sm font-medium text-orange-600 mb-1">Elevation</div>
                                    <div className="text-2xl font-bold text-orange-900">{Math.round(run.elevation_gain)}m</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Route Map */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Route Map</h4>
                        <div className="rounded-lg overflow-hidden">
                            <RouteMap coordinates={run.route.coordinates} />
                        </div>
                        <div className="mt-4 space-y-2">
                            <div>
                                <span className="text-sm font-medium text-gray-600">Route:</span>
                                <Link
                                    href={`/routes/${run.route.id}`}
                                    className="ml-2 text-indigo-600 hover:text-indigo-900 font-medium"
                                >
                                    {run.route.name}
                                </Link>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">Start:</span>
                                <span className="ml-2 text-sm text-gray-900">{run.route.start_location}</span>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-gray-600">End:</span>
                                <span className="ml-2 text-sm text-gray-900">{run.route.end_location}</span>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    {run.notes && (
                        <div className="bg-white rounded-lg shadow p-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Notes</h4>
                            <p className="text-gray-700 whitespace-pre-wrap">{run.notes}</p>
                        </div>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h4>
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Started:</div>
                                <div className="text-sm text-gray-900">{formatDate(run.start_time)}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Finished:</div>
                                <div className="text-sm text-gray-900">{formatDate(run.end_time)}</div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex-shrink-0 w-24 text-sm font-medium text-gray-600">Duration:</div>
                                <div className="text-sm text-gray-900">{run.formatted_time}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
