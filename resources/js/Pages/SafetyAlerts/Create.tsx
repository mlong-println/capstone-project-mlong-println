import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import { FormEventHandler } from 'react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        location: '',
        severity: 'medium' as 'low' | 'medium' | 'high' | 'critical',
        alert_type: 'hazard' as 'closure' | 'hazard' | 'construction' | 'weather' | 'wildlife' | 'other',
        latitude: '',
        longitude: '',
        expires_at: '',
        media: [] as File[],
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('description', data.description);
        formData.append('location', data.location);
        formData.append('severity', data.severity);
        formData.append('alert_type', data.alert_type);
        if (data.latitude) formData.append('latitude', data.latitude);
        if (data.longitude) formData.append('longitude', data.longitude);
        if (data.expires_at) formData.append('expires_at', data.expires_at);
        
        data.media.forEach((file, index) => {
            formData.append(`media[${index}]`, file);
        });

        router.post('/safety-alerts', formData);
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Report Safety Alert
                </h2>
            }
        >
            <Head title="Report Safety Alert" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Title */}
                            <div>
                                <InputLabel htmlFor="title" value="Alert Title *" />
                                <TextInput
                                    id="title"
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    className="mt-1 block w-full"
                                    placeholder="e.g., Ice on Chedoke Trail"
                                    required
                                />
                                <InputError message={errors.title} className="mt-2" />
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
                                    placeholder="e.g., Chedoke Radial Trail, near stairs"
                                    required
                                />
                                <InputError message={errors.location} className="mt-2" />
                            </div>

                            {/* Alert Type & Severity */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel htmlFor="alert_type" value="Alert Type *" />
                                    <select
                                        id="alert_type"
                                        value={data.alert_type}
                                        onChange={(e) => setData('alert_type', e.target.value as any)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="hazard">⚠️ Hazard</option>
                                        <option value="closure">🚫 Closure</option>
                                        <option value="construction">🚧 Construction</option>
                                        <option value="weather">🌧️ Weather</option>
                                        <option value="wildlife">🦌 Wildlife</option>
                                        <option value="other">📢 Other</option>
                                    </select>
                                    <InputError message={errors.alert_type} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="severity" value="Severity *" />
                                    <select
                                        id="severity"
                                        value={data.severity}
                                        onChange={(e) => setData('severity', e.target.value as any)}
                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                        required
                                    >
                                        <option value="low">Low - Minor inconvenience</option>
                                        <option value="medium">Medium - Use caution</option>
                                        <option value="high">High - Significant hazard</option>
                                        <option value="critical">Critical - Dangerous/Impassable</option>
                                    </select>
                                    <InputError message={errors.severity} className="mt-2" />
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <InputLabel htmlFor="description" value="Description *" />
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    rows={4}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Provide details about the safety concern..."
                                    required
                                />
                                <InputError message={errors.description} className="mt-2" />
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
                                        placeholder="43.2557"
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
                                        placeholder="-79.8711"
                                    />
                                    <InputError message={errors.longitude} className="mt-2" />
                                </div>
                            </div>

                            {/* Expiration Date (Optional) */}
                            <div>
                                <InputLabel htmlFor="expires_at" value="Alert Expiration (Optional)" />
                                <input
                                    id="expires_at"
                                    type="datetime-local"
                                    value={data.expires_at}
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Set when this alert should automatically expire (e.g., after construction ends)
                                </p>
                                <InputError message={errors.expires_at} className="mt-2" />
                            </div>

                            {/* Media Upload */}
                            <div>
                                <InputLabel htmlFor="media" value="Photos/Videos (Optional)" />
                                <input
                                    id="media"
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/jpg,image/png,image/gif,video/mp4,video/mov"
                                    onChange={(e) => setData('media', Array.from(e.target.files || []))}
                                    className="mt-1 block w-full text-sm text-gray-500
                                        file:mr-4 file:py-2 file:px-4
                                        file:rounded-md file:border-0
                                        file:text-sm file:font-semibold
                                        file:bg-indigo-50 file:text-indigo-700
                                        hover:file:bg-indigo-100"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Max 10MB per file. Supported: JPG, PNG, GIF, MP4, MOV
                                </p>
                                <InputError message={errors.media} className="mt-2" />
                            </div>

                            {/* Submit Button */}
                            <div className="flex items-center justify-end gap-4">
                                <a
                                    href="/safety-alerts"
                                    className="text-sm text-gray-600 hover:text-gray-900"
                                >
                                    Cancel
                                </a>
                                <PrimaryButton disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Alert'}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
