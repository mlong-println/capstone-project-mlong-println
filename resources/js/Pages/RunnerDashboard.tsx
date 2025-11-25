// resources/js/Pages/RunnerDashboard.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import Navbar from '@/Components/Navbar';

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
 * Uses theme gradient background for visual consistency.
 */
export default function RunnerDashboard({ auth, user, profile, activePlan, stats }: RunnerDashboardProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Runner Dashboard" />

      {/* Top navbar with logout */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-end">
          <Navbar auth={auth} themeTextClass={themeConfig.textLight} />
        </div>
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

      {/* Quick Links */}
      <div className="max-w-6xl mx-auto px-6 mb-6">
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link
              href="/events"
              className="flex flex-col items-center p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition text-center"
            >
              <svg className="h-8 w-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Events</span>
            </Link>
            <Link
              href="/forum"
              className="flex flex-col items-center p-4 rounded-lg bg-purple-50 hover:bg-purple-100 transition text-center"
            >
              <svg className="h-8 w-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Forum</span>
            </Link>
            <Link
              href="/messages/inbox"
              className="flex flex-col items-center p-4 rounded-lg bg-green-50 hover:bg-green-100 transition text-center"
            >
              <svg className="h-8 w-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Messages</span>
            </Link>
            <Link
              href="/notifications"
              className="flex flex-col items-center p-4 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition text-center"
            >
              <svg className="h-8 w-8 text-yellow-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="text-sm font-medium text-gray-900">Notifications</span>
            </Link>
          </div>
        </div>
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