import { useState, useEffect } from "react";
import { Check, Terminal, Zap, Database, Cpu } from "lucide-react";

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);

  const steps = [
    { text: "Initializing automation protocols...", icon: Terminal },
    { text: "Connecting to neural networks...", icon: Cpu },
    { text: "Optimizing workflow logic...", icon: Zap },
    { text: "Syncing database nodes...", icon: Database },
    { text: "System ready.", icon: Check },
  ];

  useEffect(() => {
    // Total duration approx 2.5-3 seconds
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          // Trigger exit animation
          setIsExiting(true);
          // Wait for exit animation to finish before unmounting (match duration of glitch-out: 0.5s)
          setTimeout(onComplete, 500); 
          return 100;
        }
        // Non-linear progress for a more realistic feel
        const diff = 100 - prev;
        const increment = Math.max(1, Math.random() * (diff / 10)); 
        return Math.min(100, prev + increment);
      });
    }, 50);

    return () => clearInterval(progressInterval);
  }, [onComplete]);

  useEffect(() => {
    // Update steps based on progress
    if (progress < 30) setCurrentStep(0);
    else if (progress < 50) setCurrentStep(1);
    else if (progress < 70) setCurrentStep(2);
    else if (progress < 90) setCurrentStep(3);
    else setCurrentStep(4);
  }, [progress]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-foreground overflow-hidden transition-all duration-300 ${isExiting ? "animate-glitch-out" : ""}`}>
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      
      {/* Grid Pattern Removed */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div> */}

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4">
        {/* Main Logo/Icon Area */}
        <div className="mb-12 relative">
          <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse" />
          <div className="relative w-24 h-24 border-2 border-primary/50 rounded-full flex items-center justify-center bg-background/50 backdrop-blur-sm shadow-[0_0_15px_rgba(var(--primary),0.5)] animate-spin-slow">
             {/* Inner rotating ring */}
             <div className="absolute inset-2 border-t-2 border-primary rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
             <div className="absolute inset-4 border-b-2 border-accent rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
             
             {/* Center Icon */}
             <Zap className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>

        {/* Text Status */}
        <div className="h-8 mb-4 flex items-center justify-center gap-2 transition-all duration-300 transform">
            {steps[currentStep] && (() => {
                const Icon = steps[currentStep].icon;
                return (
                    <>
                        <Icon className="w-4 h-4 text-muted-foreground animate-bounce" />
                        <span className="text-sm font-medium tracking-widest uppercase text-muted-foreground animate-pulse">
                            {steps[currentStep].text}
                        </span>
                    </>
                );
            })()}
        </div>

        {/* Progress Bar Container */}
        <div className="w-full h-1 bg-secondary/30 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-100 ease-out relative"
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer effect on bar */}
            <div className="absolute inset-0 w-full h-full bg-white/20 animate-[shimmer_1s_infinite] translate-x-[-100%]" />
          </div>
        </div>

        {/* Percentage */}
        <div className="mt-2 w-full flex justify-end">
            <span className="text-xs font-mono text-muted-foreground">{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
