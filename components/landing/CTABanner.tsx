'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CTABanner() {
  const runwayRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start end', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const scale = useTransform(p, [0, 0.5], [0.86, 1]);
  const glow = useTransform(p, [0, 0.5, 1], [0, 1, 1.4]);
  const glowOpacity = useTransform(p, [0, 0.6], [0, 1]);
  const contentY = useTransform(p, [0, 0.6], [40, 0]);
  const contentO = useTransform(p, [0.05, 0.4], [0, 1]);

  return (
    <section ref={runwayRef} className="relative h-[150vh] bg-background/75">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4 sm:px-6">
        <motion.div
          style={reduce ? undefined : { scale, y: contentY, opacity: contentO }}
          className="relative w-full max-w-5xl"
        >
          <motion.div
            style={reduce ? undefined : { opacity: glowOpacity, scale: glow }}
            className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[130px]"
          />

          <div className="relative overflow-hidden rounded-3xl border border-accent/25 bg-gradient-to-br from-primary via-primary to-primary-2 px-6 py-16 text-center shadow-high sm:px-12 md:py-24">
            <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />

            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-soft">
                <Sparkles className="h-3.5 w-3.5" />
                Free to join
              </span>

              <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-6xl">
                Your next deal is one{' '}
                <span className="text-gradient-accent">profile</span> away
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Join the DealLink network today and let pre-qualified brands
                come to you — free, in under 2 minutes.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
                  <Link
                    href="/creator/signup"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] sm:w-auto"
                  >
                    Join as a creator
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
                  <a
                    href="#businesses"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 sm:w-auto"
                  >
                    Find creators for my brand
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
