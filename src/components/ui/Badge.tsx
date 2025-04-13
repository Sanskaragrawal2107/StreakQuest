import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

interface BadgeProps {
  name: string;
  icon: ReactNode;
  description: string;
  unlocked: boolean;
  color: string;
  onClick?: () => void;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ 
  name, 
  icon, 
  description, 
  unlocked, 
  color, 
  onClick,
  className = ''
}) => {
  const { darkMode } = useTheme();
  
  // Dynamically determine background colors based on color prop and unlocked state
  const getBgColor = () => {
    if (!unlocked) return darkMode ? 'bg-gray-700' : 'bg-neutral-200';
    
    // For unlocked achievements, use specified color with different gradient based on dark mode
    return darkMode 
      ? `bg-gradient-to-br from-${color}-900 to-${color}-800`
      : `bg-gradient-to-br from-${color}-400 to-${color}-600`;
  };
  
  // Get icon color
  const getIconColor = () => {
    if (!unlocked) return darkMode ? 'text-gray-500' : 'text-neutral-400';
    return 'text-white';
  };
  
  // Get text color for name
  const getNameColor = () => {
    if (!unlocked) return darkMode ? 'text-gray-400' : 'text-neutral-600';
    return darkMode ? `text-${color}-300` : `text-${color}-700`;
  };
  
  // Get description text color
  const getDescColor = () => {
    return darkMode ? 'text-gray-400' : 'text-neutral-500';
  };
  
  return (
    <motion.div 
      className={`p-4 rounded-xl border shadow-sm flex flex-col items-center text-center ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-neutral-100'
      } ${className}`}
      onClick={onClick}
    >
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl mb-3 ${getBgColor()}`}>
        <div className={getIconColor()}>
          {icon}
        </div>
      </div>
      <h3 className={`font-semibold text-sm mb-1 ${getNameColor()}`}>{name}</h3>
      <p className={`text-xs line-clamp-2 ${getDescColor()}`}>{description}</p>
    </motion.div>
  );
};

export default Badge; 