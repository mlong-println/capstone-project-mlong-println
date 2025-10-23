// resources/js/Pages/Welcome.tsx

import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import Navbar from '@/Components/Navbar';
import ThemeSelector, { useTheme } from '@/Components/ThemeSelector';

/**
 * Props interface for the Welcome component
 */
interface Props extends PageProps {
  auth: {
    user: any | null;
  };
  canLogin: boolean;
  canRegister: boolean;
  laravelVersion?: string;
  phpVersion?: string;
}

/**
 * Welcome Page Component
 * Landing page with theme support, logo, and navbar
 */
export default function Welcome({ auth, canLogin, canRegister }: Props) {
  // Theme state with localStorage persistence
  const { theme, themeConfig, changeTheme } = useTheme();

  return (
    <div className={`min-h-screen ${themeConfig.gradient}`}>
      {/* Page title */}
      <Head title="Welcome" />

      {/* Top bar with ThemeSelector (left) and Navbar (right) - uses reverse gradient */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Theme selector on the left */}
          <ThemeSelector currentTheme={theme} onThemeChange={changeTheme} />

          {/* Navbar on the right */}
          <div className="flex-1 flex justify-end">
            <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} themeTextClass={themeConfig.textLight} />
          </div>
        </div>
      </div>

      {/* Logo block (centered with spacing and polish) */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="pt-16 flex items-center justify-center">
          <img
            src="/images/logo.png"
            alt="RunConnect Logo"
            className="max-h-36 w-auto object-contain rounded-xl shadow-lg ring-2 ring-white/50"
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex items-center justify-center min-h-[calc(100vh-16rem)] px-6">
        <h1 className={`text-4xl font-bold ${themeConfig.text}`}>
          Welcome to RunConnect
        </h1>
      </div>
    </div>
  );
}