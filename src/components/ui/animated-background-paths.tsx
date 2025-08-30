import { motion } from "framer-motion";

interface AnimatedBackgroundPathsProps {
  opacity?: number;
  pathCount?: number;
  className?: string;
  variant?: 'hero' | 'loading';
}

export function AnimatedBackgroundPaths({ 
  opacity = 0.05, 
  pathCount = 36, 
  className = "", 
  variant = 'hero' 
}: AnimatedBackgroundPathsProps) {
  console.log("AnimatedBackgroundPaths rendering:", { variant, pathCount, opacity, className });
  // Different viewBox and positioning for loading variant
  const viewBox = variant === 'loading' ? "0 0 696 500" : "0 0 696 316";
  
  // Generate paths for both directions
  const generatePaths = (position: number, startIndex: number = 0) => {
    return Array.from({ length: pathCount }, (_, i) => {
      const pathIndex = startIndex + i;
      
      // For loading variant, adjust path positioning to create flowing effect
      const yOffset = variant === 'loading' ? i * 8 : i * 6;
      const flowSpeed = variant === 'loading' ? 8 + Math.random() * 4 : 12 + Math.random() * 6;
      
      // Simplified path that stays within viewBox
      const startX = 50 + i * 15 * position;
      const startY = 50 + yOffset;
      const midX = 300 + i * 10 * position;  
      const midY = 150 + yOffset * 0.5;
      const endX = 650 + i * 5 * position;
      const endY = 250 + yOffset * 0.3;
      
      return (
        <motion.path
          key={pathIndex}
          d={`M${startX} ${startY}Q${midX} ${midY} ${endX} ${endY}`}
          stroke="#3b82f6"
          strokeWidth={1 + i * 0.05}
          strokeOpacity={Math.max(0.2, opacity + i * 0.03)}
          fill="none"
          strokeDasharray="10 5"
          initial={{ pathLength: 0, opacity: 0.4 }}
          animate={{
            pathLength: 1,
            opacity: [0.4, 0.8, 0.4],
            strokeDashoffset: [0, -50, -100],
          }}
          transition={{
            duration: flowSpeed,
            repeat: Infinity,
            ease: "linear",
            delay: variant === 'loading' ? i * 0.2 : 0,
          }}
        />
      );
    });
  };

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <svg
        className="w-full h-full text-slate-950 dark:text-white"
        viewBox={viewBox}
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Animated Background Paths</title>
        {/* Forward flowing paths */}
        {generatePaths(1, 0)}
        {/* Backward flowing paths */}
        {generatePaths(-1, pathCount)}
      </svg>
    </div>
  );
}