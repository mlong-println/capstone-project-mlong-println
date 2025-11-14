import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface RunningRoute {
    id: number;
    name: string;
    description: string | null;
    distance: number;
    difficulty: 'easy' | 'moderate' | 'hard';
    coordinates: any;
}

interface EditProps {
    route: RunningRoute;
}

export default function Edit({ route: runningRoute }: EditProps) {
    // @ts-ignore - Type instantiation depth issue with useForm
    const { data, setData, put, processing, errors } = useForm<{
        name: string;
        description: string;
        distance: string;
        difficulty: string;
        coordinates: any;
    }>({
        name: runningRoute.name,
        description: runningRoute.description || '',
        distance: runningRoute.distance.toString(),
        difficulty: runningRoute.difficulty,
        coordinates: runningRoute.coordinates,
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('routes.update', runningRoute.id));
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Route
                </h2>
            }
        >
            <Head title="Edit Route" />

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

                            {/* Map Placeholder */}
                            <div>
                                <InputLabel value="Route Map (Coming Soon)" />
                                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center bg-gray-50">
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
                                        Interactive map editing will be added soon
                                    </p>
                                </div>
                            </div>

                            {/* Warning */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <div className="flex">
                                    <svg
                                        className="h-5 w-5 text-yellow-400"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    <p className="ml-3 text-sm text-yellow-700">
                                        Updating this route will affect all users who have saved or rated it.
                                    </p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-4">
                                <Link
                                    href={route('routes.show', runningRoute.id)}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </Link>
                                <PrimaryButton disabled={processing}>
                                    Update Route
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
