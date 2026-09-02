'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Building, BarChart, Target, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import BusinessLeadForm from '@/components/BusinessLeadForm';
import { EASE } from '@/lib/motion';

const BENEFITS = [
  {
    icon: BarChart,
    title: 'More cost-effective than digital ads',
    description:
      'Get long-tail organic views and lasting video/podcast back-catalog exposure without per-click inflation.',
  },
  {
    icon: Target,
    title: 'High-intent niche audiences',
    description:
      'Connect directly with buyers, decision-makers, and dedicated followers who trust creator recommendations.',
  },
  {
    icon: ShieldCheck,
    title: 'Hand-curated creator matches',
    description:
      'Our team selects verified creators that fit your specific product niche and audience targets.',
  },
];

export default function ForBusinesses() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const formY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.6, 1], [0.3, 1, 0.4]);

  return (
    <section
      id="businesses"
      ref={sectionRef}
      className="relative overflow-hidden bg-primary/95 py-20 text-white md:py-28"
    >
      <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-soft">
                <Building className="h-4 w-4" />
                Side two — the brands
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Reach targeted, engaged audiences through{' '}
                <span className="text-gradient-accent">trusted creators</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Traditional ad networks suffer from ad-blockers and banner
                fatigue. DealLink puts your brand inside authentic content
                people actually watch.
              </p>
            </Reveal>

            <div className="mt-9 space-y-7">
              {BENEFITS.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={reduce ? undefined : { opacity: 0, x: 40 }}
                  whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.7, ease: EASE, delay: i * 0.12 }}
                  className="flex items-start gap-4"
                >
                  <motion.div
                    initial={reduce ? undefined : { scale: 0 }}
                    whileInView={reduce ? undefined : { scale: 1 }}
                    viewport={{ once: true, margin: '-80px' }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18, delay: i * 0.12 + 0.2 }}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10"
                  >
                    <benefit.icon className="h-5 w-5 text-accent-soft" />
                  </motion.div>
                  <div>
                    <h4 className="text-base font-semibold text-white">
                      {benefit.title}
                    </h4>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Lead form with parallax */}
          <motion.div
            style={reduce ? undefined : { y: formY }}
            className="lg:col-span-6"
          >
            <BusinessLeadForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
