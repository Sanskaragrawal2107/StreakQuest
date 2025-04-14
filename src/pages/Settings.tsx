import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBell, FaPalette, FaDatabase, FaQuestionCircle, FaCheckCircle } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';
import { 
  getNotificationPermissionStatus, 
  requestNotificationPermission, 
  showSimpleNotification 
} from '../utils/notifications';
import { useTheme } from '../contexts/ThemeContext';

const Settings: React.FC = () => {
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [notificationTime, setNotificationTime] = useState('08:00');
  const { darkMode } = useTheme();

  useEffect(() => {
    getNotificationPermissionStatus().then(status => {
      console.log("Initial Notification Permission:", status);
      setNotificationPermission(status);
    });
  }, []);

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear();
      toast.success('All data has been cleared. Refresh the page to start fresh.');
      window.location.reload();
    }
  };

  const handleExportData = () => {
    try {
      const data = {
        habits: localStorage.getItem('streakquest_habits') || '[]',
        achievements: localStorage.getItem('streakquest_achievements') || '[]',
        stats: localStorage.getItem('streakquest_user_stats') || '{}',
        theme: localStorage.getItem('streakquest-dark-mode') || 'false',
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `streakquest_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Failed to export data');
    }
  };

  const handleNotificationRequest = async () => {
    const currentPermission = await getNotificationPermissionStatus();
    if (currentPermission === 'granted') {
      toast.success('Notification permission already granted!');
      showSimpleNotification("Test Notification", { body: "Notifications are working!" });
      return;
    }
    if (currentPermission === 'denied') {
      toast.error('Notification permission was denied. Please enable it in browser settings.');
      return;
    }
    
    const permissionResult = await requestNotificationPermission();
    setNotificationPermission(permissionResult);

    if (permissionResult === 'granted') {
      toast.success('Notification permission granted!');
      showSimpleNotification("Notifications Enabled!", { body: "You can now receive reminders (feature coming soon)." });
    } else if (permissionResult === 'denied') {
      toast.error('Notification permission denied.');
    } else {
      toast('Notification permission request dismissed.');
    }
  };

  return (
    <div>
      <Toaster position="top-right" />
      
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>Settings</h1>
          <p className={`${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>Customize your StreakQuest experience</p>
        </motion.div>
      </div>
      
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-indigo-900/30' : 'bg-primary-50'} flex items-center justify-center mr-3`}>
              <FaBell className={`${darkMode ? 'text-indigo-400' : 'text-primary-500'}`} />
            </div>
            <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
                Notification Permission
              </label>
              <div className={`flex items-center justify-between p-3 rounded-lg border bg-opacity-50 
                ${notificationPermission === 'granted' ? 'bg-green-100 border-green-300 dark:bg-green-900/30 dark:border-green-700' : 
                  notificationPermission === 'denied' ? 'bg-red-100 border-red-300 dark:bg-red-900/30 dark:border-red-700' : 
                  'bg-gray-100 border-gray-300 dark:bg-gray-700 dark:border-gray-600'}
              `}>
                <span className={`text-sm font-medium 
                  ${notificationPermission === 'granted' ? 'text-green-700 dark:text-green-300' : 
                    notificationPermission === 'denied' ? 'text-red-700 dark:text-red-300' : 
                    darkMode ? 'text-gray-300' : 'text-neutral-700'}
                `}>
                  Status: {notificationPermission.charAt(0).toUpperCase() + notificationPermission.slice(1)}
                </span>
                <div className="flex space-x-2">
                  {notificationPermission !== 'granted' && (
                    <button
                      onClick={handleNotificationRequest}
                      className="btn btn-sm btn-primary"
                      type="button"
                    >
                      {notificationPermission === 'denied' ? 'Enable in Settings' : 'Request Permission'}
                    </button>
                  )}
                  {notificationPermission === 'granted' && (
                     <button
                      onClick={() => showSimpleNotification("Test Notification", { body: "Notifications are working!" })}
                      className="btn btn-sm btn-secondary"
                      type="button"
                    >
                      Send Test
                    </button>
                  )}
                </div>
              </div>
               {notificationPermission === 'denied' && (
                 <p className="text-xs mt-1 text-red-600 dark:text-red-400">You need to manually enable notification permissions for this site in your browser settings.</p>
               )}
               {notificationPermission === 'default' && (
                 <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>Allow notifications to get reminders (feature coming soon).</p>
               )}
            </div>

            <div>
              <label htmlFor="notificationTime" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
                Default Reminder Time <span className="text-xs italic opacity-70">(Future Feature)</span>
              </label>
              <input
                type="time"
                id="notificationTime"
                value={notificationTime}
                onChange={(e) => setNotificationTime(e.target.value)}
                className={`input w-full max-w-xs ${darkMode ? 'bg-gray-700 border-gray-600' : ''}`}
                disabled
              />
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
                Set a default time for habit reminders (actual reminders require app to be open or background features).
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
           <div className="flex items-center mb-4">
             <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-purple-900/30' : 'bg-secondary-50'} flex items-center justify-center mr-3`}>
               <FaPalette className={`${darkMode ? 'text-purple-400' : 'text-secondary-500'}`} />
             </div>
             <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>Appearance</h2>
           </div>
           
           <div>
             <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
               Mode
             </label>
             <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-neutral-600'}`}>
                Dark/Light mode is toggled using the ☀️/🌙 icon in the header.
             </p>
           </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
          <div className="flex items-center mb-4">
             <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-teal-900/30' : 'bg-accent-50'} flex items-center justify-center mr-3`}>
               <FaDatabase className={`${darkMode ? 'text-teal-400' : 'text-accent-500'}`} />
             </div>
             <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>Data Management</h2>
           </div>
           
           <div className="space-y-4">
             <div>
               <button 
                 onClick={handleExportData}
                 className={`btn btn-outline w-full ${darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''}`}
               >
                 Export Data
               </button>
               <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
                 Download a backup of all your habit data and achievements
               </p>
             </div>
             
             <div>
               <button 
                 onClick={handleClearData}
                 className="btn w-full bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
               >
                 Clear All Data
               </button>
               <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
                 Reset all habits, achievements, and statistics (cannot be undone)
               </p>
             </div>
           </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`card ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
        >
           <div className="flex items-center mb-4">
             <div className={`w-10 h-10 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-neutral-100'} flex items-center justify-center mr-3`}>
               <FaQuestionCircle className={`${darkMode ? 'text-gray-400' : 'text-neutral-500'}`} />
             </div>
             <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>About</h2>
           </div>
           
           <div>
             <p className={`${darkMode ? 'text-gray-300' : 'text-neutral-600'} mb-2`}>
               StreakQuest version 1.0.0
             </p>
             <p className={`${darkMode ? 'text-gray-400' : 'text-neutral-500'} text-sm`}>
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