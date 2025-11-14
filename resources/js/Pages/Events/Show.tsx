import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Participant {
    id: number;
    name: string;
    email: string;
    pivot: {
        status: 'joined' | 'left';
    };
}

interface Event {
    id: number;
    organizer_id: number;
    title: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    event_date: string;
    max_participants: number | null;
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    difficulty: 'easy' | 'moderate' | 'hard' | null;
    distance_km: number | null;
    photos: string[] | null;
    created_at: string;
    organizer: {
        id: number;
        name: string;
        email: string;
    };
    participants: Participant[];
}

interface ShowProps {
    event: Event;
    isOrganizer: boolean;
    hasJoined: boolean;
    auth: {
        user: {
            id: number;
            name: string;
        };
    };
}

export default function Show({ event, isOrganizer, hasJoined, auth }: ShowProps) {
    const joinEvent = () => {
        router.post(`/events/${event.id}/join`, {}, {
            preserveScroll: true,
        });
    };

    const leaveEvent = () => {
        if (confirm('Are you sure you want to leave this event?')) {
            router.post(`/events/${event.id}/leave`, {}, {
                preserveScroll: true,
            });
        }
    };

    const cancelEvent = () => {
        if (confirm('Are you sure you want to cancel this event? All participants will be notified.')) {
            router.post(`/events/${event.id}/cancel`, {}, {
                preserveScroll: true,
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

    const activeParticipants = event.participants.filter(p => p.pivot.status === 'joined');
    const isFull = event.max_participants !== null && activeParticipants.length >= event.max_participants;

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Event Details
                    </h2>
                    <div className="flex gap-2">
                        {isOrganizer && event.status === 'upcoming' && (
                            <>
                                <Link
                                    href={`/events/${event.id}/edit`}
                                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                                >
                                    Edit
                                </Link>
                                <button
                                    onClick={cancelEvent}
                                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition"
                                >
                                    Cancel Event
                                </button>
                            </>
                        )}
                        <Link
                            href="/events"
                            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                        >
                            Back to Events
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={event.title} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    {/* Main Event Card */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-3xl font-bold text-gray-900">
                                    {event.title}
                                </h1>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(event.status)}`}>
                                    {event.status}
                                </span>
                            </div>

                            {/* Badges */}
                            <div className="flex gap-2 mb-6">
                                {event.difficulty && (
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(event.difficulty)}`}>
                                        Difficulty: {event.difficulty}
                                    </span>
                                )}
                                {event.distance_km && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                        Distance: {event.distance_km} km
                                    </span>
                                )}
                            </div>

                            {/* Event Details Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date & Time</h3>
                                    <p className="text-gray-900">{new Date(event.event_date).toLocaleString()}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
                                    <p className="text-gray-900">{event.location}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Organizer</h3>
                                    <p className="text-gray-900">{event.organizer.name}</p>
                                    <p className="text-sm text-gray-500">{event.organizer.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 mb-2">Participants</h3>
                                    <p className="text-gray-900">
                                        {activeParticipants.length} {event.max_participants ? `/ ${event.max_participants}` : ''} joined
                                    </p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                                <p className="text-gray-900 whitespace-pre-wrap">{event.description}</p>
                            </div>

                            {/* Join/Leave Button */}
                            {!isOrganizer && event.status === 'upcoming' && (
                                <div className="border-t pt-6">
                                    {hasJoined ? (
                                        <button
                                            onClick={leaveEvent}
                                            className="w-full md:w-auto rounded-md bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 transition"
                                        >
                                            Leave Event
                                        </button>
                                    ) : (
                                        <button
                                            onClick={joinEvent}
                                            disabled={isFull}
                                            className={`w-full md:w-auto rounded-md px-6 py-3 text-sm font-medium text-white transition ${
                                                isFull 
                                                    ? 'bg-gray-400 cursor-not-allowed' 
                                                    : 'bg-green-600 hover:bg-green-700'
                                            }`}
                                        >
                                            {isFull ? 'Event is Full' : 'Join Event'}
                                        </button>
                                    )}
                                </div>
                            )}

                            {isOrganizer && (
                                <div className="border-t pt-6">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        You are the organizer
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Participants List */}
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">
                                Participants ({activeParticipants.length})
                            </h2>
                            {activeParticipants.length === 0 ? (
                                <p className="text-gray-500 text-center py-4">No participants yet</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {activeParticipants.map((participant) => (
                                        <div key={participant.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                                {participant.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-gray-900">{participant.name}</p>
                                                <p className="text-xs text-gray-500">{participant.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
