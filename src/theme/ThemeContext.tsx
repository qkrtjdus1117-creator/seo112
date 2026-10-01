import React, { createContext, useContext, useEffect, useState } from 'react';
import { THEMES, ThemeConfig, ThemeKey } from './theme';

interface ThemeContextType {
  themeKey: ThemeKey;
  theme: ThemeConfig;
  setThemeKey: (key: ThemeKey) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  themeKey: 'navy',
  theme: THEMES.navy,
  setThemeKey: () => {}
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [themeKey, setThemeKeyState] = useState<ThemeKey>(() => {
    try {
      const saved = localStorage.getItem('edu_survey_theme') as ThemeKey;
      if (saved && THEMES[saved]) return saved;
    } catch {
      // ignore
    }
    return 'navy'; // Default to authoritative Government Deep Navy
  });

  const setThemeKey = (key: ThemeKey) => {
    setThemeKeyState(key);
    try {
      localStorage.setItem('edu_survey_theme', key);
    } catch {
      // ignore
    }
  };

  const theme = THEMES[themeKey] || THEMES.navy;

  return (
    <ThemeContext.Provider value={{ themeKey, theme, setThemeKey }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
