// resources/js/Pages/Trainer/ViewRunners.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface ViewRunnersProps {
  runners: Array<{
    id: number;
    name: string;
    email: string;
    profile: any;
    active_plan: any;
    plan_history: any[];
  }>;
}

/**
 * ViewRunners
 * Full list of all registered runners for the trainer
 */
export default function ViewRunners({ runners }: ViewRunnersProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="All Runners" />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>All Runners</h1>
          <Link
            href="/trainer/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {runners.length === 0 ? (
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-8 shadow-lg text-center">
            <p className="text-gray-600">No runners registered yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {runners.map((runner) => (
              <Link
                key={runner.id}
                href={`/trainer/runners/${runner.id}`}
                className="block rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{runner.name}</h3>
                    <p className="text-sm text-gray-600">{runner.email}</p>
                    {runner.profile && (
                      <div className="mt-2 text-sm text-gray-700">
                        <span className="font-medium">Experience:</span> {runner.profile.experience_level || 'Not set'}
                        {runner.profile.current_goal && (
                          <>
                            {' • '}
                            <span className="font-medium">Goal:</span> {runner.profile.current_goal}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    {runner.active_plan ? (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active Plan
                      </span>
                    ) : (
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        No Active Plan
                      </span>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                      {runner.plan_history.length} total plans
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}