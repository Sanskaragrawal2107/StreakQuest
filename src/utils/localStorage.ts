// Type definitions
import { format, subDays, addDays } from 'date-fns';

export interface Habit {
  id: string;
  name: string;
  category: string;
  frequency: string[];
  reminderTime?: string;
  color: 'primary' | 'secondary' | 'accent';
  goal: number;
  dailyTarget: number; // Number of times per day the habit should be completed
  streak: number;
  progress: number;
  lastCompleted?: string;
  completionHistory: Record<string, number>; // Changed from boolean to number for multiple completions
  icon?: string; // Optional icon for the habit
  unit?: string; // Optional unit of measurement (e.g., "minutes", "pages")
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: string;
  color: 'primary' | 'secondary' | 'accent';
}

export interface UserStats {
  totalCompletions: number;
  longestStreak: number;
  currentStreak: number;
  weeklyCompletionRate: number;
  totalHabits: number;
  achievementsUnlocked: number;
}

// Storage keys
const HABITS_KEY = 'streakquest_habits';
const ACHIEVEMENTS_KEY = 'streakquest_achievements';
const USER_STATS_KEY = 'streakquest_user_stats';

// Generate a simple UUID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

// Get today's date in YYYY-MM-DD format
export const getToday = (): string => {
  return formatDate(new Date());
};

// Habits Storage
export const getHabits = (): Habit[] => {
  const habits = localStorage.getItem(HABITS_KEY);
  const storedHabits = habits ? JSON.parse(habits) : [];
  
  // Check if habits need to be reset for today
  const resetHabits = resetDailyProgress(storedHabits);
  
  // If any habits were reset, save them back to storage
  if (resetHabits.hasChanges) {
    saveHabits(resetHabits.habits);
  }
  
  return resetHabits.habits;
};

export const saveHabits = (habits: Habit[]): void => {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
};

export const addHabit = (habit: Omit<Habit, 'id' | 'streak' | 'progress' | 'completionHistory'>): Habit => {
  const newHabit: Habit = {
    ...habit,
    id: generateId(),
    streak: 0,
    progress: 0,
    dailyTarget: habit.dailyTarget || 1, // Use user-provided value or default to 1
    completionHistory: {},
  };
  
  const habits = getHabits();
  saveHabits([...habits, newHabit]);
  
  return newHabit;
};

export const updateHabit = (updatedHabit: Partial<Habit> & { id: string }): Habit | null => {
  const habits = getHabits();
  const index = habits.findIndex(h => h.id === updatedHabit.id);
  
  if (index === -1) return null;
  
  const habit = habits[index];
  const newHabit = { ...habit, ...updatedHabit };
  
  habits[index] = newHabit;
  saveHabits(habits);
  
  return newHabit;
};

export const deleteHabit = (id: string): boolean => {
  const habits = getHabits();
  const filtered = habits.filter(h => h.id !== id);
  
  if (filtered.length === habits.length) return false;
  
  saveHabits(filtered);
  return true;
};

// Mark a habit as complete for today
export const completeHabit = (id: string): Habit | null => {
  try {
    const habits = getHabits();
    const habitIndex = habits.findIndex(h => h.id === id);
    
    if (habitIndex === -1) return null;
    
    const habit = { ...habits[habitIndex] };
    const today = new Date().toISOString().split('T')[0];
    
    // Get current and target completions
    const currentCompletions = habit.completionHistory[today] || 0;
    const targetCompletions = habit.dailyTarget || 1;
    
    // Increment the completion count for today
    if (!habit.completionHistory) {
      habit.completionHistory = {};
    }
    
    habit.completionHistory[today] = currentCompletions + 1;
    
    // Check if this marks a full completion (all repetitions done)
    const newCompletions = habit.completionHistory[today];
    const isNowFullyCompleted = newCompletions >= targetCompletions && currentCompletions < targetCompletions;
    
    // Only update the streak and last completed date when fully completed
    if (isNowFullyCompleted) {
      // Update streak logic
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      // Check if completed yesterday or this is the first completion
      const wasCompletedYesterday = habit.completionHistory[yesterdayStr] && 
                                   habit.completionHistory[yesterdayStr] >= habit.dailyTarget;
      
      if (habit.lastCompleted === yesterdayStr || !habit.lastCompleted) {
        habit.streak = (habit.streak || 0) + 1;
      } else if (habit.lastCompleted !== today) {
        // Reset streak if it wasn't completed yesterday and not already completed today
        habit.streak = 1;
      }
      
      // Update last completed date
      habit.lastCompleted = today;
      
      // Update progress
      habit.progress = Math.min(habit.progress + 1, habit.goal);
    }
    
    // Prevent exceeding the target
    if (habit.completionHistory[today] > targetCompletions) {
      habit.completionHistory[today] = targetCompletions;
    }
    
    // Update the habit in the array
    habits[habitIndex] = habit;
    
    // Save the updated habits array
    localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
    
    return habit;
  } catch (error) {
    console.error('Error completing habit:', error);
    return null;
  }
};

