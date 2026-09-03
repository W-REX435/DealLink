'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/** Soft cyan glow that trails the cursor (fine-pointer devices only). */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const x = useMotionValue(-600);
  const y = useMotionValue(-600);
  const sx = useSpring(x, { stiffness: 55, damping: 18, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 55, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);
    const move = (e: MouseEvent) => {
      x.set(e.clientX - 280);
      y.set(e.clientY - 280);
    };
    window.addEventListener('mousemove', move, { passive: true });
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-30 h-[560px] w-[560px] rounded-full"
    >
      <div className="h-full w-full rounded-full bg-[radial-gradient(circle,rgba(34,211,238,0.10),transparent_62%)] dark:bg-[radial-gradient(circle,rgba(34,211,238,0.12),transparent_62%)]" />
    </motion.div>
  );
}
