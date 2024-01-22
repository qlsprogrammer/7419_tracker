import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import {
  ThemeProvider as MuiThemeProvider,
  createTheme,
} from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useMediaQuery } from "@material-ui/core";

const defaultTheme = {
  theme: "light",
  toggleTheme: () => void 0,
};

const ThemeContext = createContext<{ theme: string; toggleTheme: () => void }>(
  defaultTheme
);

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const lightTheme = createTheme({
  palette: {
    mode: "light",
  },
});

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(defaultTheme.theme)
    
  useEffect(() => {
    const item = window.localStorage.getItem("theme") || "dark";
    if (item === "dark" || item === "light") {
      setTheme(item)
    }
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <MuiThemeProvider theme={theme === "dark" ? darkTheme : lightTheme}>
        <CssBaseline />

        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