// Reset progress for habits that were completed on previous days
export const resetDailyProgress = (habits: Habit[]): { habits: Habit[], hasChanges: boolean } => {
  const today = getToday();
  let hasChanges = false;
  
  const updatedHabits = habits.map(habit => {
    // Skip resetting if already done today
    if (habit.lastCompleted === today) {
      return habit;
    }
    
    // Reset progress if this is a new day and the habit hasn't been completed today
    if (habit.progress > 0 && habit.lastCompleted !== today) {
      hasChanges = true;
      return {
        ...habit,
        progress: 0
      };
    }
    
    return habit;
  });
  
  return { habits: updatedHabits, hasChanges };
};

// Achievements Storage
export const getAchievements = (): Achievement[] => {
  const achievements = localStorage.getItem(ACHIEVEMENTS_KEY);
  return achievements ? JSON.parse(achievements) : [];
};

export const saveAchievements = (achievements: Achievement[]): void => {
  localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
};

export const initializeDefaultAchievements = (): Achievement[] => {
  const defaultAchievements: Achievement[] = [
    {
      id: 'first-habit',
      name: 'First Step',
      description: 'Create your first habit',
      icon: '🏆',
      unlocked: false,
      category: 'beginner',
      color: 'primary',
    },
    {
      id: 'first-week',
      name: 'Week One',
      description: 'Complete a habit for 7 consecutive days',
      icon: '🔥',
      unlocked: false,
      category: 'streak',
      color: 'primary',
    },
    {
      id: 'first-month',
      name: 'Habit Master',
      description: 'Complete a habit for 30 consecutive days',
      icon: '⭐',
      unlocked: false,
      category: 'streak',
      color: 'accent',
    },
    {
      id: 'five-habits',
      name: 'Overachiever',
      description: 'Create 5 different habits',
      icon: '🌟',
      unlocked: false,
      category: 'quantity',
      color: 'secondary',
    },
    {
      id: 'perfect-week',
      name: 'Perfect Week',
      description: 'Complete all habits for an entire week',
      icon: '🎯',
      unlocked: false,
      category: 'completion',
      color: 'accent',
    },
  ];
  
  saveAchievements(defaultAchievements);
  return defaultAchievements;
};

export const unlockAchievement = (id: string): Achievement | null => {
  let achievements = getAchievements();
  
  if (achievements.length === 0) {
    achievements = initializeDefaultAchievements();
  }
  
  const index = achievements.findIndex(a => a.id === id);
  if (index === -1) return null;
  
  const achievement = achievements[index];
  if (achievement.unlocked) return achievement;
  
  const updatedAchievement: Achievement = {
    ...achievement,
    unlocked: true,
    unlockedAt: new Date().toISOString(),
  };
  
  achievements[index] = updatedAchievement;
  saveAchievements(achievements);
  
  // Update stats
  const stats = getUserStats();
  stats.achievementsUnlocked += 1;
  saveUserStats(stats);
  
  return updatedAchievement;
};

