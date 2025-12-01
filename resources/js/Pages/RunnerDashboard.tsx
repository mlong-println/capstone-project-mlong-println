// resources/js/Pages/RunnerDashboard.tsx

import { Head, Link, router } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import ThemedNavBar from '@/Components/ThemedNavBar';
import InspirationalQuotes from '@/Components/InspirationalQuotes';
import { useState } from 'react';

/**
 * RunnerDashboard Props
 * Data passed from the controller
 */
interface RunComment {
  id: number;
  user_name: string;
  user_id: number;
  comment: string;
  created_at: string;
  can_delete: boolean;
}

interface FeedActivity {
  type: 'run' | 'event' | 'challenge';
  run_id?: number;
  user: string;
  user_id: number | null;
  is_own_run?: boolean;
  message: string;
  time: string;
  data: {
    pace?: string;
    distance?: number;
    route_name?: string;
    route_preview?: Array<{lat: number; lng: number}>;
    likes_count?: number;
    comments_count?: number;
    user_liked?: boolean;
    comments?: RunComment[];
    event_id?: number;
    event_date?: string;
    achievement_id?: number;
  };
}

interface RunnerDashboardProps {
  auth: {
    user: any;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
  profile: any;
  activePlan: any;
  stats: {
    total_runs: number;
    total_distance: number;
    current_weekly_mileage: number;
  };
  feedActivities: FeedActivity[];
}

/**
 * Role-specific dashboard for runner users.
 * Shows profile status, active training plan, and quick stats.
 */
export default function RunnerDashboard({ auth, user, profile, activePlan, stats, feedActivities }: RunnerDashboardProps) {
  const { themeConfig } = useTheme();
  const [showCommentInput, setShowCommentInput] = useState<number | null>(null);
  const [commentText, setCommentText] = useState('');

  const formatTimeAgo = (time: string) => {
    const date = new Date(time);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'run':
        return '🏃';
      case 'event':
        return '📅';
      case 'challenge':
        return '🏆';
      default:
        return '📢';
    }
  };

  const handleLike = (runId: number) => {
    router.post(`/runs/${runId}/like`, {}, {
      preserveScroll: true,
    });
  };

