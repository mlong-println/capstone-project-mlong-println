import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useState } from 'react';

interface User {
    id: number;
    name: string;
}

interface SafetyAlert {
    id: number;
    title: string;
    description: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    alert_type: 'closure' | 'hazard' | 'construction' | 'weather' | 'wildlife' | 'other';
    media: string[] | null;
    latitude: number | null;
    longitude: number | null;
    is_active: boolean;
    expires_at: string | null;
    created_at: string;
    user: User;
    severity_color: string;
    alert_type_icon: string;
}

interface SafetyAlertShowProps {
    alert: SafetyAlert;
    auth: {
        user: {
            id: number;
            role: string;
        };
    };
}

export default function Show({ alert, auth }: SafetyAlertShowProps) {
    const [isActive, setIsActive] = useState(alert.is_active);
    const canManage = auth.user.id === alert.user.id || auth.user.role === 'admin';

    const toggleActive = () => {
        router.put(`/safety-alerts/${alert.id}`, {
            is_active: !isActive,
        }, {
            preserveScroll: true,
            onSuccess: () => setIsActive(!isActive),
        });
    };

    const deleteAlert = () => {
        if (confirm('Are you sure you want to delete this safety alert?')) {
            router.delete(`/safety-alerts/${alert.id}`);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Safety Alert Details
                    </h2>
                    <Link
                        href="/safety-alerts"
                        className="text-sm text-gray-600 hover:text-gray-900"
                    >
                        ← Back to Alerts
                    </Link>
                </div>
            }
        >
            <Head title={`Safety Alert: ${alert.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg p-6">
                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-4xl">{alert.alert_type_icon}</span>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">{alert.title}</h1>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alert.severity_color}`}>
                                                {alert.severity.toUpperCase()}
                                            </span>
                                            {!isActive && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    INACTIVE
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {canManage && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={toggleActive}
                                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                                        >
                                            {isActive ? 'Mark Inactive' : 'Mark Active'}
                                        </button>
                                        <button
                                            onClick={deleteAlert}
                                            className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-medium">{alert.location}</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                            <p className="text-gray-900 whitespace-pre-wrap">{alert.description}</p>
                        </div>

                        {/* Media */}
                        {alert.media && alert.media.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Photos/Videos</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {alert.media.map((mediaPath, index) => (
                                        <div key={index} className="relative">
                                            {mediaPath.endsWith('.mp4') || mediaPath.endsWith('.mov') ? (
                                                <video
                                                    src={`/storage/${mediaPath}`}
                                                    controls
                                                    className="w-full rounded-lg"
                                                />
                                            ) : (
                                                <img
                                                    src={`/storage/${mediaPath}`}
                                                    alt={`Alert media ${index + 1}`}
                                                    className="w-full h-48 object-cover rounded-lg"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="border-t pt-6">
                            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <dt className="font-medium text-gray-700">Reported By</dt>
                                    <dd className="text-gray-900">{alert.user.name}</dd>
                                </div>
                                <div>
                                    <dt className="font-medium text-gray-700">Reported On</dt>
                                    <dd className="text-gray-900">{formatDate(alert.created_at)}</dd>
                                </div>
                                {alert.latitude && alert.longitude && (
                                    <div>
                                        <dt className="font-medium text-gray-700">Coordinates</dt>
                                        <dd className="text-gray-900">
                                            {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                                        </dd>
                                    </div>
                                )}
                                {alert.expires_at && (
                                    <div>
                                        <dt className="font-medium text-gray-700">Expires</dt>
                                        <dd className="text-gray-900">{formatDate(alert.expires_at)}</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
