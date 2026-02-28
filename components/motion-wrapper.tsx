"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const FADE_UP = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: EASE_OUT },
};

export const FADE_SCALE = {
  initial: { opacity: 0, scale: 0.95 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true },
  transition: { duration: 0.8, ease: EASE_OUT },
};

export const STAGGER_CONTAINER = {
  initial: {},
  whileInView: { transition: { staggerChildren: 0.08 } },
  viewport: { once: true },
};

export const STAGGER_ITEM = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: EASE_OUT },
};

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
}

export function Reveal({ children, delay = 0, ...props }: MotionWrapperProps) {
  return (
    <motion.div 
      {...FADE_UP} 
      transition={{ ...FADE_UP.transition, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, ...props }: MotionWrapperProps) {
  return (
    <motion.div {...STAGGER_CONTAINER} {...props}>
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, ...props }: MotionWrapperProps) {
  return (
    <motion.div {...STAGGER_ITEM} {...props}>
      {children}
    </motion.div>
  );
}
