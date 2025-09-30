// resources/js/Pages/RunnerDashboard.tsx

import { Head } from '@inertiajs/react';

/**
 * RunnerDashboard
 * - Minimal role-specific dashboard for "runner" users.
 * - Includes placeholder sections to demonstrate distinct content.
 */
export default function RunnerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page title */}
      <Head title="Runner Dashboard" />

      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-900">Runner Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back. Here’s a snapshot of your running activity.
        </p>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto grid gap-6 px-6 pb-12 md:grid-cols-2">
        {/* Upcoming Runs */}
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Upcoming Runs</h2>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder content. Later, I’ll display scheduled runs.
          </p>
        </section>

        {/* Recent Activity */}
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder content. Later, I’ll list your last completed runs.
          </p>
        </section>
      </div>
    </div>
  );
}