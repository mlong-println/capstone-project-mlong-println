// resources/js/Pages/Trainer/ViewPlans.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface ViewPlansProps {
  plans: Array<{
    id: number;
    name: string;
    description: string;
    distance_type: string;
    experience_level: string | null;
    duration_weeks: number;
    is_template: boolean;
    assignments_count: number;
    active_assignments_count: number;
  }>;
}

/**
 * ViewPlans
 * Full list of all training plans created by the trainer
 */
export default function ViewPlans({ plans }: ViewPlansProps) {
  const { themeConfig } = useTheme();

  // Group plans by distance type
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.distance_type]) {
      acc[plan.distance_type] = [];
    }
    acc[plan.distance_type].push(plan);
    return acc;
  }, {} as Record<string, typeof plans>);

  const distanceLabels: Record<string, string> = {
    '5k': '5K Plans',
    '10k': '10K Plans',
    'half_marathon': 'Half Marathon Plans',
    'full_marathon': 'Full Marathon Plans',
    'ultra': 'Ultra Marathon Plans',
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="All Training Plans" />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>All Training Plans</h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/plans/create"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Create Plan
            </Link>
            <Link
              href="/admin/dashboard"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-8 shadow-lg text-center">
            <p className="text-gray-600">No training plans created yet.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedPlans).map(([distanceType, distancePlans]) => (
              <div key={distanceType}>
                <h2 className={`text-2xl font-bold ${themeConfig.text} mb-4`}>
                  {distanceLabels[distanceType] || distanceType}
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {distancePlans.map((plan) => (
                    <Link
                      key={plan.id}
                      href={`/admin/plans/${plan.id}`}
                      className="block rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg hover:shadow-xl transition"
                    >
                      <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <p className="mt-1 text-sm text-gray-600 line-clamp-2">{plan.description}</p>
                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-700">
                        <span>
                          <span className="font-medium">{plan.duration_weeks}</span> weeks
                        </span>
                        {plan.experience_level && (
                          <span className="capitalize">{plan.experience_level}</span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                          {plan.active_assignments_count} active
                        </span>
                        <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                          {plan.assignments_count} total
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}