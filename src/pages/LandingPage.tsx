import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaTrophy, FaMoon, FaSun, FaGithub, FaFire, FaBrain, FaRunning, FaBook, FaWater, FaRocket, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import { useTheme } from '../contexts/ThemeContext';

// Hero images
const IMAGES = {
  hero: 'https://img.freepik.com/free-vector/goal-achievement-concept-illustration_114360-5401.jpg',
  stats: 'https://img.freepik.com/free-vector/data-inform-illustration-concept_114360-864.jpg',
  calendar: 'https://img.freepik.com/free-vector/appointment-booking-design_23-2148576525.jpg',
  achievement: 'https://img.freepik.com/free-vector/certification-concept-illustration_114360-340.jpg',
  habit: 'https://img.freepik.com/free-vector/time-management-concept-illustration_114360-1013.jpg',
  mockup: 'https://img.freepik.com/free-vector/gradient-ui-ux-background_23-2149052117.jpg',
  darkMode: 'https://img.freepik.com/free-vector/dark-mode-concept-illustration_114360-4493.jpg',
};

// Sample app screenshots
const SCREENSHOTS = [
  '/screenshots/dashboard.png',
  '/screenshots/stats.png',
  '/screenshots/calendar.png',
  '/screenshots/achievements.png',
];

// Interactive habit data
const HABIT_EXAMPLES = [
  { icon: <FaRunning />, name: "Running", color: "from-blue-400 to-cyan-400", days: [1, 3, 5, 8, 10, 12, 15, 17, 19, 22, 24, 26, 29] },
  { icon: <FaBook />, name: "Reading", color: "from-amber-400 to-orange-400", days: [2, 4, 7, 9, 11, 14, 16, 18, 21, 23, 25, 28, 30] },
  { icon: <FaWater />, name: "Hydration", color: "from-emerald-400 to-teal-400", days: [1, 2, 3, 4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 19, 22, 23, 24, 25, 26, 29, 30] },
  { icon: <FaBrain />, name: "Meditation", color: "from-purple-400 to-violet-400", days: [1, 5, 6, 10, 15, 20, 21, 25, 26, 30] },
];

// Add type interfaces for components
interface HabitMatrixProps {
  darkMode: boolean;
}

interface ScrollingHabitJourneyProps {
  darkMode: boolean;
}

interface HabitSimulatorProps {
  darkMode: boolean;
}

// Add GradientText component
const GradientText: React.FC<{ text: string }> = ({ text }) => (
  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
    {text}
  </span>
);

