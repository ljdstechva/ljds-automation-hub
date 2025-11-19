import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
import { SpecialisationSection } from "@/components/SpecialisationSection";
import { AboutSection } from "@/components/AboutSection";
import { ToolsSection } from "@/components/ToolsSection";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ContactSection } from "@/components/ContactSection";
import { CursorRibbons } from "@/components/CursorRibbons";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <CursorRibbons color="hsl(16, 100%, 55%)" speed={0.7} thickness={10} maxAge={250} fade={true} />
      <Navigation />
      <main>
        <HeroSection />
        <SpecialisationSection />
        <AboutSection />
        <ToolsSection />
        <ProjectsSection />
        <ContactSection />
      </main>
      
      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2024 LJDS Tech. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Index;