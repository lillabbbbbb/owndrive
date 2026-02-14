// ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";
import { THEME } from "../../theme"

interface ThemeContextType {
  lightMode: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  lightMode: true,
  toggle: () => { },
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lightMode, setMode] = useState(true);

  const toggle = () => {
    setMode((prev) => !prev)
  };

  useEffect(() => {
    localStorage.setItem("lightMode", String(lightMode))

    const root = document.documentElement; // <html>
    if (lightMode) {
      root.classList.remove("dark"); // optional if you have Tailwind dark mode
      root.classList.add("bg-white"); // or THEME.background.page(lightMode)
    } else {
      root.classList.remove("bg-white");
      root.classList.add("bg-gray-900"); // dark page bg
    }
    const html = document.documentElement; // <html> element
    html.className = THEME.background.page(lightMode); // apply Tailwind classes
  }, [lightMode])


  //apply correct language and mode upon first render
  useEffect(() => {
    setMode(localStorage.getItem("lightMode") === "true")
  }, [])

  return <ThemeContext.Provider value={{ lightMode, toggle }}>{children}</ThemeContext.Provider>;
};
