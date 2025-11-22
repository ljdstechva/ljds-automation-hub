import { useState, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SpecialisationSection } from "@/components/SpecialisationSection";
import { AboutSection } from "@/components/AboutSection";
import { ToolsSection } from "@/components/ToolsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { CursorRibbons } from "@/components/CursorRibbons";
import { ChatbotWidget } from "@/components/Chatbot";

const Index = () => {
  const [selectedTag, setSelectedTag] = useState("All");
  const projectsSectionRef = useRef<HTMLElement>(null);

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
    <div className="min-h-screen bg-background">
      <CursorRibbons color="hsl(16, 100%, 55%)" speed={0.7} thickness={10} fade={true} maxAge={250} />

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
        <ContactSection />
        
      </main>

      
      
      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2024 LJDS Tech. All rights reserved.</p>
      </footer>
      <ChatbotWidget />
    </div>
  );
};

export default Index;