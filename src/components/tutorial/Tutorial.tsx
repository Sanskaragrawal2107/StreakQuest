import React from 'react';
import { FaTimes, FaArrowRight, FaArrowLeft, FaPlus, FaClipboardList } from 'react-icons/fa';
import { useTutorial } from '../../contexts/TutorialContext';
import { useTheme } from '../../contexts/ThemeContext';

const Tutorial: React.FC = () => {
  const { 
    showTutorial, 
    currentStep, 
    totalSteps, 
    nextStep, 
    prevStep, 
    closeTutorial,
    forceClose
  } = useTutorial();
  
  const { darkMode } = useTheme();

  // If the tutorial is hidden, don't render anything
  if (!showTutorial) {
    console.log("[Tutorial.tsx] Component not rendered (showTutorial is false)");
    return null;
  }

  console.log(`[Tutorial.tsx] Rendering step ${currentStep}`);

  const steps = [
    {
      title: "Welcome to StreakQuest!",
      content: (
        <div className="space-y-4">
          <p>
            Let's get you started on your habit building journey. Follow this quick tutorial to learn how to create and track your first habit.
          </p>
          <div className="flex items-center p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
            <FaClipboardList className="mr-3 text-xl" />
            <p className="text-sm">
              StreakQuest helps you build lasting habits through consistent tracking and motivation.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "Creating Your First Habit",
      content: (
        <div className="space-y-4">
          <p>
            To get started, click the <span className="font-medium text-indigo-600 dark:text-indigo-400">"New Habit"</span> button on your dashboard.
          </p>
          <div className="flex justify-center my-4">
            <button 
              className="btn btn-primary flex items-center px-4 py-2 rounded-lg"
              type="button"
            >
              <FaPlus className="mr-2" />
              <span>New Habit</span>
            </button>
          </div>
          <p>
            Fill in the details about your habit including:
          </p>
          <ul className="list-disc list-inside space-y-2 ml-4 text-sm">
            <li>Name (what habit you want to build)</li>
            <li>Category (fitness, health, learning, etc.)</li>
            <li>Frequency (which days of the week)</li>
            <li>Repetitions (how many times per day)</li>
            <li><span className="font-medium">Frequency Note:</span> Habits only show in the "Today" view if their frequency includes the current day of the week.</li>
          </ul>
        </div>
      ),
    },
    {
      title: "Setting Repetitions",
      content: (
        <div className="space-y-4">
          <p>
            For habits you want to do multiple times per day (like drinking water):
          </p>
          <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <label className="block text-sm font-medium mb-2">
              Repetitions Per Day
            </label>
            <div className="flex items-center mb-2">
              <input
                type="number"
                value="3"
                className={`w-20 px-3 py-2 border rounded-md ${
                  darkMode 
                    ? 'bg-gray-800 border-gray-700 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
                readOnly
              />
              <div className="ml-2 text-sm font-medium text-indigo-500">
                3 times per day
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              You can enter any number between 1-10. Each repetition counts toward completing the habit for the day.
            </p>
          </div>
          <p className="text-sm bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-green-700 dark:text-green-300">
            <strong>Tip:</strong> For simple habits you complete once daily, keep this at 1. For habits like "Drink water" that you do multiple times, set a higher number.
          </p>
        </div>
      ),
    }
  ];

  // Ensure currentStep is valid
  const stepIndex = Math.max(0, Math.min(currentStep - 1, steps.length - 1));
  const currentStepData = steps[stepIndex];

  return (
    // Use a portal or ensure high z-index if needed, but z-50 should be enough
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      // Add an overlay click handler to close, ensuring it doesn't trigger on modal content clicks
      onClick={(e) => {
        if (e.target === e.currentTarget) { 
          console.log('[Tutorial.tsx] Overlay clicked');
          closeTutorial();
        }
      }}
    >
      {/* Stop propagation on the modal content itself */}
      <div
        className={`relative rounded-xl shadow-2xl w-full max-w-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside modal from closing it via overlay handler
      >
        {/* Emergency Close Button */}
        <button
          type="button"
          onClick={(e) => {
            console.log('[Tutorial.tsx] EMERGENCY CLOSE clicked');
            e.stopPropagation(); 
            forceClose(); // Use forceClose from context
          }}
          className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-[51] hover:bg-red-700 transition-colors"
          aria-label="Emergency Close Tutorial"
        >
          Force Close
        </button>
        
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {currentStepData?.title || 'Tutorial'} {/* Added fallback title */}
          </h2>
          <button 
            type="button"
            onClick={(e) => {
              console.log('[Tutorial.tsx] Close (X) clicked');
              e.stopPropagation();
              closeTutorial();
            }}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close Tutorial"
          >
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 min-h-[150px]"> {/* Added min-height */} 
          {currentStepData?.content || <p>Loading tutorial content...</p>} {/* Added fallback content */} 
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Step {currentStep} of {totalSteps}
          </div>
          <div className="flex space-x-2">
            {/* Back Button */} 
            {currentStep > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  console.log('[Tutorial.tsx] Back button clicked');
                  e.stopPropagation();
                  prevStep();
                }}
                className={`px-4 py-2 rounded-lg flex items-center ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors`}
              >
                <FaArrowLeft className="mr-1" />
                <span>Back</span>
              </button>
            )}
            {/* Next/Finish Button */} 
            <button
              type="button"
              onClick={(e) => {
                console.log('[Tutorial.tsx] Next/Finish button clicked');
                e.stopPropagation();
                nextStep();
              }}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center transition-colors"
            >
              <span>{currentStep === totalSteps ? 'Finish' : 'Next'}</span>
              {currentStep !== totalSteps && <FaArrowRight className="ml-1" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial; 