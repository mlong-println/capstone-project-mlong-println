import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { FormEventHandler, useState } from 'react';

interface Route {
    id: number;
    name: string;
    distance: number;
}

interface Shoe {
    id: number;
    brand: string;
    model: string;
    color: string | null;
}

interface CreateRunProps {
    routes: Route[];
    shoes: Shoe[];
}

export default function Create({ routes, shoes }: CreateRunProps) {
    const { data, setData, post, processing, errors } = useForm({
        route_id: '',
        shoe_id: '',
        start_time: new Date().toISOString().slice(0, 16),
        hours: '0',
        minutes: '30',
        seconds: '0',
        notes: '',
        is_public: true,
        photo: null as File | null,
    });

    const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);

    const handleRouteChange = (routeId: string) => {
        setData('route_id', routeId);
        const route = routes.find(r => r.id === parseInt(routeId));
        setSelectedRoute(route || null);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Convert time to seconds (treat empty as 0)
        const hours = parseInt(data.hours || '0');
        const minutes = parseInt(data.minutes || '0');
        const seconds = parseInt(data.seconds || '0');
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        // Validate that total time is at least 1 second
        if (totalSeconds < 1) {
            alert('Please enter a valid run time (at least 1 second)');
            return;
        }

        // Submit with completion_time included and photo as FormData
        const formData = new FormData();
        
        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('_token', csrfToken);
        }
        
        formData.append('route_id', data.route_id);
        if (data.shoe_id) formData.append('shoe_id', data.shoe_id);
        formData.append('start_time', data.start_time);
        formData.append('completion_time', totalSeconds.toString());
        if (data.notes) formData.append('notes', data.notes);
        formData.append('is_public', data.is_public ? '1' : '0');
        if (data.photo) formData.append('photo', data.photo);

        router.post('/runs', formData, {
            forceFormData: true,
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Calculate estimated pace
    const calculatePace = () => {
        if (!selectedRoute) return 'N/A';
        
        const totalSeconds = 
            (parseInt(data.hours || '0') * 3600) + 
            (parseInt(data.minutes || '0') * 60) + 
            parseInt(data.seconds || '0');
        
        if (totalSeconds === 0) return 'N/A';
        
        const paceMinutes = (totalSeconds / 60) / selectedRoute.distance;
        const mins = Math.floor(paceMinutes);
        const secs = Math.round((paceMinutes - mins) * 60);
        
        return `${mins}:${secs.toString().padStart(2, '0')} /km`;
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Log a Run
                </h2>
            }
        >
            <Head title="Log a Run" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Route Selection */}
                            <div>
                                <InputLabel htmlFor="route_id" value="Select Route *" />
                                <select
                                    id="route_id"
                                    value={data.route_id}
                                    onChange={(e) => handleRouteChange(e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">Choose a route...</option>
                                    {routes.map((route) => (
                                        <option key={route.id} value={route.id}>
                                            {route.name} ({route.distance} km)
                                        </option>
                                    ))}
                                </select>
                                <InputError message={errors.route_id} className="mt-2" />
                            </div>

                            {/* Shoe Selection */}
                            <div>
                                <InputLabel htmlFor="shoe_id" value="Shoe (Optional)" />
                                <select
                                    id="shoe_id"
                                    value={data.shoe_id}
                                    onChange={(e) => setData('shoe_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">No shoe selected</option>
                                    {shoes.map((shoe) => (
                                        <option key={shoe.id} value={shoe.id}>
                                            {shoe.brand} {shoe.model} {shoe.color ? `(${shoe.color})` : ''}
                                        </option>
                                    ))}
                                </select>
                                {shoes.length === 0 && (
                                    <p className="mt-2 text-sm text-gray-500">
                                        No active shoes. <a href="/gear/create" className="text-indigo-600 hover:text-indigo-800">Add a shoe</a> to track mileage.
                                    </p>
                                )}
                                <InputError message={errors.shoe_id} className="mt-2" />
                            </div>

                            {/* Start Time */}
                            <div>
                                <InputLabel htmlFor="start_time" value="Start Time *" />
                                <TextInput
                                    id="start_time"
                                    type="datetime-local"
                                    value={data.start_time}
                                    onChange={(e) => setData('start_time', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                />
                                <InputError message={errors.start_time} className="mt-2" />
                            </div>

                            {/* Completion Time */}
                            <div>
                                <InputLabel value="Completion Time *" />
                                <div className="mt-1 grid grid-cols-3 gap-4">
                                    <div>
                                        <label htmlFor="hours" className="block text-sm text-gray-600 mb-1">
                                            Hours
                                        </label>
                                        <input
                                            id="hours"
                                            type="number"
                                            min="0"
                                            max="23"
                                            value={data.hours}
                                            onChange={(e) => setData('hours', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="minutes" className="block text-sm text-gray-600 mb-1">
                                            Minutes
                                        </label>
                                        <input
                                            id="minutes"
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={data.minutes}
                                            onChange={(e) => setData('minutes', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="seconds" className="block text-sm text-gray-600 mb-1">
                                            Seconds
                                        </label>
                                        <input
                                            id="seconds"
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={data.seconds}
                                            onChange={(e) => setData('seconds', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Run Notes */}
                            <div>
                                <InputLabel value="How did that run feel?" />
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    maxLength={250}
                                    rows={3}
                                    placeholder="Share your thoughts about this run... (optional)"
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <div className="mt-1 text-xs text-gray-500 text-right">
                                    {data.notes.length}/250 characters
                                </div>
                                <InputError message={errors.notes} className="mt-2" />
                            </div>

                            {/* Photo Upload */}
                            <div>
                                <InputLabel value="Add a Photo (Optional)" />
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/gif"
                                    onChange={(e) => setData('photo', e.target.files?.[0] || null)}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Max 5MB. Supported: JPG, PNG, GIF
                                </p>
                                <InputError message={errors.photo} className="mt-2" />
                            </div>

                            {/* Visibility Toggle */}
                            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                                <input
                                    type="checkbox"
                                    id="is_public"
                                    checked={data.is_public}
                                    onChange={(e) => setData('is_public', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_public" className="flex-1">
                                    <span className="text-sm font-medium text-gray-900">Make this run public</span>
                                    <p className="text-xs text-gray-500">
                                        Public runs appear on feeds and leaderboards. Private runs still count toward challenges.
                                    </p>
                                </label>
                            </div>

                            {/* Stats Preview */}
                            {selectedRoute && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <h3 className="text-sm font-medium text-blue-900 mb-2">Run Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-blue-700 font-medium">Distance:</span>
                                            <span className="ml-2 text-blue-900">{selectedRoute.distance} km</span>
                                        </div>
                                        <div>
                                            <span className="text-blue-700 font-medium">Estimated Pace:</span>
                                            <span className="ml-2 text-blue-900">{calculatePace()}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4">
                                <a
                                    href="/runs"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </a>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Logging Run...' : 'Log Run'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
