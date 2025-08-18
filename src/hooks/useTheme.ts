import { useEffect, useState } from 'react';

export type Theme = 'dark' | 'light' | 'system';

interface ThemeHookReturn {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

export function useTheme(): ThemeHookReturn {
  const isClient = typeof window !== 'undefined';

  const getSystemTheme = (): 'light' | 'dark' => {
    if (!isClient)
      return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const getInitialTheme = (): Theme => {
    if (!isClient)
      return 'system';
    const stored = localStorage.getItem('theme') as Theme | null;
    return stored || 'system';
  };

  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>(() => {
    const initialTheme = getInitialTheme();
    return initialTheme === 'system' ? getSystemTheme() : initialTheme;
  });

  const applyTheme = (currentTheme: Theme) => {
    if (!isClient)
      return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');

    const newResolvedTheme: 'light' | 'dark'
      = currentTheme === 'system' ? getSystemTheme() : currentTheme;

    setResolvedTheme(newResolvedTheme);
    root.classList.add(newResolvedTheme);
  };

  const setTheme = (newTheme: Theme) => {
    if (isClient) {
      localStorage.setItem('theme', newTheme);
    }
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  useEffect(() => {
    if (!isClient)
      return;

    // Apply theme on mount
    applyTheme(theme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newSystemTheme = getSystemTheme();
        setResolvedTheme(newSystemTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme, isClient]);

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
