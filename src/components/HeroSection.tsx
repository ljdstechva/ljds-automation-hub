import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import emojiFace from "@/assets/emoji-face.png";



export const HeroSection = () => {
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
      className="min-h-screen flex items-center justify-center pt-20 px-4 sm:px-6 lg:px-8 relative overflow-visible mb-16 rounded-b-[60px] bg-gradient-to-b from-background to-background/95"
      style={{
        boxShadow: '0 30px 60px -20px rgba(255, 95, 31, 0.15), 0 50px 100px -30px rgba(0, 0, 0, 0.1)'
      }}
    >
      {/* Floating Lines Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-b-[60px]">
        <svg className="w-full h-full opacity-30">
          <defs>
            <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(16, 100%, 55%)', stopOpacity: 0.8 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(16, 100%, 55%)', stopOpacity: 0.2 }} />
            </linearGradient>
            <linearGradient id="lineGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style={{ stopColor: 'hsl(16, 100%, 65%)', stopOpacity: 0.6 }} />
              <stop offset="100%" style={{ stopColor: 'hsl(16, 100%, 55%)', stopOpacity: 0.1 }} />
            </linearGradient>
          </defs>
          <g className="animate-float" style={{ transformOrigin: 'center' }}>
            <line x1="5%" y1="10%" x2="25%" y2="90%" stroke="url(#lineGradient1)" strokeWidth="3" strokeLinecap="round" />
            <line x1="20%" y1="5%" x2="40%" y2="95%" stroke="url(#lineGradient1)" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="animate-float" style={{ animationDelay: '1.5s', animationDuration: '28s', transformOrigin: 'center' }}>
            <line x1="60%" y1="8%" x2="80%" y2="92%" stroke="url(#lineGradient2)" strokeWidth="3" strokeLinecap="round" />
            <line x1="75%" y1="15%" x2="95%" y2="85%" stroke="url(#lineGradient2)" strokeWidth="2" strokeLinecap="round" />
          </g>
          <g className="animate-float" style={{ animationDelay: '3s', animationDuration: '32s', transformOrigin: 'center' }}>
            <line x1="35%" y1="20%" x2="45%" y2="80%" stroke="url(#lineGradient1)" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50%" y1="12%" x2="65%" y2="88%" stroke="url(#lineGradient2)" strokeWidth="2" strokeLinecap="round" />
          </g>
        </svg>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden rounded-b-[60px]">
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
                AI Automation Specialist
              </h2>
            </div>

            <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl">
              I design and build automation systems that turn messy processes into reliable workflows, combining a decade of Chemical Engineering experience with modern AI tools.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-base sm:text-lg px-6 sm:px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all group"
                onClick={() => scrollToSection("contact")}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book an Automation Call
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

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
          <div className="relative flex items-center justify-center lg:justify-end animate-scale-in">
            <div className="relative">
              {/* Glowing background effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full blur-3xl scale-110 animate-glow-pulse" />
              
              {/* Floating geometric shapes */}
              <div className="absolute -top-8 -right-8 w-32 h-32 border-4 border-primary/20 rounded-lg rotate-12 animate-float" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-primary/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
              
              {/* Portrait image */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem]">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-full" />
                <img
                  src={emojiFace}
                  alt="Laurenz Julian"
                  className="relative w-full h-full object-cover rounded-full shadow-2xl ring-4 ring-background"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};