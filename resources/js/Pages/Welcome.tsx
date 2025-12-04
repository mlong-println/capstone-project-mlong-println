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
  const { theme, themeConfig, setTheme } = useTheme();

  return (
    <div className="min-h-screen relative">
      {/* Page title */}
      <Head title="Welcome" />

      {/* Top bar with ThemeSelector (left) and Navbar (right) - uses reverse gradient */}
      <div className={`w-full ${themeConfig.navGradient} shadow-lg relative z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Theme selector on the left */}
          <ThemeSelector currentTheme={theme} onThemeChange={setTheme} />

          {/* Navbar on the right */}
          <div className="flex-1 flex justify-end">
            <Navbar auth={auth} canLogin={canLogin} canRegister={canRegister} themeTextClass={themeConfig.textLight} />
          </div>
        </div>
      </div>

      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/brucetrail-8.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Dark overlay for better text/logo visibility */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Logo block (centered with spacing and polish) */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="pt-24 flex items-center justify-center">
          <img
            src="/images/logo.png"
            alt="RunConnect Logo"
            className="max-h-72 w-auto object-contain rounded-xl shadow-2xl ring-4 ring-white/70"
          />
        </div>
      </div>

      {/* Main content area */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-24rem)] px-6">
        <h1 className="text-5xl font-bold text-white drop-shadow-lg">
          Welcome to RunConnect
        </h1>
      </div>
    </div>
  );
}