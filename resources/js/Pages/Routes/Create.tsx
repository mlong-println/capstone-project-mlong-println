import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import RouteMap from '@/Components/RouteMap';
import { useEffect, useState } from 'react';

interface Coordinate {
    lat: number;
    lng: number;
}

export default function Create() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // @ts-ignore - Type instantiation depth issue with useForm
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        distance: '',
        difficulty: 'moderate' as 'easy' | 'moderate' | 'hard',
        coordinates: [] as Coordinate[],
        is_public: false,
    });

    // Auto-calculate distance when coordinates change
    useEffect(() => {
        if (data.coordinates.length > 1) {
            const calculatedDistance = calculateDistance(data.coordinates);
            setData('distance', calculatedDistance.toFixed(2));
        }
    }, [data.coordinates]);

    const calculateDistance = (coords: Coordinate[]) => {
        if (coords.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 0; i < coords.length - 1; i++) {
            const lat1 = coords[i].lat;
            const lon1 = coords[i].lng;
            const lat2 = coords[i + 1].lat;
            const lon2 = coords[i + 1].lng;

            const R = 6371; // Earth's radius in km
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = 
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            totalDistance += R * c;
        }

        return totalDistance;
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Prevent duplicate submissions
        if (isSubmitting || processing) {
            console.log('Already submitting, ignoring click');
            return;
        }
        
        setIsSubmitting(true);
        console.log('Form submitting with data:', data);
        
        post('/routes', {
            onSuccess: () => {
                console.log('Route created successfully!');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                console.error('Validation errors:', errors);
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create New Route
                </h2>
            }
        >
            <Head title="Create Route" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Route Name */}
                            <div>
                                <InputLabel htmlFor="name" value="Route Name *" />
                                <TextInput
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Central Park Loop"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={4}
                                    placeholder="Describe the route, terrain, highlights, etc."
                                />
                                <InputError message={errors.description} className="mt-2" />
                            </div>

                            {/* Distance and Difficulty */}
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                {/* Distance */}
                                <div>
                                    <InputLabel htmlFor="distance" value="Distance (km) *" />
                                    <TextInput
                                        id="distance"
                                        type="number"
                                        step="0.01"
                                        min="0.1"
                                        max="999.99"
                                        value={data.distance}
                                        onChange={(e) => setData('distance', e.target.value)}
                                        className="mt-1 block w-full"
                                        placeholder="e.g., 5.5"
                                        required
                                    />
                                    <InputError message={errors.distance} className="mt-2" />
                                </div>

                                {/* Difficulty */}
                                <div>
                                    <InputLabel htmlFor="difficulty" value="Difficulty *" />
                                    <select
                                        id="difficulty"
                                        value={data.difficulty}
                                        onChange={(e) => setData('difficulty', e.target.value as 'easy' | 'moderate' | 'hard')}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="moderate">Moderate</option>
                                        <option value="hard">Hard</option>
                                    </select>
                                    <InputError message={errors.difficulty} className="mt-2" />
                                </div>
                            </div>

                            {/* Make Public Checkbox */}
                            <div className="flex items-center">
                                <input
                                    id="is_public"
                                    type="checkbox"
                                    checked={data.is_public}
                                    onChange={(e) => setData('is_public', e.target.checked)}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">
                                    Make this route public (RunConnect Routes)
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 -mt-4 ml-6">
                                Public routes can be run by other users and will appear on leaderboards
                            </p>

                            {/* Interactive Map */}
                            <div>
                                <InputLabel value="Route Map *" />
                                <p className="text-sm text-gray-600 mb-2">
                                    Click on the map to add waypoints and draw your route
                                </p>
                                <RouteMap
                                    coordinates={data.coordinates}
                                    onCoordinatesChange={(coords) => setData('coordinates', coords)}
                                    editable={true}
                                    height="500px"
                                />
                                <InputError message={errors.coordinates} className="mt-2" />
                            </div>

                            {/* Help Text */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-blue-900 mb-2">
                                    Route Creation Tips:
                                </h3>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Choose a descriptive name that identifies the route location</li>
                                    <li>Include terrain type and notable landmarks in the description</li>
                                    <li>Be accurate with distance measurements</li>
                                    <li>Consider elevation changes when selecting difficulty</li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href="/routes"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton type="submit" disabled={isSubmitting || processing}>
                                    {isSubmitting || processing ? 'Creating...' : 'Create Route'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
