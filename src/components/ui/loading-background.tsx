import { LoadingBackgroundPaths } from "./loading-background-paths";

interface LoadingBackgroundProps {
  className?: string;
  intensity?: "low" | "medium" | "high";
}

export function LoadingBackground({ 
  className = "", 
  intensity = "medium" 
}: LoadingBackgroundProps) {
  return (
    <div className={`relative rounded-lg ${className}`}>
      {/* New flowing background animation */}
      <LoadingBackgroundPaths 
        opacity={0.1}
        pathCount={30}
        intensity={intensity}
        className="transform scale-105"
      />
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background/20 pointer-events-none" />
    </div>
  );
}