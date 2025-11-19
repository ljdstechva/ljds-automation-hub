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