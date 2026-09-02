'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from 'framer-motion';
import { CheckCircle2, Building2 } from 'lucide-react';
import Logo from '@/components/Logo';

/* ------------------------------------------------------------------ */
/*  Scroll-driven story: creators connect with brands via DealLink     */
/*  Runway: 380vh. Sticky stage: 100vh. Progress p drives the scene.   */
/* ------------------------------------------------------------------ */

const CREATORS = [
  { name: 'Alex', niche: 'Tech · 85K', grad: 'from-c-tech to-c-education' },
  { name: 'Sarah', niche: 'Productivity · 142K', grad: 'from-c-productivity to-c-lifestyle' },
  { name: 'Maya', niche: 'Beauty · 210K', grad: 'from-c-beauty to-c-gaming' },
];

const BRANDS = [
  { name: 'Vectra', tag: 'SaaS tools' },
  { name: 'Pulse Fit', tag: 'Fitness app' },
  { name: 'Ledgerly', tag: 'Finance app' },
];

function CreatorNode({
  p,
  item,
  index,
  reduce,
}: {
  p: MotionValue<number>;
  item: { name: string; niche: string; grad: string };
  index: number;
  reduce: boolean | null;
}) {
  const start = 0.03 + index * 0.07;
  const x = useTransform(p, [start, start + 0.18], reduce ? [0, 0] : [-180, 0]);
  const o = useTransform(p, [start, start + 0.1], [0, 1]);
  const matched = useTransform(p, [0.74, 0.88], [0, 1]);

  return (
    <motion.div
      style={{
        x,
        opacity: o,
        y: '-50%',
        top: `${20 + index * 30}%`,
      }}
      className="absolute left-[0%] w-[24%] sm:w-[22%]"
    >
      <div className="relative rounded-xl border border-border bg-surface/80 p-2.5 shadow-mid backdrop-blur-md sm:p-3.5">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${item.grad} text-[10px] font-bold text-white sm:h-10 sm:w-10 sm:text-xs`}
          >
            {item.name[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
              {item.name}
            </p>
            <p className="truncate text-[9px] text-muted-2 sm:text-[11px]">
              {item.niche}
            </p>
          </div>
        </div>
        {/* Match badge */}
        <motion.div
          style={{ opacity: matched, scale: matched }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface shadow-mid sm:h-6 sm:w-6"
        >
          <CheckCircle2 className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function BrandNode({
  p,
  item,
  index,
  reduce,
}: {
  p: MotionValue<number>;
  item: { name: string; tag: string };
  index: number;
  reduce: boolean | null;
}) {
  const start = 0.03 + index * 0.07;
  const x = useTransform(p, [start, start + 0.18], reduce ? [0, 0] : [180, 0]);
  const o = useTransform(p, [start, start + 0.1], [0, 1]);
  const matched = useTransform(p, [0.74, 0.88], [0, 1]);

  return (
    <motion.div
      style={{
        x,
        opacity: o,
        y: '-50%',
        top: `${20 + index * 30}%`,
      }}
      className="absolute right-[0%] w-[24%] sm:w-[22%]"
    >
      <div className="relative rounded-xl border border-border bg-surface/80 p-2.5 shadow-mid backdrop-blur-md sm:p-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white sm:h-10 sm:w-10">
            <Building2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-foreground sm:text-sm">
              {item.name}
            </p>
            <p className="truncate text-[9px] text-muted-2 sm:text-[11px]">
              {item.tag}
            </p>
          </div>
        </div>
        <motion.div
          style={{ opacity: matched, scale: matched }}
          className="absolute -left-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-surface shadow-mid sm:h-6 sm:w-6"
        >
          <CheckCircle2 className="h-4 w-4 text-accent sm:h-5 sm:w-5" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function ConnectorLine({ p, d, index }: { p: MotionValue<number>; d: string; index: number }) {
  const start = 0.3 + index * 0.035;
  const len = useTransform(p, [start, start + 0.24], [0, 1]);
  return (
    <motion.path
      d={d}
      style={{ pathLength: len }}
      stroke="url(#dl-line)"
      strokeWidth={1.5}
      strokeLinecap="round"
      fill="none"
      vectorEffect="non-scaling-stroke"
    />
  );
}

function Caption({
  p,
  inA,
  inB,
  outA,
  outB,
  children,
}: {
  p: MotionValue<number>;
  inA: number;
  inB: number;
  outA: number;
  outB: number;
  children: React.ReactNode;
}) {
  const o = useTransform(p, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const y = useTransform(p, [inA, inB, outA, outB], [16, 0, 0, -16]);
  return (
    <motion.h2
      style={{ opacity: o, y }}
      className="absolute inset-x-0 top-0 text-balance text-center text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl"
    >
      {children}
    </motion.h2>
  );
}

export default function Connection() {
  const runwayRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });
  const p = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    mass: 0.4,
  });

  const emblemScale = useTransform(p, [0.46, 0.68], [0.4, 1]);
  const emblemScaleSpring = useSpring(emblemScale, { stiffness: 170, damping: 15 });
  const emblemGlow = useTransform(p, [0.52, 0.7], [0, 1]);
  const ringScale = useTransform(p, [0.68, 0.92], [1, 2]);
  const ringOpacity = useTransform(p, [0.68, 0.92], [0.9, 0]);
  const matchedBadge = useTransform(p, [0.78, 0.9], [0, 1]);
  const matchedBadgeY = useTransform(p, [0.78, 0.9], [14, 0]);
  const sceneOpacity = useTransform(p, [0.93, 1], [1, 0.2]);
  const sceneScale = useTransform(p, [0.93, 1], [1, 0.96]);
  const sideLabels = useTransform(p, [0.02, 0.12], [0, 1]);
  const progressScale = p;

  const leftLines = [
    'M 24 20 Q 35 35 45.5 50',
    'M 24 50 Q 35 50 45.5 50',
    'M 24 80 Q 35 65 45.5 50',
  ];
  const rightLines = [
    'M 76 20 Q 65 35 54.5 50',
    'M 76 50 Q 65 50 54.5 50',
    'M 76 80 Q 65 65 54.5 50',
  ];

  return (
    <section ref={runwayRef} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-screen flex-col items-center justify-center overflow-hidden px-4 sm:px-6">
        <motion.div
          style={reduce ? undefined : { opacity: sceneOpacity, scale: sceneScale }}
          className="relative flex w-full max-w-5xl flex-col"
        >
          {/* Stage captions */}
          <div className="relative mb-10 h-24 sm:h-28">
            <Caption p={p} inA={0} inB={0.08} outA={0.22} outB={0.3}>
              Two sides. One gap.
            </Caption>
            <Caption p={p} inA={0.32} inB={0.4} outA={0.56} outB={0.64}>
              We bridge them.
            </Caption>
            <Caption p={p} inA={0.66} inB={0.74} outA={0.93} outB={1}>
              Deal made. Everyone wins.
            </Caption>
          </div>

          {/* Scene */}
          <div className="relative mx-auto aspect-[4/3] w-full max-w-3xl sm:aspect-[16/10] lg:max-w-4xl">
            {/* Side labels */}
            <motion.span
              style={{ opacity: sideLabels }}
              className="absolute left-[0%] top-[1%] text-[10px] font-bold uppercase tracking-[0.25em] text-muted-2 sm:text-xs"
            >
              Creators
            </motion.span>
            <motion.span
              style={{ opacity: sideLabels }}
              className="absolute right-[0%] top-[1%] text-[10px] font-bold uppercase tracking-[0.25em] text-muted-2 sm:text-xs"
            >
              Brands
            </motion.span>

            {/* Connection lines */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="dl-line" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="var(--accent)" stopOpacity="0.15" />
                  <stop offset="0.5" stopColor="var(--accent)" stopOpacity="0.9" />
                  <stop offset="1" stopColor="var(--accent)" stopOpacity="0.15" />
                </linearGradient>
              </defs>
              {leftLines.map((d, i) => (
                <ConnectorLine key={`l${i}`} p={p} d={d} index={i} />
              ))}
              {rightLines.map((d, i) => (
                <ConnectorLine key={`r${i}`} p={p} d={d} index={i} />
              ))}
            </svg>

            {/* Nodes */}
            {CREATORS.map((c, i) => (
              <CreatorNode key={c.name} p={p} item={c} index={i} reduce={reduce} />
            ))}
            {BRANDS.map((b, i) => (
              <BrandNode key={b.name} p={p} item={b} index={i} reduce={reduce} />
            ))}

            {/* Center emblem */}
            <motion.div
              style={
                reduce
                  ? undefined
                  : { scale: emblemScaleSpring, opacity: sceneOpacity }
              }
              className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
            >
              {/* Glow + ping ring */}
              <motion.div
                style={{ opacity: emblemGlow }}
                className="absolute -inset-10 rounded-full bg-accent/20 blur-2xl"
              />
              <motion.div
                style={
                  reduce
                    ? undefined
                    : { scale: ringScale, opacity: ringOpacity }
                }
                className="absolute inset-0 rounded-full border-2 border-accent"
              />
              <div className="relative">
                <Logo iconOnly size="lg" />
              </div>
            </motion.div>

            {/* Matched badge */}
            <motion.div
              style={reduce ? undefined : { opacity: matchedBadge, y: matchedBadgeY }}
              className="absolute left-1/2 top-[62%] z-10 -translate-x-1/2"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-surface/90 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent shadow-mid backdrop-blur-sm sm:text-sm">
                <CheckCircle2 className="h-4 w-4" />
                Matched
              </span>
            </motion.div>
          </div>
        </motion.div>

        {/* Progress bar */}
        <motion.div
          style={{ scaleX: progressScale }}
          className="absolute bottom-10 left-1/2 h-0.5 w-40 origin-left -translate-x-1/2 rounded-full bg-gradient-to-r from-accent to-accent-soft sm:bottom-12"
        />
      </div>
    </section>
  );
}
