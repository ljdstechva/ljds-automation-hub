import emojiFace from "@/assets/emoji-face.png";

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
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl" />
              <img
                src={emojiFace}
                alt="Laurenz Julian"
                className="relative w-48 h-48 sm:w-64 sm:h-64 object-cover rounded-full shadow-xl ring-4 ring-background"
              />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground animate-fade-in-up">
            <p>
              I'm a <span className="font-semibold text-foreground">Chemical Engineer</span> turned <span className="font-semibold text-foreground">AI Automation Specialist</span>. I help creators, agencies, and small teams replace manual busywork with simple, reliable workflows.
            </p>

            <p>
              I still think like an engineer: map the process, test the system, and measure the results. That means your automations are clear, documented, and built to last.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};