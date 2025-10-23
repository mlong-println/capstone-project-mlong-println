// resources/js/Components/Navbar.tsx

import { useEffect, useRef, useState } from 'react';
import { Link, router } from '@inertiajs/react';

/**
 * NavbarProps
 * - auth.user: current user (or null if guest)
 * - canLogin/canRegister: flags (helpful during debugging or controlled via backend)
 * - themeTextClass: text color class from current theme (e.g., 'text-white')
 */
type NavbarProps = {
  auth: { user: any | null };
  canLogin?: boolean;
  canRegister?: boolean;
  themeTextClass?: string;
};

/**
 * Navbar
 * - Positions itself at the top-right
 * - Provides a dropdown menu with options depending on authentication state
 * - Does not require any extra UI libraries
 */
export default function Navbar({ auth, canLogin = true, canRegister = true, themeTextClass = 'text-gray-700' }: NavbarProps) {
  // Local state to toggle the dropdown visibility
  const [open, setOpen] = useState(false);

  // Ref + outside-click handler to close dropdown when clicking away
  const menuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // Logout handler (Breeze: POST /logout)
  const handleLogout = () => router.post('/logout');

  return (
    // Container positioned top-right (no background, uses parent's themed background)
    <div className="flex items-center justify-end">
          {/* Menu button (avatar/icon substitute) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-md border border-white/30 px-3 py-2 ${themeTextClass} hover:bg-white/10 hover:border-white/50 transition backdrop-blur-sm`}
              aria-expanded={open}
              aria-haspopup="true"
            >
              {/* Simple icon substitute (three dots) */}
              <span className="font-medium">Menu</span>
              <svg
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm2 2a2 2 0 100-4 2 2 0 000 4z" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {open && (
              <div
                className="absolute right-0 mt-2 w-52 rounded-md border border-white/30 bg-white shadow-lg"
                role="menu"
                aria-label="User menu"
              >
                {/* Authenticated: show Profile, Dashboard, Logout */}
                {auth.user ? (
                  <div className="py-1">
                    {/* Optional: show a small header with user name if available */}
                    {/* <div className="px-4 py-2 text-xs text-gray-500">Signed in as {auth.user?.name}</div>
                    <div className="my-1 border-t border-gray-100" /> */}

                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      role="menuitem"
                      onClick={() => setOpen(false)}
                    >
                      Dashboard
                    </Link>

                    {/* Separator for clarity */}
                    <div className="my-1 border-t border-gray-100" />

                    <button
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  // Guest: show Login/Register (if enabled)
                  <div className="py-1">
                    {canLogin && (
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                      >
                        Log in
                      </Link>
                    )}
                    {canRegister && (
                      <Link
                        href="/register"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                      >
                        Register
                      </Link>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
    </div>
  );
}