"use client";

import { motion } from "framer-motion";

interface LoadingBackgroundPathsProps {
  opacity?: number;
  pathCount?: number;
  className?: string;
  intensity?: "low" | "medium" | "high";
}

function FloatingPaths({ 
  position, 
  opacity = 0.05, 
  pathCount = 24,
  intensity = "medium" 
}: { 
  position: number; 
  opacity: number; 
  pathCount: number;
  intensity: "low" | "medium" | "high";
}) {
  // Adjust animation parameters based on intensity
  const intensityConfig = {
    low: { baseSpeed: 25, speedVariance: 5, baseOpacity: 0.03 },
    medium: { baseSpeed: 15, speedVariance: 8, baseOpacity: 0.05 },
    high: { baseSpeed: 8, speedVariance: 12, baseOpacity: 0.08 }
  };
  
  const config = intensityConfig[intensity];

  const paths = Array.from({ length: pathCount }, (_, i) => {
    // Create paths that flow from right to left for continuity
    // Reverse the original path coordinates for right-to-left flow
    const reversePosition = position * -1; // Flip direction
    
    return {
      id: i,
      d: `M${1200 + i * 8 * reversePosition} -${150 + i * 8}C${
        1200 + i * 8 * reversePosition
      } -${150 + i * 8} ${800 + i * 6 * reversePosition} ${300 - i * 8} ${
        400 + i * 8 * reversePosition
      } ${500 - i * 8}C-${200 + i * 8 * reversePosition} ${700 - i * 8} -${
        600 + i * 8 * reversePosition
      } ${900 - i * 8} -${800 + i * 8 * reversePosition} ${1000 - i * 8}`,
      width: 0.3 + i * 0.02,
      opacity: Math.max(0.1, config.baseOpacity + i * 0.015),
      speed: config.baseSpeed + Math.random() * config.speedVariance,
      delay: i * 0.3
    };
  });

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full text-primary dark:text-primary"
        viewBox="-500 -200 1696 816"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Loading Animation Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width * 3} // DEBUG: Make lines thicker
            strokeOpacity={Math.max(0.8, path.opacity * 5)} // DEBUG: Make much more visible
            fill="none"
            strokeDasharray="8 4"
            initial={{ pathLength: 0, opacity: 0.5 }}
            animate={{
              pathLength: [0, 1, 0],
              opacity: [0.5, 0.9, 0.5], // DEBUG: More visible opacity
              strokeDashoffset: [0, -30, -60],
            }}
            transition={{
              duration: path.speed,
              repeat: Infinity,
              ease: "linear",
              delay: path.delay,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function LoadingBackgroundPaths({
  opacity = 0.05,
  pathCount = 24,
  className = "",
  intensity = "medium"
}: LoadingBackgroundPathsProps) {
  return (
    <div className={`absolute inset-0 ${className}`}>
      
      {/* Multiple layers for depth effect */}
      <FloatingPaths position={1} opacity={opacity} pathCount={pathCount} intensity={intensity} />
      <FloatingPaths position={-1} opacity={opacity * 0.7} pathCount={Math.floor(pathCount * 0.6)} intensity={intensity} />
      
      {/* Subtle gradient overlay to blend with background */}
      <div className="absolute inset-0 bg-gradient-to-r from-background/20 via-transparent to-background/20 pointer-events-none" />
    </div>
  );
}