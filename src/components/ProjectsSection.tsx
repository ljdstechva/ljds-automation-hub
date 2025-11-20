import { useState, forwardRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    title: "Content Repurposing: Audio & Video to Blog Post",
    description:
      "Automation that takes long-form audio or video, transcribes it, summarizes it, and turns it into a structured blog post or article.",
    timeSaved: "2-3 hours per content piece",
    costSaved: "Lower editing costs by reducing manual work",
    tags: ["n8n", "OpenAI", "Google Drive"],
    videoUrl: "https://drive.google.com/open?id=1drn87X4FwUxHLmwVgXXCI-vWUu1iwjsg&usp=drive_fs",
    previewImage: "https://drive.google.com/thumbnail?id=1emMtqy_GVI0HbkzSgS4b49u2I39UR0Be&sz=w1000",
    detailedDescription: [
      "Automatically detects new audio/video files uploaded to a designated folder",
      "Transcribes the content using OpenAI Whisper for accurate speech-to-text",
      "Uses GPT-4 to summarize key points and structure content into blog format",
      "Generates SEO-friendly titles, headings, and meta descriptions",
      "Saves the final blog post ready for publishing or review",
      "Emphasizes consistent publishing schedule without manual writing time",
    ],
  },
  {
    title: "Email to Chat Notification: Gmail to Telegram",
    description:
      "Automation that reads specific incoming Gmail emails and forwards key details to Telegram for instant alerts.",
    timeSaved: "Instant notifications vs. checking email hourly",
    costSaved: "Faster response time improves client satisfaction",
    tags: ["n8n", "Gmail", "Telegram", "API"],
    videoUrl: "https://drive.google.com/open?id=1j5VmQKFfcTyHUCIe-EaAc0foV8l0ZwVu&usp=drive_fs",
    previewImage: "https://drive.google.com/thumbnail?id=11Qq__rGfS8YqEwQwu_5X8mfR6bXyU0GU&sz=w1000",
    detailedDescription: [
      "Monitors specific Gmail labels or sender addresses for new messages",
      "Extracts subject, sender, and message preview automatically",
      "Formats the information into a clean notification message",
      "Sends instant alert to your Telegram chat or group",
      "Useful for client inquiries, system alerts, or important updates",
      "Centralizes notifications so you never miss critical emails",
    ],
  },
  {
    title: "Google Docs Image Resizer & Compiler",
    description:
      "Automation that collects images from Google Docs, resizes them to consistent dimensions, and compiles them for export or reuse.",
    timeSaved: "30+ minutes per document with multiple images",
    costSaved: "Reduced manual resizing work for designers and writers",
    tags: ["n8n", "Google Docs", "API"],
    videoUrl: "https://drive.google.com/open?id=1B5fb6FmwQuq1sTOL9Ha2otvy4PL_AtMy&usp=drive_fs",
    previewImage: "https://drive.google.com/thumbnail?id=1oaCEOATy4ZngTmraOTeRRRI-9talFdgc&sz=w1000",
    detailedDescription: [
      "Scans Google Docs for embedded images automatically",
      "Downloads and processes each image to standard dimensions",
      "Maintains aspect ratios or applies custom cropping rules",
      "Optimizes file sizes for web or print use",
      "Compiles all images into a single folder or zip file",
      "Ensures visual consistency across all documentation and exports",
    ],
  },
];

const filterTags = ["All", "n8n", "OpenAI", "Google Drive", "Gmail", "Telegram", "Google Docs", "API"];

interface ProjectsSectionProps {
  selectedTag: string;
  onTagChange: (tag: string) => void;
}

export const ProjectsSection = forwardRef<HTMLElement, ProjectsSectionProps>(
  ({ selectedTag, onTagChange }, ref) => {
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 6;

    // Filter projects based on selected tag
    const filteredProjects = selectedTag === "All" 
      ? projects 
      : projects.filter(project => project.tags.includes(selectedTag));

    // Calculate pagination
    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentProjects = filteredProjects.slice(startIndex, endIndex);

    // Fill remaining slots with placeholders if needed
    const placeholdersNeeded = Math.max(0, itemsPerPage - currentProjects.length);
    const displayProjects = [...currentProjects];

    // Handle tag change and reset pagination
    const handleTagChange = (tag: string) => {
      onTagChange(tag);
      setCurrentPage(0);
    };

    // Handle pagination
    const handlePrevPage = () => {
      if (currentPage > 0) {
        setCurrentPage(currentPage - 1);
      }
    };

    const handleNextPage = () => {
      if (currentPage < totalPages - 1) {
        setCurrentPage(currentPage + 1);
      }
    };
    return (
      <section ref={ref} id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="text-center space-y-6 mb-12 animate-fade-in">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
                My Projects
              </h2>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                Real workflows that save time and reduce manual work.
              </p>
            </div>

            {/* Filter Tags */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {filterTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className={`cursor-pointer transition-all px-4 py-2 text-sm ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => handleTagChange(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-8">
            {displayProjects.map((project, index) => (
              <div
                key={project.title}
                className="animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard {...project} />
              </div>
            ))}
            {/* Placeholder "Coming Soon" cards */}
            {Array.from({ length: placeholdersNeeded }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="animate-fade-in-up"
                style={{ animationDelay: `${(displayProjects.length + index) * 0.1}s` }}
              >
                <ProjectCard
                  isPlaceholder={true}
                  title=""
                  description=""
                  timeSaved=""
                  costSaved=""
                  tags={[]}
                  videoUrl=""
                  previewImage=""
                  detailedDescription={[]}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevPage}
                disabled={currentPage === 0}
                className="transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages - 1}
                className="transition-all"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProjectsSection.displayName = "ProjectsSection";