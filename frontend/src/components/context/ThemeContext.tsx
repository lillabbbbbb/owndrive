// ThemeContext.tsx
import React, { createContext, useState, useContext, useEffect } from "react";

interface ThemeContextType {
  lightMode: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  lightMode: true,
  toggle: () => { },
});

//this is the hook that will be called by all the other components
export const useTheme = () => useContext(ThemeContext);

//The app is wrapped in this ThemeProvider so that all components have access to this global state
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lightMode, setMode] = useState(localStorage.getItem("lightMode") === "true");

  //change the current mode to the opporite
  const toggle = () => {
    setMode((prev) => !prev)
  };

  //change the localStorage value for lighMode upon its state change
  useEffect(() => {
    localStorage.setItem("lightMode", String(lightMode))
  }, [lightMode])


  //apply correct language and mode upon first render
  useEffect(() => {
    setMode(localStorage.getItem("lightMode") === "true")
  }, [])

  return <ThemeContext.Provider value={{ lightMode, toggle }}>{children}</ThemeContext.Provider>;
};
