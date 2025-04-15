import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheckCircle, FaCalendarAlt, FaQuestionCircle } from 'react-icons/fa';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import ProgressRing from '../components/ui/ProgressRing';
import { useHabits } from '../hooks/useHabits';
import { getUserStats, UserStats } from '../utils/localStorage';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';
import { useTutorial } from '../contexts/TutorialContext';
import Tutorial from '../components/tutorial/Tutorial';

const Dashboard: React.FC = () => {
  const {
    habits,
    loading,
    showHabitForm,
    editingHabit,
    markHabitComplete,
    openCreateHabitForm,
    openEditHabitForm,
    removeHabit,
    closeHabitForm,
    handleHabitFormSubmit,
  } = useHabits();
  const { darkMode } = useTheme();
  const { 
    openTutorial,
  } = useTutorial();

  const [activeFilter, setActiveFilter] = useState<'all' | 'today'>('today');
  const [stats, setStats] = useState<UserStats>(getUserStats());

  useEffect(() => {
    console.log("[Dashboard] Habits changed, updating stats...");
    setStats(getUserStats());
  }, [habits]);

  // Filter habits based on activeFilter
  const filteredHabits = habits.filter(habit => {
    if (activeFilter === 'all') return true;
    
    // For 'today' filter, check if the habit should be done today
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    return habit.frequency.includes(today);
  });

  // Group habits by completion status
  const completedHabits = filteredHabits.filter(habit => 
    habit.progress >= habit.goal
  );
  
  const pendingHabits = filteredHabits.filter(habit => 
    habit.progress < habit.goal
  );

  // Calculate completion rate for today
  const completionRate = filteredHabits.length > 0 
    ? Math.round((completedHabits.length / filteredHabits.length) * 100) 
    : 0;

  // Define default values for new props
  const defaultCompletionHistory: Record<string, number> = {};
  const defaultFrequency = ['monday', 'wednesday', 'friday']; // Default frequency if missing

  // --- Badge Logic (Example) ---
  // This is a placeholder. You'd replace this with actual badge logic based on stats or achievements.
  const nextBadgeThreshold = 10; // Example: next badge at 10 day streak
  const daysUntilNextBadge = Math.max(0, nextBadgeThreshold - stats.currentStreak);

  return (
    <div>
      <Toaster position="top-right" />
      <Tutorial />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>Dashboard</h1>
          <p className={darkMode ? 'text-gray-400' : 'text-[#FF9D76]'}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center"
        >
          <button 
            onClick={openTutorial} 
            className={`mr-2 p-2 rounded-full ${darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-[#FF9D76] hover:bg-[#FFF0E8]'} transition-colors`}
            aria-label="Show tutorial"
            title="Show tutorial"
          >
            <FaQuestionCircle />
          </button>
          <button 
            onClick={openCreateHabitForm}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium flex items-center mt-4 md:mt-0 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-[#FF9D76] hover:bg-[#FF8A5B] text-white'}`}
          >
            <FaPlus className="mr-2" />
            <span>New Habit</span>
          </button>
        </motion.div>
      </div>
      
      {/* Stats Overview */}
      {habits.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg text-sm space-y-1 ${darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-[#FFF0E8] text-[#FF8A5B]'}`}
        >
          <p>📊 Statistics like progress, streak, and weekly rate will appear here once you add and start completing habits.</p>
          <p>❓ Click the <FaQuestionCircle className="inline -mt-0.5 mx-0.5" /> icon in the header to see the tutorial again.</p>
          <p>☀️/🌙 Click the sun/moon icon in the header to switch between light and dark themes.</p>
        </motion.div>
      )}
      {habits.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
        >
          {/* Today's Progress */}
          <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 flex items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#FFDBCB]/30 shadow-[0_4px_12px_rgba(255,157,118,0.08)]'}`}>
            <ProgressRing 
              progress={completionRate} 
              size={70} 
              strokeWidth={7}
              className="mr-4"
              color={darkMode ? '#818cf8' : '#FF9D76'}
              bgColor={darkMode ? '#374151' : '#FFF0E8'}
            />
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>Today's Progress</h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`}>
                {completedHabits.length}/{filteredHabits.length}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>tasks completed</p>
            </div>
          </div>
          
          {/* Current Streak */}
          <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 flex items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#FFDBCB]/30 shadow-[0_4px_12px_rgba(255,157,118,0.08)]'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-[#FFF0E8] text-[#FF9D76]'}`}>
              <FaCheckCircle className="text-2xl" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>Current Streak</h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`}>{stats.currentStreak} days</p>
              {daysUntilNextBadge > 0 && (
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{daysUntilNextBadge} days until next badge!</p>
              )}
              {daysUntilNextBadge === 0 && stats.currentStreak > 0 && (
                 <p className="text-xs text-green-500">Badge threshold reached!</p>
              )}
            </div>
          </div>
          
          {/* Weekly Completion */}
          <div className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 flex items-center ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#FFDBCB]/30 shadow-[0_4px_12px_rgba(255,157,118,0.08)]'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 ${darkMode ? 'bg-indigo-900/50 text-indigo-300' : 'bg-[#FFF0E8] text-[#FF9D76]'}`}>
              <FaCalendarAlt className="text-2xl" />
            </div>
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>Weekly Rate</h3>
              <p className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`}>{Math.round(stats.weeklyCompletionRate)}%</p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>completion rate</p>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Filter Tabs */}
      <div className={`flex mb-4 border-b ${darkMode ? 'border-gray-700' : 'border-[#FFDBCB]/30'}`}>
        <button 
          onClick={() => setActiveFilter('today')}
          className={`px-4 py-2 font-medium ${
            activeFilter === 'today' 
              ? darkMode
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-[#FF9D76] border-b-2 border-[#FF9D76]'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          Today
        </button>
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 font-medium ${
            activeFilter === 'all' 
              ? darkMode
                ? 'text-indigo-400 border-b-2 border-indigo-500'
                : 'text-[#FF9D76] border-b-2 border-[#FF9D76]'
              : darkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          All Habits
        </button>
      </div>
      
      {/* Informational note about the 'Today' filter */}
      {habits.length > 0 && activeFilter === 'today' && pendingHabits.length === 0 && completedHabits.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 mb-6 rounded-lg text-sm ${darkMode ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-700'}`}
        >
          <p>ℹ️ The "Today" view only shows habits scheduled for <span className="font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</span>. Check the "All Habits" tab to see everything.</p>
        </motion.div>
      )}
      
      {/* Empty State */}
      {!loading && habits.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`p-5 rounded-xl border shadow-sm transition-colors duration-300 text-center py-10 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-[#FFDBCB]/30 shadow-[0_4px_12px_rgba(255,157,118,0.08)]'}`}
        >
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${darkMode ? 'bg-gray-700 text-gray-400' : 'bg-[#FFF0E8] text-[#FF9D76]'}`}>
            <FaPlus size={24} />
          </div>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>No habits yet</h3>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>Create your first habit to get started on your journey</p>
          <button 
            onClick={openCreateHabitForm}
            className={`px-4 py-2 rounded-lg transition-all duration-200 font-medium inline-flex items-center ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-[#FF9D76] hover:bg-[#FF8A5B] text-white'}`}
          >
            <FaPlus className="mr-2" />
            <span>New Habit</span>
          </button>
        </motion.div>
      )}
      
      {/* Habits Grid */}
      {!loading && habits.length > 0 && (
        <div className="space-y-6">
          {/* Pending Habits */}
          {pendingHabits.length > 0 && (
            <div>
              <h2 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>To Complete</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {pendingHabits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      id={habit.id}
                      name={habit.name}
                      category={habit.category}
                      streak={habit.streak}
                      icon={habit.icon || ''}
                      progress={habit.progress}
                      goal={habit.goal}
                      unit={habit.unit || ''}
                      frequency={habit.frequency || defaultFrequency}
                      completionHistory={habit.completionHistory || defaultCompletionHistory}
                      onComplete={markHabitComplete}
                      onEdit={openEditHabitForm}
                      onDelete={removeHabit}
                      darkMode={darkMode}
                      color={habit.color}
                      dailyTarget={habit.dailyTarget || 1}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
          
          {/* Completed Habits */}
          {completedHabits.length > 0 && (
            <div>
              <h2 className={`font-medium mb-3 ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {completedHabits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      id={habit.id}
                      name={habit.name}
                      category={habit.category}
                      streak={habit.streak}
                      icon={habit.icon || ''}
                      progress={habit.progress}
                      goal={habit.goal}
                      unit={habit.unit || ''}
                      frequency={habit.frequency || defaultFrequency}
                      completionHistory={habit.completionHistory || defaultCompletionHistory}
                      onComplete={markHabitComplete}
                      onEdit={openEditHabitForm}
                      onDelete={removeHabit}
                      darkMode={darkMode}
                      color={habit.color}
                      dailyTarget={habit.dailyTarget || 1}
                      completed={true}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Habit Form Modal */}
      <AnimatePresence>
        {showHabitForm && (
          <HabitForm 
            onClose={closeHabitForm}
            onSubmit={handleHabitFormSubmit}
            editingHabit={editingHabit}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 