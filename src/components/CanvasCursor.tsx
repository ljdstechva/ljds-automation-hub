import useCanvasCursor from "@/hooks/use-canvas-cursor";

const CanvasCursor = () => {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      className="pointer-events-none fixed inset-0 z-[60]"
      aria-hidden="true"
    />
  );
};

export default CanvasCursor;
