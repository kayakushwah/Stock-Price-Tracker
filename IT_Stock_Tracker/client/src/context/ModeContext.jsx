import { createContext, useState, useEffect } from 'react';

export const ModeContext = createContext();

export const ModeProvider = ({ children }) => {
  const [isBeginnerMode, setIsBeginnerMode] = useState(() => {
    const stored = localStorage.getItem('app-mode');
    return stored !== 'pro'; // default = beginner
  });

  const toggleMode = () => {
    const newMode = !isBeginnerMode;
    setIsBeginnerMode(newMode);
    localStorage.setItem('app-mode', newMode ? 'beginner' : 'pro');
  };

  return (
    <ModeContext.Provider value={{ isBeginnerMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
};
