// resources/js/Pages/Trainer/PlanDetail.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface PlanDetailProps {
  plan: {
    id: number;
    name: string;
    description: string;
    distance_type: string;
    experience_level: string | null;
    duration_weeks: number;
    weekly_mileage_peak: number | null;
    prerequisites: string | null;
    goals: string | null;
    is_template: boolean;
  };
  assignments: any[];
}

/**
 * PlanDetail
 * Detailed view of a specific training plan with assignments
 */
export default function PlanDetail({ plan, assignments }: PlanDetailProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title={`${plan.name} - Training Plan`} />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>{plan.name}</h1>
          <Link
            href="/trainer/plans"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to All Plans
          </Link>
        </div>

        {/* Plan Details */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Plan Details</h2>
          <div className="space-y-3 text-sm">
            <p className="text-gray-700">{plan.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <div className="text-gray-600">{plan.duration_weeks} weeks</div>
              </div>
              {plan.experience_level && (
                <div>
                  <span className="font-medium text-gray-700">Level:</span>
                  <div className="text-gray-600 capitalize">{plan.experience_level}</div>
                </div>
              )}
              <div>
                <span className="font-medium text-gray-700">Distance:</span>
                <div className="text-gray-600 uppercase">{plan.distance_type.replace('_', ' ')}</div>
              </div>
              {plan.weekly_mileage_peak && (
                <div>
                  <span className="font-medium text-gray-700">Peak Mileage:</span>
                  <div className="text-gray-600">{plan.weekly_mileage_peak} km/week</div>
                </div>
              )}
            </div>
            {plan.prerequisites && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Prerequisites:</span>
                <p className="mt-1 text-gray-600">{plan.prerequisites}</p>
              </div>
            )}
            {plan.goals && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Goals:</span>
                <p className="mt-1 text-gray-600">{plan.goals}</p>
              </div>
            )}
          </div>
        </div>

        {/* Assignments */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Runners on This Plan</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-600">No runners assigned to this plan yet.</p>
          ) : (
            <p className="text-sm text-gray-600">{assignments.length} runner(s) assigned. Details coming soon...</p>
          )}
        </div>
      </div>
    </div>
  );
}