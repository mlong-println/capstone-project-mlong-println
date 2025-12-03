// resources/js/Pages/Trainer/PlanDetail.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { useState } from 'react';

interface Workout {
  day: string;
  workout: string;
}

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
    weekly_structure: Record<string, Workout[]>;
  };
  assignments: any[];
}

/**
 * PlanDetail
 * Detailed view of a specific training plan with assignments
 */
export default function PlanDetail({ plan, assignments }: PlanDetailProps) {
  const { themeConfig } = useTheme();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  const toggleWeek = (weekNum: number) => {
    setExpandedWeek(expandedWeek === weekNum ? null : weekNum);
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title={`${plan.name} - Training Plan`} />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>{plan.name}</h1>
          <Link
            href="/admin/plans"
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

        {/* Weekly Breakdown */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Training Schedule</h2>
          {plan.weekly_structure && Object.keys(plan.weekly_structure).length > 0 ? (
            <div className="space-y-2">
              {Array.from({ length: plan.duration_weeks }, (_, i) => i + 1).map((weekNum) => {
                const weekKey = `week_${weekNum}`;
                const workouts: Workout[] = plan.weekly_structure[weekKey] || [];
                const isExpanded = expandedWeek === weekNum;

                return (
                  <div key={weekNum} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleWeek(weekNum)}
                      className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition flex items-center justify-between text-left"
                    >
                      <span className="font-medium text-gray-900">Week {weekNum}</span>
                      <svg
                        className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {isExpanded && (
                      <div className="p-4 bg-white space-y-2">
                        {workouts.length > 0 ? (
                          workouts.map((workout, idx) => (
                            <div key={idx} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                              <span className="font-medium text-gray-700 min-w-[80px]">{workout.day}:</span>
                              <span className="text-gray-600">{workout.workout}</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-sm text-gray-500 italic">No workouts defined for this week</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-600">No weekly schedule defined yet.</p>
          )}
        </div>

        {/* Assignments */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Runners on This Plan ({assignments.length})</h2>
          {assignments.length === 0 ? (
            <p className="text-sm text-gray-600">No runners assigned to this plan yet.</p>
          ) : (
            <div className="space-y-3">
              {assignments.map((assignment: any) => (
                <div key={assignment.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between mb-2">
                    <Link
                      href={`/admin/runners/${assignment.user.id}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {assignment.user.name}
                    </Link>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      assignment.status === 'active' ? 'bg-green-100 text-green-800' :
                      assignment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      assignment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Week {assignment.current_week} of {plan.duration_weeks}</span>
                      <span className="font-medium">{assignment.completion_percentage}% complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${assignment.completion_percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      Started: {new Date(assignment.start_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}