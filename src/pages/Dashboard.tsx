import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';
import HabitCard from '../components/habits/HabitCard';
import HabitForm from '../components/habits/HabitForm';
import ProgressRing from '../components/ui/ProgressRing';
import { useHabits } from '../hooks/useHabits';
import { getUserStats } from '../utils/localStorage';
import { Toaster } from 'react-hot-toast';
import { useTheme } from '../contexts/ThemeContext';

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

  const [activeFilter, setActiveFilter] = useState<'all' | 'today'>('today');
  const stats = getUserStats();

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

  return (
    <div>
      <Toaster position="top-right" />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
          <p className="text-neutral-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <button 
            onClick={openCreateHabitForm}
            className="btn btn-primary flex items-center mt-4 md:mt-0"
          >
            <FaPlus className="mr-2" />
            <span>New Habit</span>
          </button>
        </motion.div>
      </div>
      
      {/* Stats Overview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
      >
        {/* Today's Progress */}
        <div className="card flex items-center">
          <ProgressRing 
            progress={completionRate} 
            size={70} 
            strokeWidth={7}
            className="mr-4"
          />
          <div>
            <h3 className="font-semibold text-neutral-700">Today's Progress</h3>
            <p className="text-2xl font-bold text-primary-600">
              {completedHabits.length}/{filteredHabits.length}
            </p>
            <p className="text-xs text-neutral-500">tasks completed</p>
          </div>
        </div>
        
        {/* Current Streak */}
        <div className="card flex items-center">
          <div className="w-16 h-16 rounded-full bg-accent-50 flex items-center justify-center mr-4">
            <FaCheckCircle className="text-2xl text-accent-500" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-700">Current Streak</h3>
            <p className="text-2xl font-bold text-accent-600">{stats.currentStreak} days</p>
            <p className="text-xs text-neutral-500">keep it up!</p>
          </div>
        </div>
        
        {/* Weekly Completion */}
        <div className="card flex items-center">
          <div className="w-16 h-16 rounded-full bg-secondary-50 flex items-center justify-center mr-4">
            <FaCalendarAlt className="text-2xl text-secondary-500" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-700">Weekly Rate</h3>
            <p className="text-2xl font-bold text-secondary-600">{Math.round(stats.weeklyCompletionRate)}%</p>
            <p className="text-xs text-neutral-500">completion rate</p>
          </div>
        </div>
      </motion.div>
      
      {/* Filter Tabs */}
      <div className="flex mb-4 border-b border-neutral-200">
        <button 
          onClick={() => setActiveFilter('today')}
          className={`px-4 py-2 font-medium ${
            activeFilter === 'today' 
              ? 'text-primary-600 border-b-2 border-primary-500' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          Today
        </button>
        <button 
          onClick={() => setActiveFilter('all')}
          className={`px-4 py-2 font-medium ${
            activeFilter === 'all' 
              ? 'text-primary-600 border-b-2 border-primary-500' 
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          All Habits
        </button>
      </div>
      
      {/* Empty State */}
      {!loading && habits.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="card text-center py-10"
        >
          <div className="bg-neutral-100 w-20 h-20 rounded-full flex items-center justify-center text-neutral-400 mx-auto mb-4">
            <FaPlus size={24} />
          </div>
          <h3 className="text-lg font-semibold text-neutral-700 mb-2">No habits yet</h3>
          <p className="text-neutral-500 mb-4">Create your first habit to get started on your journey</p>
          <button 
            onClick={openCreateHabitForm}
            className="btn btn-primary inline-flex items-center"
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
              <h2 className="font-medium text-neutral-700 mb-3">To Complete</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {pendingHabits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      id={habit.id}
                      name={habit.name}
                      category={habit.category}
                      streak={habit.streak}
                      completed={false}
                      color={habit.color}
                      goal={habit.goal}
                      progress={habit.progress}
                      lastCompleted={habit.lastCompleted ? new Date(habit.lastCompleted) : undefined}
                      onComplete={markHabitComplete}
                      onEdit={() => openEditHabitForm(habit)}
                      onDelete={removeHabit}
                      completionHistory={habit.completionHistory || defaultCompletionHistory}
                      frequency={habit.frequency || defaultFrequency}
                      darkMode={darkMode}
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
              <h2 className="font-medium text-neutral-700 mb-3">Completed</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <AnimatePresence>
                  {completedHabits.map(habit => (
                    <HabitCard 
                      key={habit.id}
                      id={habit.id}
                      name={habit.name}
                      category={habit.category}
                      streak={habit.streak}
                      completed={true}
                      color={habit.color}
                      goal={habit.goal}
                      progress={habit.progress}
                      lastCompleted={habit.lastCompleted ? new Date(habit.lastCompleted) : undefined}
                      onComplete={markHabitComplete}
                      onEdit={() => openEditHabitForm(habit)}
                      onDelete={removeHabit}
                      completionHistory={habit.completionHistory || defaultCompletionHistory}
                      frequency={habit.frequency || defaultFrequency}
                      darkMode={darkMode}
                      dailyTarget={habit.dailyTarget || 1}
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
            initialData={editingHabit || undefined}
            onClose={closeHabitForm}
            onSubmit={handleHabitFormSubmit}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard; 