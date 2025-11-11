// resources/js/Pages/Runner/ActivePlan.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { useState } from 'react';

interface Workout {
  day: string;
  workout: string;
}

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
  const [processing, setProcessing] = useState(false);

  // Get current week's workouts from the plan's weekly_structure
  const currentWeekKey = `week_${assignment.current_week}`;
  const currentWeekWorkouts: Workout[] = plan.weekly_structure?.[currentWeekKey] || [];
  
  // Check if a workout is completed
  const isWorkoutCompleted = (workoutIndex: number): boolean => {
    const completed = assignment.completed_workouts || {};
    return completed[currentWeekKey]?.[workoutIndex] === true;
  };

  // Mark workout as complete
  const handleCompleteWorkout = (workoutIndex: number) => {
    if (processing || isWorkoutCompleted(workoutIndex)) return;
    
    setProcessing(true);
    router.post(
      `/runner/my-plan/${assignment.id}/complete-workout`,
      {
        week: assignment.current_week,
        workout_index: workoutIndex,
      },
      {
        onFinish: () => setProcessing(false),
      }
    );
  };

  // Pause plan
  const handlePause = () => {
    if (processing) return;
    if (confirm('Are you sure you want to pause this training plan?')) {
      setProcessing(true);
      router.post(`/runner/my-plan/${assignment.id}/pause`, {}, {
        onFinish: () => setProcessing(false),
      });
    }
  };

  // Resume plan
  const handleResume = () => {
    if (processing) return;
    setProcessing(true);
    router.post(`/runner/my-plan/${assignment.id}/resume`, {}, {
      onFinish: () => setProcessing(false),
    });
  };

  // Abandon plan
  const handleAbandon = () => {
    if (processing) return;
    if (confirm('Are you sure you want to abandon this training plan? This cannot be undone.')) {
      setProcessing(true);
      router.post(`/runner/my-plan/${assignment.id}/abandon`, {}, {
        onFinish: () => setProcessing(false),
      });
    }
  };

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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-900">{plan.name}</h2>
            
            {/* Status Badge */}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              assignment.status === 'active' ? 'bg-green-100 text-green-800' :
              assignment.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
            </span>
          </div>
          
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
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

          {/* Plan Controls */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {assignment.status === 'active' && (
              <button
                onClick={handlePause}
                disabled={processing}
                className="px-4 py-2 rounded bg-yellow-600 text-white text-sm font-medium hover:bg-yellow-700 transition disabled:opacity-50"
              >
                Pause Plan
              </button>
            )}
            {assignment.status === 'paused' && (
              <button
                onClick={handleResume}
                disabled={processing}
                className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition disabled:opacity-50"
              >
                Resume Plan
              </button>
            )}
            <button
              onClick={handleAbandon}
              disabled={processing}
              className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition disabled:opacity-50"
            >
              Abandon Plan
            </button>
          </div>
        </div>

        {/* Weekly Workouts */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Week {assignment.current_week} Workouts
          </h3>
          
          {currentWeekWorkouts.length > 0 ? (
            <div className="space-y-3">
              {currentWeekWorkouts.map((workout, index) => {
                const completed = isWorkoutCompleted(index);
                return (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg border transition ${
                      completed
                        ? 'bg-green-50 border-green-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-gray-900">{workout.day}</span>
                        {completed && (
                          <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{workout.workout}</p>
                    </div>
                    
                    {!completed && assignment.status === 'active' && (
                      <button
                        onClick={() => handleCompleteWorkout(index)}
                        disabled={processing}
                        className="ml-4 px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                No workout schedule available for this week. Contact your trainer for details.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}