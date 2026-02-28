"use client";

import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Certificate } from "@/lib/portfolio-data";
import { AwardIcon, CloseIcon, ExternalLinkIcon } from "@/components/icons";
import { Reveal, STAGGER_ITEM } from "@/components/motion-wrapper";
import { useModalLock } from "@/hooks/use-modal-lock";

type CertificatesShowcaseProps = {
  certificates: Certificate[];
  filters: string[];
};

export function CertificatesShowcase({ certificates, filters }: CertificatesShowcaseProps) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const certificateModalRef = useRef<HTMLElement | null>(null);

  const filteredCertificates = useMemo(() => {
    if (activeFilter === "All") {
      return certificates;
    }

    return certificates.filter((certificate) => certificate.categories.includes(activeFilter));
  }, [activeFilter, certificates]);

  const closeSelectedCertificate = useCallback(() => {
    setSelectedCertificate(null);
  }, []);

  useModalLock({
    isOpen: Boolean(selectedCertificate),
    onRequestClose: closeSelectedCertificate,
    scrollContainerRef: certificateModalRef,
  });

  return (
    <>
      <section id="certificates" className="section section--surface">
        <div className="shell section__stack">
          <Reveal className="section-heading">
            <p className="eyebrow">Credential Track</p>
            <h2>My Certificates</h2>
            <p>Continuous upskilling in AI automation, no-code operations, and prompt engineering.</p>
          </Reveal>

          <Reveal delay={0.1} className="filter-row" role="tablist" aria-label="Certificate filters">
            {filters.map((category) => (
              <button
                key={category}
                type="button"
                role="tab"
                aria-selected={activeFilter === category}
                className={`chip ${activeFilter === category ? "chip--active" : ""}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </Reveal>

          <motion.div layout className="cert-grid">
            <AnimatePresence mode="popLayout">
              {filteredCertificates.map((certificate) => (
                <motion.button
                  layout
                  key={certificate.id}
                  {...STAGGER_ITEM}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{ y: -5, borderColor: "var(--accent)" }}
                  type="button"
                  className="cert-card"
                  onClick={() => setSelectedCertificate(certificate)}
                >
                  <div className="cert-card__head">
                    <span className="cert-card__icon">
                      <AwardIcon className="icon" />
                    </span>
                    <div>
                      <h3>{certificate.title}</h3>
                      <p>{certificate.provider}</p>
                    </div>
                  </div>
                  <p className="cert-card__meta">Issued: {certificate.issuedDate}</p>
                  <p className="cert-card__meta">Credential ID: {certificate.credentialId}</p>

                  <div className="tag-row">
                    {certificate.categories.map((category) => (
                      <span key={category} className="tag">
                        {category}
                      </span>
                    ))}
                  </div>
                </motion.button>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {selectedCertificate && (
          <div className="overlay" role="dialog" aria-modal="true" aria-label={selectedCertificate.title} data-lenis-prevent>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="overlay__backdrop" 
              onClick={closeSelectedCertificate} 
            />
            <motion.article 
              ref={certificateModalRef}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="overlay__panel overlay__panel--certificate"
            >
              <button
                type="button"
                className="icon-button overlay__close"
                onClick={closeSelectedCertificate}
                aria-label="Close certificate details"
              >
                <CloseIcon className="icon" />
              </button>

              <h3>{selectedCertificate.title}</h3>
              <p className="overlay__subtitle">{selectedCertificate.provider}</p>
              <div className="overlay__certificate-image">
                <Image
                  src={selectedCertificate.imageUrl}
                  alt={`${selectedCertificate.title} certificate preview`}
                  width={880}
                  height={620}
                  className="cert-preview"
                  sizes="(max-width: 900px) 90vw, 800px"
                />
              </div>

              <p className="overlay__subtitle">Skills covered</p>
              <ul>
                {selectedCertificate.skills.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>

              <a href={selectedCertificate.externalUrl} target="_blank" rel="noreferrer" className="button button--ghost overlay__cta">
                <ExternalLinkIcon className="icon" />
                Open credential link
              </a>
            </motion.article>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
