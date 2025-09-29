// resources/js/Pages/RunnerDashboard.tsx

import { Head } from '@inertiajs/react';

/**
 * RunnerDashboard
 * Simple dashboard page for users with the 'runner' role.
 * This exists to verify role-based routing (middleware('role:runner')) works.
 */
export default function RunnerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Set page title */}
            <Head title="Runner Dashboard" />

            {/* Main content */}
            <div className="max-w-5xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold mb-4">Runner Dashboard</h1>
                <p className="text-gray-700">
                    You are logged in as a runner. This page confirms role-based access is working.
                </p>
            </div>
        </div>
    );
}