// User Stats Storage
export const getUserStats = (): UserStats => {
  const stats = localStorage.getItem(USER_STATS_KEY);
  if (stats) return JSON.parse(stats);
  
  // Initialize default stats
  const defaultStats: UserStats = {
    totalCompletions: 0,
    longestStreak: 0,
    currentStreak: 0,
    weeklyCompletionRate: 0,
    totalHabits: 0,
    achievementsUnlocked: 0,
  };
  
  saveUserStats(defaultStats);
  return defaultStats;
};

export const saveUserStats = (stats: UserStats): void => {
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(stats));
};

// Update user stats based on current habits and achievements
export const updateStats = (): UserStats => {
  const habits = getHabits();
  const achievements = getAchievements();
  
  // Calculate total completions across all habits
  let totalCompletions = 0;
  habits.forEach(habit => {
    Object.values(habit.completionHistory).forEach(completions => {
      totalCompletions += completions; // Add up all completions (now storing counts instead of booleans)
    });
  });
  
  // Calculate longest streak across all habits
  const longestStreak = habits.reduce((max, habit) => 
    Math.max(max, habit.streak), 0);
  
  // Calculate current streak (days in a row with completions)
  let currentStreak = 0;
  
  // Only calculate if we have habits
  if (habits.length > 0) {
    const today = getToday();
    let checkDate = new Date();
    let streakBroken = false;
    
    // Check up to 30 days back
    for (let i = 0; i < 30 && !streakBroken; i++) {
      const dateString = formatDate(checkDate);
      
      // Get all habits scheduled for this day
      const scheduledHabits = habits.filter(habit => {
        const dayOfWeek = format(checkDate, 'EEEE').toLowerCase();
        return habit.frequency.includes(dayOfWeek);
      });
      
      // If no habits scheduled for this day, skip to previous day
      if (scheduledHabits.length === 0) {
        checkDate = subDays(checkDate, 1);
        continue;
      }
      
      // Check if all scheduled habits were completed to their daily target
      const allCompleted = scheduledHabits.every(habit => {
        const completionsOnDate = habit.completionHistory[dateString] || 0;
        return completionsOnDate >= (habit.dailyTarget || 1);
      });
      
      if (allCompleted) {
        currentStreak++;
      } else {
        // If the date we're checking is today, don't break the streak
        // (since user still has time to complete habits)
        if (dateString !== today) {
          streakBroken = true;
        }
      }
      
      checkDate = subDays(checkDate, 1);
    }
  }
  
  // Calculate weekly completion rate
  let weeklyCompletionRate = 0;
  const sevenDaysAgo = subDays(new Date(), 6);
  
  // Count habits fully completed (all repetitions) vs scheduled
  let totalHabitsScheduled = 0;
  let totalHabitsCompleted = 0;
  
  for (let day = 0; day < 7; day++) {
    const checkDate = addDays(sevenDaysAgo, day);
    const dateString = formatDate(checkDate);
    const dayOfWeek = format(checkDate, 'EEEE').toLowerCase();
    
    habits.forEach(habit => {
      if (habit.frequency.includes(dayOfWeek)) {
        // This habit was scheduled on this day
        totalHabitsScheduled++;
        
        // Check if all repetitions were completed
        const dailyTarget = habit.dailyTarget || 1;
        const actualCompletions = habit.completionHistory[dateString] || 0;
        
        // Only count as fully completed if all repetitions were done
        if (actualCompletions >= dailyTarget) {
          totalHabitsCompleted++;
        }
      }
    });
  }
  
  if (totalHabitsScheduled > 0) {
    weeklyCompletionRate = Math.round((totalHabitsCompleted / totalHabitsScheduled) * 100);
  }
  
  // Create updated stats object
  const updatedStats: UserStats = {
    totalCompletions,
    longestStreak,
    currentStreak,
    weeklyCompletionRate,
    totalHabits: habits.length,
    achievementsUnlocked: achievements.filter(a => a.unlocked).length,
  };
  
  // Save to localStorage
  localStorage.setItem(USER_STATS_KEY, JSON.stringify(updatedStats));
  
  return updatedStats;
}; 