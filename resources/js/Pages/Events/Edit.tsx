import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface Event {
    id: number;
    title: string;
    description: string;
    location: string;
    latitude: number | null;
    longitude: number | null;
    event_date: string;
    max_participants: number | null;
    difficulty: 'easy' | 'moderate' | 'hard' | null;
    distance_km: number | null;
}

interface EditProps {
    event: Event;
}

export default function Edit({ event }: EditProps) {
    // Format datetime for input
    const formatDatetimeLocal = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const { data, setData, put, processing, errors } = useForm({
        title: event.title,
        description: event.description,
        location: event.location,
        latitude: event.latitude?.toString() || '',
        longitude: event.longitude?.toString() || '',
        event_date: formatDatetimeLocal(event.event_date),
        max_participants: event.max_participants?.toString() || '',
        difficulty: event.difficulty || '',
        distance_km: event.distance_km?.toString() || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/events/${event.id}`);
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Edit Event
                    </h2>
                    <Link
                        href={`/events/${event.id}`}
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title="Edit Event" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Event Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description *" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={5}
                                    required
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Location */}
                            <div>
                                <InputLabel htmlFor="location" value="Location *" />
                                <TextInput
                                    id="location"
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.location} className="mt-2" />
                            </div>

                            {/* Coordinates (Optional) */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="latitude" value="Latitude (Optional)" />
                                    <TextInput
                                        id="latitude"
                                        type="number"
                                        step="any"
                                        value={data.latitude}
                                        onChange={(e) => setData('latitude', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.latitude} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="longitude" value="Longitude (Optional)" />
                                    <TextInput
                                        id="longitude"
                                        type="number"
                                        step="any"
                                        value={data.longitude}
                                        onChange={(e) => setData('longitude', e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.longitude} className="mt-2" />
                                </div>
                            </div>

                            {/* Event Date */}
                            <div>
                                <InputLabel htmlFor="event_date" value="Event Date & Time *" />
                                <TextInput
                                    id="event_date"
                                    type="datetime-local"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.event_date} className="mt-2" />
                            </div>

                            {/* Max Participants */}
                            <div>
                                <InputLabel htmlFor="max_participants" value="Maximum Participants (Optional)" />
                                <TextInput
                                    id="max_participants"
                                    type="number"
                                    min="1"
                                    value={data.max_participants}
                                    onChange={(e) => setData('max_participants', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.max_participants} className="mt-2" />
                            </div>

                            {/* Difficulty */}
                            <div>
                                <InputLabel htmlFor="difficulty" value="Difficulty Level (Optional)" />
                                <select
                                    id="difficulty"
                                    value={data.difficulty}
                                    onChange={(e) => setData('difficulty', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Select difficulty</option>
                                    <option value="easy">Easy</option>
                                    <option value="moderate">Moderate</option>
                                    <option value="hard">Hard</option>
                                </select>
                                <InputError message={errors.difficulty} className="mt-2" />
                            </div>

                            {/* Distance */}
                            <div>
                                <InputLabel htmlFor="distance_km" value="Distance (km) (Optional)" />
                                <TextInput
                                    id="distance_km"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={data.distance_km}
                                    onChange={(e) => setData('distance_km', e.target.value)}
                                    className="mt-1 block w-full"
                                />
                                <InputError message={errors.distance_km} className="mt-2" />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Link
                                    href={`/events/${event.id}`}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Event'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Warning */}
                    <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-yellow-900 mb-2">
                            Note:
                        </h3>
                        <p className="text-sm text-yellow-800">
                            All participants will be notified of any changes to this event.
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
