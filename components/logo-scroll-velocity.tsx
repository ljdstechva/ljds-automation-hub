"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import type { ToolItem } from "@/lib/portfolio-data";

type LogoScrollVelocityProps = {
  tools: ToolItem[];
  selectedTag: string;
  onSelectTool: (tool: ToolItem) => void;
  velocity?: number;
};

function useElementWidth<T extends HTMLElement>(ref: React.RefObject<T | null>) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    function updateWidth() {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    }

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

function wrap(min: number, max: number, value: number) {
  const range = max - min;
  const mod = (((value - min) % range) + range) % range;
  return mod + min;
}

type VelocityRowProps = {
  tools: ToolItem[];
  selectedTag: string;
  baseVelocity: number;
  onSelectTool: (tool: ToolItem) => void;
};

function VelocityRow({ tools, selectedTag, baseVelocity, onSelectTool }: VelocityRowProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 40, stiffness: 320 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false });

  const copyRef = useRef<HTMLDivElement>(null);
  const copyWidth = useElementWidth(copyRef);
  const directionRef = useRef<number>(1);

  const x = useTransform(baseX, (value) => {
    if (copyWidth === 0) {
      return "0px";
    }

    return `${wrap(-copyWidth, 0, value)}px`;
  });

  useAnimationFrame((_, delta) => {
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);

    const velocityNow = velocityFactor.get();
    if (velocityNow < 0) {
      directionRef.current = -1;
    } else if (velocityNow > 0) {
      directionRef.current = 1;
    }

    moveBy += directionRef.current * moveBy * velocityNow;
    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="logo-velocity__parallax">
      <motion.div className="logo-velocity__scroller" style={{ x }}>
        {Array.from({ length: 6 }).map((_, copyIndex) => (
          <div
            key={`logos-copy-${copyIndex}`}
            className="logo-velocity__copy"
            ref={copyIndex === 0 ? copyRef : null}
          >
            {tools.map((tool) => {
              const isActive = selectedTag === tool.filterTag && selectedTag !== "All";
              return (
                <button
                  key={`${tool.id ?? tool.name}-${copyIndex}`}
                  type="button"
                  className={`logo-velocity__item ${isActive ? "logo-velocity__item--active" : ""}`}
                  onClick={() => onSelectTool(tool)}
                  aria-label={`Filter projects by ${tool.filterTag}`}
                >
                  <Image
                    src={tool.logo}
                    alt={tool.name}
                    width={36}
                    height={36}
                    sizes="36px"
                    className="logo-velocity__logo"
                  />
                </button>
              );
            })}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function LogoScrollVelocity({
  tools,
  selectedTag,
  onSelectTool,
  velocity = 64,
}: LogoScrollVelocityProps) {
  return (
    <div className="tools-marquee" aria-label="Tools logo marquee">
      <VelocityRow tools={tools} selectedTag={selectedTag} baseVelocity={velocity} onSelectTool={onSelectTool} />
      <VelocityRow
        tools={[...tools].reverse()}
        selectedTag={selectedTag}
        baseVelocity={-velocity * 0.78}
        onSelectTool={onSelectTool}
      />
    </div>
  );
}
