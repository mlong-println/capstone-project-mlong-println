// resources/js/Pages/Runner/EditProfile.tsx

import { Head, useForm, Link } from '@inertiajs/react';
import { useTheme } from '@/Components/ThemeSelector';
import { FormEventHandler } from 'react';

interface EditProfileProps {
  user: {
    id: number;
    name: string;
    email: string;
  };
  profile: any;
}

/**
 * EditProfile
 * Allows runners to edit their profile information
 */
export default function EditProfile({ user, profile }: EditProfileProps) {
  const { themeConfig } = useTheme();

  const { data, setData, patch, processing, errors } = useForm<{
    bio: string;
    location: string;
    experience_level: string;
    current_goal: string;
    current_weekly_distance: string;
  }>({
    bio: profile?.bio || '',
    location: profile?.location || '',
    experience_level: profile?.experience_level || 'beginner',
    current_goal: profile?.current_goal || '',
    current_weekly_distance: profile?.current_weekly_distance || '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    patch('/runner/profile');
  };

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      <Head title="Edit Profile" />

      <div className="max-w-4xl mx-auto py-10 px-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-3xl font-bold ${themeConfig.text}`}>Edit Profile</h1>
          <Link
            href="/runner/dashboard"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg border border-white/30 bg-white/90 backdrop-blur-sm p-6 shadow-lg">
          <form onSubmit={submit} className="space-y-6">
            {/* Experience Level */}
            <div>
              <label htmlFor="experience_level" className="block text-sm font-medium text-gray-700">
                Experience Level <span className="text-red-500">*</span>
              </label>
              <select
                id="experience_level"
                value={data.experience_level}
                onChange={(e) => setData('experience_level', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.experience_level && (
                <p className="mt-1 text-sm text-red-600">{errors.experience_level}</p>
              )}
            </div>

            {/* Current Goal */}
            <div>
              <label htmlFor="current_goal" className="block text-sm font-medium text-gray-700">
                Current Goal
              </label>
              <input
                type="text"
                id="current_goal"
                value={data.current_goal}
                onChange={(e) => setData('current_goal', e.target.value)}
                placeholder="e.g., Complete my first 5K"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.current_goal && (
                <p className="mt-1 text-sm text-red-600">{errors.current_goal}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={data.location}
                onChange={(e) => setData('location', e.target.value)}
                placeholder="e.g., Hamilton, ON"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Current Weekly Distance */}
            <div>
              <label htmlFor="current_weekly_distance" className="block text-sm font-medium text-gray-700">
                Current Weekly Distance (km)
              </label>
              <input
                type="text"
                id="current_weekly_distance"
                value={data.current_weekly_distance}
                onChange={(e) => setData('current_weekly_distance', e.target.value)}
                placeholder="e.g., 20 or 35-45"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                You can enter a single number (e.g., 20) or a range (e.g., 35-45)
              </p>
              {errors.current_weekly_distance && (
                <p className="mt-1 text-sm text-red-600">{errors.current_weekly_distance}</p>
              )}
            </div>

            {/* Bio */}
            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={data.bio}
                onChange={(e) => setData('bio', e.target.value)}
                rows={4}
                placeholder="Tell us about yourself and your running journey..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.bio && (
                <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-4">
              <Link
                href="/runner/dashboard"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {processing ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}