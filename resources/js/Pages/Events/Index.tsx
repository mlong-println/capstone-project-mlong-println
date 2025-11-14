import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface Event {
    id: number;
    organizer_id: number;
    title: string;
    description: string;
    location: string;
    event_date: string;
    max_participants: number | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    difficulty: 'easy' | 'moderate' | 'hard' | null;
    distance_km: number | null;
    organizer: {
        id: number;
        name: string;
    };
    participants_count: number;
    user_participation?: {
        status: 'joined' | 'left';
    } | null;
}

interface IndexProps {
    events: {
        data: Event[];
        current_page: number;
        last_page: number;
    };
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
}

export default function Index({ events, auth }: IndexProps) {
    const page = usePage<any>();
    const flash = page.props.flash;
    const [localEvents, setLocalEvents] = useState(events.data);

    const joinEvent = (eventId: number) => {
        router.post(`/events/${eventId}/join`, {}, {
            preserveScroll: true,
            onSuccess: () => {
                setLocalEvents(prev =>
                    prev.map(e => e.id === eventId 
                        ? { ...e, participants_count: e.participants_count + 1, user_participation: { status: 'joined' as const } }
                        : e
                    )
                );
            },
        });
    };

    const leaveEvent = (eventId: number) => {
        if (confirm('Are you sure you want to leave this event?')) {
            router.post(`/events/${eventId}/leave`, {}, {
                preserveScroll: true,
                onSuccess: () => {
                    setLocalEvents(prev =>
                        prev.map(e => e.id === eventId 
                            ? { ...e, participants_count: e.participants_count - 1, user_participation: null }
                            : e
                        )
                    );
                },
            });
        }
    };

    const getStatusColor = (status: Event['status']) => {
        switch (status) {
            case 'upcoming': return 'bg-blue-100 text-blue-800';
            case 'ongoing': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-gray-100 text-gray-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
        }
    };

    const getDifficultyColor = (difficulty: Event['difficulty']) => {
        switch (difficulty) {
            case 'easy': return 'bg-green-100 text-green-800';
            case 'moderate': return 'bg-yellow-100 text-yellow-800';
            case 'hard': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Events
                    </h2>
                    <Link
                        href="/events/create"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                    >
                        Create Event
                    </Link>
                </div>
            }
        >
            <Head title="Events" />

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

                    {localEvents.length === 0 ? (
                        <div className="bg-white/90 backdrop-blur-sm p-8 text-center rounded-lg shadow-lg border border-white/20">
                            <p className="text-gray-500">No events available.</p>
                            <Link
                                href="/events/create"
                                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
                            >
                                Create the first event
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {localEvents.map((event) => (
                                <div key={event.id} className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition overflow-hidden border border-white/20">
                                    {/* Event Header */}
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                                {event.title}
                                            </h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                                {event.status}
                                            </span>
                                        </div>

                                        {/* Event Details */}
                                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                {new Date(event.event_date).toLocaleString()}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {event.location}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                </svg>
                                                Organized by {event.organizer.name}
                                            </div>
                                            <div className="flex items-center">
                                                <svg className="h-4 w-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                {event.participants_count} {event.max_participants ? `/ ${event.max_participants}` : ''} participants
                                            </div>
                                        </div>

                                        {/* Badges */}
                                        <div className="flex gap-2 mb-4">
                                            {event.difficulty && (
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                                                    {event.difficulty}
                                                </span>
                                            )}
                                            {event.distance_km && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                    {event.distance_km} km
                                                </span>
                                            )}
                                        </div>

                                        {/* Description Preview */}
                                        <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                                            {event.description}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <Link
                                                href={`/events/${event.id}`}
                                                className="flex-1 text-center rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition"
                                            >
                                                View Details
                                            </Link>
                                            {event.status === 'upcoming' && (
                                                event.user_participation?.status === 'joined' ? (
                                                    <button
                                                        onClick={() => leaveEvent(event.id)}
                                                        className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                                                    >
                                                        Leave
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => joinEvent(event.id)}
                                                        className="flex-1 rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
                                                        disabled={event.max_participants !== null && event.participants_count >= event.max_participants}
                                                    >
                                                        {event.max_participants !== null && event.participants_count >= event.max_participants ? 'Full' : 'Join'}
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {events.last_page > 1 && (
                        <div className="mt-6 flex justify-center gap-2">
                            {Array.from({ length: events.last_page }, (_, i) => i + 1).map(page => (
                                <Link
                                    key={page}
                                    href={`/events?page=${page}`}
                                    className={`px-4 py-2 rounded-md ${
                                        page === events.current_page
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
