import laurenzPhoto from "@/assets/laurenz-away-new.png";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            About <span className="text-primary">Me</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 items-center">
          {/* Avatar */}
          <div className="flex justify-center lg:justify-start animate-scale-in">
            <div className="relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              {/* Hover outer glow */}
              <div className="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-110 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                {/* Animated glowing circle */}
                <svg className="absolute inset-0 w-full h-full -rotate-90" style={{ filter: 'drop-shadow(0 0 6px hsl(var(--primary)))' }}>
                  <circle
                    cx="50%"
                    cy="50%"
                    r="48%"
                    fill="none"
                    stroke="url(#gradient-about)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="8 192"
                    className="animate-spin"
                    style={{ animationDuration: '4s' }}
                  />
                  <defs>
                    <linearGradient id="gradient-about" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="1" />
                      <stop offset="50%" stopColor="hsl(16, 100%, 65%)" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                    </linearGradient>
                  </defs>
                </svg>
                
                <img
                  src={laurenzPhoto}
                  alt="Laurenz Julian"
                  className="relative w-full h-full object-cover rounded-full shadow-xl ring-4 ring-background"
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up">
            <p>
              I'm a licensed <span className="font-semibold text-foreground">Chemical Engineer</span> with over a decade of experience in labs, QA/QC, and environmental consulting. I spent years optimizing complex processes, analyzing data, and solving problems under pressure.
            </p>

            <p>
              Now, I use that same engineering mindset to design and build <span className="font-semibold text-foreground">AI automation systems</span> that turn messy, manual workflows into reliable, scalable solutions. I help creators, agencies, and small teams replace busywork with simple workflows that just work.
            </p>

            <div className="pt-4">
              <p className="font-semibold text-foreground mb-3">What I bring to every project:</p>
              <ul className="space-y-2 list-disc list-inside">
                <li><span className="font-medium">Systems thinking</span> – I see how each part connects</li>
                <li><span className="font-medium">Process optimization</span> – I find the bottlenecks and fix them</li>
                <li><span className="font-medium">Data-driven decisions</span> – I test, measure, and iterate</li>
                <li><span className="font-medium">Risk awareness</span> – I build for reliability, not just speed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};