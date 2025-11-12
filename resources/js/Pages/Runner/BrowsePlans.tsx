// resources/js/Pages/Runner/BrowsePlans.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { useState, useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistance, setFilterDistance] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const distanceLabels: Record<string, string> = {
    '5k': '5K Plans',
    '10k': '10K Plans',
    'half_marathon': 'Half Marathon Plans',
    'full_marathon': 'Full Marathon Plans',
    'ultra': 'Ultra Marathon Plans',
  };

  // Flatten plans for filtering
  const allPlans = useMemo(() => {
    return Object.entries(plans).flatMap(([distanceType, distancePlans]) =>
      distancePlans.map(plan => ({ ...plan, distance_type: distanceType }))
    );
  }, [plans]);

  // Filter plans
  const filteredPlans = useMemo(() => {
    return allPlans.filter((plan) => {
      // Search filter
      const matchesSearch = searchQuery === '' ||
        plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Distance filter
      const matchesDistance = filterDistance === 'all' || plan.distance_type === filterDistance;

      // Experience level filter
      const matchesLevel = filterLevel === 'all' || plan.experience_level === filterLevel;

      return matchesSearch && matchesDistance && matchesLevel;
    });
  }, [allPlans, searchQuery, filterDistance, filterLevel]);

  // Group filtered plans by distance
  const groupedFilteredPlans = useMemo(() => {
    const grouped: Record<string, typeof filteredPlans> = {};
    filteredPlans.forEach(plan => {
      if (!grouped[plan.distance_type]) {
        grouped[plan.distance_type] = [];
      }
      grouped[plan.distance_type].push(plan);
    });
    return grouped;
  }, [filteredPlans]);

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

        {/* Search and Filter Bar */}
        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Plan name or description..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            {/* Distance Filter */}
            <div>
              <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-1">
                Distance
              </label>
              <select
                id="distance"
                value={filterDistance}
                onChange={(e) => setFilterDistance(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Distances</option>
                <option value="5k">5K</option>
                <option value="10k">10K</option>
                <option value="half_marathon">Half Marathon</option>
                <option value="full_marathon">Full Marathon</option>
                <option value="ultra">Ultra Marathon</option>
              </select>
            </div>

            {/* Experience Level Filter */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">
                Experience Level
              </label>
              <select
                id="level"
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Results Count and Clear Filters */}
          <div className="mt-3 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredPlans.length} of {allPlans.length} plans
            </div>
            {(searchQuery !== '' || filterDistance !== 'all' || filterLevel !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setFilterDistance('all');
                  setFilterLevel('all');
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Plans grouped by distance */}
        {filteredPlans.length === 0 ? (
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-8 shadow-lg text-center">
            <p className="text-gray-600">No plans match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterDistance('all');
                setFilterLevel('all');
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFilteredPlans).map(([distanceType, distancePlans]) => (
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
        )}
      </div>
    </div>
  );
}