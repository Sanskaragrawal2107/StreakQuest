import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaFire } from 'react-icons/fa';
import { HiCheck, HiDotsVertical } from 'react-icons/hi';

interface HabitCardProps {
  id: string;
  name: string;
  category: string;
  color: 'primary' | 'secondary' | 'accent';
  streak: number;
  goal: number;
  progress: number;
  completed?: boolean;
  lastCompleted?: Date;
  icon?: string;
  unit?: string;
  onComplete: (id: string) => any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  dailyTarget: number;
  completionHistory: Record<string, number>;
  frequency: string[];
  darkMode: boolean;
}

const HabitCard: React.FC<HabitCardProps> = ({
  id,
  name,
  category,
  color,
  streak,
  goal,
  progress,
  completed,
  lastCompleted,
  icon,
  unit,
  onComplete,
  onEdit,
  onDelete,
  dailyTarget,
  completionHistory,
  frequency,
  darkMode,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleComplete = () => {
    onComplete(id);
  };

  const handleEdit = () => {
    onEdit(id);
  };

  const handleDelete = () => {
    onDelete(id);
  };

  const formatFrequency = (freq: string[]) => {
    if (freq.length === 7) return 'Every day';
    
    if (freq.length <= 3) {
      return freq.map(day => day.substring(0, 3)).join(', ');
    } else {
      return `${freq.length} days / week`;
    }
  };

  const getCategoryColor = (category: string, color: string) => {
    if (color === 'primary') return 'bg-primary-500';
    if (color === 'secondary') return 'bg-secondary-500';
    if (color === 'accent') return 'bg-accent-500';
    
    // Fallback by category
    switch (category.toLowerCase()) {
      case 'health':
      case 'fitness':
        return 'bg-emerald-500';
      case 'learning':
      case 'education':
        return 'bg-blue-500';
      case 'productivity':
      case 'work':
        return 'bg-amber-500';
      case 'mindfulness':
      case 'wellbeing':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  // Display progress
  const renderProgressIndicator = () => {
    // Progress indicator (circular or step-based)
    if (goal > 1) {
      // Step-based indicator for multi-step habits
      const steps = Array.from({ length: goal }, (_, i) => i < progress);
      return (
        <div className="flex space-x-1">
          {steps.map((isCompleted, index) => (
            <div
              key={index}
              className={`w-2 h-5 rounded-full ${
                isCompleted
                  ? 'bg-emerald-500'
                  : darkMode
                  ? 'bg-gray-700'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      );
    } else {
      // Calculate daily progress and target
      const today = format(new Date(), 'yyyy-MM-dd');
      const completedToday = completionHistory[today] || 0;
      const targetValue = dailyTarget || 1;
      const percentage = Math.min(100, (completedToday / targetValue) * 100);
      const isFullyComplete = completedToday >= targetValue;
      
      // Circular indicator for single or multiple daily completions
      return (
        <div className="relative w-12 h-12">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            {/* Background circle */}
            <circle
              cx="18"
              cy="18"
              r="16"
              fill="none"
              className={`stroke-current ${
                darkMode ? 'text-gray-700' : 'text-gray-200'
              }`}
              strokeWidth="3"
            />
            
            {/* Progress circle */}
            {percentage > 0 && (
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className={`stroke-current ${isFullyComplete ? 'text-green-500' : 'text-emerald-400'}`}
                strokeWidth={isFullyComplete ? 4 : 3}
                strokeDasharray="100"
                strokeDashoffset={100 - percentage}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              />
            )}
            
            {/* Text in the middle showing completions/target */}
            <text
              x="18"
              y="17"
              textAnchor="middle"
              className={`fill-current ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              } text-xs font-semibold`}
            >
              {completedToday}
            </text>
            <text
              x="18"
              y="23"
              textAnchor="middle"
              className={`fill-current ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              } text-[9px]`}
            >
              of {targetValue}
            </text>
          </svg>
          
          {/* Show a checkmark badge when fully complete */}
          {isFullyComplete && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 border border-white dark:border-gray-800 rounded-full flex items-center justify-center shadow-md">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>
      );
    }
  };

  // Check if the habit is fully completed for today
  const today = format(new Date(), 'yyyy-MM-dd');
  const completedToday = completionHistory[today] || 0;
  const isFullyCompletedToday = completedToday >= (dailyTarget || 1);
  const isPartiallyCompleted = completedToday > 0 && completedToday < (dailyTarget || 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`relative rounded-xl shadow-sm overflow-hidden border ${
        isFullyCompletedToday
          ? darkMode 
            ? 'bg-green-900/20 border-green-800' 
            : 'bg-green-50 border-green-200'
          : isPartiallyCompleted
            ? darkMode
              ? 'bg-gray-800 border-emerald-700/60'
              : 'bg-white border-emerald-200'
            : darkMode
              ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
              : 'bg-white border-gray-200 hover:border-gray-300'
      } transition-all duration-300`}
    >
      {/* Category Indicator */}
      <div
        className={`absolute top-0 left-0 w-1.5 h-full ${getCategoryColor(
          category,
          color
        )}`}
      />

      <div className="p-4 pl-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3
              className={`font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              } flex items-center`}
            >
              {icon && <span className="mr-2">{icon}</span>}
              {name}
              {unit && <span className={`ml-2 text-xs opacity-60 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>({unit})</span>}
            </h3>
            <div className="flex items-center flex-wrap mt-1 gap-2">
              <span
                className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {formatFrequency(frequency)}
              </span>
              
              {/* Daily Target Pill - show only for multiple targets */}
              {(dailyTarget || 1) > 1 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    darkMode ? 'bg-indigo-900/30 text-indigo-300' : 'bg-indigo-100 text-indigo-700'
                  }`}
                >
                  {dailyTarget}x daily
                </span>
              )}
              
              {/* Display streak if positive */}
              {streak > 0 && (
                <div
                  className={`flex items-center text-xs ${
                    darkMode ? 'text-amber-300' : 'text-amber-600'
                  }`}
                >
                  <FaFire className="mr-1" />
                  <span>{streak} day{streak !== 1 ? 's' : ''}</span>
                </div>
              )}
              
              {/* Show partial completion badge */}
              {isPartiallyCompleted && !isFullyCompletedToday && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-yellow-900/30 text-yellow-300' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  In progress
                </span>
              )}
              
              {/* Show completed badge */}
              {isFullyCompletedToday && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  darkMode ? 'bg-green-900/30 text-green-300' : 'bg-green-100 text-green-700'
                }`}>
                  Completed
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Progress indicator */}
            {renderProgressIndicator()}

            <div className="flex space-x-2">
              {/* Action buttons - only show if not fully completed for today */}
              {!isFullyCompletedToday && (
                <button
                  onClick={handleComplete}
                  className={`p-2 rounded-lg transition-colors ${
                    isPartiallyCompleted
                      ? darkMode
                        ? 'bg-emerald-700/80 hover:bg-emerald-700 text-white'
                        : 'bg-emerald-500/90 hover:bg-emerald-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                  aria-label={isPartiallyCompleted ? "Continue habit" : "Complete habit"}
                >
                  <HiCheck className="text-xl" />
                </button>
              )}

              {/* Show completed button if fully completed */}
              {isFullyCompletedToday && (
                <div
                  className={`p-2 rounded-lg ${
                    darkMode
                      ? 'bg-green-600 text-white'
                      : 'bg-green-500 text-white'
                  }`}
                >
                  <HiCheck className="text-xl" />
                </div>
              )}

              <button
                onClick={() => setShowOptions(!showOptions)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
                aria-label="Habit options"
              >
                <HiDotsVertical />
              </button>
            </div>
          </div>
        </div>

        {/* Options menu (conditionally rendered) */}
        {showOptions && (
          <div className={`absolute right-4 top-12 z-10 w-36 rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}>
            <div className="py-1">
              <button
                onClick={handleEdit}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  darkMode ? 'text-red-400 hover:bg-gray-700' : 'text-red-500 hover:bg-gray-100'
                }`}
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default HabitCard; 