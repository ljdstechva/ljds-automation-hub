import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SpecialisationSection } from "@/components/SpecialisationSection";
import { AboutSection } from "@/components/AboutSection";
import { ToolsSection } from "@/components/ToolsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { CertificatesSection } from "@/components/CertificatesSection";
import { ContactSection } from "@/components/ContactSection";
import CanvasCursor from "@/components/CanvasCursor";
import FluidCursor from "@/components/FluidCursor";


const Index = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const [enableCursorEffects, setEnableCursorEffects] = useState(true);
  const projectsSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const pointerMedia = window.matchMedia("(pointer: fine)");

    const updatePointerState = () => {
      setEnableCursorEffects(pointerMedia.matches);
    };

    updatePointerState();
    pointerMedia.addEventListener("change", updatePointerState);

    return () => {
      pointerMedia.removeEventListener("change", updatePointerState);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      smoothWheel: true,
      lerp: 0.08,
      wheelMultiplier: 1.1,
    });

    let animationFrameId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    };

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
    };
  }, []);

  const handleToolClick = (filterTag: string) => {
    setSelectedTag(filterTag);
    // Scroll to projects section with offset for fixed nav
    if (projectsSectionRef.current) {
      const offset = 80;
      const elementPosition = projectsSectionRef.current.offsetTop - offset;
      window.scrollTo({ top: elementPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background relative">
      {enableCursorEffects && <FluidCursor />}
      {enableCursorEffects && <CanvasCursor />}

      <div className="relative z-10">
        <Navigation />
        <main>
        <HeroSection />
        <SpecialisationSection />
        <AboutSection />
        <ToolsSection onToolClick={handleToolClick} />
        <ProjectsSection
          ref={projectsSectionRef}
          selectedTag={selectedTag}
          onTagChange={setSelectedTag}
        />
        <CertificatesSection />
        <ContactSection />
        </main>

        {/* Footer */}
        <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t border-border">
          <p>© 2024 LJDS Tech. All rights reserved.</p>
        </footer>
        {/* <ChatbotWidget /> */}
      </div>
    </div>
  );
};

export default Index;
