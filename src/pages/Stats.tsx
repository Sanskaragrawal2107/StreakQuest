import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaCalendarCheck, FaChartLine, FaChevronDown, FaMoon, FaSun } from 'react-icons/fa';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  Tooltip, 
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, eachDayOfInterval, parseISO } from 'date-fns';
import { getUserStats, getHabits, getAchievements, formatDate, updateStats, Habit } from '../utils/localStorage';
import { useTheme } from '../contexts/ThemeContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// Import placeholder illustrations
const ILLUSTRATIONS = {
  hero: 'https://img.freepik.com/free-vector/goal-achievement-concept-illustration_114360-5401.jpg',
  streak: 'https://img.freepik.com/free-vector/target-achievement-concept-illustration_114360-5788.jpg',
  achievement: 'https://img.freepik.com/free-vector/winner-concept-illustration_114360-1988.jpg',
  empty: 'https://img.freepik.com/free-vector/active-tourist-hiking-mountain-cartoon-icon-illustration_138676-2652.jpg',
};

const Stats: React.FC<{}> = () => {
  const [stats, setStats] = useState(getUserStats());
  const [habits, setHabits] = useState(getHabits());
  const [achievements, setAchievements] = useState(getAchievements());
  const { darkMode } = useTheme();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const [completionData, setCompletionData] = useState<{
    labels: string[];
    completions: number[];
    partialCompletions: number[];
    scheduled: number[];
    completionRates: number[];
  }>({ labels: [], completions: [], partialCompletions: [], scheduled: [], completionRates: [] });
  const [categoryData, setCategoryData] = useState<{
    labels: string[];
    values: number[];
  }>({ labels: [], values: [] });
  
  // Theme-based colors
  const getThemeColors = () => {
    return {
      text: darkMode ? '#f1f5f9' : '#1e293b',
      textSecondary: darkMode ? '#cbd5e1' : '#64748b',
      background: darkMode ? '#0f172a' : '#ffffff',
      backgroundSecondary: darkMode ? '#1e293b' : '#f8fafc',
      cardBg: darkMode ? '#1e293b' : '#ffffff',
      border: darkMode ? '#334155' : '#e2e8f0',
      indigo: {
        primary: darkMode ? 'rgb(129, 140, 248)' : 'rgb(79, 70, 229)', // Lighter in dark mode
        light: darkMode ? 'rgba(129, 140, 248, 0.3)' : 'rgba(79, 70, 229, 0.15)',
        bg: darkMode ? '#312e81' : '#eef2ff',
      },
      emerald: {
        primary: darkMode ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)',
        light: darkMode ? 'rgba(52, 211, 153, 0.3)' : 'rgba(16, 185, 129, 0.15)',
        bg: darkMode ? '#065f46' : '#ecfdf5',
      },
      fuchsia: {
        primary: darkMode ? 'rgb(232, 121, 249)' : 'rgb(217, 70, 239)', // Lighter in dark mode
        light: darkMode ? 'rgba(232, 121, 249, 0.3)' : 'rgba(217, 70, 239, 0.15)',
        bg: darkMode ? '#701a75' : '#fdf4ff',
      },
      gold: {
        primary: 'rgb(250, 204, 21)',
        light: 'rgba(250, 204, 21, 0.3)',
        bg: darkMode ? '#854d0e' : '#fef9c3',
      },
      grid: darkMode ? 'rgba(71, 85, 105, 0.3)' : 'rgba(226, 232, 240, 0.5)',
      tooltipBg: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
      tooltipBorder: darkMode ? '#334155' : 'rgba(203, 213, 225, 1)',
    };
  };

  const colors = getThemeColors();
  
  // Chart state management
  const [lineChartData, setLineChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      fill: boolean;
      tension: number;
      pointBackgroundColor: string;
      pointRadius: number;
      pointHoverRadius: number;
      borderWidth: number;
    }>;
  }>({
    labels: [],
    datasets: [
      {
        label: 'Completion Rate (%)',
        data: [],
        borderColor: '',
        backgroundColor: '',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '',
        pointRadius: 5,
        pointHoverRadius: 7,
        borderWidth: 3,
      },
    ],
  });
  
  const [barChartData, setBarChartData] = useState<{
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderWidth?: number;
      borderColor?: string;
      borderRadius: number;
      barPercentage: number;
      categoryPercentage: number;
      order: number;
    }>;
  }>({
    labels: [],
    datasets: [
      {
        label: 'Fully Completed',
        data: [],
        backgroundColor: '',
        borderWidth: 2,
        borderColor: '',
        borderRadius: 6,
        barPercentage: 0.6, 
        categoryPercentage: 0.8,
        order: 1,
      },
      {
        label: 'Partially Completed',
        data: [],
        backgroundColor: '',
        borderWidth: 2,
        borderColor: '',
        borderRadius: 6,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
        order: 2,
      },
      {
        label: 'Scheduled',
        data: [],
        backgroundColor: '',
        borderRadius: 6,
        barPercentage: 0.7,
        categoryPercentage: 0.8,
        order: 3,
      }
    ],
  });
  
  const [doughnutChartData, setDoughnutChartData] = useState<{
    labels: string[];
    datasets: Array<{
      data: number[];
      backgroundColor: string[];
      borderWidth: number;
      borderColor: string;
      hoverOffset: number;
    }>;
  }>({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',    // Indigo (primary)
          'rgba(52, 211, 153, 0.8)',   // Emerald (secondary)
          'rgba(217, 70, 239, 0.8)',   // Fuchsia (accent)
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(99, 102, 241, 0.8)',   // Indigo-blue
          'rgba(236, 72, 153, 0.8)',   // Pink
        ],
        borderWidth: 2,
        borderColor: '',
        hoverOffset: 6,
      },
    ],
  });

  // Load and refresh data when dependencies change
  useEffect(() => {
    // Update stats from localStorage and recalculate
    const updatedStats = updateStats();
    setStats(updatedStats);
    setHabits(getHabits());
    setAchievements(getAchievements());

    // Initialize chart data once without using an interval
    // Previously, an interval was causing navigation issues and performance problems
    // by continuously refreshing data even when the user wasn't viewing the stats page
    refreshAllChartData();
  }, [timeframe, darkMode]); // Re-run when timeframe or dark mode changes

  // Initial setup for charts when colors change - speed up animations
  useEffect(() => {
    // Get fresh colors based on the current darkMode state
    const currentColors = getThemeColors();
    
    // Update charts with current theme colors and data
    setLineChartData(prevData => ({
      labels: completionData.labels,
      datasets: [{
        ...prevData.datasets[0],
        label: 'Completion Rate (%)',
        data: completionData.completionRates,
        borderColor: currentColors.indigo.primary,
        backgroundColor: currentColors.indigo.light,
        pointBackgroundColor: currentColors.indigo.primary,
      }]
    }));
    
    setBarChartData(prevData => ({
      labels: completionData.labels,
      datasets: [
        {
          ...prevData.datasets[0],
          backgroundColor: darkMode ? '#4ade80' : '#10b981',
          borderColor: darkMode ? '#34d399' : '#059669',
          data: completionData.completions,
        },
        {
          ...prevData.datasets[1],
          backgroundColor: darkMode ? 'rgba(250, 204, 21, 0.8)' : 'rgba(234, 179, 8, 0.8)',
          borderColor: darkMode ? 'rgba(250, 204, 21, 1)' : 'rgba(202, 138, 4, 1)',
          data: completionData.partialCompletions,
        },
        {
          ...prevData.datasets[2],
          backgroundColor: darkMode ? 'rgba(148, 163, 184, 0.4)' : 'rgba(100, 116, 139, 0.4)',
          data: completionData.scheduled,
        }
      ]
    }));
    
    setDoughnutChartData(prevData => ({
      labels: categoryData.labels,
      datasets: [{
        ...prevData.datasets[0],
        data: categoryData.values,
        backgroundColor: [
          'rgba(79, 70, 229, 0.8)',    // Indigo (primary)
          'rgba(52, 211, 153, 0.8)',   // Emerald (secondary)
          'rgba(217, 70, 239, 0.8)',   // Fuchsia (accent)
          'rgba(251, 146, 60, 0.8)',   // Orange
          'rgba(99, 102, 241, 0.8)',   // Indigo-blue
          'rgba(236, 72, 153, 0.8)',   // Pink
        ],
        borderColor: darkMode ? '#1e293b' : '#ffffff',
      }]
    }));
  }, [darkMode, completionData, categoryData]); // Remove colors from dependency array since it's derived from darkMode

  // Utility to check if a habit is scheduled for a specific date
  const isHabitScheduledForDate = (habit: any, date: Date): boolean => {
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    return habit.frequency?.includes(dayOfWeek) || false;
  };

  // This function creates data for the Line chart showing completion over time
  const generateCompletionData = (days = 7) => {
    const habits = getHabits();
    const FORCE_TEST_DATA = false; // Set to false to use real data
    
    // Generate dates for the past week or month
    const labels: string[] = [];
    const scheduled: number[] = [];
    const partialCompletions: number[] = [];
    const completions: number[] = [];
    
    // Generate dates for the selected timeframe (last 7 or 30 days)
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      labels.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      
      // Reset counters for this date
      let scheduledCount = 0;
      let partialCompletionCount = 0;
      let fullCompletionCount = 0;

      // Format date string to match the format used in habit histories
      const dateString = date.toISOString().split('T')[0];
      
      // Count scheduled, partially completed, and fully completed habits for this date
      habits.forEach(habit => {
        // Check if habit was scheduled for this day
        const isScheduledForDay = isHabitScheduledForDate(habit, date);
        
        if (isScheduledForDay) {
          scheduledCount++;
          
          // Check completion for this date
          const completionForDate = habit.completionHistory && habit.completionHistory[dateString];
          
          if (completionForDate !== undefined) {
            // If completions is >= target, it's fully completed
            if (completionForDate >= habit.dailyTarget) {
              fullCompletionCount++;
            } else if (completionForDate > 0) {
              // If some completions but less than target, it's partially completed
              partialCompletionCount++;
            }
          }
        }
      });
      
      // If we have no real data and testing is forced, generate sample data
      if (FORCE_TEST_DATA && habits.length === 0) {
        scheduled.push(Math.floor(Math.random() * 3) + 3); // 3-5 scheduled habits
        partialCompletions.push(Math.floor(Math.random() * 2) + 1); // 1-2 partial completions
        completions.push(Math.floor(Math.random() * 3)); // 0-2 full completions
      } else {
        scheduled.push(scheduledCount);
        partialCompletions.push(partialCompletionCount);
        completions.push(fullCompletionCount);
      }
    }
    
    // Calculate completion rates
    const completionRates = scheduled.map((scheduledCount, index) => 
      scheduledCount > 0 ? Math.round((completions[index] / scheduledCount) * 100) : 0
    );
    
    return { labels, scheduled, partialCompletions, completions, completionRates };
  };

  // Generate category data for doughnut chart
  const generateCategoryData = () => {
    const categories: Record<string, number> = {};
    const allHabits = getHabits();
    
    // Count habits by category
    allHabits.forEach(habit => {
      const category = habit.category || 'Uncategorized';
      if (!categories[category]) {
        categories[category] = 0;
      }
      categories[category]++;
    });
    
    // If no habits or categories, provide sample data
    if (Object.keys(categories).length === 0) {
      return {
        labels: ['Health', 'Productivity', 'Learning', 'Mindfulness'],
        values: [3, 2, 1, 1]
      };
    }
    
    // Transform into arrays for chart
    const labels = Object.keys(categories);
    const values = Object.values(categories);
    
    return { labels, values };
  };

  // Line chart data and options
  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 600,
          },
          color: colors.textSecondary,
        }
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
        titleFont: {
          size: 14,
          weight: "bold" as const,
        },
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += Math.round(context.parsed.y) + '%';
            }
            return label;
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        suggestedMax: 100,
        ticks: {
          font: {
            size: 12,
          },
          color: colors.textSecondary,
          callback: function(value: any) {
            return value + '%';
          }
        },
        grid: {
          color: colors.grid,
        },
        border: {
          color: darkMode ? '#475569' : '#e2e8f0',
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: colors.textSecondary,
        },
        grid: {
          display: false,
        },
        border: {
          color: darkMode ? '#475569' : '#e2e8f0',
        }
      },
    },
  };

  // Debug log to check completion data values
  console.log('DEBUG - Completion Data Values:', {
    labels: completionData.labels,
    scheduled: completionData.scheduled,
    completions: completionData.completions,
  });
  
  // Create a hybrid dataset - use actual data but ensure it's non-zero by providing fallback values
  const hybridCompletions = completionData.completions.map((value, index) => {
    // Force a minimum value of 0.1 to ensure bars are visible
    // For actual bars, ensure they don't exceed scheduled values
    const scheduledValue = completionData.scheduled[index] || 0;
    const actualValue = (value <= 0) ? 0.1 : value;
    return Math.min(actualValue, scheduledValue > 0 ? scheduledValue : actualValue);
  });
  
  // Bar chart data and options
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'x' as const,
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        stacked: false, // Ensure bars are not stacked
        ticks: {
          precision: 0,
          stepSize: 1,
          font: {
            size: 12,
            weight: 600,
          },
          color: darkMode ? '#f1f5f9' : '#1e293b',
        },
        grid: {
          color: darkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(226, 232, 240, 0.5)',
        }
      },
      x: {
        ticks: {
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          color: darkMode ? '#f1f5f9' : '#1e293b',
        },
        grid: {
          display: false,
        }
      },
    },
    plugins: {
      legend: {
        display: false // Properly disable the legend
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: colors.tooltipBg,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      },
    },
  };

  // Add this debug output below the chart
  const renderDebug = () => {
    // Only render in development mode and when enabled
    if (process.env.NODE_ENV === 'development' && false) { // Set to false to disable debug output
      return (
        <div className={`mt-4 p-4 border rounded text-xs font-mono overflow-x-auto ${
          darkMode ? 'bg-slate-800 text-gray-300 border-slate-700' : 'bg-gray-50 text-gray-800 border-gray-200'
        }`}>
          <h4 className="font-bold mb-2">Debug Data:</h4>
          <div>
            <p><strong>Chart Data:</strong></p>
            <pre>{JSON.stringify({
              labels: completionData.labels,
              scheduled: completionData.scheduled,
              partialCompletions: completionData.partialCompletions,
              completions: completionData.completions,
              rates: completionData.completionRates
            }, null, 2)}</pre>
          </div>
        </div>
      );
    }
    return null;
  };

  // Doughnut chart data and options
  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          font: {
            size: 12,
            weight: 500,
          },
          color: colors.textSecondary,
        },
      },
      tooltip: {
        backgroundColor: colors.tooltipBg,
        titleColor: colors.text,
        bodyColor: colors.text,
        borderColor: colors.tooltipBorder,
        borderWidth: 1,
        padding: 12,
        boxPadding: 6,
        cornerRadius: 8,
      },
    },
    cutout: '70%',
    animation: {
      animateScale: true,
      animateRotate: true
    }
  };

  // Create a refresh function that can be called directly to update all data
  // This ensures we always have fresh data in the charts
  // Helper function to generate a date range
  const generateDateRange = (start: Date, end: Date): Date[] => {
    return eachDayOfInterval({ start, end });
  };

  // Function to refresh all chart data based on the current timeframe
  const refreshAllChartData = () => {
    // Get fresh data
    const freshHabits = getHabits();
    setHabits(freshHabits);
    updateStats();
    
    // Re-generate chart data
    const days = timeframe === 'week' ? 7 : 30;
    const newCompletionData = generateCompletionData(days);
    
    // Update completion data
    setCompletionData({
      labels: newCompletionData.labels,
      completions: newCompletionData.completions,
      partialCompletions: newCompletionData.partialCompletions,
      scheduled: newCompletionData.scheduled,
      completionRates: newCompletionData.completionRates
    });
    
    // Update line chart data
    setLineChartData(prevData => ({
      labels: newCompletionData.labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: newCompletionData.completionRates
        }
      ]
    }));
    
    // Update bar chart data - make sure the order matches the state definition
    setBarChartData(prevData => ({
      labels: newCompletionData.labels,
      datasets: [
        {
          ...prevData.datasets[0], // Fully Completed (order 1)
          data: newCompletionData.completions
        },
        {
          ...prevData.datasets[1], // Partially Completed (order 2)
          data: newCompletionData.partialCompletions
        },
        {
          ...prevData.datasets[2], // Scheduled (order 3)
          data: newCompletionData.scheduled
        }
      ]
    }));
    
    // Update doughnut chart data
    const categoryData = generateCategoryData();
    setCategoryData(categoryData);
    setDoughnutChartData(prevData => ({
      labels: categoryData.labels,
      datasets: [
        {
          ...prevData.datasets[0],
          data: categoryData.values
        }
      ]
    }));
  };

  // Simple legend for chart - updated with brighter colors and enhanced contrast
  const renderLegend = () => (
    <div className="flex items-center justify-center space-x-4 mt-4 flex-wrap">
      <div className="flex items-center mx-2 my-1">
        <div className={`w-5 h-5 rounded mr-2 ${
          darkMode ? 'bg-[rgba(148,163,184,0.6)] shadow' : 'bg-[rgba(100,116,139,0.5)]'
        }`}></div>
        <span className={`text-sm ${darkMode ? 'text-white font-medium' : 'text-neutral-600'}`}>Scheduled</span>
      </div>
      <div className="flex items-center mx-2 my-1">
        <div className={`w-5 h-5 rounded mr-2 ${
          darkMode ? 'bg-[rgba(250,204,21,0.8)] border border-[rgba(250,204,21,1)]' : 'bg-[rgba(234,179,8,0.8)]'
        }`}></div>
        <span className={`text-sm ${darkMode ? 'text-white font-medium' : 'text-neutral-600'}`}>Partially Completed</span>
      </div>
      <div className="flex items-center mx-2 my-1">
        <div className={`w-5 h-5 rounded mr-2 ${darkMode ? 'bg-[#22c55e] shadow-md border border-[#34d399]' : 'bg-[#10b981]'}`}></div>
        <span className={`text-sm ${darkMode ? 'text-white font-bold' : 'text-neutral-600'}`}>Fully Completed</span>
      </div>
    </div>
  );

  // Get today's data for insight section
  useEffect(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const dayOfWeek = format(new Date(), 'EEEE').toLowerCase();
    
    // Get fresh data to ensure it's up to date
    getHabits(); // Just load habits without excessive logging
  }, []);

  // Helper function to check scheduled vs completed habits
  const getScheduledAndCompletedHabitsForDate = (date: Date, habits: Habit[]) => {
    const dateString = formatDate(date);
    const dayOfWeek = format(date, 'EEEE').toLowerCase();
    
    let scheduled = 0;
    let completed = 0;
    
    habits.forEach(habit => {
      // Check if scheduled based on frequency
      if (habit.frequency.includes(dayOfWeek)) {
        scheduled++;
        
        // Check if completed based on history
        if (habit.completionHistory && habit.completionHistory[dateString] > 0) {
          completed++;
        }
      }
    });
    
    return { scheduled, completed };
  };

  return (
    <div className={`pb-8 transition-colors duration-300 ${darkMode ? 'bg-gradient-to-b from-slate-900 to-gray-900 text-white' : 'bg-white text-neutral-800'}`}>
      {/* Page Header with Hero Image */}
      <div className={`relative overflow-hidden rounded-lg mb-8 ${darkMode ? 'bg-gradient-to-r from-slate-800 to-indigo-900/70' : 'bg-indigo-50'}`}>
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-30">
          <img 
            src={ILLUSTRATIONS.hero} 
            alt="Statistics hero" 
            className="object-cover h-full w-full"
          />
        </div>
        
        <div className="relative z-10 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-neutral-800'}`}>Statistics</h1>
              <p className={`${darkMode ? 'from-indigo-300 via-purple-300 to-emerald-300' : 'from-indigo-500 to-emerald-500'} bg-gradient-to-r bg-clip-text text-transparent font-medium text-lg`}>
                Track your progress over time
              </p>
            </motion.div>
            
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              {/* Timeframe Selector */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative inline-block"
              >
                <div className={`flex items-center space-x-2 p-1 rounded-lg ${darkMode ? 'bg-slate-800/80 border border-slate-700' : 'bg-neutral-100'}`}>
                  <button 
                    onClick={() => setTimeframe('week')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      timeframe === 'week' 
                        ? `${darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-indigo-500'} text-white shadow-md ${darkMode ? 'shadow-indigo-900/50' : 'shadow-indigo-800/30'}` 
                        : `${darkMode ? 'text-gray-200 hover:bg-slate-700' : 'text-neutral-600 hover:bg-neutral-200'}`
                    }`}
                  >
                    Week
                  </button>
                  <button 
                    onClick={() => setTimeframe('month')}
                    className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      timeframe === 'month' 
                        ? `${darkMode ? 'bg-gradient-to-r from-indigo-500 to-purple-500' : 'bg-indigo-500'} text-white shadow-md ${darkMode ? 'shadow-indigo-900/50' : 'shadow-indigo-800/30'}`
                        : `${darkMode ? 'text-gray-200 hover:bg-slate-700' : 'text-neutral-600 hover:bg-neutral-200'}`
                    }`}
                  >
                    Month
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        <div className={`card flex items-center border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800 to-indigo-900/30 border-indigo-900/50 hover:border-indigo-700 hover:shadow-lg hover:shadow-indigo-900/20' 
            : 'bg-gradient-to-br from-indigo-50 to-neutral-50 border-indigo-100 hover:shadow-indigo-100'
        } hover:shadow-md transition-all duration-300`}>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mr-4 shadow-sm ${
            darkMode ? 'bg-gradient-to-br from-indigo-900 to-indigo-800 shadow-inner shadow-black/20' : 'bg-indigo-100'
          }`}>
            <FaCalendarCheck className="text-2xl text-indigo-500" />
          </div>
          <div>
            <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-200' : 'text-neutral-700'}`}>Total Completions</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">{stats.totalCompletions}</p>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>across all habits</p>
          </div>
        </div>
        
        <div className={`card flex items-center border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800 to-emerald-900/30 border-emerald-900/50 hover:border-emerald-700 hover:shadow-lg hover:shadow-emerald-900/20' 
            : 'bg-gradient-to-br from-emerald-50 to-neutral-50 border-emerald-100 hover:shadow-emerald-100'
        } hover:shadow-md transition-all duration-300`}>
          <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mr-4 shadow-sm ${
            darkMode ? 'bg-gradient-to-br from-emerald-900 to-emerald-800 shadow-inner shadow-black/20' : 'bg-emerald-100'
          }`}>
            <FaChartLine className="text-2xl text-emerald-500" />
          </div>
          <div>
            <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-100' : 'text-neutral-700'}`}>Longest Streak</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">{stats.longestStreak} days</p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}>keep it up!</p>
          </div>
        </div>
        
        <div className={`card flex items-center border ${
          darkMode 
            ? 'bg-gradient-to-br from-slate-800 to-fuchsia-900/30 border-fuchsia-900/50 hover:border-fuchsia-700 hover:shadow-lg hover:shadow-fuchsia-900/20' 
            : 'bg-gradient-to-br from-fuchsia-50 to-neutral-50 border-fuchsia-100 hover:shadow-fuchsia-100'
        } hover:shadow-md transition-all duration-300`}>
          <div className={`relative w-16 h-16 rounded-full flex items-center justify-center mr-4 shadow-sm ${
            darkMode ? 'bg-gradient-to-br from-fuchsia-900 to-fuchsia-800 shadow-inner shadow-black/20' : 'bg-fuchsia-100'
          }`}>
            <FaTrophy className="text-2xl text-fuchsia-500" />
          </div>
          <div>
            <h3 className={`font-semibold mb-1 ${darkMode ? 'text-gray-100' : 'text-neutral-700'}`}>Achievements</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent">
              {achievements.filter(a => a.unlocked).length}/{achievements.length}
            </p>
            <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-neutral-500'}`}>unlocked so far</p>
          </div>
        </div>
      </motion.div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Completion Rate Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`card border shadow-sm hover:shadow-lg transition-shadow duration-300 ${
            darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-indigo-900/50' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`font-semibold mb-6 flex items-center ${
            darkMode ? 'text-gray-200' : 'text-neutral-700'
          }`}>
            <span className="w-2 h-8 bg-gradient-to-b from-indigo-400 to-indigo-600 rounded-r mr-3"></span>
            Completion Rate Over Time
          </h3>
          <div className="h-80">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </motion.div>
        
        {/* Habits Completed vs Scheduled */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className={`card border shadow-sm hover:shadow-lg transition-shadow duration-300 ${
            darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-emerald-900/50' : 'bg-white border-gray-200'
          }`}
        >
          <h3 className={`font-semibold mb-6 flex items-center ${
            darkMode ? 'text-gray-200' : 'text-neutral-700'
          }`}>
            <span className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-emerald-600 rounded-r mr-3"></span>
            Habits Completed vs Scheduled
          </h3>
          <div className="h-80">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
          
          {/* Legend and debug output */}
          {renderLegend()}
          {renderDebug()}
        </motion.div>
      </div>
      
      {/* Category Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`card mb-8 border shadow-sm hover:shadow-lg transition-shadow duration-300 ${
          darkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-fuchsia-900/50' : 'bg-white border-gray-200'
        }`}
      >
        <h3 className={`font-semibold mb-6 flex items-center ${
          darkMode ? 'text-gray-200' : 'text-neutral-700'
        }`}>
          <span className="w-2 h-8 bg-gradient-to-b from-fuchsia-400 to-fuchsia-600 rounded-r mr-3"></span>
          Habit Categories Distribution
        </h3>
        
        {/* Show empty state if no categories */}
        {categoryData.values.reduce((a, b) => a + b, 0) === 0 ? (
          <div className="flex flex-col items-center justify-center p-4 h-80">
            <img src={ILLUSTRATIONS.empty} alt="No data" className="w-40 mb-4 opacity-60" />
            <p className={`text-center ${darkMode ? 'text-gray-400' : 'text-neutral-500'}`}>
              No habit categories yet. Create some habits to see your distribution.
            </p>
          </div>
        ) : (
          <div className="h-80">
            <Doughnut data={doughnutChartData} options={doughnutChartOptions} />
          </div>
        )}
      </motion.div>
      
      {/* Tips Based on Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={`card border ${
          darkMode
            ? 'bg-gradient-to-br from-slate-800 via-indigo-900/20 to-slate-800 border-slate-700 shadow-lg'
            : 'bg-gradient-to-br from-indigo-50 via-neutral-50 to-emerald-50 border-neutral-200'
        }`}
      >
        <h3 className={`font-semibold mb-5 flex items-center ${
          darkMode ? 'text-gray-200' : 'text-neutral-700'
        }`}>
          <span className="w-2 h-8 bg-gradient-to-b from-gold-400 to-gold-600 rounded-r mr-3"></span>
          Smart Insights
        </h3>
        <ul className="space-y-4">
          {stats.weeklyCompletionRate < 50 && (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-amber-900/20 border-amber-800/50 text-amber-200'
                  : 'bg-amber-50 border-amber-100 text-neutral-600'
              }`}
            >
              <span className="text-amber-500 mr-2 text-lg">•</span>
              Your weekly completion rate is below 50%. Try focusing on fewer habits to build momentum.
            </motion.li>
          )}
          
          {stats.weeklyCompletionRate >= 80 && (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className={`flex p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-green-900/20 border-green-800/50 text-green-200'
                  : 'bg-green-50 border-green-100 text-neutral-600'
              }`}
            >
              <span className="text-green-500 mr-2 text-lg">•</span>
              Great job! Your completion rate is excellent. Consider adding a new challenging habit.
            </motion.li>
          )}
          
          {habits.length === 0 && (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`flex p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-800/50 text-blue-200'
                  : 'bg-blue-50 border-blue-100 text-neutral-600'
              }`}
            >
              <span className="text-blue-500 mr-2 text-lg">•</span>
              You haven't created any habits yet. Start small with one daily habit.
            </motion.li>
          )}
          
          {habits.length > 0 && habits.length < 3 && (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className={`flex p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-blue-900/20 border-blue-800/50 text-blue-200'
                  : 'bg-blue-50 border-blue-100 text-neutral-600'
              }`}
            >
              <span className="text-blue-500 mr-2 text-lg">•</span>
              You have a few habits. This is a good foundation to build upon.
            </motion.li>
          )}
          
          {habits.length > 7 && (
            <motion.li 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className={`flex p-3 rounded-lg border ${
                darkMode 
                  ? 'bg-amber-900/20 border-amber-800/50 text-amber-200'
                  : 'bg-amber-50 border-amber-100 text-neutral-600'
              }`}
            >
              <span className="text-amber-500 mr-2 text-lg">•</span>
              You have many habits. Consider focusing on the most important ones.
            </motion.li>
          )}
          
          <motion.li 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className={`flex p-3 rounded-lg border ${
              darkMode 
                ? 'bg-purple-900/20 border-purple-800/50 text-purple-200'
                : 'bg-purple-50 border-purple-100 text-neutral-600'
            }`}
          >
            <span className="text-purple-500 mr-2 text-lg">•</span>
            Consistency is key. Try to complete your habits at the same time each day.
          </motion.li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Stats; 