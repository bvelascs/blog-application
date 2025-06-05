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
  
  // Initialize theme from cookie when component mounts
  useEffect(() => {
    const cookieTheme = document.cookie
      .split('; ')
      .find(row => row.startsWith('theme='))
      ?.split('=')[1] as Theme | undefined;
      
    if (cookieTheme) {
      setTheme(cookieTheme);
    }
  }, []);function toggleThemeHandler() {
    const newTheme = theme == "light" ? "dark" : "light";
    setTheme(newTheme);
    // Set cookie so the theme persists between page loads and server-side rendering
    document.cookie = `theme=${newTheme}; path=/; max-age=31536000`; // 1 year expiration
  }

  const context = {
    theme: theme as Theme,
    toggleTheme: toggleThemeHandler,
  };
  useEffect(() => {
    // Update data-theme attribute
    document.documentElement.setAttribute("data-theme", theme);
    
    // Also synchronize with cookie for persistence
    document.cookie = `theme=${theme}; path=/; max-age=31536000`; // 1 year expiration
  }, [theme]);

  // 3. Use the provider in your layout
  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
};
