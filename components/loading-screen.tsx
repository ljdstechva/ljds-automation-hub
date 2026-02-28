"use client";

import { useEffect, useRef, useState } from "react";
import { CheckIcon, CpuIcon, DatabaseIcon, TerminalIcon, ZapIcon } from "@/components/icons";

type LoadingScreenProps = {
  progress: number;
  onComplete: () => void;
};

const steps = [
  { text: "Initializing automation protocols...", Icon: TerminalIcon },
  { text: "Connecting to neural networks...", Icon: CpuIcon },
  { text: "Optimizing workflow logic...", Icon: ZapIcon },
  { text: "Syncing database nodes...", Icon: DatabaseIcon },
  { text: "System ready.", Icon: CheckIcon },
];

export function LoadingScreen({ progress, onComplete }: LoadingScreenProps) {
  const [displayProgress, setDisplayProgress] = useState(0);
  const completionTriggeredRef = useRef(false);

  useEffect(() => {
    if (displayProgress >= progress) {
      return;
    }

    const timer = window.setInterval(() => {
      setDisplayProgress((previous) => {
        const difference = progress - previous;
        if (difference <= 0) {
          window.clearInterval(timer);
          return previous;
        }

        return Math.min(progress, previous + Math.max(1, Math.ceil(difference / 10)));
      });
    }, 30);

    return () => window.clearInterval(timer);
  }, [displayProgress, progress]);

  const isExiting = progress >= 100 && displayProgress >= 100;

  useEffect(() => {
    if (!isExiting || completionTriggeredRef.current) {
      return;
    }

    completionTriggeredRef.current = true;
    const timer = window.setTimeout(onComplete, 500);
    return () => window.clearTimeout(timer);
  }, [isExiting, onComplete]);

  const currentStep =
    displayProgress < 30 ? 0 : displayProgress < 50 ? 1 : displayProgress < 70 ? 2 : displayProgress < 90 ? 3 : 4;
  const StepIcon = steps[currentStep]?.Icon ?? ZapIcon;

  return (
    <div className={`loading-overlay ${isExiting ? "loading-overlay--exit" : ""}`}>
      <div className="loading-overlay__ambient" aria-hidden="true" />

      <div className="loading-overlay__content">
        <div className="loading-orb" aria-hidden="true">
          <div className="loading-orb__ring loading-orb__ring--outer" />
          <div className="loading-orb__ring loading-orb__ring--inner" />
          <ZapIcon className="icon loading-orb__icon" />
        </div>

        <div className="loading-status">
          <StepIcon className="icon" />
          <span>{steps[currentStep]?.text}</span>
        </div>

        <div className="loading-progress">
          <div className="loading-progress__bar" style={{ width: `${displayProgress}%` }}>
            <span className="loading-progress__shine" aria-hidden="true" />
          </div>
        </div>

        <p className="loading-progress__text">{Math.floor(displayProgress)}%</p>
      </div>
    </div>
  );
}
