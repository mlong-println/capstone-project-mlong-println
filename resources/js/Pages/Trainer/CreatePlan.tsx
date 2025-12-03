// resources/js/Pages/Trainer/CreatePlan.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { FormEventHandler, useState } from 'react';

interface Workout {
  day: string;
  workout: string;
}

/**
 * CreatePlan
 * Form for creating new training plans
 */
export default function CreatePlan() {
  const { themeConfig } = useTheme();
  const [weeklyStructure, setWeeklyStructure] = useState<Record<string, Workout[]>>({});
  const [currentWeek, setCurrentWeek] = useState(1);
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [data, setDataState] = useState({
    name: '',
    description: '',
    distance_type: '5k',
    experience_level: 'beginner',
    duration_weeks: 8,
    weekly_mileage_peak: '',
    prerequisites: '',
    goals: '',
  });

  const setData = (key: string, value: any) => {
    setDataState(prev => ({ ...prev, [key]: value }));
  };

  // Initialize weekly structure when duration changes
  const handleDurationChange = (weeks: number) => {
    setData('duration_weeks', weeks);
    const newStructure: Record<string, Workout[]> = {};
    for (let i = 1; i <= weeks; i++) {
      newStructure[`week_${i}`] = weeklyStructure[`week_${i}`] || [];
    }
    setWeeklyStructure(newStructure);
  };

  // Add workout to current week
  const addWorkout = () => {
    const weekKey = `week_${currentWeek}`;
    setWeeklyStructure({
      ...weeklyStructure,
      [weekKey]: [...(weeklyStructure[weekKey] || []), { day: '', workout: '' }],
    });
  };

  // Update workout
  const updateWorkout = (weekNum: number, index: number, field: 'day' | 'workout', value: string) => {
    const weekKey = `week_${weekNum}`;
    const updatedWorkouts = [...(weeklyStructure[weekKey] || [])];
    updatedWorkouts[index] = { ...updatedWorkouts[index], [field]: value };
    setWeeklyStructure({
      ...weeklyStructure,
      [weekKey]: updatedWorkouts,
    });
  };

  // Remove workout
  const removeWorkout = (weekNum: number, index: number) => {
    const weekKey = `week_${weekNum}`;
    const updatedWorkouts = (weeklyStructure[weekKey] || []).filter((_, i) => i !== index);
    setWeeklyStructure({
      ...weeklyStructure,
      [weekKey]: updatedWorkouts,
    });
  };

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    setProcessing(true);
    
    // Submit with weekly_structure included (stringify for JSON)
    const formData = {
      ...data,
      weekly_structure: JSON.stringify(weeklyStructure),
    };
    
    router.post('/admin/plans', formData as any, {
      onError: (errors) => {
        setErrors(errors as Record<string, string>);
        setProcessing(false);
      },
      onFinish: () => setProcessing(false),
    });
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Create Training Plan" />

      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Create Training Plan</h1>
          <Link
            href="/admin/plans"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Plans
          </Link>
        </div>

        <form onSubmit={submit} className="space-y-6">
          {/* Basic Info */}
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name *</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  value={data.description}
                  onChange={(e) => setData('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Distance Type *</label>
                  <select
                    value={data.distance_type}
                    onChange={(e) => setData('distance_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="5k">5K</option>
                    <option value="10k">10K</option>
                    <option value="half_marathon">Half Marathon</option>
                    <option value="full_marathon">Full Marathon</option>
                    <option value="ultra">Ultra Marathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level *</label>
                  <select
                    value={data.experience_level}
                    onChange={(e) => setData('experience_level', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (weeks) *</label>
                  <input
                    type="number"
                    value={data.duration_weeks}
                    onChange={(e) => handleDurationChange(parseInt(e.target.value))}
                    min="1"
                    max="52"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peak Weekly Mileage (km)</label>
                  <input
                    type="number"
                    value={data.weekly_mileage_peak}
                    onChange={(e) => setData('weekly_mileage_peak', e.target.value)}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
                <textarea
                  value={data.prerequisites}
                  onChange={(e) => setData('prerequisites', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Ability to run 5km comfortably"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Goals</label>
                <textarea
                  value={data.goals}
                  onChange={(e) => setData('goals', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Complete a 5K race in under 30 minutes"
                />
              </div>
            </div>
          </div>

          {/* Weekly Structure */}
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Weekly Training Schedule</h2>
            
            {/* Week Selector */}
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {Array.from({ length: data.duration_weeks }, (_, i) => i + 1).map((weekNum) => (
                <button
                  key={weekNum}
                  type="button"
                  onClick={() => setCurrentWeek(weekNum)}
                  className={`px-3 py-1 rounded-lg font-medium transition ${
                    currentWeek === weekNum
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Week {weekNum}
                </button>
              ))}
            </div>

            {/* Current Week Workouts */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Week {currentWeek} Workouts</h3>
                <button
                  type="button"
                  onClick={addWorkout}
                  className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm"
                >
                  + Add Workout
                </button>
              </div>

              {(weeklyStructure[`week_${currentWeek}`] || []).map((workout, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1 grid grid-cols-3 gap-3">
                    <input
                      type="text"
                      value={workout.day}
                      onChange={(e) => updateWorkout(currentWeek, index, 'day', e.target.value)}
                      placeholder="Day (e.g., Monday)"
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      value={workout.workout}
                      onChange={(e) => updateWorkout(currentWeek, index, 'workout', e.target.value)}
                      placeholder="Workout description"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeWorkout(currentWeek, index)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {(weeklyStructure[`week_${currentWeek}`] || []).length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-4">
                  No workouts added for this week yet. Click "Add Workout" to get started.
                </p>
              )}
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href="/admin/plans"
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={processing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {processing ? 'Creating...' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
