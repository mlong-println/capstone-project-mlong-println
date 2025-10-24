// resources/js/Pages/TrainerDashboard.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

/**
 * TrainerDashboard Props
 * Data passed from TrainerDashboardController
 */
interface TrainerDashboardProps {
  runners: Array<{
    id: number;
    name: string;
    email: string;
    profile: any;
    active_plan: any;
    total_plans_completed: number;
  }>;
  trainingPlans: Array<{
    id: number;
    name: string;
    full_name: string;
    distance_type: string;
    experience_level: string | null;
    duration_weeks: number;
    is_template: boolean;
    total_assignments: number;
    active_assignments: number;
  }>;
  stats: {
    total_runners: number;
    active_runners: number;
    total_plans: number;
    total_active_assignments: number;
  };
}

/**
 * TrainerDashboard
 * Role-specific dashboard for trainer users.
 * Shows overview of runners and training plans with quick stats.
 * Uses theme gradient background for visual consistency.
 */
export default function TrainerDashboard({ runners, trainingPlans, stats }: TrainerDashboardProps) {
  // Get current theme configuration
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      {/* Page title */}
      <Head title="Trainer Dashboard" />

      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Trainer Dashboard</h1>
        <p className={`mt-2 ${themeConfig.text} opacity-80`}>
          Welcome back, Michael. Manage your athletes and their training plans here.
        </p>

        {/* Quick Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total_runners}</div>
            <div className="text-sm text-gray-600">Total Runners</div>
          </div>
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.active_runners}</div>
            <div className="text-sm text-gray-600">Active Runners</div>
          </div>
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total_plans}</div>
            <div className="text-sm text-gray-600">Training Plans</div>
          </div>
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow">
            <div className="text-2xl font-bold text-gray-900">{stats.total_active_assignments}</div>
            <div className="text-sm text-gray-600">Active Assignments</div>
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="max-w-6xl mx-auto grid gap-6 px-6 pb-12 md:grid-cols-2">
        {/* Assigned Athletes */}
        <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Assigned Athletes</h2>
            <Link
              href="/trainer/runners"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>

          {runners.length === 0 ? (
            <p className="text-sm text-gray-600">No runners registered yet.</p>
          ) : (
            <div className="space-y-3">
              {runners.slice(0, 5).map((runner) => (
                <Link
                  key={runner.id}
                  href={`/trainer/runners/${runner.id}`}
                  className="block p-3 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-gray-900">{runner.name}</div>
                  <div className="text-sm text-gray-600">
                    {runner.active_plan ? (
                      <span className="text-green-600">● Active Plan</span>
                    ) : (
                      <span className="text-gray-500">No active plan</span>
                    )}
                    {' • '}
                    {runner.total_plans_completed} completed
                  </div>
                </Link>
              ))}
              {runners.length > 5 && (
                <div className="text-sm text-gray-500 text-center pt-2">
                  + {runners.length - 5} more runners
                </div>
              )}
            </div>
          )}
        </section>

        {/* Training Plans */}
        <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Training Plans</h2>
            <Link
              href="/trainer/plans"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View All →
            </Link>
          </div>

          {trainingPlans.length === 0 ? (
            <p className="text-sm text-gray-600">No training plans created yet.</p>
          ) : (
            <div className="space-y-3">
              {trainingPlans.slice(0, 5).map((plan) => (
                <Link
                  key={plan.id}
                  href={`/trainer/plans/${plan.id}`}
                  className="block p-3 rounded border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition"
                >
                  <div className="font-medium text-gray-900">{plan.name}</div>
                  <div className="text-sm text-gray-600">
                    {plan.active_assignments} active • {plan.total_assignments} total assignments
                  </div>
                </Link>
              ))}
              {trainingPlans.length > 5 && (
                <div className="text-sm text-gray-500 text-center pt-2">
                  + {trainingPlans.length - 5} more plans
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}