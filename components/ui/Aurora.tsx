'use client';

import { useEffect, useRef } from 'react';

/** Canvas aurora — drifting cyan/blue radial gradients (desktop, non-reduced-motion only). */
export default function Aurora({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const blobs = [
      { r: 340, hue: '34, 211, 238', a: 0.055, sx: 0.00012, sy: 0.00009, px: 0.72, py: 0.25 },
      { r: 440, hue: '37, 99, 235', a: 0.05, sx: -0.00009, sy: 0.00011, px: 0.22, py: 0.62 },
      { r: 280, hue: '103, 232, 249', a: 0.055, sx: 0.0001, sy: -0.00008, px: 0.5, py: 0.82 },
    ];

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      w = canvas.width = Math.round((rect?.width ?? window.innerWidth) * dpr);
      h = canvas.height = Math.round((rect?.height ?? window.innerHeight) * dpr);
    };
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    const loop = () => {
      t += 1;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const b of blobs) {
        const x = (b.px + Math.sin(t * b.sx) * 0.2) * w;
        const y = (b.py + Math.cos(t * b.sy) * 0.2) * h;
        const rad = b.r * dpr;
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, `rgba(${b.hue}, ${b.a})`);
        g.addColorStop(1, `rgba(${b.hue}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
