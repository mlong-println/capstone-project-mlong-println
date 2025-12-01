import { Link } from '@inertiajs/react';
import NotificationBell from '@/Components/NotificationBell';
import ActivityHeart from '@/Components/ActivityHeart';
import Dropdown from '@/Components/Dropdown';

interface ThemedNavBarProps {
    auth: { user: any };
    themeTextClass: string;
}

/**
 * ThemedNavBar
 * Navigation bar with links for themed dashboard pages
 * Includes: Dashboard, Forum, Routes, Events, Messages
 */
export default function ThemedNavBar({ auth, themeTextClass }: ThemedNavBarProps) {
    return (
        <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left: Navigation Links */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/dashboard"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/forum"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Forum
                        </Link>
                        <Link
                            href="/routes"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Routes
                        </Link>
                        <Link
                            href="/events"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Events
                        </Link>
                        <Link
                            href="/messages/inbox"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Messages
                        </Link>
                        <Link
                            href="/achievements"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Achievements
                        </Link>
                        <Link
                            href="/gear"
                            className={`${themeTextClass} hover:text-white transition font-medium`}
                        >
                            Gear
                        </Link>
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
