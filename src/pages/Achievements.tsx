import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTrophy, FaFireAlt, FaMedal, FaStar, 
  FaCalendarAlt, FaCheckDouble, FaSearch 
} from 'react-icons/fa';
import Badge from '../components/ui/Badge';
import { Achievement, getAchievements, initializeDefaultAchievements } from '../utils/localStorage';
import { useTheme } from '../contexts/ThemeContext';

const Achievements: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { darkMode } = useTheme();

  // Load achievements from localStorage
  useEffect(() => {
    let storedAchievements = getAchievements();
    
    if (storedAchievements.length === 0) {
      storedAchievements = initializeDefaultAchievements();
    }
    
    setAchievements(storedAchievements);
  }, []);

  // Get achievement icon
  const getAchievementIcon = (achievement: Achievement) => {
    switch (achievement.category) {
      case 'beginner':
        return <FaTrophy />;
      case 'streak':
        return <FaFireAlt />;
      case 'quantity':
        return <FaMedal />;
      case 'completion':
        return <FaCheckDouble />;
      default:
        return <FaStar />;
    }
  };

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    // Apply category filter
    if (filter !== 'all' && achievement.category !== filter) return false;
    
    // Apply search filter
    if (searchQuery && !achievement.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !achievement.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  // Count unlocked achievements
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
            Achievements
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}>
            Track your progress and earn badges
          </p>
        </motion.div>
      </div>
      
      {/* Achievement Progress */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`card mb-6 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
      >
        <h3 className={`font-semibold mb-3 ${darkMode ? 'text-gray-200' : 'text-neutral-700'}`}>
          Achievement Progress
        </h3>
        <div className="flex items-center mb-2">
          <div className="flex-1">
            <span className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-primary-600'}`}>
              {unlockedCount}/{totalCount}
            </span>
            <span className={`text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
              achievements unlocked
            </span>
          </div>
          <div className={`text-lg font-bold ${darkMode ? 'text-indigo-400' : 'text-primary-600'}`}>
            {completionPercentage}%
          </div>
        </div>
        <div className={`h-2 w-full rounded-full overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-neutral-100'}`}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
          />
        </div>
      </motion.div>
      
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-primary-500 text-white' 
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('beginner')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filter === 'beginner' 
                ? 'bg-primary-500 text-white' 
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <FaTrophy className="mr-1.5" />
            Beginner
          </button>
          <button 
            onClick={() => setFilter('streak')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filter === 'streak' 
                ? 'bg-primary-500 text-white' 
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <FaFireAlt className="mr-1.5" />
            Streaks
          </button>
          <button 
            onClick={() => setFilter('quantity')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filter === 'quantity' 
                ? 'bg-primary-500 text-white' 
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <FaMedal className="mr-1.5" />
            Quantity
          </button>
          <button 
            onClick={() => setFilter('completion')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center ${
              filter === 'completion' 
                ? 'bg-primary-500 text-white' 
                : darkMode
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
            }`}
          >
            <FaCheckDouble className="mr-1.5" />
            Completion
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className={darkMode ? 'text-gray-500' : 'text-neutral-400'} />
          </div>
          <input
            type="text"
            placeholder="Search achievements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`input pl-10 w-full max-w-md ${
              darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''
            }`}
          />
        </div>
      </div>
      
      {/* Achievements Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        <AnimatePresence>
          {filteredAchievements.map((achievement) => (
            <motion.div 
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Badge
                name={achievement.name}
                icon={getAchievementIcon(achievement)}
                description={achievement.unlocked ? achievement.description : "???"}
                unlocked={achievement.unlocked}
                color={achievement.color}
                onClick={() => setSelectedAchievement(achievement)}
                className={`cursor-pointer ${darkMode ? 'dark-badge' : ''}`}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {/* Empty State */}
      {filteredAchievements.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`card text-center py-10 ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4 ${
            darkMode ? 'bg-gray-700' : 'bg-neutral-100'
          }`}>
            <FaTrophy size={24} className={darkMode ? 'text-gray-500' : ''} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-neutral-700'}`}>
            No achievements found
          </h3>
          <p className={darkMode ? 'text-gray-400' : 'text-neutral-500'}>
            {searchQuery 
              ? `No achievements match your search "${searchQuery}"`
              : `No achievements in the ${filter} category yet`}
          </p>
        </motion.div>
      )}
      
      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`rounded-xl shadow-lg w-full max-w-md ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex flex-col items-center mb-4">
                  <div 
                    className={`
                      w-24 h-24 rounded-full flex items-center justify-center text-3xl mb-4
                      ${selectedAchievement.unlocked 
                        ? `bg-gradient-to-br from-${selectedAchievement.color}-400 to-${selectedAchievement.color}-600 text-white` 
                        : darkMode ? 'bg-gray-700 text-gray-500' : 'bg-neutral-200 text-neutral-400'}
                    `}
                  >
                    {getAchievementIcon(selectedAchievement)}
                  </div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-gray-100' : 'text-neutral-800'}`}>
                    {selectedAchievement.name}
                  </h2>
                  <p className={`text-center mt-2 ${darkMode ? 'text-gray-300' : 'text-neutral-600'}`}>
                    {selectedAchievement.description}
                  </p>
                </div>
                
                {selectedAchievement.unlocked && selectedAchievement.unlockedAt && (
                  <div className={`text-center text-sm mb-4 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
                    <FaCalendarAlt className="inline mr-1" />
                    Unlocked on {new Date(selectedAchievement.unlockedAt).toLocaleDateString()}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <button 
                    onClick={() => setSelectedAchievement(null)}
                    className={`btn btn-outline ${
                      darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : ''
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements; 