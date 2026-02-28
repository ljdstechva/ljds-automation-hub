"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export function GridBeam() {
  const [beams] = useState(() => {
    // Generate some random beams that align with the 64px grid from globals.css
    return Array.from({ length: 5 }).map((_, i) => ({
      id: i,
      x: Math.floor(Math.random() * 20) * 64, // Align to grid
      y: Math.floor(Math.random() * 20) * 64,
      length: 150 + Math.random() * 200,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 10,
    }));
  });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30" aria-hidden="true">
      <svg width="100%" height="100%" className="w-full h-full">
        {beams.map((beam) => (
          <motion.path
            key={beam.id}
            d={`M${beam.x} ${beam.y} L${beam.x} ${beam.y + 1000}`} // Vertical beam
            stroke="url(#beam-gradient)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0, pathOffset: -1 }}
            animate={{ 
              pathLength: [0, 0.2, 0], 
              pathOffset: [0, 1.2] 
            }}
            transition={{
              duration: beam.duration,
              repeat: Infinity,
              ease: "linear",
              delay: beam.delay,
            }}
          />
        ))}
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
