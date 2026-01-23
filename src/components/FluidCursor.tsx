import { useEffect } from "react";
import initFluidCursor from "@/hooks/use-fluid-cursor";

const FluidCursor = () => {
  useEffect(() => {
    initFluidCursor();
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 bg-black/40" style={{ opacity: 0.18 }}>
      <canvas id="fluid" className="h-screen w-screen" />
    </div>
  );
};

export default FluidCursor;
