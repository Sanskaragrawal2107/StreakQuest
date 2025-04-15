import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Function to get initial dark mode state synchronously
const getInitialDarkMode = (): boolean => {
  // Check if running in a browser environment
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return false; // Default to light mode for SSR or if localStorage is unavailable
  }
  
  const savedPreference = localStorage.getItem('streakquest-dark-mode');
  if (savedPreference) {
    return savedPreference === 'true';
  }
  // Default to light mode if no preference is saved
  return false; 
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize state using the synchronous function
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode());

  // Apply dark mode class to html element when darkMode state changes
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [darkMode]);

  // Toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      localStorage.setItem('streakquest-dark-mode', newMode.toString());
      return newMode;
    });
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 