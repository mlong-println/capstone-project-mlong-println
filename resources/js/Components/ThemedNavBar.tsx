import { Link } from '@inertiajs/react';
import NotificationBell from '@/Components/NotificationBell';
import ActivityHeart from '@/Components/ActivityHeart';
import Dropdown from '@/Components/Dropdown';
import { useState, useEffect, useRef } from 'react';

interface ThemedNavBarProps {
    auth: { user: any };
    themeTextClass: string;
}

/**
 * ThemedNavBar
 * Navigation bar with dropdown menus for organized navigation
 * Sections: Training, Activity, Social, Profile
 */
export default function ThemedNavBar({ auth, themeTextClass }: ThemedNavBarProps) {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeDropdown = () => {
        setOpenDropdown(null);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isAdmin = auth.user.role === 'admin';

    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Navigation Dropdowns */}
                    <div ref={dropdownRef} className="flex items-center space-x-6">
                        {/* Dashboard Link (standalone) */}
                        <Link
                            href="/dashboard"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Dashboard
                        </Link>

                        {/* Admin-specific dropdowns */}
                        {isAdmin ? (
                            <>
                                {/* Athletes Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown('athletes')}
                                        className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                                    >
                                        Athletes
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'athletes' && (
                                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <Link
                                                    href="/admin/runners"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    View All Athletes
                                                </Link>
                                                <Link
                                                    href="/users"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Find Athletes
                                                </Link>
                                                <Link
                                                    href="/admin/plans"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Training Plans
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Routes Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown('routes')}
                                        className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                                    >
                                        Routes
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'routes' && (
                                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <Link
                                                    href="/routes"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    All Routes
                                                </Link>
                                                <Link
                                                    href="/routes/create"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Create Route
                                                </Link>
                                                <Link
                                                    href="/explore"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Explore & Leaderboards
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Social Dropdown for Admin */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown('social')}
                                        className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                                    >
                                        Social
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'social' && (
                                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <Link
                                                    href="/forum"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Forum
                                                </Link>
                                                <Link
                                                    href="/events"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Events
                                                </Link>
                                                <Link
                                                    href="/messages/inbox"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Messages
                                                </Link>
                                                <Link
                                                    href="/safety-alerts"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Safety Alerts
                                                </Link>
                                                <Link
                                                    href="/users"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Find Users
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Admin Tools Dropdown */}
                                <div className="relative">
                                    <button
                                        onClick={() => toggleDropdown('admin')}
                                        className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                                    >
                                        Admin
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    {openDropdown === 'admin' && (
                                        <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                            <div className="py-1">
                                                <Link
                                                    href="/forum"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Flagged Posts
                                                </Link>
                                                <Link
                                                    href="/safety-alerts"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Review Alerts
                                                </Link>
                                                <Link
                                                    href="/achievements"
                                                    onClick={closeDropdown}
                                                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                >
                                                    Manage Challenges
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Runner Training Dropdown */}
                                <div className="relative">
                            <button
                                onClick={() => toggleDropdown('training')}
                                className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                            >
                                Training
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {openDropdown === 'training' && (
                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/runner/plans"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Browse Plans
                                        </Link>
                                        <Link
                                            href="/runner/my-plan"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Plan
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Activity Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('activity')}
                                className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                            >
                                Activity
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {openDropdown === 'activity' && (
                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/routes"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Routes
                                        </Link>
                                        <Link
                                            href="/runs"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Runs
                                        </Link>
                                        <Link
                                            href="/gear"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Gear
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Social Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => toggleDropdown('social')}
                                className={`${themeTextClass} hover:text-white transition font-medium flex items-center gap-1`}
                            >
                                Social
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                            {openDropdown === 'social' && (
                                <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="py-1">
                                        <Link
                                            href="/forum"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Forum
                                        </Link>
                                        <Link
                                            href="/messages/inbox"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Messages
                                        </Link>
                                        <Link
                                            href="/events"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Events
                                        </Link>
                                        <Link
                                            href="/activity"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Follow Requests
                                        </Link>
                                        <Link
                                            href="/users"
                                            onClick={closeDropdown}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Find Users
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                            </>
                        )}
                    </div>

                    {/* Right: Activity Heart + Notification Bell + User Dropdown */}
                    <div className="flex items-center space-x-4">
                        <ActivityHeart />
                        <NotificationBell />
                        
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button
                                    type="button"
                                    className={`inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-2 ${themeTextClass} hover:bg-white/10 hover:border-white/50 transition backdrop-blur-sm`}
                                >
                                    <span className="font-medium">{auth.user.name}</span>
                                    <svg
                                        className="h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Dropdown.Link href="/achievements">
                                    Achievements
                                </Dropdown.Link>
                                <Dropdown.Link href={route('profile.edit')}>
                                    Profile
                                </Dropdown.Link>
                                <Dropdown.Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                >
                                    Log Out
                                </Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </div>
        </div>
    );
}
