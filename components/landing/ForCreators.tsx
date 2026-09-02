'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  Layers,
  ExternalLink,
  BadgeCheck,
  Mail,
} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const PERKS = [
  {
    title: 'No upfront fees or hidden charges',
    description: 'Signing up is completely free. We only earn when you get paid.',
  },
  {
    title: 'Sponsors matched to your niche',
    description:
      'Whether you cover tech, lifestyle, gaming, finance, fitness, or education, we pair you with products your viewers actually care about.',
  },
  {
    title: 'Full creative control',
    description:
      'You decide how to present the sponsorship so it stays authentic to your content style and brand voice.',
  },
];

const METRICS = [
  { label: 'Subscribers', value: '142K' },
  { label: 'Deals closed', value: '17' },
  { label: 'Avg. CPM', value: '$28' },
];

export default function ForCreators() {
  const reduce = useReducedMotion();

  return (
    <section id="creators" className="border-y border-border bg-mint py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                <Layers className="h-4 w-4" />
                Built for creators on any platform
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Turn your audience into{' '}
                <span className="text-gradient-accent">recurring sponsorship revenue</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Stop wasting time emailing unresponsive marketing managers.
                DealLink brings pre-qualified sponsors directly to you, with
                deals tailored to your exact audience and content niche.
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {PERKS.map((perk, i) => (
                <Reveal key={perk.title} delay={i * 0.1}>
                  <div className="flex items-start gap-3.5">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent/10">
                      <CheckCircle className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-foreground">
                        {perk.title}
                      </h4>
                      <p className="mt-1 text-sm leading-relaxed text-muted">
                        {perk.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.3}>
              <div className="mt-9">
                <Link href="/creator/signup" className="btn-primary group px-8 py-3.5">
                  Join as a creator now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </Reveal>
          </div>

          {/* Visual: creator profile card */}
          <Reveal delay={0.15} y={36}>
            <div className="relative mx-auto max-w-md">
              <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-accent/10 blur-3xl" />
              <div className="dl-card relative overflow-hidden shadow-high">
                {/* Header */}
                <div className="bg-gradient-to-br from-primary via-primary to-primary-2 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-accent-soft">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-soft" />
                      Active in network
                    </span>
                    <BadgeCheck className="h-5 w-5 text-accent-soft" />
                  </div>
                  <div className="mt-5 flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-soft to-accent text-lg font-bold text-primary">
                      AC
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-lg font-semibold">Alex Carter</p>
                      <a
                        href="#"
                        onClick={(e) => e.preventDefault()}
                        className="flex items-center gap-1 text-xs text-white/60 transition-colors hover:text-white/90"
                      >
                        youtube.com/@alexcarter
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
                  {METRICS.map((metric, i) => (
                    <motion.div
                      key={metric.label}
                      initial={reduce ? undefined : { opacity: 0, y: 12 }}
                      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.2 + i * 0.12 }}
                      className="p-4 text-center"
                    >
                      <p className="text-lg font-bold tracking-tight text-foreground">
                        {metric.value}
                      </p>
                      <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-2">
                        {metric.label}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Recent deals */}
                <div className="space-y-3 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-2">
                    Recent matches
                  </p>
                  {[
                    { brand: 'Northwind SaaS', niche: 'Tech & SaaS', value: '$2,400', color: 'bg-c-tech', text: 'text-c-tech' },
                    { brand: 'Pulse Fitness', niche: 'Fitness & Health', value: '$1,800', color: 'bg-c-fitness', text: 'text-c-fitness' },
                    { brand: 'Ledgerly', niche: 'Finance & Investing', value: '$3,100', color: 'bg-c-finance', text: 'text-c-finance' },
                  ].map((deal, i) => (
                    <motion.div
                      key={deal.brand}
                      initial={reduce ? undefined : { opacity: 0, x: -16 }}
                      whileInView={reduce ? undefined : { opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, ease: EASE, delay: 0.4 + i * 0.15 }}
                      className="flex items-center justify-between rounded-xl border border-border bg-mint-2 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${deal.color}`} />
                        <div>
                          <p className="text-sm font-semibold text-foreground">
                            {deal.brand}
                          </p>
                          <p className={`text-[11px] font-medium ${deal.text}`}>
                            {deal.niche}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-foreground">
                        {deal.value}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center gap-2 border-t border-border bg-mint px-5 py-3.5">
                  <Mail className="h-3.5 w-3.5 text-accent" />
                  <p className="text-xs text-muted">
                    New brand match: <strong className="text-foreground">1 new inquiry</strong> in
                    Tech & SaaS
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
