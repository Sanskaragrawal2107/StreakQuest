import React from 'react';
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

// Import ThemeProvider and TutorialProvider
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { TutorialProvider } from './contexts/TutorialContext';

// Handle signup - store flag and redirect to dashboard
const SignupHandler: React.FC = () => {
  React.useEffect(() => {
    localStorage.setItem('streakquest_demo_login', 'true');
    localStorage.setItem('demo_status', 'working');
    localStorage.setItem('streakquest_signup_flow', 'true');
    
    // This will run once on component mount
    window.location.replace(process.env.PUBLIC_URL ? `${process.env.PUBLIC_URL}/app/dashboard` : '/app/dashboard');
  }, []);
  
  return <div className="flex items-center justify-center h-screen">Redirecting to your dashboard...</div>;
};

const AppContent: React.FC = () => {
  const { darkMode } = useTheme();
  
  // Get the base URL from environment if available (for production builds)
  const basename = process.env.PUBLIC_URL || '';
  
  return (
    <Router basename={basename}>
      <Routes>
        {/* Landing Page at the root */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Signup route that redirects to the dashboard */}
        <Route path="/signup" element={<SignupHandler />} />
        
        {/* Main application routes nested under /app */}
        <Route path="/app/*" element={ 
          <div className={`flex min-h-screen ${darkMode ? 'dark' : ''}`}>
            <Sidebar />
            <div className={`flex-1 transition-colors duration-300 ${ 
              darkMode 
                ? 'bg-gray-900 text-gray-100' 
                : 'bg-gradient-to-br from-[#FFF8F4] via-[#FFF0E8] to-[#FFF5ED] text-gray-900'
            }`}>
              <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 md:px-8">
                <MobileNav />
                <AnimatePresence mode="wait">
                  {/* Nested routes specific to the /app path */}
                  <Routes>
                    {/* Redirect base /app to /app/dashboard */}
                    <Route path="/" element={<Navigate to="/app/dashboard" replace />} /> 
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="achievements" element={<Achievements />} />
                    <Route path="stats" element={<Stats />} />
                    <Route path="settings" element={<Settings />} />
                    {/* Catch-all within /app redirects to dashboard */}
                    <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
                  </Routes>
                </AnimatePresence>
              </div>
            </div>
          </div>
        } />

        {/* General catch-all to redirect unknown paths to landing */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TutorialProvider>
        <AppContent />
      </TutorialProvider>
    </ThemeProvider>
  );
};

export default App;
