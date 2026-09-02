'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { UserPlus, Target, DollarSign, ArrowRight } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const STEPS = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Create your creator profile',
    description:
      'Register your channel or social profile link, audience size, and niche in under 2 minutes. No upfront cost or commitment required.',
    chip: 'Immediate network inclusion',
    color: 'bg-primary-2',
  },
  {
    icon: Target,
    step: '02',
    title: 'We match you with the right brand',
    description:
      'Our team pairs your content with relevant brands looking for authentic sponsorships aligned with your audience interest.',
    chip: 'Targeted audience alignment',
    color: 'bg-accent',
  },
  {
    icon: DollarSign,
    step: '03',
    title: 'Deal happens & success cut',
    description:
      'You maintain 100% creative control over your content. DealLink only takes a success cut when a paid sponsorship is closed.',
    chip: 'Performance-aligned incentives',
    color: 'bg-primary',
  },
];

export default function HowItWorks() {
  const reduce = useReducedMotion();

  return (
    <section id="how-it-works" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="dl-badge">Process</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            How DealLink{' '}
            <span className="text-gradient-accent">works</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            A simple, transparent 3-step model designed to make sponsorships
            seamless and profitable for every creator.
          </p>
        </Reveal>

        <div className="relative grid gap-6 md:grid-cols-3 md:gap-8">
          {/* Animated connector line */}
          <motion.div
            initial={reduce ? undefined : { scaleX: 0 }}
            whileInView={reduce ? undefined : { scaleX: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.3 }}
            className="absolute left-1/2 top-12 hidden h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/50 to-transparent md:block"
          />

          {STEPS.map((step, i) => (
            <motion.div
              key={step.step}
              initial={reduce ? undefined : { opacity: 0, y: 28 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.7, ease: EASE, delay: i * 0.15 }}
              whileHover={reduce ? undefined : { y: -6 }}
              className="dl-card relative p-8 transition-shadow duration-300 hover:shadow-mid"
            >
              <div className="mb-6 flex items-center justify-between">
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl ${step.color} text-white shadow-mid`}
                >
                  <step.icon className="h-6 w-6" />
                </div>
                <span className="font-mono text-sm font-semibold tracking-[0.2em] text-muted-2">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {step.description}
              </p>
              <div className="mt-5 flex items-center gap-2 border-t border-border pt-4 text-xs font-semibold text-accent">
                <ArrowRight className="h-3.5 w-3.5" />
                {step.chip}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
