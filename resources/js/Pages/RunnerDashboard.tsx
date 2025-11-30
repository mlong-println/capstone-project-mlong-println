// resources/js/Pages/RunnerDashboard.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import ThemedNavBar from '@/Components/ThemedNavBar';

/**
 * RunnerDashboard Props
 * Data passed from the controller
 */
interface RunnerDashboardProps {
  auth: {
    user: any;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  profile: any;
  activePlan: any;
  stats: {
    total_runs: number;
    total_distance: number;
    current_weekly_mileage: number;
  };
}

/**
 * Role-specific dashboard for runner users.
 * Shows profile status, active training plan, and quick stats.
 */
export default function RunnerDashboard({ auth, user, profile, activePlan, stats }: RunnerDashboardProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Runner Dashboard" />

      {/* Top navbar with navigation links */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg`}>
        <ThemedNavBar auth={auth} themeTextClass={themeConfig.textLight} />
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Runner Dashboard</h1>
        <p className={`mt-2 ${themeConfig.text} opacity-80`}>
          Welcome back, {user.name}. Here's a snapshot of your running activity.
        </p>

        {/* Profile completion prompt */}
        {!profile && (
          <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Complete your profile</strong> to get started with training plans.{' '}
              <Link href="/runner/profile/edit" className="underline font-medium">
                Set up profile →
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Active Plan Section */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Training Plan</h2>
          {activePlan ? (
            <div>
              <h3 className="font-semibold text-gray-900">{activePlan.training_plan?.name}</h3>
              <div className="mt-3 space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Week:</span> {activePlan.current_week} of {activePlan.training_plan?.duration_weeks}
                </div>
                <div>
                  <span className="font-medium">Progress:</span> {activePlan.completion_percentage}%
                </div>
                <div>
                  <span className="font-medium">Target End:</span> {new Date(activePlan.target_end_date).toLocaleDateString()}
                </div>
              </div>
              <Link
                href="/runner/my-plan"
                className="mt-4 inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                View Plan Details
              </Link>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                You don't have an active training plan yet. Browse available plans and start your training journey!
              </p>
              <Link
                href="/runner/plans"
                className="inline-block px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
              >
                Browse Training Plans
              </Link>
            </div>
          )}
        </section>
      </div>

      {/* Profile & Stats */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
            <Link
              href="/runner/profile/edit"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit →
            </Link>
          </div>

          {profile ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Experience Level:</span>
                <span className="ml-2 text-gray-600 capitalize">{profile.experience_level}</span>
              </div>
              {profile.current_goal && (
                <div>
                  <span className="font-medium text-gray-700">Current Goal:</span>
                  <span className="ml-2 text-gray-600">{profile.current_goal}</span>
                </div>
              )}
              {profile.location && (
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{profile.location}</span>
                </div>
              )}
              
              {/* Running Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Running Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stats?.total_runs || 0}</div>
                    <div className="text-xs text-gray-600">Total Runs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stats?.total_distance || 0} km</div>
                    <div className="text-xs text-gray-600">Total Distance</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Complete your profile to track your progress and get personalized training plans.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}