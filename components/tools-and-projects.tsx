"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Project, ToolItem } from "@/lib/portfolio-data";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CloseIcon,
  DollarIcon,
} from "@/components/icons";
import { Reveal } from "@/components/motion-wrapper";
import { LogoScrollVelocity } from "@/components/logo-scroll-velocity";
import { useModalLock } from "@/hooks/use-modal-lock";

type ToolsAndProjectsProps = {
  tools: ToolItem[];
  projects: Project[];
  filterTags: string[];
};

const PROJECT_CARD_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function toDriveEmbed(url: string) {
  const match = url.match(/id=([^&]+)/);
  if (match?.[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }

  return url;
}

export function ToolsAndProjects({ tools, projects, filterTags }: ToolsAndProjectsProps) {
  const [selectedTag, setSelectedTag] = useState("All");
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const projectModalRef = useRef<HTMLElement | null>(null);

  const itemsPerPage = 6;

  const filteredProjects = useMemo(() => {
    if (selectedTag === "All") {
      return projects;
    }

    return projects.filter((project) => project.tags.includes(selectedTag));
  }, [projects, selectedTag]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / itemsPerPage));

  const currentProjects = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return filteredProjects.slice(start, start + itemsPerPage);
  }, [currentPage, filteredProjects]);

  const placeholders = Math.max(0, itemsPerPage - currentProjects.length);

  const closeSelectedProject = useCallback(() => {
    setSelectedProject(null);
  }, []);

  useModalLock({
    isOpen: Boolean(selectedProject),
    onRequestClose: closeSelectedProject,
    scrollContainerRef: projectModalRef,
  });

  const applyTagFilter = (tag: string) => {
    setSelectedTag(tag);
    setCurrentPage(0);
  };

  const selectTool = (tool: ToolItem) => {
    applyTagFilter(tool.filterTag);

    const section = document.getElementById("projects");
    if (section) {
      window.scrollTo({ top: section.offsetTop - 88, behavior: "smooth" });
    }
  };

  return (
    <>
      <section id="tools" className="section section--surface">
        <div className="tools-section__inner">
          <Reveal delay={0.08}>
            <LogoScrollVelocity tools={tools} selectedTag={selectedTag} onSelectTool={selectTool} />
          </Reveal>
        </div>
      </section>

      <section id="projects" className="section">
        <div className="shell section__stack">
          <Reveal className="section-heading">
            <p className="eyebrow">Build Archive</p>
            <h2>My Projects</h2>
            <p>Real workflows that save time and reduce manual work.</p>
          </Reveal>

          <Reveal delay={0.1} className="filter-row" role="tablist" aria-label="Project filters">
            {filterTags.map((tag) => (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={selectedTag === tag}
                className={`chip ${selectedTag === tag ? "chip--active" : ""}`}
                onClick={() => applyTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </Reveal>

          <motion.div 
            layout
            className="projects-grid"
          >
            <AnimatePresence mode="popLayout">
              {currentProjects.map((project) => (
                <motion.button
                  layout
                  key={project.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: PROJECT_CARD_EASE }}
                  whileHover={{ y: -8 }}
                  type="button"
                  className="project-card"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="project-card__preview">
                    <Image
                      src={project.previewImage}
                      alt={`${project.title} preview`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="project-card__image"
                    />
                  </div>

                  <div className="project-card__content">
                    <h3>{project.title}</h3>
                    <p>{project.description}</p>

                    <div className="project-card__stats">
                      <div>
                        <ClockIcon className="icon" />
                        <span>{project.timeSaved}</span>
                      </div>
                      <div>
                        <DollarIcon className="icon" />
                        <span>{project.costSaved}</span>
                      </div>
                    </div>

                    <div className="tag-row">
                      {project.tags.map((tag) => (
                        <span key={tag} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.button>
              ))}

              {Array.from({ length: placeholders }).map((_, index) => (
                <motion.article 
                  layout
                  key={`placeholder-${index}`} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="project-card project-card--placeholder"
                >
                  <h3>Coming Soon</h3>
                  <p>New automation case studies are currently in production and will be published soon.</p>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>

          {totalPages > 1 && (
            <Reveal className="pagination">
              <button
                type="button"
                className="icon-button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((value) => Math.max(0, value - 1))}
                aria-label="Previous page"
              >
                <ChevronLeftIcon className="icon" />
              </button>
              <p>
                Page {currentPage + 1} of {totalPages}
              </p>
              <button
                type="button"
                className="icon-button"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage((value) => Math.min(totalPages - 1, value + 1))}
                aria-label="Next page"
              >
                <ChevronRightIcon className="icon" />
              </button>
            </Reveal>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedProject && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label={selectedProject.title} data-lenis-prevent>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay__backdrop" 
              onClick={closeSelectedProject} 
            />
            <motion.article 
              ref={projectModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="overlay__panel"
            >
              <button type="button" className="icon-button overlay__close" onClick={closeSelectedProject} aria-label="Close project details">
                <CloseIcon className="icon" />
              </button>

              <h3>{selectedProject.title}</h3>
              <div className="overlay__media">
                <iframe src={toDriveEmbed(selectedProject.videoUrl)} title={selectedProject.title} allow="autoplay" loading="lazy" />
              </div>
              <p className="overlay__subtitle">How it works</p>
              <ul>
                {selectedProject.detailedDescription.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
