// resources/js/Pages/TrainerDashboard.tsx

import { Head } from '@inertiajs/react';

/**
 * TrainerDashboard
 * Simple dashboard page for users with the 'trainer' role.
 * This exists to verify role-based routing (middleware('role:trainer')) works.
 */
export default function TrainerDashboard() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Set page title */}
            <Head title="Trainer Dashboard" />

            {/* Main content */}
            <div className="max-w-5xl mx-auto py-12 px-6">
                <h1 className="text-3xl font-bold mb-4">Trainer Dashboard</h1>
                <p className="text-gray-700">
                    You are logged in as a trainer. This page confirms role-based access is working.
                </p>
            </div>
        </div>
    );
}