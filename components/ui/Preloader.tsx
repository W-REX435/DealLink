'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';

export default function Preloader() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem('dl-preloader') === '1';
    } catch {}
    if (seen) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setVisible(true);
    try {
      sessionStorage.setItem('dl-preloader', '1');
    } catch {}
    const t = setTimeout(() => setVisible(false), 1700);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Logo size="lg" iconOnly />
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
            className="mt-7 h-0.5 w-44 origin-left rounded-full bg-gradient-to-r from-primary-2 to-accent"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 text-xs font-semibold uppercase tracking-[0.35em] text-muted"
          >
            DealLink
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
