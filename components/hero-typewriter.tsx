"use client";

import { useEffect, useState } from "react";

type HeroTypewriterProps = {
  titles: string[];
};

export function HeroTypewriter({ titles }: HeroTypewriterProps) {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayTitle, setDisplayTitle] = useState(titles[0] ?? "");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!titles.length) {
      return;
    }

    const currentTitle = titles[titleIndex] ?? "";
    let timer = 0;

    if (!isDeleting) {
      if (displayTitle === currentTitle) {
        timer = window.setTimeout(() => setIsDeleting(true), 2400);
      } else {
        timer = window.setTimeout(() => {
          setDisplayTitle(currentTitle.slice(0, displayTitle.length + 1));
        }, 75);
      }
    } else if (displayTitle.length === 0) {
      timer = window.setTimeout(() => {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }, 360);
    } else {
      timer = window.setTimeout(() => {
        setDisplayTitle(currentTitle.slice(0, Math.max(0, displayTitle.length - 1)));
      }, 42);
    }

    return () => window.clearTimeout(timer);
  }, [displayTitle, isDeleting, titleIndex, titles]);

  return (
    <span className="hero-typewriter" aria-live="polite">
      <span>{displayTitle}</span>
      <span className="hero-typewriter__cursor" aria-hidden="true" />
    </span>
  );
}
