'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { Star, ArrowRight, Sparkles } from 'lucide-react';

const TESTIMONIALS = [
  {
    quote:
      'DealLink landed me three sponsorships in my first two months — all in my niche, all brands my audience actually cared about. I doubled my sponsorship income without cold-emailing anyone.',
    name: 'Alex Rivera',
    role: 'Tech Reviews HQ · 85K',
    initials: 'AR',
    color: 'bg-gradient-to-br from-c-tech to-c-education',
  },
  {
    quote:
      'As a finance creator, authenticity matters. Every deal DealLink sent my way fit my audience perfectly, and I kept full creative control over the content.',
    name: 'Elena Rostova',
    role: 'GrowthMatrix · 110K',
    initials: 'ER',
    color: 'bg-gradient-to-br from-c-finance to-accent',
  },
  {
    quote:
      'We needed creators who could demo our v2 product credibly. DealLink curated five perfect matches in days — the campaign generated 2,500+ trial signups in two weeks.',
    name: 'Jordan Blake',
    role: 'Vectra · Head of Growth',
    initials: 'JB',
    color: 'bg-gradient-to-br from-c-productivity to-c-lifestyle',
  },
  {
    quote:
      'The team actually understands gaming audiences. My sponsored segment felt native to my content, and engagement beat every previous brand deal I&apos;d done.',
    name: 'Marcus Vance',
    role: 'CodeCrafted · 63K',
    initials: 'MV',
    color: 'bg-gradient-to-br from-c-gaming to-c-beauty',
  },
  {
    quote:
      'I run a small productivity channel and assumed sponsorships were for the big guys. DealLink proved otherwise — first deal within six weeks.',
    name: 'Sarah Chen',
    role: 'ProductivityStack · 142K',
    initials: 'SC',
    color: 'bg-gradient-to-br from-c-fitness to-c-finance',
  },
  {
    quote:
      'Hand-curated is the differentiator. No spam, no irrelevant pitches — just sponsorships that respect my audience and my time.',
    name: 'David K. Miller',
    role: 'CloudNative Weekly · 47K',
    initials: 'DM',
    color: 'bg-gradient-to-br from-c-lifestyle to-c-education',
  },
];

export default function Testimonials() {
  const runwayRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [shift, setShift] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const total = trackRef.current.scrollWidth;
      const viewport = window.innerWidth;
      setShift(Math.max(0, total - viewport + 48));
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  const x = useTransform(p, [0, 1], [0, -shift]);
  const titleY = useTransform(p, [0, 0.08], [40, 0]);
  const titleO = useTransform(p, [0, 0.08], [0, 1]);
  const barScale = p;

  return (
    <section
      ref={runwayRef}
      className="relative h-[260vh] border-y border-border bg-soft/80"
    >
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="pointer-events-none absolute -left-24 top-1/4 h-[360px] w-[360px] rounded-full bg-accent/[0.06] blur-[110px]" />

        <motion.div
          style={reduce ? undefined : { y: titleY, opacity: titleO }}
          className="mx-auto mb-10 w-full max-w-7xl px-4 text-center sm:px-6"
        >
          <span className="dl-badge">Don&apos;t take our word for it</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Both sides <span className="text-gradient-accent">win</span>
          </h2>
        </motion.div>

        {/* Horizontal track */}
        <motion.div
          ref={trackRef}
          style={reduce ? undefined : { x }}
          className="flex w-max items-stretch gap-5 px-6 sm:gap-6"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex w-[78vw] shrink-0 flex-col rounded-2xl border border-border bg-surface/85 p-6 shadow-mid backdrop-blur-sm sm:w-[380px] sm:p-7"
            >
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="h-3.5 w-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">
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
          ))}

          {/* End CTA card */}
          <div className="flex w-[78vw] shrink-0 flex-col items-center justify-center rounded-2xl border border-accent/30 bg-gradient-to-br from-primary via-primary to-primary-2 p-8 text-center text-white shadow-high sm:w-[380px]">
            <Sparkles className="h-8 w-8 text-accent-soft" />
            <p className="mt-4 text-xl font-semibold tracking-tight">
              Your story could be next.
            </p>
            <p className="mt-2 max-w-[240px] text-sm text-white/60">
              Join the network and start landing brand deals.
            </p>
            <Link
              href="/creator/signup"
              className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-primary transition-all hover:shadow-[0_0_40px_rgba(255,255,255,0.25)]"
            >
              Join free
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.div>

        {/* Progress bar */}
        <div className="mx-auto mt-10 h-0.5 w-48 overflow-hidden rounded-full bg-border">
          <motion.div
            style={{ scaleX: barScale }}
            className="h-full origin-left bg-gradient-to-r from-accent to-accent-soft"
          />
        </div>
      </div>
    </section>
  );
}
