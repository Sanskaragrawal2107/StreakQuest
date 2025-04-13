import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaCalendarAlt, FaTrophy, FaChartBar, FaCog, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const navItems = [
    { path: '/app/dashboard', icon: <FaHome size={20} />, label: 'Dashboard' },
    { path: '/app/calendar', icon: <FaCalendarAlt size={20} />, label: 'Calendar' },
    { path: '/app/achievements', icon: <FaTrophy size={20} />, label: 'Achievements' },
    { path: '/app/stats', icon: <FaChartBar size={20} />, label: 'Statistics' },
    { path: '/app/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  return (
    <div className={`hidden md:flex flex-col w-64 transition-colors duration-300 ${
      darkMode 
        ? 'bg-gray-800 border-r border-gray-700 shadow-lg shadow-gray-900/20' 
        : 'bg-white border-r border-neutral-100 shadow-soft'
    }`}>
      <div className="p-5">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-primary-400 to-primary-600 w-8 h-8 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold">SQ</span>
            </div>
            <h1 className={`text-xl font-bold ${
              darkMode
                ? 'from-indigo-400 to-emerald-400'
                : 'from-primary-500 via-accent-500 to-secondary-500'
            } bg-gradient-to-r bg-clip-text text-transparent`}>
              StreakQuest
            </h1>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`p-2 rounded-full transition-colors ${
              darkMode 
                ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' 
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
          </motion.button>
        </motion.div>
      </div>

      <nav className="mt-5 flex-1">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link 
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? darkMode 
                          ? 'bg-gray-700 text-indigo-400' 
                          : 'bg-primary-50 text-primary-600' 
                      : darkMode
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                    {item.label}
                  </span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`w-1 h-6 absolute right-0 rounded-l-full ${
                        darkMode ? 'bg-indigo-400' : 'bg-primary-500'
                      }`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className={`p-5 border-t transition-colors ${darkMode ? 'border-gray-700' : 'border-neutral-100'}`}>
        <div className={`card ${
          darkMode
            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-none'
            : 'bg-gradient-to-br from-primary-50 to-neutral-50 border-none'
        }`}>
          <h3 className={`font-semibold ${
            darkMode ? 'text-gray-200' : 'text-neutral-700'
          }`}>Current Streak</h3>
          <div className="mt-2 flex items-baseline">
            <span className={`text-3xl font-bold ${
              darkMode ? 'text-indigo-400' : 'text-primary-600'
            }`}>12</span>
            <span className={`ml-1 text-sm ${
              darkMode ? 'text-gray-400' : 'text-neutral-500'
            }`}>days</span>
          </div>
          <div className={`h-2 w-full rounded-full mt-2 overflow-hidden ${
            darkMode ? 'bg-gray-600' : 'bg-neutral-100'
          }`}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '60%' }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
            />
          </div>
          <p className={`text-xs mt-2 ${
            darkMode ? 'text-gray-400' : 'text-neutral-500'
          }`}>8 days until next badge</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 