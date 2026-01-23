import { useEffect } from "react";
import initFluidCursor from "@/hooks/use-fluid-cursor";

const FluidCursor = () => {
  useEffect(() => {
    initFluidCursor();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-50 mix-blend-screen" style={{ opacity: 0.18 }}>
      <canvas id="fluid" className="h-full w-full block" />
    </div>
  );
};

export default FluidCursor;
