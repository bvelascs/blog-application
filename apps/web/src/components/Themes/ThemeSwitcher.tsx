"use client";

import { Button } from "@repo/ui/button";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeSwitch = () => {
  const themeCtx = useContext(ThemeContext);
  const [currentTheme, setCurrentTheme] = useState<string>("light");
  
  // Update current theme from context, ensuring it always stays in sync
  useEffect(() => {
    if (themeCtx?.theme) {
      setCurrentTheme(themeCtx.theme);
    } else {
      // Fallback to HTML attribute if context isn't available yet
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (htmlTheme === 'dark' || htmlTheme === 'light') {
        setCurrentTheme(htmlTheme);
      }
    }
  }, [themeCtx?.theme]);

  return (
    <Button
      className="border-1 cursor-pointer rounded-md border-gray-400 px-3 py-2"
      onClick={themeCtx?.toggleTheme}
    >
      {currentTheme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
