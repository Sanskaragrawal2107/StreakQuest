import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaTimes, FaRunning, FaBook, FaBrain, FaHeart, 
  FaWater, FaLeaf, FaRegCheckCircle 
} from 'react-icons/fa';
import { useTheme } from '../../contexts/ThemeContext';
import { Habit } from '../../utils/localStorage';

interface HabitFormProps {
  initialData?: {
    id?: string;
    name: string;
    category: string;
    frequency: string[];
    dailyTarget?: number;
    reminderTime?: string;
    color: 'primary' | 'secondary' | 'accent';
    goal: number;
  };
  editingHabit?: Habit | null;
  darkMode?: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const DEFAULT_FORM_DATA = {
  name: '',
  category: 'fitness',
  frequency: ['monday', 'wednesday', 'friday'],
  dailyTarget: 1,
  reminderTime: '',
  color: 'primary' as const,
  goal: 1,
};

const CATEGORIES = [
  { id: 'fitness', label: 'Fitness', icon: <FaRunning /> },
  { id: 'reading', label: 'Reading', icon: <FaBook /> },
  { id: 'learning', label: 'Learning', icon: <FaBrain /> },
  { id: 'health', label: 'Health', icon: <FaHeart /> },
  { id: 'hydration', label: 'Hydration', icon: <FaWater /> },
  { id: 'mindfulness', label: 'Mindfulness', icon: <FaLeaf /> },
];

const WEEKDAYS = [
  { id: 'monday', label: 'Mon' },
  { id: 'tuesday', label: 'Tue' },
  { id: 'wednesday', label: 'Wed' },
  { id: 'thursday', label: 'Thu' },
  { id: 'friday', label: 'Fri' },
  { id: 'saturday', label: 'Sat' },
  { id: 'sunday', label: 'Sun' },
];

const COLOR_OPTIONS = [
  { id: 'primary', label: 'Blue', class: 'bg-primary-500' },
  { id: 'secondary', label: 'Green', class: 'bg-secondary-500' },
  { id: 'accent', label: 'Purple', class: 'bg-accent-500' },
];

// Form values type
interface FormValues {
  name: string;
  category: string;
  frequency: string[];
  dailyTarget?: number;
  reminderTime?: string;
  color: 'primary' | 'secondary' | 'accent';
  goal: number;
}

const HabitForm: React.FC<HabitFormProps> = ({
  initialData,
  editingHabit,
  darkMode: propDarkMode,
  onClose,
  onSubmit,
}) => {
  // Use the prop darkMode if provided, otherwise use context
  const { darkMode: themeDarkMode } = useTheme();
  const darkMode = propDarkMode !== undefined ? propDarkMode : themeDarkMode;
  
  const [formValues, setFormValues] = useState<FormValues>({
    name: initialData?.name || '',
    category: initialData?.category || 'Health',
    frequency: initialData?.frequency || ['monday', 'wednesday', 'friday'],
    dailyTarget: initialData?.dailyTarget || 1,
    reminderTime: initialData?.reminderTime || '',
    color: initialData?.color || 'primary',
    goal: initialData?.goal || 1,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleFrequencyToggle = (day: string) => {
    setFormValues((prev) => ({
      ...prev,
      frequency: prev.frequency.includes(day)
        ? prev.frequency.filter((d) => d !== day)
        : [...prev.frequency, day],
    }));
  };

  const handleColorChange = (color: 'primary' | 'secondary' | 'accent') => {
    setFormValues((prev) => ({ ...prev, color }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formValues);
  };

  // Handle dailyTarget change
  const handleDailyTargetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    // Only update if it's a valid number between 1 and 10
    // If field is empty (during typing), keep the current value without auto-converting to 10
    if (e.target.value === '') {
      setFormValues({
        ...formValues,
        dailyTarget: undefined // Allow empty field during typing
      });
    } else if (!isNaN(value)) {
      setFormValues({
        ...formValues,
        dailyTarget: value < 1 ? 1 : value > 10 ? 10 : value
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto`}
      >
        <div className={`p-5 ${darkMode ? 'border-gray-700' : 'border-neutral-100'} border-b flex items-center justify-between`}>
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>
            {initialData?.id ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button 
            onClick={onClose}
            className={`p-2 rounded-lg ${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-neutral-500 hover:bg-neutral-100'} transition-colors`}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Habit Name */}
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Habit Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formValues.name}
              onChange={handleChange}
              placeholder="E.g. Morning Run, Read a Book"
              className={`input w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200 placeholder-gray-500' : ''}`}
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setFormValues((prev) => ({ ...prev, category: category.id }))}
                  className={`p-3 rounded-lg border flex flex-col items-center justify-center transition-all ${
                    formValues.category === category.id
                      ? darkMode 
                        ? 'bg-indigo-900/30 border-indigo-700 text-indigo-300' 
                        : 'bg-primary-50 border-primary-200 text-primary-600'
                      : darkMode
                        ? 'border-gray-700 text-gray-300 hover:border-gray-600'
                        : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                  }`}
                >
                  <span className="text-lg mb-1">{category.icon}</span>
                  <span className="text-xs">{category.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Frequency */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Frequency
            </label>
            <div className="flex space-x-1">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleFrequencyToggle(day.id)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
                    formValues.frequency.includes(day.id)
                      ? 'bg-primary-500 text-white'
                      : darkMode
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Color
            </label>
            <div className="flex space-x-3">
              {COLOR_OPTIONS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleColorChange(option.id as any)}
                  className={`w-8 h-8 rounded-full transition-all flex items-center justify-center ${
                    option.class
                  } ${
                    formValues.color === option.id ? 'ring-2 ring-offset-2 ring-neutral-300' : ''
                  }`}
                >
                  {formValues.color === option.id && (
                    <FaRegCheckCircle className="text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Daily Target Field - Simplified and clarified */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Repetitions Per Day
            </label>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center">
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formValues.dailyTarget === undefined ? '' : formValues.dailyTarget}
                  onChange={handleDailyTargetChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    darkMode 
                      ? 'bg-gray-800 border-gray-700 text-white' 
                      : 'bg-white border-gray-300 text-gray-900'
                  }`}
                  onBlur={() => {
                    // When field loses focus, ensure there's a valid value
                    if (formValues.dailyTarget === undefined) {
                      setFormValues({
                        ...formValues,
                        dailyTarget: 1
                      });
                    }
                  }}
                />
                <div className="ml-2 text-sm font-medium text-indigo-500">
                  {formValues.dailyTarget === 1 
                    ? 'Once per day'
                    : `${formValues.dailyTarget} times per day`
                  }
                </div>
              </div>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                How many times do you want to complete this habit each day? You'll need to click the complete 
                button {formValues.dailyTarget} times to fully complete the habit for the day.
              </p>
            </div>
          </div>

          {/* Goal (for countable habits) */}
          <div>
            <label htmlFor="goal" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Daily Goal (if applicable)
            </label>
            <div className="flex items-center">
              <input
                type="number"
                id="goal"
                name="goal"
                min="1"
                max="100"
                value={formValues.goal}
                onChange={handleChange}
                className={`input w-24 ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
              />
              <span className={`ml-2 text-sm ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>times per day</span>
            </div>
            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
              Leave at 1 for habits you simply complete, or set higher for countable goals (e.g. glasses of water)
            </p>
          </div>

          {/* Reminder */}
          <div>
            <label htmlFor="reminderTime" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-neutral-700'}`}>
              Reminder Time (Optional)
            </label>
            <input
              type="time"
              id="reminderTime"
              name="reminderTime"
              value={formValues.reminderTime}
              onChange={handleChange}
              className={`input w-full ${darkMode ? 'bg-gray-700 border-gray-600 text-gray-200' : ''}`}
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              {initialData?.id ? 'Update Habit' : 'Create Habit'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default HabitForm; 