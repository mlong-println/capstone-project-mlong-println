import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
}

interface TrailAlert {
    id: number;
    title: string;
    description: string;
    location: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    alert_type: 'closure' | 'hazard' | 'construction' | 'weather' | 'wildlife' | 'other';
    created_at: string;
    user: User;
    severity_color: string;
    alert_type_icon: string;
}

interface PaginatedAlerts {
    data: TrailAlert[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface TrailAlertsIndexProps {
    alerts: PaginatedAlerts;
}

export default function Index({ alerts }: TrailAlertsIndexProps) {
    const getSeverityBadge = (severity: string, color: string) => {
        return (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
                {severity.toUpperCase()}
            </span>
        );
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString();
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Trail Alerts
                    </h2>
                    <Link
                        href="/trail-alerts/create"
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:bg-indigo-700 active:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    >
                        + Report Alert
                    </Link>
                </div>
            }
        >
            <Head title="Trail Alerts" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Info Banner */}
                            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-blue-800">Community Safety Alerts</h3>
                                        <p className="mt-1 text-sm text-blue-700">
                                            Report trail conditions, hazards, closures, and other safety concerns to help fellow runners stay informed.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Alerts List */}
                            {alerts.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No active alerts</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        All trails are clear! Be the first to report any issues.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {alerts.data.map((alert) => (
                                        <Link
                                            key={alert.id}
                                            href={`/trail-alerts/${alert.id}`}
                                            className="block hover:bg-gray-50 transition rounded-lg border border-gray-200 p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="text-2xl">{alert.alert_type_icon}</span>
                                                        <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                                                        {getSeverityBadge(alert.severity, alert.severity_color)}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            {alert.location}
                                                        </span>
                                                        <span>•</span>
                                                        <span>Reported by {alert.user.name}</span>
                                                        <span>•</span>
                                                        <span>{formatDate(alert.created_at)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Pagination */}
                            {alerts.last_page > 1 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {Array.from({ length: alerts.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`/trail-alerts?page=${page}`}
                                            className={`px-3 py-1 rounded ${
                                                page === alerts.current_page
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            {page}
                                        </Link>
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