// Add the missing ScrollingHabitJourney component before the LandingPage component
const ScrollingHabitJourney: React.FC<ScrollingHabitJourneyProps> = ({ darkMode }) => {
  const [currentDay, setCurrentDay] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [completedHabits, setCompletedHabits] = useState<number[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  // Animation controls for each habit day
  const controls = useAnimation();
  
  // Use scroll position to control animation
  useEffect(() => {
    scrollYProgress.onChange(value => {
      // Map scroll progress to days (1-30)
      const newDay = Math.min(30, Math.floor(value * 40));
      if (newDay !== currentDay) {
        setCurrentDay(newDay);
        
        // Simulate habit completion based on day
        if (newDay > 0 && !completedHabits.includes(newDay)) {
          // 70% chance to complete the habit
          if (Math.random() < 0.7) {
            setCompletedHabits(prev => [...prev, newDay]);
            setStreakCount(prev => prev + 1);
            
            // Animate the day being completed
            controls.start({
              scale: [1, 1.2, 1],
              transition: { duration: 0.3 }
            });
          } else {
            // Break the streak
            setStreakCount(0);
          }
        }
      }
    });
  }, [scrollYProgress, currentDay, completedHabits, controls]);
  
  // Text colors based on theme
  const textColor = darkMode ? 'text-white' : 'text-slate-800';
  const subtextColor = darkMode ? 'text-gray-300' : 'text-slate-500';
  
  // Define a function to generate sparkles with random positions
  const HabitSparkles = () => (
    <>
      {Array.from({ length: 5 }).map((_, index) => {
        const topPosition = Math.random() * 100;
        const leftPosition = Math.random() * 100;
        const size = 5 + Math.random() * 10;
        const delay = Math.random() * 2;
        const duration = 1 + Math.random() * 2;
        
        return (
          <motion.div
            key={index}
            className={`absolute w-${Math.round(size)} h-${Math.round(size)} rounded-full ${darkMode ? 'bg-indigo-400' : 'bg-[#FF9D76]'} opacity-70`}
            style={{ top: `${topPosition}%`, left: `${leftPosition}%` }}
            animate={{
              scale: [0, 1, 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: duration,
              delay: delay,
              ease: "easeInOut"
            }}
          />
        );
      })}
    </>
  );
  
  return (
    <div ref={containerRef} className="min-h-[150vh] relative">
      <div className="sticky top-32 py-12">
        <div className="text-center mb-16">
          <div className={`inline-block px-4 py-1.5 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'} text-sm font-medium mb-4`}>
            Visualize Your Growth
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-6`}>
            Your Habit Journey
          </h2>
          <p className={`max-w-2xl mx-auto text-lg ${subtextColor}`}>
            Watch how small daily actions compound over time into remarkable results
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto relative overflow-hidden">
          {/* Habit Visualization */}
          <div className="bg-gradient-to-b from-transparent via-transparent to-transparent relative rounded-xl p-8">
            {/* Current Day Indicator */}
            <div className="mb-12 flex justify-between items-center">
              <div className={`text-lg font-medium ${textColor}`}>
                Day <span className="text-3xl font-bold">{currentDay}</span> of 30
              </div>
              <div className={`px-4 py-2 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`}>
                Streak: {streakCount} days
              </div>
            </div>
            
            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-3 mb-12">
              {Array.from({ length: 30 }).map((_, index) => {
                const day = index + 1;
                const isCompleted = completedHabits.includes(day);
                const isCurrentDay = day === currentDay;
                
                return (
                  <motion.div
                    key={day}
                    animate={isCurrentDay ? controls : {}}
                    className={`relative aspect-square rounded-lg flex items-center justify-center text-sm sm:text-base font-medium transition-all ${
                      isCompleted
                        ? darkMode 
                          ? 'bg-indigo-900/50 border border-indigo-700 text-indigo-300' 
                          : 'bg-[#FFF0E8] border border-[#FFBEA7] text-[#FF9D76]'
                        : darkMode
                          ? 'bg-gray-800 border border-gray-700 text-gray-400'
                          : 'bg-slate-50 border border-slate-200/60 text-slate-400'
                    } ${
                      isCurrentDay 
                        ? 'ring-2 ring-offset-2 ' + (darkMode ? 'ring-indigo-500' : 'ring-[#FF9D76]')
                        : ''
                    }`}
                  >
                    {day}
                    {isCompleted && (
                      <div className="absolute -top-1 -right-1">
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                            darkMode ? 'bg-indigo-500 text-white' : 'bg-[#FF9D76] text-white'
                          }`}
                        >
                          ✓
                        </motion.div>
                      </div>
                    )}
                    {isCurrentDay && <HabitSparkles />}
                  </motion.div>
                );
              })}
            </div>
            
            {/* Growth Visualization */}
            <div className="h-64 relative mb-8">
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-200/50 dark:bg-gray-700/50"></div>
              
              {/* Progress Bars */}
              <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-full px-3">
                {Array.from({ length: 30 }).map((_, index) => {
                  const day = index + 1;
                  // Calculate height based on completed habits and current day
                  const baseHeight = 10; // Minimum height
                  const completedBonus = completedHabits.includes(day) ? 40 : 0;
                  const streakBonus = (completedHabits.includes(day) ? streakCount : 0) * 2;
                  const pastDayBonus = day <= currentDay ? 30 : 0;
                  
                  // Combine all factors for total height (as a percentage)
                  let totalHeight = Math.min(100, baseHeight + completedBonus + streakBonus + pastDayBonus);
                  
                  // If day is beyond current day, show minimal bar
                  if (day > currentDay) {
                    totalHeight = baseHeight;
                  }
                  
                  return (
                    <motion.div
                      key={day}
                      initial={{ height: 0 }}
                      animate={{ height: `${totalHeight}%` }}
                      transition={{ 
                        duration: 0.5, 
                        delay: day > currentDay ? 0 : 0.1,
                        ease: "easeOut"
                      }}
                      className={`w-[2%] min-w-[8px] rounded-t-sm ${
                        completedHabits.includes(day)
                          ? darkMode 
                            ? 'bg-gradient-to-t from-indigo-600 to-indigo-400' 
                            : 'bg-gradient-to-t from-[#FF9D76] to-[#FFBEA7]'
                          : darkMode
                            ? 'bg-gray-700'
                            : 'bg-slate-300/70'
                      }`}
                    >
                      {day === currentDay && (
                        <motion.div
                          className="absolute -top-5 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                          }}
                        >
                          <div className={`px-2 py-1 rounded-md text-xs ${
                            darkMode 
                              ? 'bg-indigo-900/90 text-indigo-300' 
                              : 'bg-[#FFF0E8] text-[#FF9D76]'
                          }`}>
                            You are here
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Growth Indicator */}
              {currentDay > 5 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute top-5 left-0 right-0 flex justify-center"
                >
                  <div className={`px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-800 text-indigo-300' : 'bg-white text-[#FF9D76]'
                  } shadow-lg`}>
                    <div className="font-bold text-xl">+{Math.floor(completedHabits.length * 3.5)}% Growth</div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      Based on your habit consistency
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
            
            {/* Scroll Indicator */}
            <div className="text-center">
              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                }}
                className={`inline-flex items-center ${subtextColor}`}
              >
                <span className="mr-2 text-sm">Scroll to continue your journey</span>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M19 9L12 16L5 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Refined theme-aware variables inspired by the Dribbble design
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-[#f5f5fa]'; // Light lavender background
  const textColor = darkMode ? 'text-white' : 'text-slate-800';
  const subtextColor = darkMode ? 'text-gray-300' : 'text-slate-500';
  const borderColor = darkMode ? 'border-gray-700' : 'border-slate-200/60';
  const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBorderColor = darkMode ? 'border-gray-700' : 'border-slate-200/60';
  const inputTextColor = darkMode ? 'text-white' : 'text-slate-900';
  const buttonHoverColor = darkMode ? 'hover:bg-indigo-600' : 'hover:bg-indigo-700';
  const themeToggleHoverColor = darkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100';
  const navBgColor = darkMode ? 'bg-gray-900/90 backdrop-blur-md border-b border-gray-800' : 'bg-white/90 backdrop-blur-md shadow-sm';
  const navIconBgColor = darkMode ? 'bg-indigo-900' : 'bg-indigo-100';
  const navTextColor = darkMode ? 'text-white' : 'text-slate-700';
  const heroSubtextColor = darkMode ? 'text-gray-200' : 'text-slate-500';
  const accentColor = darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'; // Peachy accent color from image
  const featureCardBg = darkMode ? 'bg-gray-800/50' : 'bg-white';
  const featureCardHoverBg = darkMode ? 'hover:bg-gray-800/80' : 'hover:shadow-lg hover:translate-y-[-4px]';
  const featureCardIconBg = darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'; // Light peach from image
  const featureCardDescColor = darkMode ? 'text-gray-300' : 'text-slate-500';
  const featureIconColor = darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'; // Peachy accent
  const calendarDayBgColor = darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-slate-50/80 border border-slate-100/90'; // Softer calendar days
  const calendarHeaderColor = darkMode ? 'text-gray-400' : 'text-slate-500';
  const progressBgColor = darkMode ? 'bg-gray-700' : 'bg-slate-200/90'; // Softer progress bar bg
  const interactiveBadgeBg = darkMode ? 'bg-indigo-900/30 border border-indigo-800/50' : 'bg-indigo-50/80 border border-indigo-100/90'; // Softer badge bg
  const interactiveBadgeTextColor = darkMode ? 'text-gray-400' : 'text-slate-600';
  const sectionBgColor = darkMode ? 'bg-gray-800/30' : 'bg-white';
  const showcaseFrameBg = darkMode ? 'bg-gray-800' : 'bg-slate-100/90'; // Slightly softer frame
  const showcaseHeaderBg = darkMode ? 'bg-gray-900' : 'bg-slate-200/80';
  const showcaseCardBg = darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow-sm border border-slate-100/80'; // Add subtle border/shadow
  const showcaseCardHeaderBg = darkMode ? 'border-gray-700 text-gray-300' : 'border-slate-200/80 text-slate-500';
  const matrixContainerBg = darkMode ? 'bg-gray-900/40 rounded-xl p-6' : 'bg-slate-50/30 rounded-xl p-6'; // Add subtle bg for light mode
  const matrixControlButtonBg = darkMode ? 'bg-gray-800 text-gray-200 shadow-glow-gray' : 'bg-slate-200 text-slate-700';
  const matrixControlActiveBg = darkMode ? 'bg-indigo-800 text-indigo-100 shadow-glow-indigo' : 'bg-indigo-100 text-indigo-700';
  const matrixControlTextColor = darkMode ? 'text-gray-300' : 'text-slate-500';
  const matrixLineColor = darkMode ? 'bg-indigo-600/40' : 'bg-slate-300/80'; // Softer line
  const matrixLineOpacity = darkMode ? 0.5 : 0.4;
  const matrixHoverNodeBg = darkMode ? 'bg-gray-800 border border-gray-700 text-white' : 'bg-white border border-slate-200/90 text-slate-800';
  const matrixHoverNodeDescColor = darkMode ? 'text-gray-300' : 'text-slate-600';
  const simulatorSectionBg = darkMode ? 'bg-gray-800/30' : 'bg-gradient-to-br from-indigo-50/60 via-purple-50/40 to-white'; // Softer gradient
  const simulatorContainerBg = darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-slate-200/90';
  const simulatorHeaderBorder = darkMode ? 'border-gray-800' : 'border-slate-200/90';
  const simulatorParamLabelColor = darkMode ? 'text-gray-300' : 'text-slate-700';
  const simulatorParamValueColor = darkMode ? 'text-gray-400' : 'text-slate-500';
  const simulatorRangeBg = darkMode ? 'bg-gray-700' : 'bg-slate-200/90';
  const simulatorRangeAccent = darkMode ? '#818cf8' : '#6366f1';
  const simulatorRangeDifficultyAccent = darkMode ? '#f87171' : '#ef4444';
  const simulatorDescColor = darkMode ? 'text-gray-500' : 'text-slate-500';
  const simulatorButtonDisabledBg = darkMode ? 'bg-gray-800 text-gray-500' : 'bg-slate-200 text-slate-400';
  const simulatorResetButtonBg = darkMode ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' : 'bg-slate-200 hover:bg-slate-300 text-slate-700';
  const simulatorProgressTextColor = darkMode ? 'text-gray-400' : 'text-slate-600';
  const simulatorStatsCardBg = darkMode ? 'bg-gray-800' : 'bg-slate-50/90'; // Slightly softer
  const simulatorStatsLabelColor = darkMode ? 'text-gray-400' : 'text-slate-500';
  const simulatorStatsValueColor = darkMode ? 'text-gray-500' : 'text-slate-600';
  const simulatorTimelineBg = darkMode ? 'bg-gray-800' : 'bg-slate-50/90';
  const simulatorTimelineHeaderBorder = darkMode ? 'border-gray-700' : 'border-slate-200/90';
  const simulatorTimelineDayColor = darkMode ? 'text-gray-500' : 'text-slate-600';
  const simulatorGridLineColor = darkMode ? 'bg-gray-700' : 'bg-slate-300/70'; // Softer grid
  const simulatorGridLabelColor = darkMode ? 'text-gray-500' : 'text-slate-500';
  const simulatorStrengthGradientStart = darkMode ? '#818cf8' : '#6366f1';
  const simulatorStrengthGradientEnd = darkMode ? '#d946ef' : '#c026d3';
  const simulatorInsightsBg = darkMode ? 'border-gray-800 bg-indigo-900/10' : 'border-slate-200/90 bg-indigo-50/70'; // Softer insight bg
  const simulatorInsightsTextColor = darkMode ? 'text-gray-300' : 'text-slate-700';
  const simulatorInsightCardBg = darkMode ? 'bg-gray-800' : 'bg-white/80';
  const simulatorInsightDescColor = darkMode ? 'text-gray-400' : 'text-slate-600';
  const simulatorDemoButtonGradient = darkMode ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600';
  const simulatorNoteColor = darkMode ? 'text-green-400' : 'text-green-600';
  const ctaSectionBg = darkMode ? 'bg-gray-900' : 'bg-indigo-50/80'; // Softer CTA bg
  const ctaGradientBg = darkMode ? 'bg-gradient-to-r from-gray-900 to-indigo-900/80' : 'bg-gradient-to-r from-indigo-500 to-purple-600';
  const ctaDemoButtonBg = darkMode ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-white text-indigo-600 hover:bg-slate-50';
  const ctaMockupBg = darkMode ? 'bg-gray-900' : 'bg-white';
  const newsletterSectionBg = darkMode ? 'bg-gray-800' : 'bg-slate-50/90'; // Softer newsletter bg
  const footerBg = darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-100/80'; // Subtle border
  const modalBg = darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white';
  const modalCloseButtonHover = darkMode ? 'hover:bg-gray-800 text-gray-400' : 'hover:bg-slate-100 text-slate-500';
  const modalLabelColor = darkMode ? 'text-gray-300' : 'text-slate-700';
  const modalInputBg = darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-slate-100 border-slate-200/90 text-slate-900'; // Adjust input bg
  const modalSubtextColor = darkMode ? 'text-gray-400' : 'text-slate-500';
  
  const handleDemo = () => {
    setShowLoginModal(true);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Demo login handler
  const handleDemoLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Set a flag in localStorage to indicate the user has logged in
    localStorage.setItem('streakquest_demo_login', 'true');
    // Add success note
    localStorage.setItem('demo_status', 'working');
    // Close the modal
    setShowLoginModal(false);
    // Use path with PUBLIC_URL if available for deployments
    const basePath = process.env.PUBLIC_URL || '';
    window.location.replace(`${basePath}/app/dashboard`);
  };

  // Define the features array to fix the map error
  const features = [
    {
      title: "Habit Analytics",
      description: "Visualize your progress with detailed analytics and charts that show your habit streaks and patterns.",
      icon: "📊"
    },
    {
      title: "Calendar View",
      description: "Track your habits with our interactive calendar - see your streaks grow day by day.",
      icon: "📅"
    },
    {
      title: "Achievements",
      description: "Unlock achievements as you build consistent habits and reach your goals.",
      icon: "🏆"
    },
    {
      title: "Dark Mode",
      description: "Comfortable usage any time of day with our thoughtfully designed dark mode.",
      icon: "🌙"
    }
  ];
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${bgColor} ${textColor}`}>
      {/* Navbar - Simplified with bakery-inspired design */}
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${navBgColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-900' : 'bg-[#FFF0E8]'}`}>
                <svg className={`w-8 h-8 ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                </div>
              <span className={`ml-2 text-xl font-bold ${textColor}`}>StreakQuest</span>
              </div>
            <div className="flex items-center space-x-4">
              <button 
                className={`p-2 rounded-full transition-colors ${themeToggleHoverColor}`}
                onClick={toggleDarkMode}
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
              <button 
                onClick={() => setShowLoginModal(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white hover:bg-slate-100 text-slate-700'}`}
              >
                Log in
              </button>
              <Link
                to="/signup"
                className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'}`}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Inspired by the Dribbble design */}
      <section className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-indigo-100/40 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-32 h-32 rounded-full bg-indigo-100/20 blur-2xl"></div>
        
        <div className="max-w-7xl mx-auto relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left side text content */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <div className={`inline-block px-4 py-1.5 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'} text-sm font-medium mb-2`}>
                Transform Your Habits
              </div>
              
              <motion.div variants={fadeInUp} className="space-y-3">
                <h1 className={`text-5xl md:text-6xl font-bold leading-tight tracking-tight ${textColor}`}>
                  Nothing Can Stop 
                </h1>
                <h1 className={`text-5xl md:text-6xl font-bold leading-tight tracking-tight ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`}>
                  A Good Habit
                </h1>
              </motion.div>
              
              <motion.p 
                variants={fadeInUp}
                className={`text-lg ${heroSubtextColor} max-w-lg leading-relaxed`}
              >
                StreakQuest turns habit-building into an engaging journey with visual tracking, analytics, and achievement rewards.
              </motion.p>
              
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-2"
              >
                {/* Primary "Try Demo" Button */}
                <button 
                  onClick={handleDemo}
                  className={`px-8 py-3.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'} text-white`}
                  data-demo-button="true"
                >
                  Try Demo
                </button>
                
                {/* Video Button - inspired by the Dribbble design */}
                <button className={`px-8 py-3.5 rounded-lg font-medium flex items-center justify-center space-x-3 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-slate-700'} shadow-sm hover:shadow transition-all`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${darkMode ? 'bg-gray-700' : 'bg-[#FFF0E8]'}`}>
                    <svg className={`w-4 h-4 ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'}`} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                  <span>Intro Video</span>
                </button>
              </motion.div>
            </motion.div>
            
            {/* Right side visual - Round blob with app mockup */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Peachy blob background */}
              <div className="absolute inset-0 translate-x-8 translate-y-8 rounded-full bg-[#FFDBCB] opacity-80"></div>
              
              {/* App mockup container */}
              <div className={`relative z-10 bg-white rounded-3xl overflow-hidden shadow-xl p-4 border ${borderColor}`}>
                <div className="rounded-2xl overflow-hidden">
                  {/* Calendar Grid */}
                  <div className="bg-white p-6">
                    <h3 className={`text-xl font-semibold mb-5 text-slate-800`}>Daily Habits</h3>
                    
                    <div className="grid grid-cols-7 gap-2 mb-6">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={`header-${i}`} className="text-center text-xs font-medium text-slate-400">{day}</div>
                      ))}
                      {Array.from({ length: 35 }).map((_, i) => {
                        const isActive = [3, 4, 5, 10, 11, 12, 17, 18, 19, 24, 25, 26].includes(i);
                        return (
                      <motion.div
                        key={`day-${i}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.01, duration: 0.3 }}
                            className={`aspect-square rounded-lg flex items-center justify-center text-xs 
                              ${i < 30 
                                ? isActive 
                                  ? 'bg-[#FFDBCB] border border-[#FFBEA7] text-[#FF9D76] font-medium' 
                                  : 'bg-slate-50 border border-slate-100 text-slate-600' 
                                : 'opacity-0'}`}
                      >
                        {i < 30 ? i + 1 : ''}
                      </motion.div>
                        );
                      })}
                  </div>
                  
                    {/* Habit List */}
                    <div className="space-y-5">
                      {HABIT_EXAMPLES.slice(0, 3).map((habit, index) => (
                      <div key={`habit-${index}`} className="relative">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`w-10 h-10 rounded-xl mr-3 ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'} flex items-center justify-center`}>
                            {habit.icon}
                          </div>
                              <div>
                                <h4 className="font-medium text-slate-800">{habit.name}</h4>
                                <div className="text-xs text-slate-400">{habit.days.length} day streak</div>
                          </div>
                        </div>
                            <div className="text-sm font-medium text-[#FF9D76]">+{habit.days.length}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                      </div>
                      </div>
                    </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 z-20">
                <div className="absolute -right-4 -top-12 w-24 h-24 opacity-80">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-[#FF9D76]/20">
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                    </div>
                <div className="absolute -right-8 top-12 w-16 h-16 opacity-60">
                  <svg viewBox="0 0 100 100" className="w-full h-full fill-indigo-200">
                    <circle cx="50" cy="50" r="50" />
                  </svg>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Habit Journey Section - original implementation with updated styles */}
      <section className="py-28 overflow-hidden"> {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollingHabitJourney darkMode={darkMode} />
        </div>
      </section>

      {/* Features Section - Updated with bakery-inspired aesthetic */}
      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${bgColor}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1.5 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'} text-sm font-medium mb-4`}>
              Why Choose StreakQuest?
            </div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`text-3xl md:text-4xl font-bold ${textColor} mb-6`}
            >
              Features that transform habits
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`max-w-2xl mx-auto text-lg ${heroSubtextColor}`}
            >
              Our unique approach helps you build lasting habits with visual feedback and rewarding experiences
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`${cardBgColor} rounded-xl overflow-hidden shadow-sm border ${borderColor} transition-all duration-300 hover:shadow-lg hover:translate-y-[-4px]`}
              >
                <div className="p-8">
                  <div className={`w-16 h-16 rounded-xl mb-6 ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} flex items-center justify-center`}>
                    <span className={`text-2xl ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'}`}>{feature.icon}</span>
                </div>
                  <h3 className={`text-xl font-bold mb-3 ${textColor}`}>{feature.title}</h3>
                  <p className={`${subtextColor}`}>{feature.description}</p>
                </div>
                <div className="p-6 border-t border-slate-100">
                  <button className={`text-sm font-medium ${darkMode ? 'text-indigo-400' : 'text-[#FF9D76]'} flex items-center`}>
                    Learn more
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-28"> {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Discover StreakQuest</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Beautiful, intuitive, and designed to help you succeed
            </motion.p>
          </div>

          {/* App Screenshots with Macbook Frame */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative mx-auto max-w-5xl"
          >
            <div className={`relative rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} p-4 md:p-8 shadow-2xl`}>
              <div className={`absolute top-0 left-0 right-0 h-6 ${darkMode ? 'bg-gray-900' : 'bg-gray-200'} rounded-t-2xl flex items-center pl-4 space-x-2`}>
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} text-xs font-medium`}>Dashboard</div>
                  <img src={IMAGES.habit} alt="Dashboard" className="w-full h-auto" />
                </div>
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} text-xs font-medium`}>Statistics</div>
                  <img src={IMAGES.stats} alt="Stats" className="w-full h-auto" />
                </div>
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} text-xs font-medium`}>Calendar</div>
                  <img src={IMAGES.calendar} alt="Calendar" className="w-full h-auto" />
                </div>
                <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-900 border border-gray-700' : 'bg-white shadow'}`}>
                  <div className={`p-3 border-b ${darkMode ? 'border-gray-700 text-gray-300' : 'border-gray-200 text-gray-500'} text-xs font-medium`}>Achievements</div>
                  <img src={IMAGES.achievement} alt="Achievements" className="w-full h-auto" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-5 w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute -top-5 -left-5 w-32 h-32 bg-gradient-to-br from-pink-500 to-red-500 rounded-full opacity-20 blur-3xl"></div>
          </motion.div>
        </div>
      </section>

      {/* Matrix Section - Updated with bakery-inspired aesthetic */}
      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${bgColor}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1.5 rounded-full ${featureCardIconBg} ${accentColor} text-sm font-medium mb-4`}>
              Visualize Connections
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold ${textColor} mb-6`}>Habit Matrix</h2>
            <p className={`max-w-2xl mx-auto text-lg ${heroSubtextColor}`}>
              Discover how your habits interconnect and influence each other for maximum effectiveness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Matrix Visualization */}
            <div className={`rounded-2xl overflow-hidden shadow-lg border ${borderColor} ${cardBgColor} p-6`}>
              <div className="aspect-square relative">
                {/* Nodes */}
                {[
                  { id: 1, x: 50, y: 50, label: 'Morning Routine' },
                  { id: 2, x: 20, y: 30, label: 'Exercise' },
                  { id: 3, x: 80, y: 30, label: 'Meditation' },
                  { id: 4, x: 20, y: 70, label: 'Reading' },
                  { id: 5, x: 80, y: 70, label: 'Journaling' },
                ].map((node, index) => (
                  <div 
                    key={index}
                    className={`absolute w-16 h-16 rounded-full ${featureCardIconBg} ${accentColor} flex items-center justify-center shadow-lg transform -translate-x-1/2 -translate-y-1/2 border-2 border-white cursor-pointer hover:scale-110 transition-transform duration-300`}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                  >
                    <span className="text-xs font-medium text-center px-1">{node.label}</span>
          </div>
                ))}
                
                {/* Connection Lines - SVG */}
                <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
                  <line x1="50%" y1="50%" x2="20%" y2="30%" stroke={darkMode ? "#FF9D76" : "#FF9D76"} strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="80%" y2="30%" stroke={darkMode ? "#FF9D76" : "#FF9D76"} strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="20%" y2="70%" stroke={darkMode ? "#FF9D76" : "#FF9D76"} strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="50%" y1="50%" x2="80%" y2="70%" stroke={darkMode ? "#FF9D76" : "#FF9D76"} strokeWidth="2" strokeDasharray="5,5" />
                  <line x1="20%" y1="30%" x2="20%" y2="70%" stroke={darkMode ? "#4F46E5" : "#8B5CF6"} strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                  <line x1="80%" y1="30%" x2="80%" y2="70%" stroke={darkMode ? "#4F46E5" : "#8B5CF6"} strokeWidth="2" strokeDasharray="5,5" opacity="0.5" />
                </svg>
                
                {/* Center Node */}
                <div className="absolute left-1/2 top-1/2 w-24 h-24 rounded-full bg-[#FF9D76] text-white flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 shadow-lg border-4 border-white">
                  <span className="text-sm font-bold text-center">Habit Core</span>
                </div>
              </div>
            </div>
            
            {/* Matrix Text Content */}
            <div className="space-y-6">
              <h3 className={`text-2xl font-bold ${textColor}`}>Understand Your Habit Ecosystem</h3>
              <p className={`${heroSubtextColor}`}>
                Our Habit Matrix shows you how habits relate to each other, helping you identify keystone habits 
                that can trigger positive chain reactions in your daily routine.
              </p>
              
              <div className="space-y-5 mt-8">
                {[
                  { title: 'Keystone Habits', description: 'Identify the core habits that trigger cascading positive effects throughout your day.' },
                  { title: 'Habit Stacking', description: 'Link new habits to established ones to make them stick more effectively.' },
                  { title: 'Friction Analysis', description: 'See which habits might be conflicting with each other and resolve the tension.' },
                ].map((feature, index) => (
                  <div key={index} className="flex">
                    <div className={`w-12 h-12 rounded-xl mr-4 ${featureCardIconBg} ${accentColor} flex items-center justify-center shrink-0`}>
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                          stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <h4 className={`text-lg font-medium ${textColor}`}>{feature.title}</h4>
                      <p className={`${featureCardDescColor} mt-1`}>{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className={`mt-6 px-6 py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'} text-white`}>
                Explore Your Matrix
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Habit Formation Simulation - original with visual updates */}
      <section className={`py-28 ${simulatorSectionBg}`}> {/* Increased padding */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className={`inline-block px-4 py-1.5 rounded-full ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'} text-sm font-medium mb-4`}>
              Plan For Success
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textColor}`}>
                Build Your Own Habit System
            </h2>
            <p className={`max-w-2xl mx-auto text-lg ${subtextColor}`}>
              Experiment with the key factors that make or break habit formation
            </p>
          </div>
          
          <HabitSimulator darkMode={darkMode} />
        </div>
      </section>

      {/* CTA Section - Updated with bakery-inspired aesthetic */}
      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${bgColor}`}>
        <div className="max-w-5xl mx-auto">
          <div className={`rounded-3xl overflow-hidden shadow-xl border ${borderColor} ${darkMode ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-[#FFF0E8] to-[#FFDBCB]'}`}>
            <div className="p-12 relative">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#FF9D76]/10 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#FF9D76]/10 blur-2xl"></div>
              
              <div className="relative text-center">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                  className={`text-3xl md:text-4xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-slate-800'}`}
              >
                  Ready to transform your habits?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                  className={`text-lg max-w-2xl mx-auto mb-10 ${darkMode ? 'text-gray-300' : 'text-slate-600'}`}
              >
                  Join thousands of users who are building better habits and achieving their goals with StreakQuest's proven system.
              </motion.p>
                
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <button 
                  onClick={handleDemo}
                    className={`px-8 py-3.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'} text-white`}
                  data-demo-button="true"
                >
                  Try Demo
                </button>
                  <Link
                    to="/signup"
                    className={`px-8 py-3.5 rounded-lg font-medium flex items-center justify-center ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-slate-800 hover:bg-slate-50'} shadow-sm transition-all hover:shadow`}
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none">
                      <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Sign Up
                  </Link>
              </motion.div>
                
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="mt-12 flex flex-wrap justify-center gap-8"
                >
                  {[
                    { count: '10k+', label: 'Active Users' },
                    { count: '50M+', label: 'Habits Tracked' },
                    { count: '4.9/5', label: 'Average Rating' },
                  ].map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className={`text-3xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-[#FF9D76]'}`}>{stat.count}</div>
                      <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>{stat.label}</div>
                    </div>
                  ))}
          </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter Section - Updated with bakery-inspired aesthetic */}
      <section className={`py-24 px-4 sm:px-6 lg:px-8 ${darkMode ? 'bg-gray-900/50' : 'bg-[#f5f5fa]'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Newsletter Text */}
            <div className="space-y-6">
              <div className={`inline-block px-4 py-1.5 rounded-full ${featureCardIconBg} ${accentColor} text-sm font-medium mb-2`}>
                Stay Updated
          </div>
              <h2 className={`text-3xl md:text-4xl font-bold ${textColor}`}>Subscribe to our newsletter</h2>
              <p className={`${heroSubtextColor} text-lg`}>
                Get the latest habit-building tips, research findings, and product updates delivered to your inbox.
              </p>
              
              <div className="grid grid-cols-3 gap-6 mt-8">
                {[
                  { title: 'Tips & Tricks', description: 'Weekly habit formation techniques based on scientific research' },
                  { title: 'Case Studies', description: 'Real stories from users who transformed their lives' },
                  { title: 'Product Updates', description: 'Be the first to know about new features and improvements' }
                ].map((item, index) => (
                  <div key={index} className="col-span-3 md:col-span-1">
                    <div className="flex">
                      <div className={`w-10 h-10 rounded-xl mr-3 ${featureCardIconBg} ${accentColor} flex items-center justify-center shrink-0`}>
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" 
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
          </div>
                      <div>
                        <h4 className={`font-medium ${textColor}`}>{item.title}</h4>
                        <p className={`text-sm ${featureCardDescColor}`}>{item.description}</p>
        </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Newsletter Form */}
            <div className={`rounded-2xl overflow-hidden shadow-lg border ${borderColor} ${cardBgColor} p-8`}>
              <h3 className={`text-xl font-bold ${textColor} mb-6`}>Join our community</h3>
              
              <form className="space-y-5">
                <div>
                  <label className={`block text-sm font-medium ${heroSubtextColor} mb-2`}>Full Name</label>
                  <input
                    type="text" 
                    placeholder="Your name" 
                    className={`w-full px-4 py-3 rounded-lg border ${inputBorderColor} ${inputBgColor} ${inputTextColor} focus:ring-2 focus:ring-[#FF9D76] focus:border-transparent transition-colors`} 
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${heroSubtextColor} mb-2`}>Email Address</label>
                  <input 
                    type="email"
                    placeholder="you@example.com" 
                    className={`w-full px-4 py-3 rounded-lg border ${inputBorderColor} ${inputBgColor} ${inputTextColor} focus:ring-2 focus:ring-[#FF9D76] focus:border-transparent transition-colors`} 
                  />
                </div>
                
                <div>
                  <label className={`block text-sm font-medium ${heroSubtextColor} mb-2`}>Interests</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Habit Building', 'Productivity', 'Mental Health', 'Physical Health'].map((interest, index) => (
                      <div key={index} className="flex items-center">
                  <input
                          type="checkbox" 
                          id={`interest-${index}`} 
                          className="w-4 h-4 rounded text-[#FF9D76] focus:ring-[#FF9D76]" 
                        />
                        <label htmlFor={`interest-${index}`} className={`ml-2 text-sm ${textColor}`}>{interest}</label>
                </div>
                    ))}
              </div>
                </div>
                
              <button
                type="submit"
                  className={`w-full py-3 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'} text-white mt-6`}
                >
                  Subscribe Now
              </button>
                
                <p className={`text-xs text-center ${featureCardDescColor} mt-4`}>
                  By subscribing, you agree to our privacy policy and terms of service.
              </p>
            </form>
        </div>
    </div>
        </div>
      </section>
      
      {/* Footer Section - Updated with bakery-inspired aesthetic */}
      <footer className={`py-16 px-4 sm:px-6 lg:px-8 ${bgColor} border-t ${borderColor}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Company Info */}
            <div className="md:col-span-1">
              <div className="flex items-center mb-6">
                <div className={`p-2 rounded-xl ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} mr-2`}>
                  <svg className={`w-6 h-6 ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'}`} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
            </div>
                <span className={`text-xl font-bold ${textColor}`}>StreakQuest</span>
            </div>
              <p className={`${subtextColor} mb-6`}>
                Transforming daily actions into lifelong habits through engaging tracking and rewards.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: <FaTwitter />, link: "#" },
                  { icon: <FaFacebook />, link: "#" },
                  { icon: <FaInstagram />, link: "#" },
                  { icon: <FaGithub />, link: "#" }
                ].map((social, index) => (
                  <a 
                    key={index} 
                    href={social.link} 
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-slate-100'} transition-colors`}
                  >
                    <span className={`${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'}`}>
                      {social.icon}
                      </span>
                  </a>
            ))}
          </div>
        </div>
        
            {/* Quick Links */}
            <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-8">
              {[
                {
                  title: 'Product',
                  links: ['Features', 'Pricing', 'Testimonials', 'Integrations', 'Updates']
                },
                {
                  title: 'Company',
                  links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact']
                },
                {
                  title: 'Resources',
                  links: ['Blog', 'Knowledge Base', 'Guides', 'API Docs', 'Community']
                }
              ].map((category, index) => (
                <div key={index}>
                  <h4 className={`text-lg font-bold mb-4 ${textColor}`}>{category.title}</h4>
                  <ul className="space-y-3">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a href="#" className={`text-sm ${subtextColor} hover:${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'} transition-colors`}>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
                  </div>
                  
          <div className={`mt-12 pt-8 border-t ${borderColor} flex flex-col md:flex-row justify-between items-center`}>
            <div className={`text-sm ${subtextColor} mb-4 md:mb-0`}>
              © {new Date().getFullYear()} StreakQuest. All rights reserved.
                  </div>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Accessibility'].map((link, index) => (
                <a key={index} href="#" className={`text-sm ${subtextColor} hover:${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'} transition-colors`}>
                  {link}
                </a>
              ))}
                </div>
              </div>
          </div>
      </footer>
          
      {/* Modal Implementation */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`w-full max-w-md rounded-2xl overflow-hidden shadow-2xl ${cardBgColor} p-8 relative`}
          >
            <button 
              onClick={() => setShowLoginModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-slate-100'} transition-colors`}
            >
              <svg className={`w-5 h-5 ${textColor}`} viewBox="0 0 24 24" fill="none">
                <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
            </button>
            
            <div className="text-center mb-6">
              <div className={`inline-flex p-3 rounded-xl ${darkMode ? 'bg-indigo-900/50' : 'bg-[#FFF0E8]'} mb-4`}>
                <svg className={`w-6 h-6 ${darkMode ? 'text-indigo-300' : 'text-[#FF9D76]'}`} viewBox="0 0 24 24" fill="none">
                  <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className={`text-2xl font-bold ${textColor}`}>Demo Login</h3>
              <p className={`${subtextColor} mt-2`}>
                Log in to continue your habit journey
              </p>
        </div>
        
            <form onSubmit={handleDemoLogin} className="space-y-5">
              <div>
                <label className={`block text-sm font-medium ${subtextColor} mb-2`}>Email Address</label>
                <input 
                  type="email" 
                  value="demo@streakquest.app"
                  readOnly
                  className={`w-full px-4 py-3 rounded-lg border ${inputBorderColor} ${inputBgColor} ${inputTextColor} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`} 
                />
        </div>
        
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className={`text-sm font-medium ${subtextColor}`}>Password</label>
              </div>
                <input 
                  type="password" 
                  value="demodemo"
                  readOnly
                  className={`w-full px-4 py-3 rounded-lg border ${inputBorderColor} ${inputBgColor} ${inputTextColor} focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors`} 
                />
                </div>
              
        <button
                type="submit" 
                className={`w-full py-3.5 rounded-lg font-medium transition-all ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-[#FF9D76] hover:bg-[#FF8A5B]'} text-white mt-6`}
              >
                Enter Demo
        </button>
              
              <p className={`text-xs text-center ${subtextColor} mt-4`}>
                This is a demo account. No sign up required.
              </p>
            </form>
      </motion.div>
                  </div>
                )}
    </div>
  );
};

