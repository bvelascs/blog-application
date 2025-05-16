"use client";

import { Button } from "@repo/ui/button";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

const ThemeSwitch = () => {
  const themeCtx = useContext(ThemeContext);
  const theme = themeCtx?.theme; // <- TODO: Get the theme from the context

  return (
    <Button
      className="border-1 cursor-pointer rounded-md border-gray-400 px-3 py-2"
      onClick={themeCtx?.toggleTheme}
    >
      {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </Button>
  );
};

export default ThemeSwitch;
