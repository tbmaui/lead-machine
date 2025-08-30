import { AnimatedBackgroundPaths } from "./animated-background-paths";

interface LoadingBackgroundProps {
  className?: string;
}

export function LoadingBackground({ className = "" }: LoadingBackgroundProps) {
  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      {/* Animated background with loading-specific styling - positioned to flow from top */}
      <AnimatedBackgroundPaths 
        variant="loading" 
        opacity={0.04}
        pathCount={32}
        className="transform translate-y-[-30%] scale-125 rotate-1" 
      />
      
      {/* Additional layer for continuity effect */}
      <AnimatedBackgroundPaths 
        variant="loading" 
        opacity={0.02}
        pathCount={20}
        className="transform translate-y-[-40%] scale-150 -rotate-1" 
      />
      
      {/* Gradient overlay to create depth and readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/70 to-background/90 pointer-events-none" />
      
      {/* Top fade to blend with hero section */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-background to-transparent pointer-events-none" />
    </div>
  );
}