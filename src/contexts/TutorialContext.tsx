import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface TutorialContextType {
  showTutorial: boolean;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  closeTutorial: () => void;
  openTutorial: () => void;
  markTutorialComplete: () => void;
  forceClose: () => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

interface TutorialProviderProps {
  children: ReactNode;
}

export const TutorialProvider: React.FC<TutorialProviderProps> = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3; // Total number of tutorial steps

  // Check localStorage on mount to potentially show the tutorial
  useEffect(() => {
    console.log("[TutorialContext] Checking if tutorial should be shown on mount...");
    try {
      const tutorialCompleted = localStorage.getItem('streakquest_tutorial_completed');
      const hasHabitsRaw = localStorage.getItem('streakquest_habits');
      
      let habitsList = []; // Default to an empty array
      if (hasHabitsRaw && hasHabitsRaw.trim() !== '') {
        try {
          habitsList = JSON.parse(hasHabitsRaw);
          // Ensure it's actually an array after parsing
          if (!Array.isArray(habitsList)) {
              console.warn("[TutorialContext] Parsed habits from localStorage is not an array, treating as no habits.");
              habitsList = []; 
          }
        } catch (parseError) {
          console.error("[TutorialContext] Error parsing habits from localStorage:", parseError);
          habitsList = []; // Treat as no habits if parsing fails
        }
      }
      const hasHabits = habitsList.length > 0;
      
      console.log(`[TutorialContext] Status check: tutorialCompleted=${tutorialCompleted}, hasHabits=${hasHabits}`);
      
      // Show tutorial ONLY if it hasn't been completed AND the user has no habits
      if (!tutorialCompleted && !hasHabits) {
        console.log("[TutorialContext] Conditions met: Initializing tutorial for new user.");
        setShowTutorial(true);
        setCurrentStep(1); // Start at step 1
      } else {
        console.log(`[TutorialContext] Tutorial will not auto-show.`);
        setShowTutorial(false); // Explicitly ensure it's false if conditions aren't met
      }
    } catch (error) {
      console.error("[TutorialContext] Error during initial tutorial status check:", error);
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  // Use functional updates to ensure latest state
  const nextStep = () => {
    setCurrentStep(prev => {
      const next = prev + 1;
      console.log(`[TutorialContext] nextStep called. Current: ${prev}, Next: ${next}, Total: ${totalSteps}`);
      if (next > totalSteps) {
        console.log("[TutorialContext] Finishing tutorial.");
        markTutorialComplete(); // Mark as complete
        setShowTutorial(false); // Hide the tutorial
        return prev; // Keep current step unchanged when finishing
      } else {
        console.log(`[TutorialContext] Moving to step ${next}.`);
        return next; // Update to the next step
      }
    });
  };

  const prevStep = () => {
    setCurrentStep(prev => {
      const previous = prev - 1;
      console.log(`[TutorialContext] prevStep called. Current: ${prev}, Previous: ${previous}`);
      if (previous < 1) {
        console.warn("[TutorialContext] Already at first step.");
        return prev; // Stay at step 1
      }
      console.log(`[TutorialContext] Moving to step ${previous}.`);
      return previous;
    });
  };

  const closeTutorial = () => {
    console.log("[TutorialContext] closeTutorial called.");
    setShowTutorial(false);
    markTutorialComplete(); // Mark as complete when closed manually
  };

  const openTutorial = () => {
    console.log("[TutorialContext] openTutorial called.");
    setShowTutorial(true);
    setCurrentStep(1); // Reset to step 1 when opened manually
  };

  const markTutorialComplete = () => {
    console.log("[TutorialContext] Marking tutorial as complete in localStorage.");
    try {
      localStorage.setItem('streakquest_tutorial_completed', 'true');
    } catch (error) {
      console.error("[TutorialContext] Failed to mark tutorial complete in localStorage:", error);
    }
  };

  // Add a direct emergency close method for debugging
  const forceClose = () => {
    console.warn("[TutorialContext] FORCE CLOSING TUTORIAL via forceClose.");
    setShowTutorial(false);
    markTutorialComplete(); // Also mark complete on force close
  };

  return (
    <TutorialContext.Provider
      value={{
        showTutorial,
        currentStep,
        totalSteps,
        nextStep,
        prevStep,
        closeTutorial,
        openTutorial,
        markTutorialComplete,
        forceClose
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}; 