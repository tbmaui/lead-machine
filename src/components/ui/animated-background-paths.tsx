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
  // Different viewBox and positioning for loading variant
  const viewBox = variant === 'loading' ? "0 0 696 500" : "0 0 696 316";
  
  // Generate paths for both directions
  const generatePaths = (position: number, startIndex: number = 0) => {
    return Array.from({ length: pathCount }, (_, i) => {
      const pathIndex = startIndex + i;
      
      // For loading variant, adjust path positioning to create flowing effect
      const yOffset = variant === 'loading' ? i * 8 : i * 6;
      const flowSpeed = variant === 'loading' ? 15 + Math.random() * 8 : 20 + Math.random() * 10;
      
      return (
        <motion.path
          key={pathIndex}
          d={`M-${380 - i * 5 * position} -${189 + yOffset}C-${
            380 - i * 5 * position
          } -${189 + yOffset} -${312 - i * 5 * position} ${216 - yOffset} ${
            152 - i * 5 * position
          } ${343 - yOffset}C${616 - i * 5 * position} ${470 - yOffset} ${
            684 - i * 5 * position
          } ${875 - yOffset} ${684 - i * 5 * position} ${875 - yOffset}`}
          stroke="currentColor"
          strokeWidth={0.5 + i * 0.03}
          strokeOpacity={opacity + i * 0.02}
          initial={{ pathLength: 0.3, opacity: 0.6 }}
          animate={{
            pathLength: 1,
            opacity: [0.2, 0.4, 0.2],
            pathOffset: [0, 1, 0],
          }}
          transition={{
            duration: flowSpeed,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
            delay: variant === 'loading' ? Math.random() * 3 : 0,
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