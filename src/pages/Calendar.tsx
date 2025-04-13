import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaCircle } from 'react-icons/fa';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addMonths, 
  subMonths,
  parseISO 
} from 'date-fns';
import { useHabits } from '../hooks/useHabits';
import { getHabits, Habit, formatDate } from '../utils/localStorage';
import { useTheme } from '../contexts/ThemeContext';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { habits } = useHabits();
  const [selectedHabit, setSelectedHabit] = useState<string | 'all'>('all');
  const { darkMode } = useTheme();

  // Handle month navigation
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysArray = eachDayOfInterval({ start: monthStart, end: monthEnd });
    return daysArray;
  }, [currentMonth]);

  // Get completion data for heat map
  const getCompletionData = (day: Date) => {
    const dateString = format(day, 'yyyy-MM-dd');
    const today = formatDate(new Date());
    
    if (selectedHabit === 'all') {
      // Calculate total progress and total goals for habits scheduled on this day
      let totalProgress = 0;
      let totalGoal = 0;
      
      const dayOfWeek = format(day, 'EEEE').toLowerCase();
      habits.forEach(habit => {
        // Only include habits scheduled for this day
        if (habit.frequency.includes(dayOfWeek)) {
          totalGoal += habit.goal;
          
          // If the habit was completed on this day
          if (habit.completionHistory && habit.completionHistory[dateString]) {
            // For today, use actual progress
            if (dateString === today) {
              totalProgress += habit.progress;
            } else {
              // For past days, if in history, assume the goal was met
              totalProgress += habit.goal;
            }
          }
        }
      });
      
      if (totalGoal === 0) return 0;
      return (totalProgress / totalGoal) * 100;
    } else {
      // For a specific habit
      const habit = habits.find(h => h.id === selectedHabit);
      if (!habit) return 0;
      
      const dayOfWeek = format(day, 'EEEE').toLowerCase();
      const wasScheduled = habit.frequency.includes(dayOfWeek);
      
      if (!wasScheduled) return 0;
      
      // If the habit was completed on this day
      if (habit.completionHistory && habit.completionHistory[dateString]) {
        // For today, use actual progress percentage
        if (dateString === today) {
          return (habit.progress / habit.goal) * 100;
        } else {
          // For past days, if in history, assume 100%
          return 100;
        }
      }
      
      return 0;
    }
  };

  // Determine color intensity based on completion percentage
  const getColorClass = (percentage: number): string => {
    if (percentage === 0) return darkMode ? 'bg-gray-700' : 'bg-neutral-100';
    if (percentage < 25) return darkMode ? 'bg-indigo-900/50' : 'bg-primary-100';
    if (percentage < 50) return darkMode ? 'bg-indigo-800/60' : 'bg-primary-200';
    if (percentage < 75) return darkMode ? 'bg-indigo-700/70' : 'bg-primary-300';
    if (percentage < 100) return darkMode ? 'bg-indigo-600/80' : 'bg-primary-400';
    return darkMode ? 'bg-indigo-500/90' : 'bg-primary-500';
  };

  // Get longest streak for a habit
  const getLongestStreak = (habitId: string): number => {
    if (habitId === 'all') {
      return Math.max(...habits.map(h => h.streak), 0);
    }
    
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.streak : 0;
  };

  // Get current streak for a habit
  const getCurrentStreak = (habitId: string): number => {
    if (habitId === 'all') {
      return Math.max(...habits.map(h => h.streak), 0);
    }
    
    const habit = habits.find(h => h.id === habitId);
    return habit ? habit.streak : 0;
  };

  return (
    <div className="pb-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>
            Calendar
          </h1>
          <p className={`${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}>
            View your habit completion history
          </p>
        </motion.div>
      </div>
      
      {/* Habit Selector */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
          Select Habit
        </label>
        <select
          value={selectedHabit}
          onChange={(e) => setSelectedHabit(e.target.value)}
          className={`input w-full max-w-md ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
        >
          <option value="all">All Habits</option>
          {habits.map(habit => (
            <option key={habit.id} value={habit.id}>
              {habit.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Streak Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-neutral-700'}`}>
            Current Streak
          </h3>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              darkMode ? 'bg-indigo-900/40' : 'bg-primary-50'
            }`}>
              <FaCircle className={`text-sm ${darkMode ? 'text-indigo-400' : 'text-primary-500'}`} />
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-primary-600'}`}>
              {getCurrentStreak(selectedHabit)} days
            </span>
          </div>
        </div>
        
        <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
          <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-neutral-700'}`}>
            Longest Streak
          </h3>
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              darkMode ? 'bg-fuchsia-900/40' : 'bg-accent-50'
            }`}>
              <FaCircle className={`text-sm ${darkMode ? 'text-fuchsia-400' : 'text-accent-500'}`} />
            </div>
            <span className={`text-2xl font-bold ${darkMode ? 'text-fuchsia-400' : 'text-accent-600'}`}>
              {getLongestStreak(selectedHabit)} days
            </span>
          </div>
        </div>
      </div>
      
      {/* Calendar Navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FaChevronLeft />
        </button>
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-neutral-800'}`}>
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <button
          onClick={nextMonth}
          className={`p-2 rounded-lg transition-colors ${
            darkMode 
              ? 'text-gray-300 hover:bg-gray-700' 
              : 'text-neutral-600 hover:bg-neutral-100'
          }`}
        >
          <FaChevronRight />
        </button>
      </div>
      
      {/* Calendar Legend */}
      <div className={`flex items-center space-x-2 mb-4 text-xs ${darkMode ? 'text-gray-400' : 'text-neutral-600'}`}>
        <span>Completion:</span>
        <div className="flex items-center space-x-1">
          <div className={`w-4 h-4 rounded-sm ${darkMode ? 'bg-gray-700' : 'bg-neutral-100'}`}></div>
          <span>0%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-4 h-4 rounded-sm ${darkMode ? 'bg-indigo-900/50' : 'bg-primary-100'}`}></div>
          <span>25%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-4 h-4 rounded-sm ${darkMode ? 'bg-indigo-800/60' : 'bg-primary-200'}`}></div>
          <span>50%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-4 h-4 rounded-sm ${darkMode ? 'bg-indigo-700/70' : 'bg-primary-300'}`}></div>
          <span>75%</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className={`w-4 h-4 rounded-sm ${darkMode ? 'bg-indigo-500/90' : 'bg-primary-500'}`}></div>
          <span>100%</span>
        </div>
      </div>
      
      {/* Calendar Heat Map */}
      <div className={`card ${darkMode ? 'bg-gray-800 border-gray-700' : ''}`}>
        <div className="grid grid-cols-7 gap-2">
          {/* Day labels */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className={`text-center text-xs font-medium py-1 ${
              darkMode ? 'text-gray-300' : 'text-neutral-500'
            }`}>
              {day}
            </div>
          ))}
          
          {/* Calendar grid spacing for first day of month */}
          {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-14 rounded-lg"></div>
          ))}
          
          {/* Calendar days */}
          {calendarDays.map(day => {
            const formattedDate = format(day, 'yyyy-MM-dd');
            const completionPercentage = getCompletionData(day);
            const colorClass = getColorClass(completionPercentage);
            const isToday = isSameDay(day, new Date());
            
            return (
              <motion.div
                key={formattedDate}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                className={`
                  h-14 rounded-lg flex flex-col items-center justify-center relative
                  ${colorClass}
                  ${isToday ? `ring-2 ${darkMode ? 'ring-indigo-400' : 'ring-primary-500'}` : ''}
                `}
              >
                <span className={`text-sm ${isToday ? 'font-bold' : ''} ${
                  darkMode ? 'text-gray-200' : ''
                }`}>
                  {format(day, 'd')}
                </span>
                
                {completionPercentage > 0 && (
                  <span className={`text-xs mt-0.5 ${
                    darkMode ? 'text-gray-400' : 'text-neutral-600'
                  }`}>
                    {Math.round(completionPercentage)}%
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar; 