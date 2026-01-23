import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import laurenzPhoto from "@/assets/laurenz-forward-new.png";
import { Magnet } from "@/components/Magnet";
import { BookingDialog } from "@/components/BookingDialog";

const HERO_TITLES = [
  "AI Automation Specialist",
  "AI Workflow Specialist",
  "High-Level Automation Specialist",
];

export const HeroSection = () => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState(HERO_TITLES[0]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTitle = HERO_TITLES[titleIndex];
    let timeout = 0;

    if (!isDeleting) {
      if (displayTitle === currentTitle) {
        timeout = window.setTimeout(() => {
          setIsDeleting(true);
        }, 3200);
      } else {
        timeout = window.setTimeout(() => {
          setDisplayTitle(currentTitle.slice(0, displayTitle.length + 1));
        }, 90);
      }
    } else {
      if (displayTitle.length === 0) {
        timeout = window.setTimeout(() => {
          setIsDeleting(false);
          setTitleIndex((prev) => (prev + 1) % HERO_TITLES.length);
        }, 700);
      } else {
        timeout = window.setTimeout(() => {
          setDisplayTitle(currentTitle.slice(0, displayTitle.length - 1));
        }, 60);
      }
    }

    return () => window.clearTimeout(timeout);
  }, [displayTitle, isDeleting, titleIndex]);
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-glow-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Hi, I'm{" "}
                <span className="text-primary">Laurenz</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl italic leading-tight text-foreground/90">
                <span className="inline-flex items-baseline gap-2 min-h-[1.6em] min-w-[24ch]">
                  <span>
                    {displayTitle}
                  </span>
                  <span className="inline-block w-[0.12em] h-[1em] bg-foreground/80 animate-blink" />
                </span>
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              I design and build automation systems that turn messy processes into reliable workflows, combining a decade of Chemical Engineering experience with modern AI tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <BookingDialog
                trigger={
                  <Magnet>
                    <Button
                      size="lg"
                      className="text-base sm:text-lg px-6 sm:px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
                    >
                      <Calendar className="mr-2 h-5 w-5" />
                      Book an Automation Call
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Magnet>
                }
              />

              <Button
                size="lg"
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-6 border-2 hover:bg-secondary transition-all"
                onClick={() => scrollToSection("projects")}
              >
                View My Projects
              </Button>
            </div>

            <div className="pt-4 space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                From Chemical Engineer to AI Automation Specialist
              </p>
              <p className="text-sm text-muted-foreground">
                Helping creators and teams save hours every week
              </p>
            </div>
          </div>

          {/* Portrait */}
          <div className="relative hidden lg:flex items-center justify-center lg:justify-end animate-scale-in">
            <div className="relative group">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl scale-110 animate-glow-pulse" />

              {/* Hover outer glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-2xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="absolute -top-6 -right-6 z-20 transition-transform duration-300">
                <div className="bg-background/80 backdrop-blur-md border border-accent px-6 py-4 rounded-2xl animate-breathing-glow flex items-center gap-4 will-change-transform">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping-smooth absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 animate-green-glow"></span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Current Status</span>
                    <span className="text-sm font-bold text-foreground leading-none mt-1">Available for Work</span>
                  </div>
                </div>
              </div>

              {/* Portrait image */}
              {/* Portrait image with animated circle border */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">

                {/* Wrapper to apply the -90deg static rotation */}
                <div className="absolute -inset-2 w-[calc(100%+1rem)] h-[calc(100%+1rem)] -rotate-90">
                  {/* SVG gets only the smooth orbit animation */}
                  <svg className="w-full h-full animate-orbit">
                    <defs>
                      <linearGradient id="gradient-about-segment" x1="0%" y1="0%" x2="50%" y2="50%">
                        {/* symmetric gradient: 0% and 100% match */}
                        <stop offset="0%" stopColor="hsl(16, 100%, 60%)" stopOpacity="0.2" />
                        <stop offset="40%" stopColor="hsl(16, 100%, 60%)" stopOpacity="1" />
                        <stop offset="60%" stopColor="hsl(16, 100%, 70%)" stopOpacity="1" />
                        <stop offset="100%" stopColor="hsl(16, 100%, 60%)" stopOpacity="0.2" />
                      </linearGradient>
                      <filter id="glow-about">
                        <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                        <feMerge>
                          <feMergeNode in="coloredBlur" />
                          <feMergeNode in="SourceGraphic" />
                        </feMerge>
                      </filter>
                    </defs>

                    <circle
                      cx="50%"
                      cy="50%"
                      r="48%"
                      fill="none"
                      stroke="url(#gradient-about-segment)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      filter="url(#glow-about)"
                    />
                  </svg>
                </div>

                {/* --- Portrait Image --- */}
                <img
                  src={laurenzPhoto}
                  alt="Laurenz Julian"
                  className="relative w-full h-full object-cover object-[20%_50%] rounded-full shadow-2xl ring-4 ring-background"
                />
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
