import { AnimatedBackgroundPaths } from "./animated-background-paths";

interface LoadingBackgroundProps {
  className?: string;
}

export function LoadingBackground({ className = "" }: LoadingBackgroundProps) {
  console.log("LoadingBackground rendering with className:", className);
  
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`} style={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}>
      {/* Debug: Visible background to confirm component renders */}
      <div className="absolute inset-0 border-2 border-blue-300 border-dashed opacity-30" />
      
      {/* Animated background with loading-specific styling - positioned to flow from top */}
      <AnimatedBackgroundPaths 
        variant="loading" 
        opacity={0.1}
        pathCount={24}
        className="transform translate-y-[-20%] scale-110" 
      />
      
      {/* Simplified gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background/80 pointer-events-none" />
    </div>
  );
}