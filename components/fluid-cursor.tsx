"use client";

import { useEffect } from "react";
import initFluidCursor from "@/hooks/use-fluid-cursor";

export function FluidCursor() {
  useEffect(() => {
    initFluidCursor();
  }, []);

  return (
    <div className="fluid-cursor-layer" aria-hidden="true">
      <canvas id="fluid" className="fluid-cursor-canvas" />
    </div>
  );
}
