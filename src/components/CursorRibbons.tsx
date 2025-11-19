import { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

interface RibbonsProps {
  color?: string;
  speed?: number;
  thickness?: number;
  fade?: boolean;
}

export const CursorRibbons = ({ 
  color = 'hsl(16, 100%, 55%)', 
  speed = 0.7, 
  thickness = 10,
  fade = true 
}: RibbonsProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mousePos = useRef<Point>({ x: 0, y: 0 });
  const points = useRef<Point[]>([]);
  const animationFrameId = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize points
    const pointCount = 50;
    for (let i = 0; i < pointCount; i++) {
      points.current.push({ x: 0, y: 0 });
    }

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update points
      for (let i = points.current.length - 1; i >= 0; i--) {
        if (i === 0) {
          // Head follows mouse with spring physics
          const dx = mousePos.current.x - points.current[i].x;
          const dy = mousePos.current.y - points.current[i].y;
          points.current[i].x += dx * (0.1 * speed);
          points.current[i].y += dy * (0.1 * speed);
        } else {
          // Other points follow previous point
          const prev = points.current[i - 1];
          const curr = points.current[i];
          curr.x += (prev.x - curr.x) * (0.1 + speed * 0.05);
          curr.y += (prev.y - curr.y) * (0.1 + speed * 0.05);
        }
      }

      // Draw ribbon
      if (points.current.length > 1) {
        ctx.beginPath();
        ctx.moveTo(points.current[0].x, points.current[0].y);

        for (let i = 1; i < points.current.length; i++) {
          ctx.lineTo(points.current[i].x, points.current[i].y);
        }

        // Apply gradient if fade is enabled
        if (fade) {
          const gradient = ctx.createLinearGradient(
            points.current[0].x,
            points.current[0].y,
            points.current[points.current.length - 1].x,
            points.current[points.current.length - 1].y
          );
          
          // Parse HSL color and create gradient
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color.replace(')', ', 0)').replace('hsl', 'hsla'));
          ctx.strokeStyle = gradient;
        } else {
          ctx.strokeStyle = color;
        }

        ctx.lineWidth = thickness;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [color, speed, thickness, fade]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ pointerEvents: 'none' }}
    />
  );
};

