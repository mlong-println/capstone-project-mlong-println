// Updated with navigation links
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import NotificationBell from '@/Components/NotificationBell';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Toast from '@/Components/Toast';
import { useTheme } from '@/Components/ThemeSelector';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

/**
 * AuthenticatedLayout
 * Layout wrapper for authenticated pages (dashboards, profile, etc.)
{{ ... }}
 */
export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    // Get the authenticated user from Inertia page props
    // Non-null assertion (!) is safe here because this layout is only used on auth-protected routes
    const user = usePage().props.auth.user!;
    const { themeConfig } = useTheme();

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className={`min-h-screen ${themeConfig.gradient}`}>
            <nav className={`border-b border-white/20 ${themeConfig.navGradient} shadow-lg`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/" className={`text-xl font-bold ${themeConfig.textLight}`}>
                                    RunConnect
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <Link
                                    href={route('dashboard')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('dashboard')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('forum.index')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('forum.*')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Forum
                                </Link>
                                <Link
                                    href={route('routes.index')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('routes.*')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Routes
                                </Link>
                                <Link
                                    href={route('events.index')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('events.*')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Events
                                </Link>
                                <Link
                                    href={route('messages.inbox')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('messages.*')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Messages
                                </Link>
                                <Link
                                    href={route('achievements.index')}
                                    className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium transition ${
                                        route().current('achievements.*')
                                            ? 'border-white text-white'
                                            : 'border-transparent text-white/70 hover:text-white hover:border-white/50'
                                    }`}
                                >
                                    Achievements
                                </Link>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center sm:space-x-4">
                            {/* Notification Bell */}
                            <NotificationBell />
                            
                            <div className="relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-white/30 bg-white/10 backdrop-blur-sm px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:bg-white/20 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
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
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('profile.edit')}
                                        >
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

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route('achievements.index')}
                            active={route().current('achievements.*')}
                        >
                            Achievements
                        </ResponsiveNavLink>
                    </div>

                    <div className="border-t border-gray-200 pb-1 pt-4">
                        <div className="px-4">
                            <div className="text-base font-medium text-gray-800">
                                {user.name}
                            </div>
                            <div className="text-sm font-medium text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route('logout')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white/10 backdrop-blur-sm shadow-lg border-b border-white/20">
                    <div className={`mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${themeConfig.textLight}`}>
                        {header}
                    </div>
                </header>
            )}

            <main className="pb-12">{children}</main>
            
            {/* Toast Notifications */}
            <Toast />
        </div>
    );
}