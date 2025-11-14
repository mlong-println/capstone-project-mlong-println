import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        latitude: '',
        longitude: '',
        event_date: '',
        max_participants: '',
        difficulty: '',
        distance_km: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/events');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Create Event
                    </h2>
                    <Link
                        href="/events"
                        className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 transition"
                    >
                        Cancel
                    </Link>
                </div>
            }
        >
            <Head title="Create Event" />

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
                                    placeholder="e.g., Morning 5K Run"
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
                                    placeholder="Describe your event..."
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
                                    placeholder="e.g., Central Park, New York"
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
                                        placeholder="40.785091"
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
                                        placeholder="-73.968285"
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
                                <p className="mt-1 text-xs text-gray-500">
                                    Event must be scheduled for a future date
                                </p>
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
                                    placeholder="Leave empty for unlimited"
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
                                    placeholder="e.g., 5.0"
                                />
                                <InputError message={errors.distance_km} className="mt-2" />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-between pt-4 border-t">
                                <Link
                                    href="/events"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Creating...' : 'Create Event'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

                    {/* Help Text */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-blue-900 mb-2">
                            Tips for creating a great event:
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                            <li>Choose a clear, descriptive title</li>
                            <li>Provide detailed information about the route and meeting point</li>
                            <li>Set a realistic maximum participant count if needed</li>
                            <li>Include difficulty level to help runners decide if it's right for them</li>
                        </ul>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
