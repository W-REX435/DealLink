'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin cyan reading-progress bar pinned to the very top of the page. */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-primary-2 via-accent to-accent-soft"
    />
  );
}
