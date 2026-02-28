import Image from "next/image";
import { BookingDialog } from "@/components/booking-dialog";
import { ExperienceShell } from "@/components/experience-shell";
import { HeroTypewriter } from "@/components/hero-typewriter";
import { Magnet } from "@/components/magnet";
import {
  ArrowRightIcon,
  CalendarIcon,
  MailIcon,
  SparklesIcon,
  TrendingIcon,
  WorkflowIcon,
} from "@/components/icons";
import { Navigation } from "@/components/navigation";
import { CertificatesShowcase } from "@/components/certificates-showcase";
import { ToolsAndProjects } from "@/components/tools-and-projects";
import { getPortfolioData } from "@/lib/portfolio-data";
import { GridBeam } from "@/components/grid-beam";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/motion-wrapper";
import { SmoothScroll } from "@/components/smooth-scroll";

import TextPressure from "@/components/TextPressure";

const specializationIcons = {
  workflow: WorkflowIcon,
  sparkles: SparklesIcon,
  trending: TrendingIcon,
};

export default async function Home() {
  const [portfolioData] = await Promise.all([getPortfolioData()]);

  return (
    <SmoothScroll>
      <ExperienceShell>
        <Navigation items={portfolioData.navigation} />

      <main className="site-main">
        <section id="home" className="hero">
          <div className="hero__background" aria-hidden="true">
            <span className="grid-overlay" />
            <GridBeam />
          </div>

          <div className="shell hero__inner">
            <Reveal className="hero__copy">
              <p className="eyebrow">LJDS Tech Automation Studio</p>
              
              <div className="desktop-only" style={{ position: 'relative', height: '80px', maxWidth: '300px', marginBottom: '0.8rem', marginLeft: '-0.2rem' }}>
                <TextPressure
                  text="HELLO!"
                  flex
                  alpha={false}
                  stroke={false}
                  width
                  weight
                  italic
                  textColor="var(--text)"
                  strokeColor="var(--accent)"
                  minFontSize={36}
                />
              </div>
              <h1 className="mobile-only" style={{ fontSize: 'clamp(2.4rem, 5.6vw, 4.8rem)', marginBottom: '0.2rem' }}>
                HELLO!
              </h1>
              <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', marginTop: '-0.5rem' }}>
                I&apos;m <span>Laurenz</span>
              </h1>

              <h2>
                <HeroTypewriter titles={portfolioData.heroTitles} />
              </h2>
              <p>
                I design and build automation systems that turn messy processes into reliable workflows, combining a decade of Chemical
                Engineering experience with modern AI tools.
              </p>

              <div className="hero__cta-row">
                <BookingDialog
                  trigger={
                    <Magnet>
                      <span className="button button--primary">
                        <CalendarIcon className="icon" />
                        Book an automation call
                        <ArrowRightIcon className="icon" />
                      </span>
                    </Magnet>
                  }
                />
                <a href="#projects" className="button button--ghost">
                  View my projects
                </a>
              </div>

              <ul className="hero__notes">
                <li>From Chemical Engineer to AI Automation Specialist</li>
                <li>Helping creators and teams save hours every week</li>
              </ul>
            </Reveal>

            <Reveal delay={0.2} className="hero__portrait">
              <div className="status-pill">
                <span className="status-dot" aria-hidden="true" />
                <div>
                  <p>Current status</p>
                  <strong>Available for work</strong>
                </div>
              </div>

              <div className="portrait-wrapper">
                <div className="portrait-ring-animated" aria-hidden="true" />
                <div className="portrait-container">
                  <Image
                    src="/media/profile/laurenz-forward-new.png"
                    alt="Laurenz Julian portrait"
                    width={720}
                    height={720}
                    className="portrait-image"
                    priority
                    sizes="(max-width: 1024px) 70vw, 36vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="specialization" className="section section--surface">
          <div className="shell section__stack">
            <Reveal className="section-heading">
              <p className="eyebrow">Capability Map</p>
              <h2>My Specialization</h2>
              <p>Building AI-powered systems that quietly run your business in the background.</p>
            </Reveal>

            <StaggerContainer className="specialization-grid">
              {portfolioData.specializations.map((specialization) => {
                const Icon = specializationIcons[specialization.icon];
                return (
                  <StaggerItem key={specialization.title} className="specialization-card">
                    <span className="specialization-card__icon">
                      <Icon className="icon" />
                    </span>
                    <h3>{specialization.title}</h3>
                    <p>{specialization.description}</p>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            <Reveal className="callout">
              <p>
                <strong>Engineer&apos;s mindset:</strong> I bring a Chemical Engineering background to automation, clear process
                mapping, tested systems, and measurable improvements.
              </p>
            </Reveal>
          </div>
        </section>

        <section id="about" className="section">
          <div className="shell about-grid">
            <Reveal className="about-photo">
              <div className="portrait-wrapper portrait-wrapper--small">
                <div className="portrait-ring-animated" aria-hidden="true" />
                <div className="portrait-container portrait-container--small">
                  <Image
                    src="/media/profile/laurenz-away-new.png"
                    alt="Laurenz Julian profile photo"
                    width={560}
                    height={560}
                    className="portrait-image portrait-image--small"
                    sizes="(max-width: 1024px) 72vw, 28vw"
                  />
                </div>
              </div>
            </Reveal>

            <div className="about-copy">
              <Reveal className="section-heading section-heading--left">
                <p className="eyebrow">About</p>
                <h2>About Me</h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p>
                  I&apos;m a licensed Chemical Engineer with over a decade of experience in labs, QA/QC, and environmental consulting. I
                  spent years optimizing complex processes, analyzing data, and solving problems under pressure.
                </p>
                <p>
                  Now, I use that same engineering mindset to design and build AI automation systems that turn messy, manual workflows into
                  reliable, scalable solutions. I help creators, agencies, and small teams replace busywork with simple workflows that just
                  work.
                </p>
                <p>What I bring to every project:</p>
                <ul>
                  <li>Systems thinking - I see how each part connects</li>
                  <li>Process optimization - I find the bottlenecks and fix them</li>
                  <li>Data-driven decisions - I test, measure, and iterate</li>
                  <li>Risk awareness - I build for reliability, not just speed</li>
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        <ToolsAndProjects
          tools={portfolioData.tools}
          projects={portfolioData.projects}
          filterTags={portfolioData.projectFilterTags}
        />

        <CertificatesShowcase certificates={portfolioData.certificates} filters={portfolioData.certificateFilters} />

        <section id="contact" className="section">
          <div className="shell">
            <Reveal className="contact-card">
              <div className="section-heading">
                <p className="eyebrow">Contact</p>
                <h2>Let&apos;s Talk About Your Automation</h2>
                <p>
                  Ready to save time and streamline your workflows? Book a call to discuss how automation can transform your business
                  operations.
                </p>
              </div>

              <div className="contact-card__booking">
                <div className="contact-card__calendar-icon" aria-hidden="true">
                  <CalendarIcon className="icon" />
                </div>
                <h3>Schedule Your Consultation</h3>
                <p>Pick a time that works for you, and we&apos;ll discuss your automation needs.</p>
                <div className="contact-card__actions">
                  <BookingDialog
                    trigger={
                      <Magnet>
                        <span className="button button--primary">
                          <CalendarIcon className="icon" />
                          Book a 30-Minute Call
                        </span>
                      </Magnet>
                    }
                  />
                </div>
              </div>

              <div className="contact-divider" aria-hidden="true">
                <span>or</span>
              </div>

              <div className="contact-card__email">
                <h4>Prefer Email?</h4>
                <a href="mailto:ljdstechva@gmail.com" className="button button--ghost">
                  <MailIcon className="icon" />
                  ljdstechva@gmail.com
                </a>
              </div>

              <p className="contact-note">Based in the Philippines. Serving clients worldwide.</p>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell">
          <p>Copyright 2024 LJDS Tech. All rights reserved.</p>
        </div>
      </footer>
    </ExperienceShell>
    </SmoothScroll>
  );
}

