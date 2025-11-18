import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, X } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  timeSaved: string;
  costSaved: string;
  tools: string;
  videoUrl: string;
  previewImage: string;
  detailedDescription: string[];
}

export const ProjectCard = ({
  title,
  description,
  timeSaved,
  costSaved,
  tools,
  videoUrl,
  previewImage,
  detailedDescription,
}: ProjectCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract Google Drive file ID from the URL
  const getEmbedUrl = (url: string) => {
    const match = url.match(/id=([^&]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  return (
    <div className="perspective-1000 h-full">
      <div
        className={`relative w-full h-full transition-transform duration-600 transform-style-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of Card */}
        <Card
          className={`absolute inset-0 p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group backface-hidden ${
            isFlipped ? "invisible" : "visible"
          }`}
          onClick={() => setIsFlipped(true)}
        >
          <div className="h-full flex flex-col">
            {/* Preview Image */}
            <div className="mb-4 rounded-lg overflow-hidden bg-muted">
              <img
                src={previewImage}
                alt={title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://placehold.co/600x400/333/fff?text=Project";
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                {description}
              </p>

              {/* Stats */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">Time Saved:</span>
                  <span className="ml-2 text-muted-foreground">{timeSaved}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="h-4 w-4 text-primary mr-2" />
                  <span className="font-medium">Cost Impact:</span>
                  <span className="ml-2 text-muted-foreground">{costSaved}</span>
                </div>
              </div>

              {/* Tools Badge */}
              <Badge variant="secondary" className="w-fit text-xs">
                {tools}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Back of Card */}
        <Card
          className={`absolute inset-0 p-6 bg-card border-border rotate-y-180 backface-hidden overflow-auto ${
            isFlipped ? "visible" : "invisible"
          }`}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">{title}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFlipped(false)}
                className="flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Video Embed */}
            <div className="rounded-lg overflow-hidden bg-muted aspect-video">
              <iframe
                src={getEmbedUrl(videoUrl)}
                className="w-full h-full"
                allow="autoplay"
                title={title}
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">How it works:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {detailedDescription.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-2 mt-0.5">▪</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};