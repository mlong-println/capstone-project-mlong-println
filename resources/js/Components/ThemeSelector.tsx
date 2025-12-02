// resources/js/Components/ThemeSelector.tsx

import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

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
    // Main gradient: dark forest greens (very dark to lighter)
    gradient: 'bg-gradient-to-br from-green-950 via-green-800 to-green-600',
    // Navbar: reverse gradient (lighter to darker)
    navGradient: 'bg-gradient-to-r from-green-600 via-green-800 to-green-950',
    accent: 'bg-green-700 hover:bg-green-800',
    text: 'text-green-50',
    textLight: 'text-green-50',
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

// Create theme context
interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themeConfig: typeof themes[ThemeName];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Component
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('forest');

  // Load theme from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('theme') as ThemeName;
    console.log('ThemeProvider: Loading theme from localStorage:', saved);
    if (saved && themes[saved]) {
      setTheme(saved);
    }
  }, []);

  // Save to localStorage when theme changes
  useEffect(() => {
    console.log('ThemeProvider: Saving theme to localStorage:', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = {
    theme,
    setTheme,
    themeConfig: themes[theme],
  };

  console.log('ThemeProvider: Rendering with theme:', theme, 'config:', themes[theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

// Hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

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
      {/* Theme button - matches navbar styling */}
      <button
        type="button"
        className="inline-flex items-center gap-2 rounded-md bg-white/10 backdrop-blur-sm px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-white/20 transition border border-white/20"
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

      {/* Dropdown panel (shows on hover) - added pt-2 to create hover bridge */}
      {isHovered && (
        <div className="absolute left-0 pt-2 z-50">
          <div className="w-40 rounded-md border border-gray-200 bg-white shadow-lg">
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
        </div>
      )}
    </div>
  );
}
