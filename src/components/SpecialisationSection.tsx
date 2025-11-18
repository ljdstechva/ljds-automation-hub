import { Card } from "@/components/ui/card";
import { Workflow, Sparkles, TrendingUp } from "lucide-react";

const specialisations = [
  {
    icon: Workflow,
    title: "Workflow & Process Automation",
    description:
      "I map your existing processes, identify bottlenecks, and transform them into automated workflows using tools like n8n, Zapier, Make, and custom APIs. No more manual copy-paste or repetitive tasks.",
  },
  {
    icon: Sparkles,
    title: "Content & Marketing Automation",
    description:
      "Automate content repurposing, social media flows, email follow-ups, and reporting using AI. Turn one piece of content into many, without the manual grind.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Decision Support",
    description:
      "Build dashboards, alert systems, and automations that help your team react faster using structured data and AI models. Get the right information at the right time.",
  },
];

export const SpecialisationSection = () => {
  return (
    <section id="specialisation" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            My Specialisation
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Building AI-powered systems that quietly run your business in the background.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {specialisations.map((spec, index) => (
            <Card
              key={spec.title}
              className="p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border animate-fade-in-up group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-6">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <spec.icon className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-3">{spec.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {spec.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center p-6 sm:p-8 bg-card rounded-2xl border border-border shadow-sm">
          <p className="text-base sm:text-lg text-muted-foreground">
            <span className="font-semibold text-foreground">Engineer's mindset:</span>{" "}
            I bring a Chemical Engineering background to automation—clear process mapping, tested systems, and measurable improvements.
          </p>
        </div>
      </div>
    </section>
  );
};