  const handleComment = (runId: number) => {
    if (!commentText.trim()) return;
    
    router.post(`/runs/${runId}/comment`, {
      comment: commentText,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        setCommentText('');
        setShowCommentInput(null);
      },
    });
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('Delete this comment?')) {
      router.delete(`/runs/comments/${commentId}`, {
        preserveScroll: true,
      });
    }
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Runner Dashboard" />

      {/* Top navbar with navigation links */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg`}>
        <ThemedNavBar auth={auth} themeTextClass={themeConfig.textLight} />
      </div>

      {/* Header */}
      <div className="max-w-6xl mx-auto py-10 px-6">
        <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Runner Dashboard</h1>
        <p className={`mt-2 ${themeConfig.text} opacity-80`}>
          Welcome back, {user.name}. Here's a snapshot of your running activity.
        </p>

        {/* Profile completion prompt */}
        {!profile && (
          <div className="mt-4 rounded-lg border border-yellow-300 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              <strong>Complete your profile</strong> to get started with training plans.{' '}
              <Link href="/runner/profile/edit" className="underline font-medium">
                Set up profile →
              </Link>
            </p>
          </div>
        )}
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Left Column - Training Plan & Social Feed */}
          <div className="space-y-6">
            {/* Active Training Plan - Compact */}
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Active Training Plan</h2>
              {activePlan ? (
                <div>
                  <h3 className="font-semibold text-gray-900">{activePlan.training_plan?.name}</h3>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs text-gray-600">
                    <div>
                      <span className="font-medium">Week:</span> {activePlan.current_week}/{activePlan.training_plan?.duration_weeks}
                    </div>
                    <div>
                      <span className="font-medium">Progress:</span> {activePlan.completion_percentage}%
                    </div>
                    <div>
                      <span className="font-medium">End:</span> {new Date(activePlan.target_end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                  <Link
                    href="/runner/my-plan"
                    className="mt-3 inline-block px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                </div>
              ) : (
                <div>
                  <p className="text-xs text-gray-600 mb-3">
                    No active training plan. Start your training journey!
                  </p>
                  <Link
                    href="/runner/plans"
                    className="inline-block px-3 py-1.5 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                  >
                    Browse Plans
                  </Link>
                </div>
              )}
            </section>

            {/* Social Feed */}
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity Feed</h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {feedActivities.length > 0 ? (
                  feedActivities.map((activity, index) => (
                    <div key={index} className="pb-4 border-b border-gray-200 last:border-0">
                      {/* Run Activity */}
                      {activity.type === 'run' && activity.run_id ? (
                        <div className="space-y-2">
                          {/* User and Message */}
                          <div className="flex items-start gap-2">
                            <span className="text-xl">{getActivityIcon(activity.type)}</span>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {activity.user_id ? (
                                  <Link href={`/users/${activity.user_id}`} className="font-semibold hover:text-indigo-600">
                                    {activity.user}
                                  </Link>
                                ) : (
                                  <span className="font-semibold">{activity.user}</span>
                                )}{' '}
                                <span className="text-gray-600">{activity.message}</span>
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                            </div>
                          </div>

                          {/* Route Preview */}
                          {activity.data.route_preview && activity.data.route_preview.length > 0 && (
                            <div className="ml-7 bg-gray-100 rounded p-2 text-xs">
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                </svg>
                                <span className="text-gray-700 font-medium">{activity.data.route_name}</span>
                                <span className="text-gray-500">• {activity.data.distance}km • {activity.data.pace}</span>
                              </div>
                            </div>
                          )}

                          {/* Like and Comment Actions */}
                          <div className="ml-7 flex items-center gap-4 text-xs">
                            <button
                              onClick={() => handleLike(activity.run_id!)}
                              className={`flex items-center gap-1 ${activity.data.user_liked ? 'text-red-600' : 'text-gray-600'} hover:text-red-600 transition`}
                            >
                              <svg className="w-4 h-4" fill={activity.data.user_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{activity.data.likes_count || 0}</span>
                            </button>
                            <button
                              onClick={() => setShowCommentInput(showCommentInput === activity.run_id ? null : activity.run_id!)}
                              className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{activity.data.comments_count || 0}</span>
                            </button>
                          </div>

                          {/* Comments */}
                          {activity.data.comments && activity.data.comments.length > 0 && (
                            <div className="ml-7 space-y-2 mt-2">
                              {activity.data.comments.map((comment) => (
                                <div key={comment.id} className="bg-gray-50 rounded p-2 text-xs">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <Link href={`/users/${comment.user_id}`} className="font-semibold text-gray-900 hover:text-indigo-600">
                                        {comment.user_name}
                                      </Link>
                                      <p className="text-gray-700 mt-1">{comment.comment}</p>
                                      <p className="text-gray-400 mt-1">{formatTimeAgo(comment.created_at)}</p>
                                    </div>
                                    {comment.can_delete && (
                                      <button
                                        onClick={() => handleDeleteComment(comment.id)}
                                        className="text-red-500 hover:text-red-700 ml-2"
                                      >
                                        ×
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Comment Input */}
                          {showCommentInput === activity.run_id && (
                            <div className="ml-7 mt-2">
                              <div className="flex gap-2">
                                <input
                                  type="text"
                                  value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  placeholder="Add a comment..."
                                  className="flex-1 text-xs rounded border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                  onKeyPress={(e) => e.key === 'Enter' && handleComment(activity.run_id!)}
                                />
                                <button
                                  onClick={() => handleComment(activity.run_id!)}
                                  className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700 transition"
                                >
                                  Post
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Non-Run Activities (Events, Challenges) */
                        <div className="flex items-start gap-2">
                          <span className="text-xl">{getActivityIcon(activity.type)}</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              {activity.user_id ? (
                                <Link href={`/users/${activity.user_id}`} className="font-semibold hover:text-indigo-600">
                                  {activity.user}
                                </Link>
                              ) : (
                                <span className="font-semibold">{activity.user}</span>
                              )}{' '}
                              <span className="text-gray-600">{activity.message}</span>
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{formatTimeAgo(activity.time)}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No recent activity</p>
                    <p className="text-xs text-gray-400 mt-1">Follow other runners to see their activities here!</p>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Stats */}
            <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-4 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Your Stats</h2>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_runs}</div>
                  <div className="text-xs text-gray-600">Total Runs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.total_distance}</div>
                  <div className="text-xs text-gray-600">Total km</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.current_weekly_mileage}</div>
                  <div className="text-xs text-gray-600">This Week</div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Inspirational Quotes */}
          <div>
            <InspirationalQuotes />
          </div>

        </div>
      </div>

      {/* Profile Section - Below */}
      <div className="max-w-7xl mx-auto px-6 mb-6">
        <section className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Your Profile</h2>
            <Link
              href="/runner/profile/edit"
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit →
            </Link>
          </div>

          {profile ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Experience Level:</span>
                <span className="ml-2 text-gray-600 capitalize">{profile.experience_level}</span>
              </div>
              {profile.current_goal && (
                <div>
                  <span className="font-medium text-gray-700">Current Goal:</span>
                  <span className="ml-2 text-gray-600">{profile.current_goal}</span>
                </div>
              )}
              {profile.location && (
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{profile.location}</span>
                </div>
              )}
              
              {/* Running Stats */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">Running Stats</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stats?.total_runs || 0}</div>
                    <div className="text-xs text-gray-600">Total Runs</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">{stats?.total_distance || 0} km</div>
                    <div className="text-xs text-gray-600">Total Distance</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-600">
              Complete your profile to track your progress and get personalized training plans.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}