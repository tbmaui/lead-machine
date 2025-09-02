import { ReactNode } from 'react';

interface AdaptiveSearchLayoutProps {
  children: ReactNode;
  currentStep: 'setup' | 'searching' | 'results';
  className?: string;
}

export const AdaptiveSearchLayout = ({
  children,
  currentStep,
  className = ''
}: AdaptiveSearchLayoutProps) => {
  
  const getLayoutClasses = () => {
    switch (currentStep) {
      case 'setup':
        // Form-focused layout - single column, centered
        return 'max-w-4xl mx-auto';
      
      case 'searching':
        // Progress-focused layout - centered, narrow
        return 'max-w-2xl mx-auto text-center';
      
      case 'results':
        // Data-focused layout - full width for tables and charts
        return 'max-w-[1400px] mx-auto';
      
      default:
        return 'max-w-4xl mx-auto';
    }
  };

  const getStepSpecificClasses = () => {
    switch (currentStep) {
      case 'setup':
        return 'space-y-8';
      
      case 'searching':
        return 'space-y-6 py-8';
      
      case 'results':
        return 'space-y-6';
      
      default:
        return 'space-y-8';
    }
  };

  return (
    <div 
      className={`
        ${getLayoutClasses()} 
        ${getStepSpecificClasses()} 
        ${className}
      `}
      data-layout-step={currentStep}
    >
      {children}
    </div>
  );
};