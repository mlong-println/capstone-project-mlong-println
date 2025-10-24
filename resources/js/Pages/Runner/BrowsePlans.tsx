// resources/js/Pages/Runner/BrowsePlans.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface BrowsePlansProps {
  plans: Record<string, Array<{
    id: number;
    name: string;
    description: string;
    distance_type: string;
    experience_level: string | null;
    duration_weeks: number;
  }>>;
  userProfile: any;
  activePlan: any;
}

/**
 * BrowsePlans
 * Allows runners to browse and select training plans
 */
export default function BrowsePlans({ plans, userProfile, activePlan }: BrowsePlansProps) {
  const { themeConfig } = useTheme();

  const distanceLabels: Record<string, string> = {
    '5k': '5K Plans',
    '10k': '10K Plans',
    'half_marathon': 'Half Marathon Plans',
    'full_marathon': 'Full Marathon Plans',
    'ultra': 'Ultra Marathon Plans',
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Browse Training Plans" />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Browse Training Plans</h1>
          <Link
            href="/runner/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Active plan warning */}
        {activePlan && (
          <div className="mb-6 rounded-lg border border-blue-300 bg-blue-50 p-4">
            <p className="text-sm text-blue-800">
              You already have an active training plan. Complete or abandon it before selecting a new one.
            </p>
          </div>
        )}

        {/* Profile completion check */}
        {!userProfile?.experience_level && (
          <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Complete your profile</strong> before selecting a training plan.{' '}
              <Link href="/runner/profile/edit" className="underline font-medium">
                Edit Profile →
              </Link>
            </p>
          </div>
        )}

        {/* Plans grouped by distance */}
        <div className="space-y-8">
          {Object.entries(plans).map(([distanceType, distancePlans]) => (
            <div key={distanceType}>
              <h2 className={`text-2xl font-bold ${themeConfig.text} mb-4`}>
                {distanceLabels[distanceType] || distanceType}
              </h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {distancePlans.map((plan) => (
                  <Link
                    key={plan.id}
                    href={`/runner/plans/${plan.id}`}
                    className="block rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg hover:shadow-xl transition"
                  >
                    <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                    <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
                      <span>
                        <span className="font-medium">{plan.duration_weeks}</span> weeks
                      </span>
                      {plan.experience_level && (
                        <span className="capitalize px-2 py-1 rounded text-xs font-medium bg-gray-100">
                          {plan.experience_level}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}