'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  animate,
} from 'framer-motion';
import { ArrowRight, ChevronDown, Sparkles } from 'lucide-react';
import { blurReveal, EASE } from '@/lib/motion';
import Aurora from '@/components/ui/Aurora';
import Magnetic from '@/components/ui/Magnetic';

function CountUp({ to }: { to: number }) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return <span>{value.toLocaleString()}</span>;
}

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [creatorCount, setCreatorCount] = useState(0);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.creatorCount) setCreatorCount(data.creatorCount);
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-4 py-20 sm:px-6"
    >
      <Aurora />
      <div className="pointer-events-none absolute -top-32 left-1/2 h-[440px] w-[720px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-4xl text-center"
      >
        <motion.div variants={blurReveal(0)} initial="hidden" animate="visible">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs font-semibold backdrop-blur-sm sm:text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span className="text-muted">
              {creatorCount > 0 ? (
                <>
                  <strong className="font-bold text-foreground">
                    <CountUp to={creatorCount} /> creators
                  </strong>{' '}
                  already inside
                </>
              ) : (
                'Creators and brands, connected'
              )}
            </span>
          </span>
        </motion.div>

        <motion.h1
          variants={blurReveal(0.1)}
          initial="hidden"
          animate="visible"
          className="mt-8 text-balance text-5xl font-semibold leading-[1.02] tracking-tight text-foreground sm:text-7xl md:text-8xl"
        >
          Creators meet brands.
          <br />
          <span className="text-gradient-accent">We make the deal.</span>
        </motion.h1>

        <motion.p
          variants={blurReveal(0.22)}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-7 max-w-xl text-balance text-base leading-relaxed text-muted sm:text-lg"
        >
          You create. Brands pay. DealLink connects the right people and only
          takes a cut when you win.
        </motion.p>

        <motion.div
          variants={blurReveal(0.34)}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center justify-center gap-3.5 sm:flex-row"
        >
          <Magnetic strength={0.2}>
            <Link
              href="/creator/signup"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-2 px-8 py-4 text-base font-semibold text-white shadow-mid transition-all hover:bg-primary hover:shadow-high sm:w-auto"
            >
              Join free — it takes 2 minutes
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href="/business/apply"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-surface/60 px-8 py-4 text-base font-semibold text-foreground backdrop-blur-sm transition-all hover:border-border-strong hover:bg-surface sm:w-auto"
            >
              I&apos;m a brand
            </a>
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        style={reduce ? undefined : { opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-1.5 text-muted"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em]">
            Scroll to see how
          </span>
          <ChevronDown className="h-4 w-4 text-accent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
