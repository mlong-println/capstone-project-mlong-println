// resources/js/Pages/TrainerDashboard.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import ThemedNavBar from '@/Components/ThemedNavBar';
import InspirationalQuotes from '@/Components/InspirationalQuotes';
import BackgroundSlideshow from '@/Components/BackgroundSlideshow';

/**
 * TrainerDashboard Props
 * Data passed from TrainerDashboardController
 */
interface TrainerDashboardProps {
  auth: {
    user: any;
  };
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
 */
export default function TrainerDashboard({ auth, runners, trainingPlans, stats }: TrainerDashboardProps) {
  const { themeConfig } = useTheme();

  return (
    <div className="min-h-screen relative">
      <Head title="Trainer Dashboard" />
      
      {/* Background Slideshow */}
      <BackgroundSlideshow />

      {/* Top navbar with navigation links */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg relative z-50`}>
        <ThemedNavBar auth={auth} themeTextClass={themeConfig.textLight} />
      </div>

      {/* Header */}
      <div className={`${themeConfig.gradient} relative z-10`}>
        <div className="max-w-6xl mx-auto py-6 px-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text} tracking-tight`}>Trainer Dashboard</h1>
          <p className={`mt-1 ${themeConfig.text} opacity-90`}>
            Manage your athletes and their training plans.
          </p>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 py-8 mb-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Stats & Athletes & Plans */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_runners}</div>
                  <div className="text-xs text-gray-600">Total Runners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.active_runners}</div>
                  <div className="text-xs text-gray-600">Active Runners</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.total_plans}</div>
                  <div className="text-xs text-gray-600">Training Plans</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.total_active_assignments}</div>
                  <div className="text-xs text-gray-600">Active Assignments</div>
                </div>
              </div>
            </section>
            {/* Assigned Athletes */}
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Assigned Athletes</h2>
                <Link
                  href="/admin/runners"
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
                      href={`/admin/runners/${runner.id}`}
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
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Training Plans</h2>
                <Link
                  href="/admin/plans"
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
                      href={`/admin/plans/${plan.id}`}
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

          {/* Right Column - Inspirational Quotes */}
          <div>
            <InspirationalQuotes />
          </div>

        </div>
      </div>
    </div>
  );
}