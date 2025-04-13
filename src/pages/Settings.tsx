import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaPalette, FaDatabase, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

const Settings: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationTime, setNotificationTime] = useState('08:00');
  const [theme, setTheme] = useState('blue');

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data has been cleared. Refresh the page to start fresh.');
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        habits: localStorage.getItem('streakquest_habits'),
        achievements: localStorage.getItem('streakquest_achievements'),
        stats: localStorage.getItem('streakquest_user_stats'),
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `streakquest_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-neutral-800">Settings</h1>
          <p className="text-neutral-500">Customize your StreakQuest experience</p>
        </motion.div>
      </div>
      
      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Notifications */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-3">
              <FaBell className="text-primary-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label htmlFor="notificationsToggle" className="text-neutral-700">
                Enable notifications
              </label>
              <button
                id="notificationsToggle"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-primary-500' : 'bg-neutral-300'
                }`}
              >
                <span 
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${
                    notificationsEnabled ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
            
            <div>
              <label htmlFor="notificationTime" className="block text-sm font-medium text-neutral-700 mb-1">
                Default reminder time
              </label>
              <input
                type="time"
                id="notificationTime"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className="input w-full max-w-xs"
                disabled={!notificationsEnabled}
              />
              <p className="text-xs text-neutral-500 mt-1">
                This is the default time for new habit reminders
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* Theme */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-secondary-50 flex items-center justify-center mr-3">
              <FaPalette className="text-secondary-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">Appearance</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Theme Colors
            </label>
            <div className="flex space-x-3">
              <button
                onClick={() => setTheme('blue')}
                className={`w-10 h-10 rounded-full bg-primary-500 transition-all flex items-center justify-center ${
                  theme === 'blue' ? 'ring-2 ring-offset-2 ring-neutral-300' : ''
                }`}
              >
                {theme === 'blue' && <FaCheckCircle className="text-white" />}
              </button>
              <button
                onClick={() => setTheme('green')}
                className={`w-10 h-10 rounded-full bg-green-500 transition-all flex items-center justify-center ${
                  theme === 'green' ? 'ring-2 ring-offset-2 ring-neutral-300' : ''
                }`}
              >
                {theme === 'green' && <FaCheckCircle className="text-white" />}
              </button>
              <button
                onClick={() => setTheme('purple')}
                className={`w-10 h-10 rounded-full bg-purple-500 transition-all flex items-center justify-center ${
                  theme === 'purple' ? 'ring-2 ring-offset-2 ring-neutral-300' : ''
                }`}
              >
                {theme === 'purple' && <FaCheckCircle className="text-white" />}
              </button>
              <button
                onClick={() => setTheme('orange')}
                className={`w-10 h-10 rounded-full bg-orange-500 transition-all flex items-center justify-center ${
                  theme === 'orange' ? 'ring-2 ring-offset-2 ring-neutral-300' : ''
                }`}
              >
                {theme === 'orange' && <FaCheckCircle className="text-white" />}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2">
              (Note: Theme customization is a preview feature)
            </p>
          </div>
        </motion.div>
        
        {/* Data Management */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-accent-50 flex items-center justify-center mr-3">
              <FaDatabase className="text-accent-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">Data Management</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <button 
                onClick={handleExportData}
                className="btn btn-outline w-full"
              >
                Export Data
              </button>
              <p className="text-xs text-neutral-500 mt-1">
                Download a backup of all your habit data and achievements
              </p>
            </div>
            
            <div>
              <button 
                onClick={handleClearData}
                className="btn w-full bg-red-500 text-white hover:bg-red-600 active:bg-red-700"
              >
                Clear All Data
              </button>
              <p className="text-xs text-neutral-500 mt-1">
                Reset all habits, achievements, and statistics (cannot be undone)
              </p>
            </div>
          </div>
        </motion.div>
        
        {/* About */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center mr-3">
              <FaQuestionCircle className="text-neutral-500" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">About</h2>
          </div>
          
          <div>
            <p className="text-neutral-600 mb-2">
              StreakQuest version 1.0.0
            </p>
            <p className="text-neutral-500 text-sm">
              A beautiful habit tracker to help you build consistency and achieve your goals.
              Data is stored locally in your browser.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings; 