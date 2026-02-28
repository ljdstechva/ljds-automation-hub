"use client";

import { useEffect, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingScreen } from "@/components/loading-screen";

type ExperienceShellProps = {
  children: ReactNode;
};

const preloadTargets = [
  "/media/profile/laurenz-forward-new.png",
  "/media/profile/laurenz-away-new.png",
  "/media/branding/logo-horizontal-dark.png",
  "/media/branding/logo-horizontal-light.png",
];

const FluidCursor = dynamic(() => import("@/components/fluid-cursor").then((module) => module.FluidCursor), {
  ssr: false,
});

const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

function preloadImages(onProgress: (value: number) => void) {
  let loaded = 0;
  const total = preloadTargets.length;

  const promises = preloadTargets.map((src) =>
    new Promise<void>((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => {
        loaded += 1;
        onProgress(Math.round((loaded / total) * 100));
        resolve();
      };
      image.onerror = () => {
        loaded += 1;
        onProgress(Math.round((loaded / total) * 100));
        resolve();
      };
    }),
  );

  return Promise.all(promises);
}

export function ExperienceShell({ children }: ExperienceShellProps) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [unlockCompletion, setUnlockCompletion] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    const pointerMedia = window.matchMedia("(pointer: fine)");

    const updatePointerState = () => {
      setShowCursor(pointerMedia.matches);
    };

    updatePointerState();
    pointerMedia.addEventListener("change", updatePointerState);

    return () => {
      pointerMedia.removeEventListener("change", updatePointerState);
    };
  }, []);

  useEffect(() => {
    const unlockTimer = window.setTimeout(() => {
      setUnlockCompletion(true);
    }, 1200);

    preloadImages(setProgress)
      .then(() => {
        setProgress(100);
      })
      .catch(() => {
        setProgress(100);
      });

    return () => {
      window.clearTimeout(unlockTimer);
    };
  }, []);

  const loadingProgress = unlockCompletion ? progress : Math.min(progress, 96);

  return (
    <>
      {showCursor && !loading && <FluidCursor />}
      
      <AnimatePresence mode="wait">
        {loading ? (
          <LoadingScreen 
            key="loader"
            progress={loadingProgress} 
            onComplete={() => setLoading(false)} 
          />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            className="experience-content"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
