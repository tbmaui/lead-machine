"use client";

import { motion } from "framer-motion";

function LoadingFloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        // REVERSED paths - flip the coordinates for right-to-left flow
        d: `M${684 + i * 5 * position} -${189 + i * 6}C${
            684 + i * 5 * position
        } -${189 + i * 6} ${616 + i * 5 * position} ${216 - i * 6} ${
            152 + i * 5 * position
        } ${343 - i * 6}C-${312 + i * 5 * position} ${470 - i * 6} -${
            380 + i * 5 * position
        } ${875 - i * 6} -${380 + i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Loading Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width * 1.5} // Refined thickness
                        strokeOpacity={0.15 + path.id * 0.015} // Subtle, professional opacity
                        initial={{ pathLength: 0.3, opacity: 0.4 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.2, 0.5, 0.2], // Refined opacity range
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 15 + Math.random() * 8, // Faster animation
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function SimpleLoadingAnimation() {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {/* Two layers for visual depth */}
            <LoadingFloatingPaths position={1} />
            <LoadingFloatingPaths position={-1} />
        </div>
    );
}