import { ProjectCard } from "./ProjectCard";

const projects = [
  {
    title: "Content Repurposing: Audio & Video to Blog Post",
    description:
      "Automation that takes long-form audio or video, transcribes it, summarizes it, and turns it into a structured blog post or article.",
    timeSaved: "2-3 hours per content piece",
    costSaved: "Lower editing costs by reducing manual work",
    tools: "n8n + OpenAI + Google Drive",
    videoUrl: "https://drive.google.com/open?id=1drn87X4FwUxHLmwVgXXCI-vWUu1iwjsg&usp=drive_fs",
    previewImage: "https://drive.google.com/uc?export=view&id=1emMtqy_GVI0HbkzSgS4b49u2I39UR0Be",
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
    tools: "n8n + Gmail API + Telegram Bot",
    videoUrl: "https://drive.google.com/open?id=1j5VmQKFfcTyHUCIe-EaAc0foV8l0ZwVu&usp=drive_fs",
    previewImage: "https://drive.google.com/uc?export=view&id=11Qq__rGfS8YqEwQwu_5X8mfR6bXyU0GU",
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
    tools: "n8n + Google Docs API + Image Processing",
    videoUrl: "https://drive.google.com/open?id=1B5fb6FmwQuq1sTOL9Ha2otvy4PL_AtMy&usp=drive_fs",
    previewImage: "https://drive.google.com/uc?export=view&id=1oaCEOATy4ZngTmraOTeRRRI-9talFdgc",
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

export const ProjectsSection = () => {
  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            My Projects
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Real workflows that save time and reduce manual work.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {projects.map((project, index) => (
            <div
              key={project.title}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard {...project} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};