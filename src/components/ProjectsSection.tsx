import { useState, forwardRef } from "react";
import { ProjectCard } from "./ProjectCard";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
  title: "GoHighLevel Lead Intake + Zoom Meeting Summary Automation",
  description:
    "A GoHighLevel automation that captures leads, manages appointments, and automatically turns Zoom meeting recordings into AI-generated summaries—sent directly to customers and stored in the CRM for sales follow-up.",
  timeSaved: "3–5 hours per week per salesperson",
  costSaved: "Reduce manual admin, meeting notes, and follow-up effort—close more deals with the same team",
  tags: ["GoHighLevel", "OpenAI", "Zoom"],
  videoUrl: "https://drive.google.com/open?id=1JQCfQjg2jgJQsrux2R-KWMBLZ-vAST4n&usp=drive_fs",
  previewImage: "https://i.imgur.com/WMQXOTW.png",
  detailedDescription: [
    "Captures new leads from GoHighLevel forms and Contact Us pages, ensuring every enquiry is logged and tracked automatically.",
    "Creates or updates contacts inside GoHighLevel and pushes them into the correct sales pipeline stage.",
    "Triggers appointment booking workflows and links scheduled calls directly to the contact record.",
    "Uses a custom Zoom webhook to detect completed meetings and retrieve the meeting recording and transcript automatically.",
    "Sends the Zoom transcript to OpenAI to generate a clean, structured, and easy-to-read meeting summary.",
    "Extracts key discussion points, action items, and next steps from the meeting using AI.",
    "Automatically emails the AI-generated meeting summary to the customer for clarity, trust, and professionalism.",
    "Logs the meeting summary back into GoHighLevel as notes or custom fields for internal sales reference.",
    "Eliminates manual note-taking and post-call admin work for sales and support teams.",
    "Improves customer experience by providing instant, professional follow-ups after every call.",
    "Ensures no leads, conversations, or commitments are lost between meetings and follow-ups.",
    "Designed to scale—supports multiple pipelines, forms, calendars, and Zoom accounts with minimal configuration."
  ]
},

  {
    title: "Content Repurposing: Audio & Video to Blog Post",
    description:
      "Automation that takes long-form audio or video, transcribes it, summarizes it, and turns it into a structured blog post or article.",
    timeSaved: "2-3 hours per content piece",
    costSaved: "Lower editing costs by reducing manual work",
    tags: ["n8n", "OpenAI", "Google Drive", "API"],
    videoUrl: "https://drive.google.com/open?id=1drn87X4FwUxHLmwVgXXCI-vWUu1iwjsg&usp=drive_fs",
    previewImage: "https://i.imgur.com/rkJHsaK.png",
    detailedDescription: [
      "Automatically detects new audio/video files uploaded to a designated folder",
      "Transcribes the content using OpenAI for accurate speech-to-text",
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
    previewImage: "https://i.imgur.com/x1yx3A4.png",
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
  title: "Google Drive to Google Docs Image Transfer & Auto-Resizer",
  description:
    "Automation that collects social media images from Google Drive, transfers them into Google Docs, and automatically resizes each image while preparing a clean caption space below.",
  timeSaved: "20–40 minutes per batch of images",
  costSaved: "Removes repetitive manual formatting for content creators",
  tags: ["n8n", "Google Drive", "Google Docs", "API"],
  videoUrl: "https://drive.google.com/open?id=1B5fb6FmwQuq1sTOL9Ha2otvy4PL_AtMy&usp=drive_fs",
  previewImage: "https://i.imgur.com/21UjtPV.png",
  detailedDescription: [
    "Retrieves all uploaded social media images from a designated Google Drive folder",
    "Automatically inserts each image into a Google Docs document, one per page",
    "Resizes images to a consistent, smaller format optimized for captioning",
    "Adds clean spacing beneath each image for client-provided captions",
    "Ensures every image is uniformly positioned across the entire document",
    "Prepares the final Google Docs file for content review, editing, or publishing",
  ],
},
  {
  title: "AI Appointment Setter – Smart Voice Scheduling System",
  description:
    "A fully automated voice-driven appointment scheduling system where an AI agent handles incoming calls, checks availability, books appointments, updates or cancels slots, and logs all details into Airtable—without human intervention.",
  timeSaved: "2–4 hours per day of manual call handling",
  costSaved: "Eliminates the need for a dedicated appointment setter",
  tags: ["n8n", "VAPI", "Google Calendar", "Airtable", "Voice AI", "Webhook"],
  videoUrl: "https://drive.google.com/open?id=1CTJ_RDmsjU8xFrPzmdpwOwswB9qkyke-&usp=drive_fs",
  previewImage: "https://i.imgur.com/FIcyl4n.png",
  detailedDescription: [
    "AI Agent answers incoming calls through VAPI and interacts naturally with callers",
    "Fetches live availability from Google Calendar to ensure accurate scheduling",
    "Books new appointments and logs all caller details directly into Airtable",
    "Allows callers to update or cancel existing appointments with full validation",
    "Syncs all changes to Google Calendar in real time to avoid double-booking",
    "Includes custom error handling and fallback prompts for smooth caller experience",
    "Tracks call results and stores conversation details for audit and reporting",
    "Built with modular n8n workflows to handle Get Slots, Book Slot, Update Slot, Cancel Slot, and Call Results",
  ],
},
{
  title: "Facebook Page AI Chatbot",
  description:
    "AI chatbot that handles Facebook Page inquiries end-to-end — classifying intent, pulling the right company info, and sending human-like replies back to Messenger in real time.",
  timeSaved: "5–10+ hours per week of manual inbox replying",
  costSaved: "Reduces need for a dedicated VA to monitor and triage page messages",
  tags: ["n8n", "Facebook", "OpenAI", "Google Gemini", "Webhook"],
  videoUrl: "https://drive.google.com/open?id=14wIOpufyp37FPSUgmaMssim6CHvpxjo6&usp=drive_fs",
  previewImage: "https://i.imgur.com/4rwHtcD.png",
  detailedDescription: [
    "Receives all incoming Facebook Page messages via webhook and extracts the sender’s text",
    "Skips empty or system messages to avoid unnecessary AI calls and costs",
    "Uses a Google Gemini chat model plus a Structured Output Parser to classify if the message is related to services or just general conversation",
    "For service-related messages, fetches LJDS Tech VA service documentation and injects it as context for the AI Agent",
    "For non-service or casual inquiries, uses a separate prompt and knowledge set to keep replies friendly but on-brand",
    "Routes both branches through an OpenAI-powered agent with simple memory for more coherent multi-turn conversations",
    "Formats the final AI response and sends it back to the user via the Facebook Graph API reply endpoint",
    "Keeps the Facebook inbox responsive 24/7 while preserving your tone and service details"
  ],
},
{
  title: "Portfolio Website AI Chatbot",
  description:
    "Embedded AI assistant for my portfolio site that answers questions about my services, background, and projects using live documentation as its knowledge base.",
  timeSaved: "Removes the need to manually answer repetitive portfolio inquiries",
  costSaved: "Acts as a self-service pre-sales assistant for visitors and leads",
  tags: ["n8n", "Web", "OpenAI", "Google Gemini", "Webhook"],
  videoUrl: "https://drive.google.com/open?id=1MO8wARtQ8yVAc7Z0INjt26Lisw7m0at0&usp=drive_fs",
  previewImage: "https://i.imgur.com/VB2DB8d.png",
  detailedDescription: [
    "Captures chat messages from the portfolio website via webhook and normalizes the payload",
    "Checks that a message exists and that the source is the portfolio widget before continuing",
    "Uses a Google Gemini chat model with a Structured Output Parser to decide if the question is related to services/portfolio or general queries",
    "For service-related questions, pulls detailed LJDS Portfolio Information from Google Docs and maps it into the AI Agent’s prompt fields",
    "For non-service questions, uses an alternate prompt and document set so the chatbot can still respond helpfully without going off-brand",
    "Passes both branches into dedicated OpenAI-based ‘LJDS Chatbot’ agents, each with lightweight memory for better multi-turn conversations",
    "Returns the structured AI response to the website through a webhook, ready to be rendered in the front-end chat UI",
    "Gives visitors an always-on, context-aware assistant that can explain my offers, tools, and case studies in natural language"
  ],
}


];

const filterTags = ["All", "n8n", "OpenAI", "Google Drive", "Gmail", "Telegram", "Google Docs", "Facebook", "Web", "API", "Webhook", "GoHighLevel", "Zoom"];

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