"use client";

import { useRef, useState, type HTMLAttributes, type MouseEvent, type ReactNode } from "react";

type MagnetProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  strength?: number;
  radius?: number;
};

export function Magnet({ children, strength = 0.35, radius = 140, className, style, ...props }: MagnetProps) {
  const wrapperRef = useRef<HTMLSpanElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = (event: MouseEvent<HTMLSpanElement>) => {
    const container = wrapperRef.current;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    const distance = Math.sqrt(x * x + y * y);

    if (distance > radius) {
      setOffset({ x: 0, y: 0 });
      return;
    }

    setOffset({ x: x * strength, y: y * strength });
  };

  const onMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  return (
    <span
      ref={wrapperRef}
      className={className}
      style={{
        ...(style ?? {}),
        display: "inline-flex",
        transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
        transition: "transform 0.2s ease-out",
        willChange: "transform",
      }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      {...props}
    >
      {children}
    </span>
  );
}
