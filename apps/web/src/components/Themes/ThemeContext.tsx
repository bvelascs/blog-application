"use client";

import { createContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeContextProvider: React.FC<React.PropsWithChildren> = (
  props,
) => {  // Initialize state with a function to properly handle SSR
  const [theme, setTheme] = useState<Theme>(() => {
    // This runs only on client side
    if (typeof window !== 'undefined') {
      // Check cookies first for explicit theme preference
      const cookieTheme = document.cookie
        .split('; ')
        .find(row => row.startsWith('theme='))
        ?.split('=')[1] as Theme | undefined;

      // If cookie exists, use it
      if (cookieTheme === 'dark' || cookieTheme === 'light') {
        return cookieTheme;
      }
      
      // Otherwise check HTML attribute (from server)
      const htmlTheme = document.documentElement.getAttribute('data-theme') as Theme | null;
      if (htmlTheme === 'dark' || htmlTheme === 'light') {
        return htmlTheme;
      }

      // Last resort, check system preference
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    }
    
    // Default to light if nothing found
    return "light";
  });
  
  // Effect to synchronize theme with system preferences if no explicit choice was made
  useEffect(() => {
    // Listen for changes in system color scheme if that's how we're determining theme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const systemPreferenceChangeHandler = (e: MediaQueryListEvent) => {
      // Only change theme based on system preference if no explicit cookie is set
      const hasThemeCookie = document.cookie
        .split('; ')
        .some(row => row.startsWith('theme='));
      
      if (!hasThemeCookie) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', systemPreferenceChangeHandler);
    return () => mediaQuery.removeEventListener('change', systemPreferenceChangeHandler);
  }, []);

  function toggleThemeHandler() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Set cookie so theme persists between page loads
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 year expiration
  }

  const context = {
    theme: theme,
    toggleTheme: toggleThemeHandler,
  };
  useEffect(() => {
    // Update the data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);
    
    // Also synchronize with layout.tsx setting by ensuring cookie is set
    if (typeof document !== 'undefined') {
      document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year expiration
    }
  }, [theme]);

  // 3. Use the provider in your layout
  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
};
