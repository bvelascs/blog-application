"use client";

import { createContext, useEffect, useState } from "react";

export type Theme = "light" | "dark";

export interface ThemeContextProps {
  theme: Theme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// TODOS:
// 1. Create Theme Provider
export const ThemeContextProvider: React.FC<React.PropsWithChildren> = (
  props,
) => {  // 2. Create useTheme hook
  const [theme, setTheme] = useState<Theme>("light");
    // Initialize theme from cookie or system preference when component mounts
  useEffect(() => {
    // First try to get theme from cookie
    const cookieTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] as Theme | undefined;
      
    if (cookieTheme === 'dark' || cookieTheme === 'light') {
      setTheme(cookieTheme);
    } else if (typeof window !== 'undefined') {
      // If no cookie, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);function toggleThemeHandler() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    // Set cookie so the theme persists between page loads and server-side rendering
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000; SameSite=Strict`; // 1 year expiration
  }

  const context = {
    theme: theme as Theme,
    toggleTheme: toggleThemeHandler,
  };  useEffect(() => {
    // Update data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);
    
    // Also synchronize with cookie for persistence
    document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Strict`; // 1 year expiration
    
    // Add/remove class on the html element for better CSS targeting
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // 3. Use the provider in your layout
  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
};
