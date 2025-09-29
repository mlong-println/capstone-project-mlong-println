// resources/js/Pages/Welcome.tsx

// Import required dependencies and types
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';

/**
 * Props interface for the Welcome component
 * Extends PageProps to include authentication and configuration flags.
 *
 * IMPORTANT:
 * - Ensure your global types allow `auth.user` to be `User | null` for guests.
 *   Update `resources/js/types/index.d.ts` to:
 *     user: User | null
 */
interface Props extends PageProps {
  auth: {
    user: any | null; // current user or null when not authenticated
  };
  canLogin: boolean;     // whether to show the "Log in" link
  canRegister: boolean;  // whether to show the "Register" link
  laravelVersion?: string;
  phpVersion?: string;
}

/**
 * Welcome Page Component
 * - Renders a dropdown Navbar on the top-right
 * - Displays a centered logo with spacing at the top
 * - Shows a simple hero message
 */
export default function Welcome({ auth, canLogin, canRegister }: Props) {
  // Debug log to verify prop values during development (remove/disable for production)
  console.log('Welcome props:', { auth, canLogin, canRegister });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Set page title */}
      <Head title="Welcome" />

      {/* Top navbar: right-aligned dropdown with Login/Register or Dashboard/Logout */}
      {/* Navbar lives at: resources/js/Components/Navbar.tsx */}
      <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} />

      {/* Logo block (centered with spacing from the top) */}
      <div className="max-w-7xl mx-auto px-6">
        {/* Provide top spacing for the logo area */}
        <div className="pt-12 flex items-center justify-center">
          {/* IMPORTANT:
             - Web apps cannot load local Windows paths directly.
             - Copy your image to: <project-root>/public/images/logo.png
             - Then reference it below as: src="/images/logo.png"
             - Original file you mentioned:
               C:\Users\Michael\Pictures\Screenshots\Screenshot 2025-01-31 115530.png
          */}
          <img
            src="/images/logo.png"
            alt="RunConnect Logo"
            className="max-h-28 w-auto object-contain"
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] px-6">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to RunConnect</h1>
      </div>

      {/* Optional on-screen debug (uncomment during development)
      <div className="p-4 text-xs text-gray-600">
        <pre>{JSON.stringify({ user: auth?.user, canLogin, canRegister }, null, 2)}</pre>
      </div>
      */}
    </div>
  );
}