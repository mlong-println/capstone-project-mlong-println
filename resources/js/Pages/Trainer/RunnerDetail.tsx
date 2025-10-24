// resources/js/Pages/Trainer/RunnerDetail.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface RunnerDetailProps {
  runner: {
    id: number;
    name: string;
    email: string;
    profile: any;
    active_plan: any;
    plan_history: any[];
  };
}

/**
 * RunnerDetail
 * Detailed view of a specific runner's profile and training history
 */
export default function RunnerDetail({ runner }: RunnerDetailProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title={`${runner.name} - Runner Profile`} />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>{runner.name}</h1>
          <Link
            href="/trainer/runners"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to All Runners
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Info */}
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <span className="ml-2 text-gray-600">{runner.email}</span>
              </div>
              {runner.profile && (
                <>
                  {runner.profile.experience_level && (
                    <div>
                      <span className="font-medium text-gray-700">Experience Level:</span>
                      <span className="ml-2 text-gray-600 capitalize">{runner.profile.experience_level}</span>
                    </div>
                  )}
                  {runner.profile.current_goal && (
                    <div>
                      <span className="font-medium text-gray-700">Current Goal:</span>
                      <span className="ml-2 text-gray-600">{runner.profile.current_goal}</span>
                    </div>
                  )}
                  {runner.profile.location && (
                    <div>
                      <span className="font-medium text-gray-700">Location:</span>
                      <span className="ml-2 text-gray-600">{runner.profile.location}</span>
                    </div>
                  )}
                  {runner.profile.bio && (
                    <div>
                      <span className="font-medium text-gray-700">Bio:</span>
                      <p className="mt-1 text-gray-600">{runner.profile.bio}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Running Stats */}
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Running Stats</h2>
            {runner.profile ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{runner.profile.total_runs || 0}</div>
                  <div className="text-sm text-gray-600">Total Runs</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{runner.profile.total_distance || 0} km</div>
                  <div className="text-sm text-gray-600">Total Distance</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{runner.profile.current_weekly_mileage || 0} km</div>
                  <div className="text-sm text-gray-600">Weekly Mileage</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{runner.plan_history.length}</div>
                  <div className="text-sm text-gray-600">Plans Completed</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-600">No stats available yet.</p>
            )}
          </div>
        </div>

        {/* Active Plan */}
        {runner.active_plan && (
          <div className="mt-6 rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Active Training Plan</h2>
            <p className="text-sm text-gray-600">Plan details coming soon...</p>
          </div>
        )}

        {/* Plan History */}
        <div className="mt-6 rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Training Plan History</h2>
          {runner.plan_history.length === 0 ? (
            <p className="text-sm text-gray-600">No training plans assigned yet.</p>
          ) : (
            <p className="text-sm text-gray-600">Plan history details coming soon...</p>
          )}
        </div>
      </div>
    </div>
  );
}