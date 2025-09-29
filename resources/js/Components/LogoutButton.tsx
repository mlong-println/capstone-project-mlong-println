// resources/js/Components/LogoutButton.tsx

import { router } from '@inertiajs/react';

/**
 * LogoutButton
 * Posts to /logout using Inertia. Use anywhere you need a quick sign-out.
 * Example usage:
 *   {auth.user && <LogoutButton />}
 */
export default function LogoutButton() {
    const handleLogout = () => {
        // Breeze logout route is POST /logout
        router.post('/logout');
    };

    return (
        <button
            type="button"
            onClick={handleLogout}
            className="rounded-md px-3 py-2 text-gray-700 hover:text-gray-900 border border-gray-200 hover:border-gray-300 transition"
            aria-label="Logout"
            title="Logout"
        >
            Logout
        </button>
    );
}