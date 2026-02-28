"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { NavigationItem } from "@/lib/portfolio-data";
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from "@/components/icons";

type NavigationProps = {
  items: NavigationItem[];
};

function getCurrentTheme() {
  if (typeof window === "undefined") {
    return "dark";
  }

  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") {
    return attr;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function Navigation({ items }: NavigationProps) {
  const [activeSection, setActiveSection] = useState(items[0]?.id ?? "home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const position = window.scrollY + 160;
      for (let index = items.length - 1; index >= 0; index -= 1) {
        const id = items[index]?.id;
        if (!id) {
          continue;
        }

        const node = document.getElementById(id);
        if (node && node.offsetTop <= position) {
          setActiveSection(id);
          break;
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [items]);

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    const offset = 92;
    window.scrollTo({ top: target.offsetTop - offset, behavior: "smooth" });
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    const currentTheme = getCurrentTheme() as "light" | "dark";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("ljds-theme", nextTheme);
  };

  return (
    <header className={`site-nav ${isScrolled ? "site-nav--solid" : ""}`}>
      <div className="site-nav__inner shell">
        <button type="button" className="brand" onClick={() => scrollToSection("home")} aria-label="Go to top">
          <Image src="/media/branding/logo-horizontal-light.png" alt="LJDS Tech" width={160} height={36} className="brand__logo brand__logo--light" priority />
          <Image src="/media/branding/logo-horizontal-dark.png" alt="LJDS Tech" width={160} height={36} className="brand__logo brand__logo--dark" priority />
        </button>

        <nav className="desktop-nav" aria-label="Main">
          <div className="desktop-nav__track">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`desktop-nav__button ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
                {activeSection === item.id && (
                  <motion.span 
                    layoutId="nav-underline"
                    className="desktop-nav__underline" 
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    style={{ opacity: 1, width: "100%" }}
                  />
                )}
              </button>
            ))}
          </div>
        </nav>

        <div className="site-nav__actions">
          <button type="button" className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
            <SunIcon className="icon theme-icon--sun" />
            <MoonIcon className="icon theme-icon--moon" />
          </button>
          <button
            type="button"
            className="icon-button icon-button--menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <CloseIcon className="icon" /> : <MenuIcon className="icon" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.nav 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mobile-nav shell" 
            aria-label="Mobile"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`mobile-nav__item ${activeSection === item.id ? "is-active" : ""}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </button>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
