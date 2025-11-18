import emojiFace from "@/assets/emoji-face.png";

export const AboutSection = () => {
  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            About Laurenz
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
              I'm a licensed <span className="font-semibold text-foreground">Chemical Engineer</span> who spent years working in labs, quality assurance, environmental consulting, and industrial process optimization. I understand what it means to work with complex systems, tight regulations, and high-stakes decisions.
            </p>

            <p>
              After a decade in traditional engineering roles, I transitioned into{" "}
              <span className="font-semibold text-foreground">AI automation</span> to help teams remove repetitive work and focus on high-value tasks. I realized that the same principles I used to optimize chemical processes—systems thinking, data analysis, and continuous improvement—could transform how businesses operate.
            </p>

            <p>
              Today, I work with{" "}
              <span className="font-semibold text-foreground">content creators, agencies, small businesses, and consultants</span>{" "}
              who are tired of manual busywork. My engineering background helps me bring:
            </p>

            <ul className="space-y-3 pl-6">
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">▪</span>
                <span><span className="font-semibold text-foreground">Systems thinking</span> – Understanding how all pieces connect</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">▪</span>
                <span><span className="font-semibold text-foreground">Process optimization</span> – Finding and eliminating bottlenecks</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">▪</span>
                <span><span className="font-semibold text-foreground">Data-driven decisions</span> – Measuring what matters</span>
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-3 mt-1">▪</span>
                <span><span className="font-semibold text-foreground">Risk awareness</span> – Building reliable, documented systems</span>
              </li>
            </ul>

            <p className="text-foreground font-medium pt-4">
              If you're looking for someone who understands both the technical and practical sides of automation, let's talk.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};