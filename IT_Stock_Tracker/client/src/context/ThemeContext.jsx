import { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('theme-mode') || 'dark');
  const [palette, setPalette] = useState(() => localStorage.getItem('theme-palette') || 'indigo');

  useEffect(() => {
    const root = document.documentElement;
    
    // Handle Mode (Light/Dark)
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme-mode', mode);

    // Handle Palette
    // Remove existing palette classes
    root.classList.forEach(className => {
      if (className.startsWith('theme-')) {
        root.classList.remove(className);
      }
    });
    // Add new palette class
    root.classList.add(`theme-${palette}`);
    localStorage.setItem('theme-palette', palette);
    
  }, [mode, palette]);

  const toggleMode = () => setMode(prev => prev === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ mode, setMode, toggleMode, palette, setPalette }}>
      {children}
    </ThemeContext.Provider>
  );
};
