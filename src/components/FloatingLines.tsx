import { useEffect, useRef } from 'react';

interface Line {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  targetX1: number;
  targetY1: number;
  targetX2: number;
  targetY2: number;
  speed: number;
  thickness: number;
  opacity: number;
}

export const FloatingLines = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const linesRef = useRef<Line[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
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
      initializeLines();
    };

    // Initialize lines
    const initializeLines = () => {
      linesRef.current = [];
      const lineCount = 8;
      
      for (let i = 0; i < lineCount; i++) {
        const x1 = Math.random() * canvas.width;
        const y1 = Math.random() * canvas.height;
        const angle = Math.random() * Math.PI * 2;
        const length = 200 + Math.random() * 400;
        
        linesRef.current.push({
          x1,
          y1,
          x2: x1 + Math.cos(angle) * length,
          y2: y1 + Math.sin(angle) * length,
          targetX1: x1,
          targetY1: y1,
          targetX2: x1 + Math.cos(angle) * length,
          targetY2: y1 + Math.sin(angle) * length,
          speed: 0.02 + Math.random() * 0.03,
          thickness: 2 + Math.random() * 3,
          opacity: 0.2 + Math.random() * 0.3
        });
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      linesRef.current.forEach((line) => {
        // Calculate attraction to mouse
        const dx1 = mousePos.current.x - line.targetX1;
        const dy1 = mousePos.current.y - line.targetY1;
        const distance = Math.sqrt(dx1 * dx1 + dy1 * dy1);
        
        if (distance < 300) {
          const force = (300 - distance) / 300;
          line.targetX1 += (dx1 * force * 0.1);
          line.targetY1 += (dy1 * force * 0.1);
          line.targetX2 += (dx1 * force * 0.08);
          line.targetY2 += (dy1 * force * 0.08);
        } else {
          // Slowly drift back to original position
          const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);
          const length = Math.sqrt(
            Math.pow(line.x2 - line.x1, 2) + Math.pow(line.y2 - line.y1, 2)
          );
          
          line.targetX1 += (Math.random() - 0.5) * 2;
          line.targetY1 += (Math.random() - 0.5) * 2;
          line.targetX2 = line.targetX1 + Math.cos(angle) * length;
          line.targetY2 = line.targetY1 + Math.sin(angle) * length;
        }

        // Smooth interpolation
        line.x1 += (line.targetX1 - line.x1) * line.speed;
        line.y1 += (line.targetY1 - line.y1) * line.speed;
        line.x2 += (line.targetX2 - line.x2) * line.speed;
        line.y2 += (line.targetY2 - line.y2) * line.speed;

        // Draw line with glow effect
        const gradient = ctx.createLinearGradient(line.x1, line.y1, line.x2, line.y2);
        gradient.addColorStop(0, `hsla(16, 100%, 55%, ${line.opacity})`);
        gradient.addColorStop(0.5, `hsla(16, 100%, 65%, ${line.opacity * 0.8})`);
        gradient.addColorStop(1, `hsla(16, 100%, 55%, ${line.opacity * 0.3})`);

        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'hsla(16, 100%, 55%, 0.6)';
        
        ctx.beginPath();
        ctx.moveTo(line.x1, line.y1);
        ctx.lineTo(line.x2, line.y2);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = line.thickness;
        ctx.lineCap = 'round';
        ctx.stroke();

        // Stronger glow layer
        ctx.shadowBlur = 40;
        ctx.lineWidth = line.thickness * 0.5;
        ctx.stroke();
      });

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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
