'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Star } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const TESTIMONIALS = [
  {
    quote:
      'DealLink landed me three sponsorships in my first two months — all in my niche, all brands my audience actually cared about. I doubled my sponsorship income without cold-emailing anyone.',
    name: 'Alex Rivera',
    role: 'Tech Reviews HQ · 85K subscribers',
    initials: 'AR',
    color: 'bg-gradient-to-br from-c-tech to-c-education',
  },
  {
    quote:
      'As a finance creator, authenticity matters. Every deal DealLink sent my way fit my audience perfectly, and I kept full creative control over the content.',
    name: 'Elena Rostova',
    role: 'GrowthMatrix · 110K subscribers',
    initials: 'ER',
    color: 'bg-gradient-to-br from-c-finance to-accent',
  },
  {
    quote:
      'We needed creators who could demo our v2 product credibly. DealLink curated five perfect matches in days — the campaign generated 2,500+ trial signups in two weeks.',
    name: 'Jordan Blake',
    role: 'Vectra Brand Tools · Head of Growth',
    initials: 'JB',
    color: 'bg-gradient-to-br from-c-productivity to-c-lifestyle',
  },
  {
    quote:
      'The team actually understands gaming audiences. My sponsored segment felt native to my content, and the engagement numbers beat every previous brand deal I&apos;d done.',
    name: 'Marcus Vance',
    role: 'CodeCrafted · 63K subscribers',
    initials: 'MV',
    color: 'bg-gradient-to-br from-c-gaming to-c-beauty',
  },
  {
    quote:
      'I run a small productivity channel and always assumed sponsorships were for the big guys. DealLink proved otherwise — first deal within six weeks.',
    name: 'Sarah Chen',
    role: 'ProductivityStack · 142K subscribers',
    initials: 'SC',
    color: 'bg-gradient-to-br from-c-fitness to-c-finance',
  },
  {
    quote:
      'Hand-curated is the differentiator. No spam, no irrelevant pitches — just sponsorships that respect my audience and my time.',
    name: 'David K. Miller',
    role: 'CloudNative Weekly · 47K subscribers',
    initials: 'DM',
    color: 'bg-gradient-to-br from-c-lifestyle to-c-education',
  },
];

export default function Testimonials() {
  const reduce = useReducedMotion();

  return (
    <section className="border-y border-border bg-mint py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-14 max-w-2xl text-center">
          <span className="dl-badge">Social proof</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Creators and brands{' '}
            <span className="text-gradient-accent">both win</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            Real outcomes from the DealLink network.
          </p>
        </Reveal>

        <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={reduce ? undefined : { opacity: 0, y: 24 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.1 }}
              className="mb-5 break-inside-avoid"
            >
              <div className="dl-card p-6 transition-shadow duration-300 hover:shadow-mid">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${t.color} text-[11px] font-bold text-white`}
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="truncate text-xs text-muted-2">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
