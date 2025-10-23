// resources/js/Components/ThemeSelector.tsx

import { useState, useEffect } from 'react';

/**
 * Theme configuration with vibrant, popping gradients
 * - Forest: Deep, vibrant greens
 * - Camo: White -> dark grey with light brown accents (camo pattern)
 * - Cosmic: Hot pinks and strong purples
 * Each theme has a reverse gradient for the navbar
 */
const themes = {
  forest: {
    name: 'Forest',
    // Main gradient: vibrant deep greens
    gradient: 'bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600',
    // Navbar: reverse gradient (dark to light)
    navGradient: 'bg-gradient-to-r from-teal-600 via-green-500 to-emerald-400',
    accent: 'bg-green-600 hover:bg-green-700',
    text: 'text-green-950',
    textLight: 'text-white',
  },
  camo: {
    name: 'Camo',
    // Main gradient: white -> dark grey with brown (camo pattern)
    gradient: 'bg-gradient-to-br from-stone-100 via-stone-400 to-stone-700',
    // Navbar: reverse gradient (dark to light with brown)
    navGradient: 'bg-gradient-to-r from-stone-700 via-amber-800 to-stone-300',
    accent: 'bg-stone-600 hover:bg-stone-700',
    text: 'text-stone-900',
    textLight: 'text-white',
  },
  cosmic: {
    name: 'Cosmic',
    // Main gradient: hot pinks and strong purples
    gradient: 'bg-gradient-to-br from-fuchsia-500 via-pink-500 to-purple-600',
    // Navbar: reverse gradient (purple to pink)
    navGradient: 'bg-gradient-to-r from-purple-600 via-pink-500 to-fuchsia-500',
    accent: 'bg-purple-600 hover:bg-purple-700',
    text: 'text-purple-950',
    textLight: 'text-white',
  },
} as const;

export type ThemeName = keyof typeof themes;

/**
 * Top-left button that shows theme options on hover
 * Stores selection in localStorage and updates parent via callback
 */
export default function ThemeSelector({
  currentTheme,
  onThemeChange,
}: {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Theme button */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 transition"
      >
        <span>Theme</span>
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      </button>

      {/* Dropdown panel (shows on hover) */}
      {isHovered && (
        <div className="absolute left-0 mt-2 w-40 rounded-md border border-gray-200 bg-white shadow-lg z-50">
          <div className="py-1">
            {(Object.keys(themes) as ThemeName[]).map((themeKey) => (
              <button
                key={themeKey}
                type="button"
                onClick={() => onThemeChange(themeKey)}
                className={`block w-full text-left px-4 py-2 text-sm transition ${
                  currentTheme === themeKey
                    ? 'bg-gray-100 font-semibold text-gray-900'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                {themes[themeKey].name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to manage theme state with localStorage persistence
 */
export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>('forest');

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName | null;
    if (saved && saved in themes) {
      setTheme(saved);
    }
  }, []);

  // Save theme to localStorage when it changes
  const changeTheme = (newTheme: ThemeName) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return {
    theme,
    themeConfig: themes[theme],
    changeTheme,
  };
}