// Add type interface for CursorAnimation props
interface CursorAnimationProps {
  targetRef: React.RefObject<HTMLButtonElement>;
  isActive: boolean;
  onClick: () => void;
}

// Update the CursorAnimation component with proper TypeScript types
const CursorAnimation: React.FC<CursorAnimationProps> = ({ targetRef, isActive, onClick }) => {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const cursorRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    if (isActive && targetRef.current && cursorRef.current) {
      // Get the target button's position
      const targetRect = targetRef.current.getBoundingClientRect();
      const cursorRect = cursorRef.current.getBoundingClientRect();
      
      // Calculate center position of button
      const targetX = targetRect.left + targetRect.width / 2 - cursorRect.width / 2;
      const targetY = targetRect.top + targetRect.height / 2 - cursorRect.height / 2;
      
      // Set initial position (off-screen to the right)
      setPosition({ x: window.innerWidth - 100, y: targetY });
      
      // Animate cursor
      const animateCursor = async () => {
        // Move to target position
        await controls.start({
          x: targetX,
          y: targetY,
          transition: { duration: 1.5, ease: "easeInOut" }
        });
        
        // Pause for a moment
        await controls.start({
          scale: 1.1,
          transition: { duration: 0.2 }
        });
        
        // Click animation (scale down)
        await controls.start({
          scale: 0.9,
          transition: { duration: 0.1 }
        });
        
        if (onClick) onClick();
        
        // Return to normal size
        await controls.start({
          scale: 1,
          transition: { duration: 0.1 }
        });
        
        // Hide the cursor
        controls.start({
          opacity: 0,
          transition: { duration: 0.5, delay: 0.5 }
        });
      };
      
      animateCursor();
    }
  }, [isActive, targetRef, controls, onClick]);
  
  if (!isActive) return null;
            
            return (
              <motion.div
      ref={cursorRef}
      className="fixed z-50 pointer-events-none"
                style={{
        left: 0,
        top: 0,
        x: position.x,
        y: position.y
      }}
      animate={controls}
      initial={{ opacity: 1, scale: 1 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M5 1L18 14L12 15L14 21L10 23L8 15L2 13L5 1Z" 
          fill="white" 
          stroke="#FF9D76" 
          strokeWidth="1.5"
        />
      </svg>
              </motion.div>
  );
};

// Modify the HabitSimulator component to use the local borderColor variable
const HabitSimulator: React.FC<HabitSimulatorProps> = ({ darkMode }) => {
  // Get borderColor from variables available in parent component scope
  const borderColor = darkMode ? 'border-gray-700' : 'border-slate-200/60';
  
  // Add ref for the entire simulator container
  const simulatorRef = useRef<HTMLDivElement>(null);
  
  // Add ref for the start simulation button
  const startButtonRef = useRef<HTMLButtonElement>(null);
  const [showCursorAnimation, setShowCursorAnimation] = useState(false);
  
  // Move state declarations here, before the useEffect
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [day, setDay] = useState(0);
  const [simulationStats, setSimulationStats] = useState({
    streakLength: 0,
    successRate: 0, // Change from string to number
    habitStrength: 0, // Change from string to number
    completed: 0,
    missed: 0,
    dayLog: [] as Array<{
      day: number;
      completed: boolean;
      chance: string;
      habitStrength: string;
    }>
  });
  
  // Simulation parameters with default values
  const [params, setParams] = useState({
    consistency: 70,  // 0-100
    cue: 60,          // 0-100
    difficulty: 40,   // 0-100
    reward: 65,       // 0-100
    environment: 75   // 0-100
  });

  // Use Intersection Observer to trigger animation when section is in view
  useEffect(() => {
    if (!simulatorRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          // If simulator is in view and animation hasn't started yet
          if (entry.isIntersecting && !showCursorAnimation && !simulationRunning) {
            // Wait a moment after scrolling into view before showing animation
            setTimeout(() => {
              setShowCursorAnimation(true);
            }, 500); // Reduced from 1500ms to 500ms for quicker response
          }
        });
      },
      {
        root: null, // Use viewport as root
        rootMargin: '0px',
        threshold: 0.5 // Trigger when at least 50% of element is visible
      }
    );

    observer.observe(simulatorRef.current);
    
    return () => {
      if (simulatorRef.current) {
        observer.unobserve(simulatorRef.current);
      }
    };
  }, [simulatorRef, showCursorAnimation, simulationRunning]);
  
  // Remove the state declarations that were moved above
  
  // Get reference to parent component's handleDemo function
  const showLoginModal = () => {
    if (typeof window !== 'undefined') {
      // Instead of triggering the demo button, we'll replicate its behavior directly
      // Set flags in localStorage
      localStorage.setItem('streakquest_demo_login', 'true');
      localStorage.setItem('demo_status', 'working');
      
      // Navigate to dashboard directly - this is more reliable on mobile
      const basePath = process.env.PUBLIC_URL || '';
      window.location.replace(`${basePath}/app/dashboard`);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setSimulationRunning(false);
    setDay(0);
    setSimulationStats({
      streakLength: 0,
      successRate: 0,
      habitStrength: 0,
      completed: 0,
      missed: 0,
      dayLog: []
    });
  };
  
  // Start simulation
  const startSimulation = () => {
    resetSimulation();
    setSimulationRunning(true);
  };
  
  // Run simulation
  useEffect(() => {
    if (!simulationRunning) return;
    
    // Simulation speed (ms per day)
    const speed = 600;
    
    const simulationInterval = setInterval(() => {
      setDay(currentDay => {
        // If we've reached 30 days, stop the simulation
        if (currentDay >= 30) {
          setSimulationRunning(false);
          clearInterval(simulationInterval);
          return currentDay;
        }
        
        // Calculate probability of completing the habit today
        const baseChance = (params.consistency + params.cue + params.reward) / 3;
        const difficultyFactor = 1 - (params.difficulty / 200); // Higher difficulty reduces chance
        const environmentBoost = params.environment / 200; // Environment gives a small boost
        
        // Habit strength grows over time with successful completions
        const habitStrength = Math.min(30, simulationStats.streakLength) / 100;
        
        // Calculate completion chance with all factors (0-1)
        let completionChance = (baseChance / 100) * difficultyFactor + environmentBoost + habitStrength;
        completionChance = Math.min(0.95, Math.max(0.05, completionChance)); // Cap between 5% and 95%
        
        // Determine if habit was completed today
        const completed = Math.random() < completionChance;
        
        // Update simulation stats
        setSimulationStats(prevStats => {
          const newCompleted = completed ? prevStats.completed + 1 : prevStats.completed;
          const newMissed = completed ? prevStats.missed : prevStats.missed + 1;
          const newStreakLength = completed ? prevStats.streakLength + 1 : 0;
          const newSuccessRate = ((newCompleted / (currentDay + 1)) * 100);
          
          // Calculate habit strength (0-100)
          const newHabitStrength = Math.min(
            100,
            (newCompleted * 3) + 
            (newStreakLength * 2) + 
            (params.environment / 20) - 
            (params.difficulty / 10)
          );
          
          // Update the day log
          const newDayLog = [...prevStats.dayLog, { 
            day: currentDay + 1,
            completed,
            chance: (completionChance * 100).toFixed(1),
            habitStrength: newHabitStrength.toFixed(1)
          }];
          
          return {
            streakLength: newStreakLength,
            successRate: newSuccessRate, // Use number instead of string
            habitStrength: newHabitStrength, // Use number instead of string
            completed: newCompleted,
            missed: newMissed,
            dayLog: newDayLog
          };
        });
        
        return currentDay + 1;
      });
    }, speed);
    
    return () => clearInterval(simulationInterval);
  }, [simulationRunning, params, simulationStats.streakLength]);
  
  // Parameter labels
  const paramLabels = {
    consistency: "Consistency",
    cue: "Trigger Strength",
    difficulty: "Difficulty",
    reward: "Reward Size",
    environment: "Environment Design"
  };
  
  // Parameter descriptions
  const paramDescriptions = {
    consistency: "How regularly you attempt the habit",
    cue: "Strength of the reminder or trigger",
    difficulty: "How challenging the habit is to complete",
    reward: "How rewarding the habit feels",
    environment: "How well your environment supports the habit"
  };
  
  // Parameter handleChange
  const handleParamChange = (param: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [param]: parseInt(value)
    }));
  };
  
  return (
    <div 
      ref={simulatorRef}
      className={`rounded-xl overflow-hidden shadow-xl border ${borderColor} ${
        darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white'
      }`}
    >
      {/* Add cursor animation */}
      <CursorAnimation 
        targetRef={startButtonRef} 
        isActive={showCursorAnimation && !simulationRunning} 
        onClick={startSimulation}
      />
      
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-slate-200/60'}`}>
        <h3 className="text-xl font-bold">Habit Formation Simulator</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          Adjust the parameters and see how they affect habit success over 30 days
        </p>
      </div>
      
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Parameter Controls */}
        <div className="space-y-6">
          <h4 className="font-medium text-lg mb-4">Habit Parameters</h4>
          
          {/* Sliders for each parameter */}
          {Object.keys(params).map(param => (
            <div key={param} className="space-y-2">
              <div className="flex justify-between">
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-slate-700'}`}>
                  {paramLabels[param as keyof typeof paramLabels]}
                </label>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {params[param as keyof typeof params]}%
                </span>
              </div>
              
              <input
                type="range"
                min="0"
                max="100"
                value={params[param as keyof typeof params]}
                onChange={(e) => handleParamChange(param, e.target.value)}
                className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${
                  darkMode ? 'bg-gray-700' : 'bg-slate-200'
                }`}
                style={{
                  accentColor: param === 'difficulty' ? 
                    (darkMode ? '#f87171' : '#FF9D76') : 
                    (darkMode ? '#818cf8' : '#FF9D76')
                }}
              />
              
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                {paramDescriptions[param as keyof typeof paramDescriptions]}
              </p>
            </div>
          ))}
          
          {/* Simulation Controls */}
          <div className="flex space-x-3 pt-4">
            <button
              ref={startButtonRef}
              onClick={() => {
                setShowCursorAnimation(false);
                startSimulation();
              }}
              disabled={simulationRunning}
              className={`px-4 py-2 rounded-lg ${
                simulationRunning 
                  ? darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                  : darkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-[#FF9D76] hover:bg-[#FF8A5B] text-white'
              } transition-colors flex-1`}
            >
              {simulationRunning ? 'Simulating...' : 'Start Simulation'}
            </button>
            
            <button
              onClick={resetSimulation}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              } transition-colors`}
            >
              Reset
            </button>
          </div>
        </div>
        
        {/* Simulation Results */}
        <div>
          <h4 className="font-medium text-lg mb-4">Simulation Results</h4>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm mb-1">
              <span className={darkMode ? 'text-gray-400' : 'text-slate-600'}>Day {day} of 30</span>
              <span className={simulationRunning ? 'text-[#FF9D76] animate-pulse' : 'text-gray-500'}>
                {simulationRunning ? 'Running...' : day > 0 ? 'Completed' : 'Not started'}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-slate-200'}`}>
              <motion.div 
                className={`h-full bg-gradient-to-r ${darkMode ? 'from-indigo-500 to-purple-500' : 'from-[#FF9D76] to-[#FFDBCB]'}`}
                style={{ width: `${(day / 30) * 100}%` }}
                animate={simulationRunning ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            {/* Streak Length */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-slate-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Current Streak
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.streakLength}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-600'}`}>days</span>
              </div>
            </div>
            
            {/* Success Rate */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-slate-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Success Rate
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.successRate.toFixed(1)}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-600'}`}>%</span>
              </div>
            </div>
            
            {/* Completions */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-slate-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Days Completed
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.completed}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-600'}`}>/ {day}</span>
              </div>
            </div>
            
            {/* Habit Strength */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-slate-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                Habit Strength
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.habitStrength.toFixed(1)}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-slate-600'}`}>/ 100</span>
              </div>
            </div>
          </div>
          
          {/* Habit Timeline */}
          <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-slate-50'}`}>
            <div className={`p-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-slate-200'}`}>
              <h5 className="font-medium text-sm">Habit Timeline</h5>
            </div>
            
            <div className="p-3 overflow-x-auto">
              <div className="flex mb-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`text-center text-xs flex-shrink-0 w-8 ${
                      darkMode ? 'text-gray-500' : 'text-slate-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              
              <div className="h-10 relative mb-1">
                {/* Completion markers */}
                {simulationStats.dayLog.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className={`absolute top-0 bottom-0 w-8 flex items-center justify-center`}
                    style={{ left: `${(log.day - 1) * 2}rem` }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      log.completed 
                        ? darkMode ? 'bg-green-800/50 text-green-400' : 'bg-[#FFF0E8] text-[#FF9D76]'
                        : darkMode ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-500'
                    }`}>
                      {log.completed ? '✓' : '✕'}
                    </div>
                  </motion.div>
                ))}
              </div>
              
              {/* Habit strength line */}
              {simulationStats.dayLog.length > 0 && (
                <div className="h-20 relative">
                  {/* Background grid lines */}
                  {[0, 25, 50, 75, 100].map(level => (
                    <div
                      key={level}
                      className={`absolute left-0 right-0 h-px ${
                        darkMode ? 'bg-gray-700' : 'bg-slate-300'
                      }`}
                      style={{ top: `${100 - level}%` }}
                    >
                      <span className={`absolute -left-6 -translate-y-1/2 text-xs ${
                        darkMode ? 'text-gray-500' : 'text-slate-500'
                      }`}>
                        {level}%
                      </span>
                    </div>
                  ))}
                  
                  {/* Strength line */}
                  <svg className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="strength-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={darkMode ? '#818cf8' : '#FF9D76'} />
                        <stop offset="100%" stopColor={darkMode ? '#d946ef' : '#FFDBCB'} />
                      </linearGradient>
                    </defs>
                    <polyline
                      points={simulationStats.dayLog.map(log => 
                        `${(log.day - 1) * 32 + 16},${100 - parseFloat(log.habitStrength)}%`
                      ).join(' ')}
                      fill="none"
                      stroke="url(#strength-gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Tips based on simulation */}
      {day >= 30 && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-6 border-t ${darkMode ? 'border-gray-800 bg-indigo-900/10' : 'border-slate-200 bg-[#FFF0E8]/30'}`}
        >
          <h4 className="font-bold mb-2">Simulation Insights</h4>
          <p className={darkMode ? 'text-gray-300' : 'text-slate-700'}>
            {Number(simulationStats.successRate) > 80 
              ? "Excellent habit design! You've created a sustainable habit system."
              : Number(simulationStats.successRate) > 60
                ? "Good habit design! Try increasing consistency or reducing difficulty for even better results."
                : Number(simulationStats.successRate) > 40
                  ? "Average habit results. Consider strengthening your cues and environment design."
                  : "This habit needs redesign. Try making it easier, more rewarding, or improving your environment."
            }
          </p>
          
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {params.consistency < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Boost Consistency</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Schedule your habit at the same time each day to build momentum.
                </p>
              </div>
            )}
            
            {params.cue < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Strengthen Cues</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Create obvious triggers that remind you to perform your habit.
                </p>
              </div>
            )}
            
            {params.difficulty > 60 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Reduce Difficulty</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Make your habit so small and easy it feels almost too simple.
                </p>
              </div>
            )}
            
            {params.reward < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Enhance Rewards</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Create immediate satisfaction after completing your habit.
                </p>
              </div>
            )}
            
            {params.environment < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Design Your Environment</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                  Make good habits obvious and bad habits invisible in your space.
                </p>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button
              onClick={showLoginModal}
              className={`px-6 py-3 rounded-lg font-medium text-white ${
                darkMode 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                  : 'bg-gradient-to-r from-[#FF9D76] to-[#FFBEA7] hover:from-[#FF8A5B] hover:to-[#FFA584]'
              } transition-all shadow-lg hover:shadow-xl`}
            >
              Try StreakQuest Demo
            </button>
          </div>
          <p className={`mt-2 text-xs text-center ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
            Note: Everything is working correctly! All features ready to try.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default LandingPage; 