import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

interface RibbonsProps {
  color?: string;
  speed?: number;
  thickness?: number;
  fade?: boolean;
  maxAge?: number;
}

export const CursorRibbons = ({
  color = "hsl(16, 100%, 55%)",
  speed = 0.5,
  thickness = 8,
  fade = true,
  maxAge = 1000,
}: RibbonsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const lastTimeRef = useRef(Date.now());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      
      // Add new point
      const now = Date.now();
      const dt = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (dt > 16) { // Throttle to ~60fps
        pointsRef.current.push({
          x: e.clientX,
          y: e.clientY,
          age: 0,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Animation loop
    let animationFrameId: number;
    
    const animate = () => {
      if (!ctx || !canvas) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw points
      const points = pointsRef.current;
      
      // Age and filter points
      pointsRef.current = points
        .map(p => ({ ...p, age: p.age + speed * 16 }))
        .filter(p => p.age < maxAge);

      // Draw ribbons
      if (pointsRef.current.length > 1) {
        ctx.lineWidth = thickness;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < pointsRef.current.length - 1; i++) {
          const p1 = pointsRef.current[i];
          const p2 = pointsRef.current[i + 1];

          // Calculate opacity based on age if fade is enabled
          let opacity = 1;
          if (fade) {
            opacity = 1 - p1.age / maxAge;
          }

          // Parse HSL color and add opacity
          const colorWithOpacity = color.includes("hsl")
            ? color.replace(")", `, ${opacity})`)
            : `rgba(255, 255, 255, ${opacity})`;

          ctx.strokeStyle = colorWithOpacity;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [color, speed, thickness, fade, maxAge]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};
