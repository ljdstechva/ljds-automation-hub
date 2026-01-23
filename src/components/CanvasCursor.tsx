import useCanvasCursor from "@/hooks/use-canvas-cursor";

const CanvasCursor = () => {
  useCanvasCursor();

  return (
    <canvas
      id="canvas"
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  );
};

export default CanvasCursor;
