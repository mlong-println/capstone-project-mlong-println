// resources/js/Pages/TrainerDashboard.tsx

import { Head } from '@inertiajs/react';

/**
 * TrainerDashboard
 * - Minimal role-specific dashboard for "trainer" users.
 * - Includes placeholder sections to demonstrate distinct content.
 */
export default function TrainerDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page title */}
      <Head title="Trainer Dashboard" />

      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className="text-3xl font-bold text-gray-900">Trainer Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Welcome back. Manage your athletes and their training plans here.
        </p>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto grid gap-6 px-6 pb-12 md:grid-cols-2">
        {/* Assigned Athletes */}
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Assigned Athletes</h2>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder content. Later, I'll list athletes and provide quick actions.
          </p>
        </section>

        {/* Training Plans */}
        <section className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-900">Training Plans</h2>
          <p className="mt-2 text-sm text-gray-600">
            Placeholder content. Later, I’ll show planned workouts and templates.
          </p>
        </section>
      </div>
    </div>
  );
}