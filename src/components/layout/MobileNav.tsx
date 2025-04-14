import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHome, FaCalendarAlt, FaTrophy, FaChartBar, FaCog, FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';

const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { darkMode, toggleDarkMode } = useTheme();
  
  const navItems = [
    { path: '/app/dashboard', icon: <FaHome size={20} />, label: 'Dashboard' },
    { path: '/app/calendar', icon: <FaCalendarAlt size={20} />, label: 'Calendar' },
    { path: '/app/achievements', icon: <FaTrophy size={20} />, label: 'Achievements' },
    { path: '/app/stats', icon: <FaChartBar size={20} />, label: 'Statistics' },
    { path: '/app/settings', icon: <FaCog size={20} />, label: 'Settings' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between py-4">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center"
        >
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
        </motion.div>
        
        <div className="flex items-center space-x-2">
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
          
          <button 
            onClick={toggleMenu} 
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode 
                ? 'text-gray-300 hover:bg-gray-700' 
                : 'text-neutral-600 hover:bg-neutral-100'
            }`}
          >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <nav className={`rounded-xl shadow-card border mt-2 overflow-hidden transition-colors ${
              darkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-neutral-100'
            }`}>
              <ul>
                {navItems.map((item, index) => {
                  const isActive = location.pathname.startsWith(item.path);
                  
                  return (
                    <motion.li 
                      key={item.path}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link 
                        to={item.path}
                        className={`flex items-center px-4 py-3 transition-all duration-200 ${
                          isActive 
                            ? darkMode 
                                ? 'bg-gray-700 text-indigo-400' 
                                : 'bg-primary-50 text-primary-600' 
                            : darkMode 
                                ? 'text-gray-300 hover:bg-gray-700' 
                                : 'text-neutral-600 hover:bg-neutral-50'
                        } ${index !== 0 ? `border-t ${darkMode ? 'border-gray-700' : 'border-neutral-100'}` : ''}`}
                        onClick={toggleMenu}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className={`font-medium ${isActive ? 'font-semibold' : ''}`}>
                          {item.label}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MobileNav; 