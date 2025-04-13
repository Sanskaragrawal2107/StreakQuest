import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Import pages
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Achievements from './pages/Achievements';
import Stats from './pages/Stats';
import Settings from './pages/Settings';
import LandingPage from './pages/LandingPage';

// Import components
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';

// Import ThemeProvider
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

const AppContent: React.FC = () => {
  const { darkMode } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // For demo purposes, we'll consider the user logged in if they're on an app route
  const isAppRoute = window.location.pathname !== '/landing';
  
  return (
    <Router>
      <Routes>
        <Route path="/landing" element={<LandingPage />} />
        <Route path="*" element={
          <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            <Sidebar />
            <div className={`flex-1 transition-colors duration-300 ${
              darkMode 
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 text-gray-900'
            }`}>
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8">
                <MobileNav />
                <AnimatePresence mode="wait">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/achievements" element={<Achievements />} />
                    <Route path="/stats" element={<Stats />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
