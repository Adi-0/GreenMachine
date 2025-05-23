
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'text-green-DEFAULT' }) => {
  let spinnerSize = 'w-8 h-8';
  if (size === 'sm') spinnerSize = 'w-5 h-5';
  if (size === 'lg') spinnerSize = 'w-12 h-12';

  return (
    <div className="flex justify-center items-center">
      <div 
        className={`animate-spin rounded-full ${spinnerSize} border-t-2 border-b-2 ${color.startsWith('text-') ? `border-${color.substring(5)}` : `border-${color}`}`}
        style={{ borderColor: color.startsWith('text-') ? undefined : color, borderTopColor: 'transparent', borderBottomColor: 'transparent' }} // Tailwind JIT might not pick up dynamic border colors, so use explicit for non-tailwind colors.
      ></div>
    </div>
  );
};

export default LoadingSpinner;
    