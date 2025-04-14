import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCalendarAlt, FaTrophy, FaMoon, FaSun, FaGithub, FaFire, FaBrain, FaRunning, FaBook, FaWater, FaRocket } from 'react-icons/fa';
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

const LandingPage: React.FC = () => {
  // Restore the useTheme hook instead of the local state
  const { darkMode, toggleDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Improve dark mode styling for better appearance
  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const subtextColor = darkMode ? 'text-gray-300' : 'text-gray-600';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
  const inputBgColor = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const inputBorderColor = darkMode ? 'border-gray-700' : 'border-gray-300';
  const inputTextColor = darkMode ? 'text-white' : 'text-gray-900';
  const buttonHoverColor = darkMode ? 'hover:bg-indigo-600' : 'hover:bg-indigo-700';
  
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
  
  // Fix the features mapping
  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 text-gray-900'}`}>
      {/* Navbar - improve dark mode appearance */}
      <nav className={`fixed w-full z-50 transition-colors duration-300 ${darkMode ? 'bg-gray-900/95 backdrop-blur-lg border-b border-gray-800' : 'bg-white/90 backdrop-blur-lg shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-2 ${darkMode ? 'bg-indigo-900' : 'bg-indigo-100'}`}>
                  <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">SQ</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">StreakQuest</span>
              </div>
            </div>
            <div className={`flex-grow-0 flex items-center space-x-2 sm:space-x-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
              <button 
                onClick={() => toggleDarkMode()} 
                className={`p-2 rounded-full transition-colors ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                aria-label="Toggle dark mode"
              >
                {darkMode ? <FaSun className="text-amber-400" /> : <FaMoon className="text-indigo-700" />}
              </button>
              
              {/* Sign up button */}
              <Link
                to="/signup"
                className={`hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
                  darkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
                } transition-colors shadow-md`}
              >
                <FaRocket className="text-xs" />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - improve dark mode appearance */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-6"
            >
              <motion.h1 
                variants={fadeInUp}
                className="text-4xl md:text-5xl font-bold leading-tight"
              >
                Transform <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">daily actions</span> into lifelong habits
              </motion.h1>
              <motion.p 
                variants={fadeInUp}
                className={`text-lg md:text-xl ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
              >
                StreakQuest turns habit-building into an engaging journey with visual tracking, analytics, and achievement rewards.
              </motion.p>
              <motion.div 
                variants={fadeInUp}
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <button 
                  className={`px-8 py-3 rounded-lg font-medium ${
                    darkMode 
                      ? 'bg-gray-800 text-white hover:bg-gray-700' 
                      : 'bg-white text-gray-800 hover:bg-gray-50'
                  } border transition-all shadow-md hover:shadow-lg`}
                >
                  Learn More
                </button>
              </motion.div>
            </motion.div>
            
            {/* Interactive Habit Calendar Visualization */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className={`absolute inset-0 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-indigo-900/20 to-purple-900/20 blur-3xl' : 'bg-gradient-to-r from-indigo-200/50 to-purple-200/50 blur-3xl'}`}></div>
              
              <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl">
                <div className={`p-6 ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white'}`}>
                  <h3 className="text-xl font-bold mb-4">Watch habits form in real-time</h3>
                  
                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 mb-6">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                      <div key={`header-${i}`} className={`text-center text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {day}
                      </div>
                    ))}
                    
                    {/* Generate 30 day calendar */}
                    {Array.from({ length: 35 }).map((_, i) => (
                      <motion.div
                        key={`day-${i}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ 
                          delay: i * 0.01,
                          duration: 0.3
                        }}
                        className={`aspect-square rounded-md flex items-center justify-center text-xs
                          ${i < 30 ? 
                            darkMode ? 'bg-gray-800 border border-gray-700' : 'bg-gray-50 border border-gray-100' 
                            : 'opacity-0'
                          }`}
                      >
                        {i < 30 ? i + 1 : ''}
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Habit List with Interactive Streaks */}
                  <div className="space-y-4">
                    {HABIT_EXAMPLES.map((habit, index) => (
                      <div key={`habit-${index}`} className="relative">
                        <div className="flex items-center mb-2">
                          <div className={`w-8 h-8 rounded-full mr-2 bg-gradient-to-r ${habit.color} flex items-center justify-center text-white`}>
                            {habit.icon}
                          </div>
                          <span className="font-medium">{habit.name}</span>
                          <div className="ml-auto flex items-center">
                            <FaFire className={`mr-1 ${darkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                            <span className={`font-bold ${darkMode ? 'text-orange-400' : 'text-orange-500'}`}>{habit.days.length}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                          <div 
                            className={`h-full rounded-full bg-gradient-to-r ${habit.color}`}
                            style={{ width: `${(habit.days.length / 30) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex mt-1">
                          {Array.from({ length: 30 }).map((_, dayIndex) => (
                            <motion.div 
                              key={`habit-${index}-day-${dayIndex}`}
                              initial={{ scale: 0, opacity: 0 }}
                              animate={{ 
                                scale: habit.days.includes(dayIndex + 1) ? 1 : 0,
                                opacity: habit.days.includes(dayIndex + 1) ? 1 : 0
                              }}
                              transition={{ 
                                delay: index * 0.3 + dayIndex * 0.03,
                                type: "spring",
                                stiffness: 500,
                                damping: 30
                              }}
                              className={`w-1 h-1 rounded-full bg-gradient-to-r ${habit.color} mx-[3.3%] first:ml-0`}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Interactive Badge */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.5 }}
                    className={`mt-6 flex items-center justify-between p-3 rounded-lg ${
                      darkMode ? 'bg-indigo-900/30 border border-indigo-800/50' : 'bg-indigo-50 border border-indigo-100'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full mr-3 flex items-center justify-center bg-gradient-to-r from-amber-400 to-orange-500 text-white`}>
                        <FaTrophy />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">Consistency Champion</h4>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Complete habits 5 days in a row</p>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${darkMode ? 'text-amber-400' : 'text-amber-500'}`}>
                      Achieved!
                    </div>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative Elements */}
              <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-xl ${darkMode ? 'bg-purple-800/30' : 'bg-purple-200'} shadow-lg`}></div>
              <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-xl ${darkMode ? 'bg-indigo-800/30' : 'bg-indigo-200'} shadow-lg`}></div>
              <HabitSparkles />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Creative Habit Journey Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <ScrollingHabitJourney darkMode={darkMode} />
        </div>
      </section>

      {/* Features Section - improve dark mode appearance */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800/30' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Key Features</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
            >
              Everything you need to build and maintain successful habits
            </motion.p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`rounded-xl overflow-hidden shadow-lg transition-all p-8 ${
                  darkMode 
                    ? 'bg-gray-800/50 hover:bg-gray-800/80 text-white' 
                    : 'bg-white hover:shadow-xl text-gray-800'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
                  darkMode ? 'bg-indigo-900/50' : 'bg-indigo-100'
                }`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* App Showcase */}
      <section className="py-20">
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

      {/* 3D Habit Building Visualization - improve dark mode appearance */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                The Habit Matrix
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
            >
              Visualize how different aspects of your habits interconnect and grow
            </motion.p>
          </div>
          
          <HabitMatrix darkMode={darkMode} />
        </div>
      </section>

      {/* Interactive Habit Formation Simulation - improve dark mode appearance */}
      <section className={`py-24 ${darkMode ? 'bg-gray-800/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Build Your Own Habit System
              </span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
            >
              Experiment with the key factors that make or break habit formation
            </motion.p>
          </div>
          
          <HabitSimulator darkMode={darkMode} />
        </div>
      </section>

      {/* CTA Section - moved to the very end, after Newsletter */}
      <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-indigo-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between rounded-2xl overflow-hidden shadow-2xl">
            <div className={`p-10 lg:p-16 ${darkMode ? 'bg-gradient-to-r from-gray-900 to-indigo-900/80' : 'bg-gradient-to-r from-indigo-500 to-purple-600'} lg:w-3/5`}>
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-3xl font-bold text-white mb-4"
              >
                Ready to build lasting habits?
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-indigo-100 text-lg mb-8 max-w-xl"
              >
                Start your journey towards better habits and track your progress with StreakQuest's beautiful interface.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4"
              >
                <button 
                  onClick={handleDemo}
                  className="px-8 py-3 bg-white text-indigo-600 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-lg"
                  data-demo-button="true"
                >
                  Try Demo
                </button>
              </motion.div>
            </div>
            <div className={`hidden lg:block lg:w-2/5 relative ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
              <img 
                src={darkMode ? IMAGES.darkMode : IMAGES.mockup} 
                alt="App mockup" 
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={`py-20 px-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 ${textColor}`}
          >
            <GradientText text="Stay Updated" />
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`text-lg mb-8 ${subtextColor}`}
          >
            Subscribe to our newsletter to get updates on new features and tips for habit building.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={`px-4 py-3 rounded-lg ${inputBgColor} ${inputBorderColor} border ${inputTextColor} w-full sm:w-auto sm:flex-1 max-w-md`}
            />
            <button className={`px-6 py-3 bg-indigo-600 ${buttonHoverColor} text-white rounded-lg font-medium transition-colors duration-300 w-full sm:w-auto`}>
              Subscribe
            </button>
          </motion.div>
        </div>
      </section>
      
      {/* Footer section */}
      <footer className={`py-8 px-4 ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'} border-t`}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <img src="/logo.svg" alt="StreakQuest Logo" className="h-8 w-8 mr-2" />
            <span className={`font-bold text-xl ${textColor}`}>StreakQuest</span>
          </div>
          <div className={`text-sm ${subtextColor}`}>
            © {new Date().getFullYear()} StreakQuest. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Demo Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 px-4 sm:px-0">
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setShowLoginModal(false)}
          ></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`relative w-full max-w-md p-8 rounded-2xl shadow-2xl ${
              darkMode 
                ? 'bg-gray-900 border border-gray-800' 
                : 'bg-white'
            }`}
          >
            <button 
              onClick={() => setShowLoginModal(false)}
              className={`absolute top-4 right-4 p-1 rounded-full ${
                darkMode 
                  ? 'hover:bg-gray-800 text-gray-400' 
                  : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h3 className="text-2xl font-bold mb-6">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Demo Login</span>
            </h3>
            <form onSubmit={handleDemoLogin}>
              <div className="space-y-4 mb-6">
                <div>
                  <label htmlFor="email" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value="demo@streakquest.app"
                    readOnly
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
                <div>
                  <label htmlFor="password" className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value="demodemo"
                    readOnly
                    className={`w-full px-4 py-3 rounded-lg ${
                      darkMode 
                        ? 'bg-gray-800 border-gray-700 text-white' 
                        : 'bg-gray-50 border-gray-200 text-gray-900'
                    } border focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                  />
                </div>
              </div>
              <button
                type="submit"
                className={`w-full px-4 py-3 rounded-lg font-medium ${
                  darkMode 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700' 
                    : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
                } text-white transition-all shadow-lg hover:shadow-xl`}
              >
                Enter Demo
              </button>
              <p className={`mt-4 text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                This is a demo account. No sign up required.
              </p>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Animated Sparkles Component
const HabitSparkles = () => {
  const sparklePositions = [
    { top: '10%', left: '20%', delay: 1.2 },
    { top: '70%', left: '10%', delay: 1.5 },
    { top: '30%', left: '80%', delay: 1.8 },
    { top: '80%', left: '70%', delay: 2.1 },
    { top: '40%', left: '30%', delay: 2.4 },
  ];
  
  return (
    <>
      {sparklePositions.map((pos, i) => (
        <motion.div
          key={`sparkle-${i}`}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1, 0.8, 1, 0], 
            opacity: [0, 1, 1, 1, 0],
            rotate: [0, 45, -45, 90, 0]
          }}
          transition={{ 
            delay: pos.delay, 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
          className="absolute w-4 h-4 z-20"
          style={{ top: pos.top, left: pos.left }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L15 9H22L16 14L18 21L12 17L6 21L8 14L2 9H9L12 2Z" fill="url(#sparkle-gradient)" />
            <defs>
              <linearGradient id="sparkle-gradient" x1="2" y1="2" x2="22" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#6366F1" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      ))}
    </>
  );
};

// Update ScrollingHabitJourney with type annotation
const ScrollingHabitJourney: React.FC<ScrollingHabitJourneyProps> = ({ darkMode }) => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ 
    target: containerRef,
    offset: ["start end", "end start"] 
  });
  
  // Change types to properly define state
  const [currentDay, setCurrentDay] = useState(0);
  const [streakCount, setStreakCount] = useState(0);
  const [completedHabits, setCompletedHabits] = useState<boolean[]>([]);
  
  // Parallax and progress-based animations
  const dayProgress = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  
  // Update state based on scroll position
  useEffect(() => {
    const unsubscribe = dayProgress.onChange(latest => {
      const day = Math.min(30, Math.max(0, Math.floor(latest)));
      if (day !== currentDay) {
        setCurrentDay(day);
        
        // Simulate habit completion patterns
        if (day > 0) {
          const pattern = [
            // On days 1-5, complete 1 habit
            ...(day <= 5 ? [1] : []),
            // On days 6-15, complete 2 habits
            ...(day > 5 && day <= 15 ? [2] : []),
            // On days 16-25, complete 3 habits
            ...(day > 15 && day <= 25 ? [3] : []),
            // On days 26-30, complete all 4 habits
            ...(day > 25 ? [4] : [])
          ];
          
          const completed = pattern[0] || 0;
          // Fix typing issue by explicitly typing the array
          setCompletedHabits(Array(completed).fill(true) as boolean[]);
          
          // Update streak
          if (day > 1) {
            setStreakCount(day);
          }
        }
      }
    });
    
    return () => unsubscribe();
  }, [dayProgress, currentDay]);
  
  const habits = [
    { name: "Morning Run", icon: <FaRunning />, color: "from-blue-400 to-cyan-400" },
    { name: "Read 20 Pages", icon: <FaBook />, color: "from-amber-400 to-orange-400" },
    { name: "Drink Water", icon: <FaWater />, color: "from-emerald-400 to-teal-400" },
    { name: "Meditate", icon: <FaBrain />, color: "from-purple-400 to-violet-400" }
  ];
  
  return (
    <div ref={containerRef} className="min-h-[150vh] relative pt-16 pb-32">
      <motion.div 
        className="text-center mb-12"
        style={{ opacity, scale }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            The Habit Journey
          </span>
        </h2>
        <p className={`max-w-2xl mx-auto text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Scroll to see how small daily actions transform into powerful habits
        </p>
      </motion.div>
      
      {/* Visualization */}
      <motion.div
        className={`max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl ${
          darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-100'
        }`}
        style={{ opacity, scale }}
      >
        {/* Header with day counter */}
        <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl">Your Habit Dashboard</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Building consistency day by day</p>
            </div>
            <div className={`px-4 py-2 rounded-full ${
              darkMode ? 'bg-indigo-900/30 text-indigo-200' : 'bg-indigo-50 text-indigo-800'
            }`}>
              <span className="font-mono font-bold">Day {currentDay}</span>
            </div>
          </div>
        </div>
        
        {/* Habit tracker */}
        <div className="p-6">
          <div className="space-y-6">
            {habits.map((habit, index) => (
              <div key={index} className="flex items-center">
                <div className={`w-12 h-12 rounded-xl mr-4 flex items-center justify-center bg-gradient-to-r ${habit.color} text-white`}>
                  {habit.icon}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">{habit.name}</span>
                    {currentDay > 0 && (
                      <span className={`text-sm font-mono ${
                        index < completedHabits.length
                          ? darkMode ? 'text-green-400' : 'text-green-600'
                          : darkMode ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {index < completedHabits.length ? 'COMPLETED' : 'PENDING'}
                      </span>
                    )}
                  </div>
                  
                  <div className="h-2 w-full rounded-full overflow-hidden bg-gray-200 dark:bg-gray-800">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${habit.color}`}
                      style={{ 
                        width: index < completedHabits.length 
                          ? '100%' 
                          : '0%' 
                      }}
                      animate={{
                        width: index < completedHabits.length ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Streak display */}
          <motion.div 
            className={`mt-8 p-4 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-gray-800 to-gray-900 border border-gray-700' 
                : 'bg-gradient-to-r from-gray-50 to-white border border-gray-200'
            }`}
            animate={{
              boxShadow: streakCount > 7 
                ? ['0px 0px 0px rgba(250, 204, 21, 0)', '0px 0px 15px rgba(250, 204, 21, 0.7)', '0px 0px 0px rgba(250, 204, 21, 0)']
                : 'none'
            }}
            transition={{
              repeat: Infinity,
              duration: 2
            }}
          >
            <div className="flex items-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                streakCount > 7 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white' 
                  : darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-500'
              }`}>
                <FaFire className={streakCount > 7 ? 'text-xl' : 'text-lg'} />
              </div>
              <div className="ml-4">
                <div className="font-bold text-xl">
                  {streakCount} Day{streakCount !== 1 ? 's' : ''} Streak
                </div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {streakCount === 0 && 'Start your journey today!'}
                  {streakCount > 0 && streakCount <= 7 && 'Great start! Keep going!'}
                  {streakCount > 7 && streakCount <= 14 && 'Impressive consistency!'}
                  {streakCount > 14 && streakCount <= 21 && 'You\'re building a solid habit!'}
                  {streakCount > 21 && 'Habit master! This is becoming automatic.'}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Growth visualization */}
        <div className={`p-6 border-t ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
          <h4 className="font-medium mb-3">Habit Growth</h4>
          <div className="h-24 flex items-end justify-between">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className={`w-[2.5%] rounded-t-sm ${
                  i <= currentDay 
                    ? 'bg-gradient-to-t from-indigo-500 to-purple-500' 
                    : darkMode ? 'bg-gray-800' : 'bg-gray-200'
                }`}
                style={{ 
                  height: i <= currentDay 
                    ? `${Math.min(100, 10 + (i / 30) * 100)}%` 
                    : '10%'
                }}
                animate={{
                  height: i <= currentDay 
                    ? `${Math.min(100, 10 + (i / 30) * 100)}%` 
                    : '10%'
                }}
                transition={{ duration: 0.5 }}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>Day 1</span>
            <span>Day 15</span>
            <span>Day 30</span>
          </div>
        </div>
        
        {/* Achievement unlocked */}
        {currentDay >= 7 && (
          <motion.div 
            className={`p-4 mx-6 mb-6 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-yellow-900/40 to-amber-900/40 border border-yellow-800/40' 
                : 'bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-100'
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-yellow-400 to-amber-500 text-white">
                <FaTrophy />
              </div>
              <div className="ml-4">
                <div className="font-bold">Achievement Unlocked!</div>
                <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {currentDay >= 7 && currentDay < 14 && 'Week Warrior'}
                  {currentDay >= 14 && currentDay < 21 && 'Consistency Champion'}
                  {currentDay >= 21 && currentDay < 28 && 'Habit Hero'}
                  {currentDay >= 28 && 'Transformation Master'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
      
      {/* Scroll instruction */}
      <motion.div 
        className="text-center mt-8"
        animate={{ 
          opacity: [0.5, 1, 0.5],
          y: [0, 10, 0]
        }}
        transition={{
          repeat: Infinity,
          duration: 2
        }}
      >
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Keep scrolling to see your progress
        </p>
        <svg 
          className={`w-6 h-6 mx-auto mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </motion.div>
      
      {/* Quote that appears at specific scroll points */}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 text-center max-w-md"
        style={{ 
          top: '50%',
          opacity: useTransform(scrollYProgress, 
            [0, 0.3, 0.4, 0.6, 0.7, 1], 
            [0, 0, 1, 1, 0, 0]
          ),
          scale: useTransform(scrollYProgress, 
            [0, 0.3, 0.4, 0.6, 0.7, 1], 
            [0.8, 0.8, 1, 1, 0.8, 0.8]
          ),
        }}
      >
        <blockquote className={`text-xl italic font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          <footer className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>- Aristotle</footer>
        </blockquote>
      </motion.div>
    </div>
  );
};

// Update HabitMatrix with type annotation
const HabitMatrix: React.FC<HabitMatrixProps> = ({ darkMode }) => {
  // State for rotation and auto-rotation
  const [rotateX, setRotateX] = useState(15);
  const [rotateY, setRotateY] = useState(15);
  const [autoRotate, setAutoRotate] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);

  // Handle mouse movement for interactive rotation
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!autoRotate) {
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate rotation based on mouse position
      const newRotateY = ((e.clientX - centerX) / rect.width) * 40;
      const newRotateX = ((e.clientY - centerY) / rect.height) * -40;
      
      setRotateX(newRotateX);
      setRotateY(newRotateY);
    }
  };
  
  // Auto rotate animation
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        setRotateY(prev => (prev + 0.2) % 360);
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [autoRotate]);
  
  // Matrix nodes - elements of habit building
  const matrixNodes = [
    { id: 1, name: "Consistency", description: "Regular repetition creates neural pathways", color: "from-blue-400 to-blue-600", icon: <FaCalendarAlt /> },
    { id: 2, name: "Motivation", description: "Internal drive to maintain habits", color: "from-pink-400 to-pink-600", icon: <FaFire /> },
    { id: 3, name: "Awareness", description: "Mindfulness of progress and patterns", color: "from-purple-400 to-purple-600", icon: <FaBrain /> },
    { id: 4, name: "Tracking", description: "Recording progress strengthens commitment", color: "from-emerald-400 to-emerald-600", icon: <FaChartLine /> },
    { id: 5, name: "Rewards", description: "Positive reinforcement solidifies habits", color: "from-amber-400 to-amber-600", icon: <FaTrophy /> }
  ];
  
  // Generate additional nodes based on main nodes
  const allNodes = [
    ...matrixNodes,
    { id: 6, name: "Identity", description: "Becoming the type of person who performs the habit", color: "from-indigo-400 to-indigo-600", position: [1, 0, 1] },
    { id: 7, name: "Environment", description: "Creating a space conducive to your habits", color: "from-teal-400 to-teal-600", position: [0, 1, 1] },
    { id: 8, name: "Community", description: "Social support reinforces behavior", color: "from-orange-400 to-orange-600", position: [1, 1, 0] }
  ];
  
  // Generate connections between nodes
  const connections = [
    { from: 1, to: 2 }, { from: 1, to: 3 }, { from: 1, to: 4 },
    { from: 2, to: 3 }, { from: 2, to: 5 }, { from: 3, to: 4 },
    { from: 4, to: 5 }, { from: 5, to: 1 }, { from: 3, to: 6 },
    { from: 2, to: 7 }, { from: 4, to: 7 }, { from: 5, to: 8 },
    { from: 6, to: 8 }, { from: 7, to: 8 }
  ];
  
  // Find a node by ID
  const findNode = (id: number) => allNodes.find(node => node.id === id);
  
  return (
    <div className={`relative min-h-[600px] flex flex-col items-center ${darkMode ? 'bg-gray-900/40 rounded-xl p-6' : ''}`}>
      {/* Matrix Controls */}
      <div className="mb-8 flex items-center gap-4">
        <button
          onClick={() => setAutoRotate(prev => !prev)}
          className={`px-4 py-2 rounded-full text-sm ${
            darkMode 
              ? autoRotate ? 'bg-indigo-800 text-indigo-100 shadow-glow-indigo' : 'bg-gray-800 text-gray-200 shadow-glow-gray' 
              : autoRotate ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {autoRotate ? 'Auto-Rotating' : 'Manual Rotation'}
        </button>
        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
          {!autoRotate && 'Move your mouse over the matrix to rotate'}
        </span>
      </div>
      
      {/* 3D Matrix Container */}
      <div 
        className={`w-full h-[500px] perspective-1000 flex items-center justify-center ${darkMode ? 'bg-gradient-to-b from-transparent to-gray-900/20 rounded-lg' : ''}`}
        onMouseMove={handleMouseMove}
        onClick={() => setAutoRotate(false)}
      >
        <motion.div
          className="relative w-64 h-64 transform-style-3d"
          style={{
            rotateX: rotateX,
            rotateY: rotateY,
            transformStyle: 'preserve-3d'
          }}
          transition={{ type: 'spring', stiffness: 100 }}
        >
          {/* Connection lines */}
          {connections.map((conn, i) => {
            const fromNode = findNode(conn.from);
            const toNode = findNode(conn.to);
            
            // Skip rendering if nodes aren't found
            if (!fromNode || !toNode) return null;
            
            // Type guard to check if position exists
            const hasPosition = (node: any): node is { id: number; position: number[] } => {
              return 'position' in node;
            };
            
            // Calculate positions in 3D space with proper type checking
            const fromPosition = hasPosition(fromNode) ? fromNode.position : [
              (fromNode.id % 3) - 1, 
              Math.floor(fromNode.id / 3) - 1, 
              ((fromNode.id * 7) % 3) - 1
            ];
            
            const toPosition = hasPosition(toNode) ? toNode.position : [
              (toNode.id % 3) - 1, 
              Math.floor(toNode.id / 3) - 1, 
              ((toNode.id * 7) % 3) - 1
            ];
            
            // Calculate midpoint
            const midPoint = [
              (fromPosition[0] + toPosition[0]) / 2,
              (fromPosition[1] + toPosition[1]) / 2,
              (fromPosition[2] + toPosition[2]) / 2
            ];
            
            // Calculate length and angles
            const dx = toPosition[0] - fromPosition[0];
            const dy = toPosition[1] - fromPosition[1];
            const dz = toPosition[2] - fromPosition[2];
            
            const length = Math.sqrt(dx*dx + dy*dy + dz*dz) * 100; // scale up
            
            // Connection highlight states
            const isHighlighted = hoveredNode && 
              (hoveredNode === conn.from || hoveredNode === conn.to);
            
            return (
              <motion.div
                key={`conn-${i}`}
                className={`absolute w-1 origin-left rounded-full transform-style-3d ${
                  isHighlighted 
                    ? 'bg-gradient-to-r from-indigo-400 to-purple-500'
                    : darkMode ? 'bg-indigo-600/40' : 'bg-gray-300'
                }`}
                style={{
                  opacity: isHighlighted ? 0.9 : darkMode ? 0.5 : 0.3,
                  height: 2,
                  width: length,
                  left: (fromPosition[0] * 100) + 132,
                  top: (fromPosition[1] * 100) + 132,
                  transformStyle: 'preserve-3d',
                  transform: `translateZ(${fromPosition[2] * 100}px) rotateZ(${Math.atan2(dy, dx) * (180/Math.PI)}deg) rotateY(${Math.atan2(dz, Math.sqrt(dx*dx + dy*dy)) * (180/Math.PI)}deg)`,
                  boxShadow: isHighlighted ? (darkMode ? '0 0 12px rgba(129, 140, 248, 0.9)' : '0 0 8px rgba(129, 140, 248, 0.8)') : 'none'
                }}
                animate={{
                  opacity: isHighlighted ? [0.7, 1, 0.7] : darkMode ? 0.5 : 0.3
                }}
                transition={{
                  repeat: isHighlighted ? Infinity : 0,
                  duration: 1.5
                }}
              />
            );
          })}
          
          {/* Nodes */}
          {allNodes.map((node) => {
            // Type guard to check if position exists
            const hasPosition = (n: any): n is { id: number; position: number[] } => {
              return 'position' in n;
            };
            
            // Type guard to check if icon exists
            const hasIcon = (n: any): n is { id: number; icon: React.ReactNode } => {
              return 'icon' in n;
            };
            
            // Calculate 3D position with proper type checking
            const position = hasPosition(node) ? node.position : [
              (node.id % 3) - 1, 
              Math.floor(node.id / 3) - 1, 
              ((node.id * 7) % 3) - 1
            ];
            
            const isHovered = hoveredNode === node.id;
            
            return (
              <motion.div
                key={`node-${node.id}`}
                className={`absolute w-16 h-16 rounded-full bg-gradient-to-br ${node.color} flex items-center justify-center cursor-pointer transform-style-3d`}
                style={{
                  left: (position[0] * 100) + 124,
                  top: (position[1] * 100) + 124,
                  transform: `translateZ(${position[2] * 100}px)`,
                  boxShadow: darkMode 
                    ? isHovered ? '0 0 30px rgba(100, 100, 255, 0.7)' : '0 0 20px rgba(0, 0, 30, 0.8)' 
                    : isHovered ? '0 0 30px rgba(100, 100, 255, 0.4)' : '0 0 20px rgba(0, 0, 0, 0.2)',
                  transformStyle: 'preserve-3d'
                }}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  boxShadow: isHovered 
                    ? darkMode ? '0 0 30px rgba(100, 100, 255, 0.7)' : '0 0 30px rgba(100, 100, 255, 0.4)'
                    : darkMode ? '0 0 20px rgba(0, 0, 30, 0.8)' : '0 0 20px rgba(0, 0, 0, 0.2)'
                }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                whileHover={{ z: 30 }}
              >
                {hasIcon(node) && (
                  <div className="text-white text-xl">
                    {node.icon}
                  </div>
                )}
                
                {/* Node description on hover */}
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 w-48 p-3 rounded-lg shadow-xl z-10 ${
                      darkMode 
                        ? 'bg-gray-800 border border-gray-700 text-white' 
                        : 'bg-white text-gray-800'
                    }`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(100px)',
                      boxShadow: darkMode ? '0 10px 25px -5px rgba(0, 0, 0, 0.8)' : '0 10px 25px -5px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <h4 className="font-bold text-sm mb-1">{node.name}</h4>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{node.description}</p>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};

// Add the missing HabitSimulator component
const HabitSimulator: React.FC<HabitSimulatorProps> = ({ darkMode }) => {
  // Simulation parameters with default values
  const [params, setParams] = useState({
    consistency: 70,  // 0-100
    cue: 60,          // 0-100
    difficulty: 40,   // 0-100
    reward: 65,       // 0-100
    environment: 75   // 0-100
  });
  
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
    <div className={`rounded-xl overflow-hidden ${
      darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'
    } shadow-xl`}>
      {/* Header */}
      <div className={`p-6 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <h3 className="text-xl font-bold">Habit Formation Simulator</h3>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                <label className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {paramLabels[param as keyof typeof paramLabels]}
                </label>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
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
                  darkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}
                style={{
                  accentColor: param === 'difficulty' ? 
                    (darkMode ? '#f87171' : '#ef4444') : 
                    (darkMode ? '#818cf8' : '#6366f1')
                }}
              />
              
              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                {paramDescriptions[param as keyof typeof paramDescriptions]}
              </p>
            </div>
          ))}
          
          {/* Simulation Controls */}
          <div className="flex space-x-3 pt-4">
            <button
              onClick={startSimulation}
              disabled={simulationRunning}
              className={`px-4 py-2 rounded-lg ${
                simulationRunning 
                  ? darkMode ? 'bg-gray-800 text-gray-500' : 'bg-gray-200 text-gray-400'
                  : darkMode 
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white' 
                    : 'bg-indigo-500 hover:bg-indigo-600 text-white'
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
              <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Day {day} of 30</span>
              <span className={simulationRunning ? 'text-indigo-500 animate-pulse' : 'text-gray-500'}>
                {simulationRunning ? 'Running...' : day > 0 ? 'Completed' : 'Not started'}
              </span>
            </div>
            <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{ width: `${(day / 30) * 100}%` }}
                animate={simulationRunning ? { opacity: [0.7, 1, 0.7] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Streak Length */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Current Streak
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.streakLength}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>days</span>
              </div>
            </div>
            
            {/* Success Rate */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Success Rate
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.successRate.toFixed(1)}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>%</span>
              </div>
            </div>
            
            {/* Completions */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Days Completed
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.completed}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>/ {day}</span>
              </div>
            </div>
            
            {/* Habit Strength */}
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-50'
            }`}>
              <div className={`text-sm mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Habit Strength
              </div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold mr-1">{simulationStats.habitStrength}</span>
                <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-600'}`}>/ 100</span>
              </div>
            </div>
          </div>
          
          {/* Habit Timeline */}
          <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className={`p-3 ${darkMode ? 'border-b border-gray-700' : 'border-b border-gray-200'}`}>
              <h5 className="font-medium text-sm">Habit Timeline</h5>
            </div>
            
            <div className="p-3 overflow-x-auto">
              <div className="flex mb-2">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`text-center text-xs flex-shrink-0 w-8 ${
                      darkMode ? 'text-gray-500' : 'text-gray-600'
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
                        ? darkMode ? 'bg-green-800/50 text-green-400' : 'bg-green-100 text-green-600'
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
                        darkMode ? 'bg-gray-700' : 'bg-gray-300'
                      }`}
                      style={{ top: `${100 - level}%` }}
                    >
                      <span className={`absolute -left-6 -translate-y-1/2 text-xs ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        {level}%
                      </span>
                    </div>
                  ))}
                  
                  {/* Strength line */}
                  <svg className="absolute inset-0 h-full w-full">
                    <defs>
                      <linearGradient id="strength-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={darkMode ? '#818cf8' : '#6366f1'} />
                        <stop offset="100%" stopColor={darkMode ? '#d946ef' : '#c026d3'} />
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
          className={`p-6 border-t ${darkMode ? 'border-gray-800 bg-indigo-900/10' : 'border-gray-200 bg-indigo-50'}`}
        >
          <h4 className="font-bold mb-2">Simulation Insights</h4>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
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
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Schedule your habit at the same time each day to build momentum.
                </p>
              </div>
            )}
            
            {params.cue < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Strengthen Cues</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Create obvious triggers that remind you to perform your habit.
                </p>
              </div>
            )}
            
            {params.difficulty > 60 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Reduce Difficulty</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Make your habit so small and easy it feels almost too simple.
                </p>
              </div>
            )}
            
            {params.reward < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Enhance Rewards</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Create immediate satisfaction after completing your habit.
                </p>
              </div>
            )}
            
            {params.environment < 50 && (
              <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="font-medium">Design Your Environment</div>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
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
                  : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
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