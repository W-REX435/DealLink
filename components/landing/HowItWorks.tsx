'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from 'framer-motion';

const STEPS = [
  {
    number: '01',
    title: 'Sign up free',
    description:
      'Tell us who you are and your niche. 2 minutes. Zero cost. You&apos;re in the network.',
  },
  {
    number: '02',
    title: 'Get matched',
    description:
      'Brands that fit your audience come to you. Hand-picked. No spam, ever.',
  },
  {
    number: '03',
    title: 'Get paid',
    description:
      'You create with 100% creative control. We only take a cut when you win.',
  },
];

function Stage({
  p,
  step,
  inA,
  inB,
  outA,
  outB,
}: {
  p: MotionValue<number>;
  step: (typeof STEPS)[number];
  inA: number;
  inB: number;
  outA: number;
  outB: number;
}) {
  const o = useTransform(p, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const y = useTransform(p, [inA, inB, outA, outB], [48, 0, 0, -48]);
  const ghostX = useTransform(p, [inA, outB], [80, -40]);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
      <motion.span
        style={{ opacity: o, x: ghostX }}
        className="pointer-events-none absolute select-none text-[38vw] font-bold leading-none tracking-tighter text-muted/5 sm:text-[24vw] md:text-[20vw]"
      >
        {step.number}
      </motion.span>

      <motion.div style={{ opacity: o, y }} className="relative text-center">
        <span className="font-mono text-sm font-semibold tracking-[0.3em] text-accent sm:text-base">
          STEP {step.number}
        </span>
        <h3 className="mt-4 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl md:text-7xl">
          {step.title}
        </h3>
        <p className="mx-auto mt-5 max-w-md text-balance text-sm leading-relaxed text-muted sm:text-lg">
          {step.description}
        </p>
      </motion.div>
    </div>
  );
}

export default function HowItWorks() {
  const runwayRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 });

  const railScale = p;
  const dot1 = useTransform(p, [0.03, 0.1], [0.4, 1]);
  const dot2 = useTransform(p, [0.36, 0.43], [0.4, 1]);
  const dot3 = useTransform(p, [0.69, 0.76], [0.4, 1]);
  const headerOpacity = useTransform(p, [0, 0.05], [0, 1]);

  return (
    <section id="how-it-works" ref={runwayRef} className="relative h-[280vh]">
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute -top-20 left-1/2 h-[380px] w-[640px] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[120px]" />

        {/* Rail */}
        <div className="absolute left-5 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-6 sm:left-10 sm:flex">
          <motion.div
            style={{ scaleY: railScale }}
            className="absolute top-0 h-full w-px origin-top bg-gradient-to-b from-accent via-accent/60 to-accent/10"
          />
          {[dot1, dot2, dot3].map((dot, i) => (
            <div key={i} className="relative z-10">
              <motion.span
                style={{ opacity: dot, scale: dot }}
                className="block h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
              />
            </div>
          ))}
        </div>

        <Stage p={p} step={STEPS[0]} inA={0.02} inB={0.12} outA={0.3} outB={0.38} />
        <Stage p={p} step={STEPS[1]} inA={0.36} inB={0.46} outA={0.62} outB={0.7} />
        <Stage p={p} step={STEPS[2]} inA={0.68} inB={0.78} outA={0.93} outB={1} />

        {/* Header */}
        <div className="absolute left-1/2 top-14 -translate-x-1/2 text-center sm:top-16">
          <motion.span style={{ opacity: headerOpacity }} className="dl-badge">
            How the deal happens
          </motion.span>
        </div>
      </div>
    </section>
  );
}
