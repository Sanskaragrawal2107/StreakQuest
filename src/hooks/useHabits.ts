import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { 
  Habit, 
  getHabits, 
  addHabit, 
  updateHabit, 
  deleteHabit, 
  completeHabit,
  updateStats,
  unlockAchievement,
  getAchievements,
  initializeDefaultAchievements
} from '../utils/localStorage';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showHabitForm, setShowHabitForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);

  // Load habits from localStorage
  useEffect(() => {
    try {
      const storedHabits = getHabits();
      setHabits(storedHabits);
      
      // Check if we need to initialize achievements
      const achievements = getAchievements();
      if (achievements.length === 0) {
        initializeDefaultAchievements();
      }
      
      // Check for unlockable achievements
      checkAchievements(storedHabits);
      
      // Update stats
      updateStats();
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load your habits');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new habit
  const createHabit = useCallback((habitData: Omit<Habit, 'id' | 'streak' | 'progress' | 'completionHistory'>) => {
    try {
      const newHabit = addHabit(habitData);
      setHabits(prev => [...prev, newHabit]);
      toast.success('Habit created successfully!');
      
      // Check for first habit achievement
      if (habits.length === 0) {
        unlockAchievement('first-habit');
        toast('🎉 Achievement unlocked: First Step!', {
          icon: '🏆',
          duration: 4000,
        });
      }
      
      // Check for 5 habits achievement
      if (habits.length === 4) {
        unlockAchievement('five-habits');
        toast('🎉 Achievement unlocked: Overachiever!', {
          icon: '🌟',
          duration: 4000,
        });
      }
      
      // Update stats
      updateStats();
      
      return newHabit;
    } catch (error) {
      console.error('Error creating habit:', error);
      toast.error('Failed to create habit');
      return null;
    }
  }, [habits]);

  // Update an existing habit
  const editHabit = useCallback((habitData: Partial<Habit> & { id: string }) => {
    try {
      const updated = updateHabit(habitData);
      if (!updated) throw new Error('Habit not found');
      
      setHabits(prev => prev.map(h => h.id === updated.id ? updated : h));
      toast.success('Habit updated successfully!');
      
      // Update stats
      updateStats();
      
      return updated;
    } catch (error) {
      console.error('Error updating habit:', error);
      toast.error('Failed to update habit');
      return null;
    }
  }, []);

  // Delete a habit
  const removeHabit = useCallback((id: string) => {
    try {
      const deleted = deleteHabit(id);
      if (!deleted) throw new Error('Habit not found');
      
      setHabits(prev => prev.filter(h => h.id !== id));
      toast.success('Habit deleted successfully!');
      
      // Update stats
      updateStats();
      
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      toast.error('Failed to delete habit');
      return false;
    }
  }, []);

  // Complete a habit
  const markHabitComplete = useCallback((id: string) => {
    try {
      const habit = habits.find(h => h.id === id);
      if (!habit) throw new Error('Habit not found');
      
      // Check the current state before updating
      const today = new Date().toISOString().split('T')[0];
      const currentCompletions = habit.completionHistory[today] || 0;
      const targetCompletions = habit.dailyTarget || 1;
      
      // Log for debugging
      console.log(`Marking habit complete: ${habit.name}`);
      console.log(`Current completions: ${currentCompletions}/${targetCompletions}`);
      
      const updatedHabit = completeHabit(id);
      if (!updatedHabit) throw new Error('Failed to update habit');
      
      setHabits(prev => prev.map(h => h.id === updatedHabit.id ? updatedHabit : h));
      
      // Get updated completion information
      const newCompletions = updatedHabit.completionHistory[today] || 0;
      
      // Show appropriate toast message based on completion status
      if (newCompletions >= targetCompletions && currentCompletions < targetCompletions) {
        // This click just completed all repetitions
        toast.success('Habit fully completed! 🎉', {
          duration: 3000,
          icon: '✅'
        });
        
        // Check for streak achievements
        if (updatedHabit.streak === 7) {
          unlockAchievement('first-week');
          toast('🎉 Achievement unlocked: Week One!', {
            icon: '🔥',
            duration: 4000,
          });
        }
        
        if (updatedHabit.streak === 30) {
          unlockAchievement('first-month');
          toast('🎉 Achievement unlocked: Habit Master!', {
            icon: '⭐',
            duration: 4000,
          });
        }
      } else if (newCompletions < targetCompletions) {
        // Show progress message for multi-repetition habits
        toast.success(`Progress: ${newCompletions}/${targetCompletions} repetitions completed`, {
          duration: 2000,
          icon: '🔄'
        });
      } else {
        // Already completed but clicked again
        toast('Already completed all repetitions for today!', {
          icon: '👍',
          duration: 2000,
        });
      }
      
      // Update stats
      updateStats();
      
      return updatedHabit;
    } catch (error) {
      console.error('Error completing habit:', error);
      toast.error('Failed to mark habit as complete');
      return null;
    }
  }, [habits, setHabits]);

  // Check for unlockable achievements
  const checkAchievements = useCallback((currentHabits: Habit[]) => {
    // First habit achievement
    if (currentHabits.length === 1) {
      unlockAchievement('first-habit');
    }
    
    // Five habits achievement
    if (currentHabits.length >= 5) {
      unlockAchievement('five-habits');
    }
    
    // Check streak-based achievements
    currentHabits.forEach(habit => {
      if (habit.streak >= 7) {
        unlockAchievement('first-week');
      }
      
      if (habit.streak >= 30) {
        unlockAchievement('first-month');
      }
    });
    
    // More achievement checks can be added here
  }, []);

  // Handle opening the create habit form
  const openCreateHabitForm = useCallback(() => {
    setEditingHabit(null);
    setShowHabitForm(true);
  }, []);

  // Handle opening the edit habit form
  const openEditHabitForm = useCallback((habit: Habit) => {
    setEditingHabit(habit);
    setShowHabitForm(true);
  }, []);

  // Handle closing the habit form
  const closeHabitForm = useCallback(() => {
    setShowHabitForm(false);
    setEditingHabit(null);
  }, []);

  // Handle form submission
  const handleHabitFormSubmit = useCallback((data: any) => {
    if (editingHabit) {
      editHabit({ ...data, id: editingHabit.id });
    } else {
      createHabit(data);
    }
    closeHabitForm();
  }, [editingHabit, createHabit, editHabit, closeHabitForm]);

  return {
    habits,
    loading,
    showHabitForm,
    editingHabit,
    createHabit,
    editHabit,
    removeHabit,
    markHabitComplete,
    openCreateHabitForm,
    openEditHabitForm,
    closeHabitForm,
    handleHabitFormSubmit,
  };
}; 