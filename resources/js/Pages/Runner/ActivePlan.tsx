// resources/js/Pages/Runner/ActivePlan.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';

interface ActivePlanProps {
  assignment: any;
  plan: any;
}

/**
 * ActivePlan
 * Shows the runner's active training plan with progress tracking
 */
export default function ActivePlan({ assignment, plan }: ActivePlanProps) {
  const { themeConfig } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="My Training Plan" />

      <div className="max-w-6xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>My Training Plan</h1>
          <Link
            href="/runner/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {/* Plan Overview */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{plan.name}</h2>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{assignment.completion_percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${assignment.completion_percentage}%` }}
              />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="block text-sm text-gray-600">Current Week</span>
              <span className="text-lg font-semibold text-gray-900">
                {assignment.current_week} of {plan.duration_weeks}
              </span>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Workouts Completed</span>
              <span className="text-lg font-semibold text-gray-900">
                {assignment.total_workouts_completed} of {assignment.total_workouts_in_plan}
              </span>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Start Date</span>
              <span className="text-lg font-semibold text-gray-900">
                {new Date(assignment.start_date).toLocaleDateString()}
              </span>
            </div>
            <div>
              <span className="block text-sm text-gray-600">Target End</span>
              <span className="text-lg font-semibold text-gray-900">
                {new Date(assignment.target_end_date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {/* Weekly Workouts */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Weekly Workouts</h3>
          <p className="text-sm text-gray-600">
            Detailed workout schedule and tracking coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}