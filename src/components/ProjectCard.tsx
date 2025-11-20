import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, DollarSign } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProjectCardProps {
  title: string;
  description: string;
  timeSaved: string;
  costSaved: string;
  tags: string[];
  videoUrl: string;
  previewImage: string;
  detailedDescription: string[];
  isPlaceholder?: boolean;
}

export const ProjectCard = ({
  title,
  description,
  timeSaved,
  costSaved,
  tags,
  videoUrl,
  previewImage,
  detailedDescription,
  isPlaceholder = false,
}: ProjectCardProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Placeholder card for "Coming Soon"
  if (isPlaceholder) {
    return (
      <Card className="p-6 bg-card border-border border-dashed h-full flex flex-col items-center justify-center opacity-60">
        <h3 className="text-xl font-bold mb-3 text-center">Coming Soon</h3>
        <p className="text-sm text-muted-foreground text-center">
          New automation projects will be added here.
        </p>
        {/* TODO: Replace this placeholder "Coming Soon" card with a real project.
            - Title
            - Description
            - Tags: string[] (e.g., ['n8n', 'OpenAI'])
            - timeSaved: string
            - costSaved: string
            - videoUrl: string
            - previewImage: string
            - detailedDescription: string[]
        */}
      </Card>
    );
  }

  // Extract Google Drive file ID from the URL
  const getEmbedUrl = (url: string) => {
    const match = url.match(/id=([^&]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return url;
  };

  return (
    <>
      <Card
        className="p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-card border-border group h-full"
        onClick={() => setIsOpen(true)}
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
                <Clock className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span className="font-medium">Time Saved:</span>
                <span className="ml-2 text-muted-foreground">{timeSaved}</span>
              </div>
              <div className="flex items-center text-sm">
                <DollarSign className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span className="font-medium">Cost Impact:</span>
                <span className="ml-2 text-muted-foreground">{costSaved}</span>
              </div>
            </div>

            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            <DialogDescription className="sr-only">
              Project details and demonstration video
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
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
            <div className="space-y-3">
              <h4 className="font-semibold text-lg">How it works:</h4>
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
        </DialogContent>
      </Dialog>
    </>
  );
};