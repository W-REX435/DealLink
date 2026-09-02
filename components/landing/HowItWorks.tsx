'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

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

export default function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-background/75 py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal className="mb-16 text-center">
          <span className="dl-badge">How it works</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Three steps. <span className="text-gradient-accent">That&apos;s it.</span>
          </h2>
        </Reveal>

        <div className="space-y-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.number}
              initial={reduce ? undefined : { opacity: 0, y: 32 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
              whileHover={reduce ? undefined : { x: 8 }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-surface/70 p-7 backdrop-blur-sm transition-colors hover:border-accent/40 sm:p-9"
            >
              <span className="pointer-events-none absolute -right-3 -top-8 select-none text-[120px] font-bold leading-none tracking-tighter text-muted/10 transition-colors group-hover:text-accent/15 sm:text-[160px]">
                {step.number}
              </span>
              <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
                <span className="font-mono text-sm font-semibold tracking-[0.25em] text-accent">
                  {step.number}
                </span>
                <div className="sm:flex-1">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted sm:text-base">
                    {step.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
