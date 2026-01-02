// resources/js/Pages/Runner/PlanDetail.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { FormEventHandler, useState } from 'react';

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
  };
  userProfile: any;
  activePlan: any;
  canSelect: boolean;
}

/**
 * PlanDetail
 * Detailed view of a training plan with option to select it
 */
export default function PlanDetail({ plan, userProfile, activePlan, canSelect }: PlanDetailProps) {
  const { themeConfig } = useTheme();
  const [processing, setProcessing] = useState(false);

  const handleSelect: FormEventHandler = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    router.post(`/runner/plans/${plan.id}/assign`, {}, {
      onSuccess: () => {
        // Redirect to dashboard after successful assignment
        router.visit('/runner/dashboard');
      },
      onError: (errors) => {
        console.error('Failed to assign plan:', errors);
        setProcessing(false);
      },
    });
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title={plan.name} />

      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>{plan.name}</h1>
          <Link
            href="/runner/plans"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Plans
          </Link>
        </div>

        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
          {/* Plan Description */}
          <p className="text-gray-700 mb-6">{plan.description}</p>

          {/* Plan Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div>
              <span className="block text-sm font-medium text-gray-700">Duration</span>
              <span className="text-lg font-semibold text-gray-900">{plan.duration_weeks} weeks</span>
            </div>
            {plan.experience_level && (
              <div>
                <span className="block text-sm font-medium text-gray-700">Level</span>
                <span className="text-lg font-semibold text-gray-900 capitalize">{plan.experience_level}</span>
              </div>
            )}
            <div>
              <span className="block text-sm font-medium text-gray-700">Distance</span>
              <span className="text-lg font-semibold text-gray-900 uppercase">
                {plan.distance_type.replace('_', ' ')}
              </span>
            </div>
            {plan.weekly_mileage_peak && (
              <div>
                <span className="block text-sm font-medium text-gray-700">Peak Mileage</span>
                <span className="text-lg font-semibold text-gray-900">{plan.weekly_mileage_peak} km/week</span>
              </div>
            )}
          </div>

          {/* Prerequisites */}
          {plan.prerequisites && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Prerequisites</h3>
              <p className="text-gray-600">{plan.prerequisites}</p>
            </div>
          )}

          {/* Goals */}
          {plan.goals && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Goals</h3>
              <p className="text-gray-600">{plan.goals}</p>
            </div>
          )}

          {/* Selection Button */}
          <div className="pt-4 border-t border-gray-200">
            {!canSelect && activePlan && (
              <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
                You already have an active training plan. Complete or abandon it before selecting a new one.
              </p>
            )}
            {!userProfile?.experience_level && (
              <p className="text-sm text-yellow-700 bg-yellow-50 p-3 rounded">
                Please complete your profile before selecting a training plan.{' '}
                <Link href="/runner/profile/edit" className="underline font-medium">
                  Edit Profile →
                </Link>
              </p>
            )}
            {canSelect && userProfile?.experience_level && (
              <form onSubmit={handleSelect}>
                <button
                  type="submit"
                  disabled={processing}
                  className="w-full px-6 py-3 rounded bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {processing ? 'Selecting...' : 'Select This Plan'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}