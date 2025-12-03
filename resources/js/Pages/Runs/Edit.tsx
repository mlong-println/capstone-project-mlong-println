import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { FormEventHandler } from 'react';

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

interface Run {
    id: number;
    notes: string | null;
    is_public: boolean;
    photo: string | null;
    completion_time: number;
    shoe_id: number | null;
    route: Route;
}

interface EditRunProps {
    run: Run;
    shoes: Shoe[];
}

export default function Edit({ run, shoes }: EditRunProps) {
    // Convert completion_time (seconds) to hours, minutes, seconds
    const initialHours = Math.floor(run.completion_time / 3600);
    const initialMinutes = Math.floor((run.completion_time % 3600) / 60);
    const initialSeconds = run.completion_time % 60;

    const { data, setData, put, processing, errors } = useForm({
        shoe_id: run.shoe_id?.toString() || '',
        hours: initialHours.toString(),
        minutes: initialMinutes.toString(),
        seconds: initialSeconds.toString(),
        notes: run.notes || '',
        is_public: run.is_public,
        photo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        // Convert time to seconds
        const hours = parseInt(data.hours || '0');
        const minutes = parseInt(data.minutes || '0');
        const seconds = parseInt(data.seconds || '0');
        const totalSeconds = (hours * 3600) + (minutes * 60) + seconds;

        // Validate time
        if (totalSeconds < 1) {
            alert('Please enter a valid run time (at least 1 second)');
            return;
        }

        // Use FormData for file upload
        const formData = new FormData();
        
        // Add CSRF token
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrfToken) {
            formData.append('_token', csrfToken);
        }
        
        if (data.shoe_id) formData.append('shoe_id', data.shoe_id);
        formData.append('completion_time', totalSeconds.toString());
        if (data.notes) formData.append('notes', data.notes);
        formData.append('is_public', data.is_public ? '1' : '0');
        if (data.photo) formData.append('photo', data.photo);
        formData.append('_method', 'PUT');

        router.post(`/runs/${run.id}`, formData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Edit Run
                </h2>
            }
        >
            <Head title="Edit Run" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Route Info (Read-only) */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Route</h3>
                                <p className="text-lg font-semibold text-gray-900">{run.route.name}</p>
                                <p className="text-sm text-gray-600">{run.route.distance} km</p>
                            </div>

                            {/* Shoe Selection */}
                            <div>
                                <InputLabel value="Shoe (Optional)" />
                                <select
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
                                <InputError message={errors.shoe_id} className="mt-2" />
                            </div>

                            {/* Run Time */}
                            <div>
                                <InputLabel value="Run Time" />
                                <div className="grid grid-cols-3 gap-3 mt-1">
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Hours</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={data.hours}
                                            onChange={(e) => setData('hours', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Minutes</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={data.minutes}
                                            onChange={(e) => setData('minutes', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-600 mb-1">Seconds</label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="59"
                                            value={data.seconds}
                                            onChange={(e) => setData('seconds', e.target.value)}
                                            className="block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Current Photo */}
                            {run.photo && (
                                <div>
                                    <InputLabel value="Current Photo" />
                                    <img
                                        src={`/storage/${run.photo}`}
                                        alt="Run photo"
                                        className="mt-2 rounded-lg max-w-md"
                                    />
                                </div>
                            )}

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
                                <InputLabel value={run.photo ? "Replace Photo (Optional)" : "Add a Photo (Optional)"} />
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

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4">
                                <a
                                    href={`/runs/${run.id}`}
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </a>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
