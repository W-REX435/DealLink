'use client';

import { useRef } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  BadgeCheck,
  Youtube,
  Instagram,
  Music2,
  ArrowRight,
} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const CREATORS = [
  { name: 'Alex Rivera', niche: 'Tech & SaaS', subs: '85K', platform: Youtube, initials: 'AR', grad: 'from-c-tech to-c-education', chip: 'bg-c-tech/10 text-c-tech border-c-tech/25', verified: true },
  { name: 'Sarah Chen', niche: 'Productivity & Business', subs: '142K', platform: Youtube, initials: 'SC', grad: 'from-c-productivity to-c-lifestyle', chip: 'bg-c-productivity/10 text-c-productivity border-c-productivity/25', verified: true },
  { name: 'Marcus Vance', niche: 'Gaming & Esports', subs: '63K', platform: Music2, initials: 'MV', grad: 'from-c-gaming to-c-education', chip: 'bg-c-gaming/10 text-c-gaming border-c-gaming/25', verified: true },
  { name: 'Elena Rostova', niche: 'Finance & Investing', subs: '110K', platform: Instagram, initials: 'ER', grad: 'from-c-finance to-accent', chip: 'bg-c-finance/10 text-c-finance border-c-finance/25', verified: true },
  { name: 'David K. Miller', niche: 'Lifestyle & Vlogs', subs: '47K', platform: Youtube, initials: 'DM', grad: 'from-c-lifestyle to-c-productivity', chip: 'bg-c-lifestyle/10 text-c-lifestyle border-c-lifestyle/25', verified: false },
  { name: 'Maya Patel', niche: 'Beauty & Fashion', subs: '210K', platform: Instagram, initials: 'MP', grad: 'from-c-beauty to-c-gaming', chip: 'bg-c-beauty/10 text-c-beauty border-c-beauty/25', verified: true },
];

const FILTERS = ['All niches', 'Tech & SaaS', 'Gaming', 'Finance', 'Lifestyle'];

function CreatorCard({
  creator,
  index,
  parallaxY,
  reduce,
}: {
  creator: (typeof CREATORS)[number];
  index: number;
  parallaxY: MotionValue<number>;
  reduce: boolean | null;
}) {
  return (
    <motion.div
      style={reduce ? undefined : { y: parallaxY }}
      initial={reduce ? undefined : { opacity: 0, y: 60, rotateX: 14 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: EASE, delay: (index % 3) * 0.1 }}
      whileHover={reduce ? undefined : { y: -6, rotateX: 0 }}
      className="dl-card group p-5 transition-shadow duration-300 hover:shadow-mid"
    >
      <div className="flex items-center gap-3.5">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${creator.grad} text-sm font-bold text-white shadow-soft`}
        >
          {creator.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
            {creator.name}
            {creator.verified && (
              <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
            )}
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-2">
            <creator.platform className="h-3 w-3" />
            {creator.subs} audience
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span
          className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${creator.chip}`}
        >
          {creator.niche}
        </span>
        <button className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition-all group-hover:gap-1.5">
          View profile
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </motion.div>
  );
}

export default function MarketplacePreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallax = [
    useTransform(scrollYProgress, [0, 1], [0, 30]),
    useTransform(scrollYProgress, [0, 1], [0, -40]),
    useTransform(scrollYProgress, [0, 1], [0, 10]),
  ];

  return (
    <section
      id="marketplace"
      ref={sectionRef}
      className="bg-background/75 py-20 md:py-28"
      style={{ perspective: 1200 }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <span className="dl-badge">Meet the network</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            The creators{' '}
            <span className="text-gradient-accent">brands are hiring</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
            A live directory of vetted creators — searchable by niche, platform,
            and audience size.
          </p>
        </Reveal>

        {/* Search bar mock */}
        <Reveal delay={0.1}>
          <div className="mx-auto mb-10 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                placeholder="Search creators, niches, platforms..."
                className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm font-medium text-foreground shadow-soft transition-all placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-muted shadow-soft transition-colors hover:border-border-strong hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </button>
          </div>
        </Reveal>

        {/* Filter chips */}
        <Reveal delay={0.15}>
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            {FILTERS.map((filter, i) => (
              <button
                key={filter}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  i === 0
                    ? 'bg-primary-2 text-white shadow-mid'
                    : 'border border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </Reveal>

        {/* Creator grid with column parallax */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CREATORS.map((creator, i) => (
            <CreatorCard
              key={creator.name}
              creator={creator}
              index={i}
              parallaxY={parallax[i % 3]}
              reduce={reduce}
            />
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-center text-sm text-muted">
            <Link
              href="/creator/signup"
              className="font-semibold text-accent underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Want your profile listed here?
            </Link>{' '}
            — join the network free in under 2 minutes.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
