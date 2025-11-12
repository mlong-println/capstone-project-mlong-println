// resources/js/Pages/Trainer/ViewRunners.tsx

import { Head, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { useState, useMemo } from 'react';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter and search runners
  const filteredRunners = useMemo(() => {
    return runners.filter((runner) => {
      // Search filter (name, email, goal)
      const matchesSearch = searchQuery === '' || 
        runner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        runner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (runner.profile?.current_goal?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      // Experience level filter
      const matchesLevel = filterLevel === 'all' || 
        runner.profile?.experience_level === filterLevel;

      // Active plan status filter
      const matchesStatus = filterStatus === 'all' ||
        (filterStatus === 'active' && runner.active_plan) ||
        (filterStatus === 'inactive' && !runner.active_plan);

      return matchesSearch && matchesLevel && matchesStatus;
    });
  }, [runners, searchQuery, filterLevel, filterStatus]);

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

        {/* Search and Filter Bar */}
        {runners.length > 0 && (
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
                  placeholder="Name, email, or goal..."
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
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

              {/* Plan Status Filter */}
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Plan Status
                </label>
                <select
                  id="status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Runners</option>
                  <option value="active">Active Plan</option>
                  <option value="inactive">No Active Plan</option>
                </select>
              </div>
            </div>

            {/* Results Count and Clear Filters */}
            <div className="mt-3 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredRunners.length} of {runners.length} runners
              </div>
              {(searchQuery !== '' || filterLevel !== 'all' || filterStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterLevel('all');
                    setFilterStatus('all');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}

        {runners.length === 0 ? (
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-8 shadow-lg text-center">
            <p className="text-gray-600">No runners registered yet.</p>
          </div>
        ) : filteredRunners.length === 0 ? (
          <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-8 shadow-lg text-center">
            <p className="text-gray-600">No runners match your search criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterLevel('all');
                setFilterStatus('all');
              }}
              className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRunners.map((runner) => (
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