import { Card } from "@/components/ui/card";

interface ToolsSectionProps {
  onToolClick: (tool: string) => void;
}

const tools = [
  {
    name: "n8n",
    logo: "https://n8n.io/favicon.ico",
    description: "Building complex, flexible workflows with full control over logic and data.",
  },
  {
    name: "Zapier",
    logo: "https://cdn.zapier.com/zapier/images/favicon.ico",
    description: "Quick business automations and integrations for common use cases.",
  },
  {
    name: "Make",
    logo: "https://www.make.com/en/favicon.ico",
    description: "Visually orchestrating multi-step workflows with powerful routing options.",
  },
  {
    name: "GoHighLevel",
    logo: "https://images.saasworthy.com/highlevel_29566_logo_1744899106_furan.png",
    description: "CRM, pipelines, and marketing automation for client management.",
  },
  {
    name: "OpenAI",
    logo: "https://openai.com/favicon.ico",
    description: "Using GPT models for text generation, decision support, and content flows.",
  },
  {
    name: "Prompt Engineering",
    logo: "https://cdn-icons-png.flaticon.com/512/8943/8943377.png",
    description: "Designing effective prompts that guide AI behavior for reliable outputs.",
  },
];

export const ToolsSection = ({ onToolClick }: ToolsSectionProps) => {
  // Map tool names to project filter tags
  const toolToFilterMap: Record<string, string> = {
    "n8n": "n8n",
    "OpenAI": "OpenAI",
    "Zapier": "All", // No projects yet
    "Make": "All", // No projects yet
    "GoHighLevel": "All", // No projects yet
    "Prompt Engineering": "All", // No projects yet
  };

  const handleToolClick = (toolName: string) => {
    const filterTag = toolToFilterMap[toolName] || "All";
    onToolClick(filterTag);
  };
  return (
    <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            My Favorite Tools
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            The platforms I use to design, build, and maintain automations.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {tools.map((tool, index) => (
            <Card
              key={tool.name}
              className="p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-card border-border animate-fade-in-up group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleToolClick(tool.name)}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={tool.logo}
                    alt={`${tool.name} logo`}
                    className="w-12 h-12 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/2698/2698011.png";
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};