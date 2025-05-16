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
) => {
  // 2. Create useTheme hook
  const [theme, setTheme] = useState("light");
  function toggleThemeHandler() {
    setTheme(theme == "light" ? "dark" : "light");
  }

  const context = {
    theme: theme as Theme,
    toggleTheme: toggleThemeHandler,
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // 3. Use the provider in your layout
  return (
    <ThemeContext.Provider value={context}>
      {props.children}
    </ThemeContext.Provider>
  );
};
