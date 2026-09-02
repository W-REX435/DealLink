'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useReducedMotion,
  animate,
} from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Building,
  CheckCircle,
  Globe,
  ShieldCheck,
  TrendingUp,
  Zap,
  Users,
} from 'lucide-react';
import { blurReveal, EASE } from '@/lib/motion';

function CountUp({ to }: { to: number }) {
  const [value, setValue] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) {
      setValue(to);
      return;
    }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [to, reduce]);
  return <span>{value.toLocaleString()}</span>;
}

const FLOATING_CHIPS = [
  {
    icon: TrendingUp,
    label: 'Avg. deal value',
    value: '$1,400',
    className: '-left-8 top-10 md:-left-14',
    delay: 0,
  },
  {
    icon: Zap,
    label: 'Match time',
    value: '48h',
    className: '-right-6 top-2 md:-right-12',
    delay: 0.6,
  },
  {
    icon: Users,
    label: 'Network reach',
    value: '572K',
    className: '-bottom-6 -left-4 md:-left-10',
    delay: 1.2,
  },
];

const EARNINGS_BARS = [42, 58, 36, 72, 55, 88, 64, 96];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [creatorCount, setCreatorCount] = useState(5);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.creatorCount) setCreatorCount(data.creatorCount);
      })
      .catch(() => {});
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const visualY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);

  // Mouse tilt
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-primary text-white"
    >
      {/* Texture + glows */}
      <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-60" />
      <motion.div
        style={{ opacity: glowOpacity }}
        className="pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-accent/15 blur-[140px]"
      />
      <div className="pointer-events-none absolute -bottom-32 right-[-10%] h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-16 pt-16 sm:px-6 md:pb-24 md:pt-24">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          {/* Copy */}
          <div className="max-w-xl">
            <motion.div variants={blurReveal(0)} initial="hidden" animate="visible">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold backdrop-blur-sm sm:text-sm">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-soft" />
                </span>
                <Sparkles className="h-4 w-4 text-accent-soft" />
                <span className="text-white/90">
                  <strong className="font-bold text-white">
                    <CountUp to={creatorCount} /> creators
                  </strong>{' '}
                  already in the network
                </span>
              </div>
            </motion.div>

            <motion.h1
              variants={blurReveal(0.12)}
              initial="hidden"
              animate="visible"
              className="mt-7 text-balance text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl xl:text-6xl"
            >
              The bridge between{' '}
              <span className="text-gradient-accent">creators</span> and the
              brands that need them.
            </motion.h1>

            <motion.p
              variants={blurReveal(0.24)}
              initial="hidden"
              animate="visible"
              className="mt-6 max-w-lg text-base leading-relaxed text-white/75 sm:text-lg"
            >
              DealLink connects content creators of any niche with businesses
              looking for authentic sponsorships, real audience reach, and
              performance-backed results.
            </motion.p>

            <motion.div
              variants={blurReveal(0.36)}
              initial="hidden"
              animate="visible"
              className="mt-9 flex flex-col gap-3.5 sm:flex-row sm:items-center"
            >
              <motion.div whileHover={reduce ? undefined : { scale: 1.02 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
                <Link
                  href="/creator/signup"
                  className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-7 py-3.5 text-sm font-semibold text-primary shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.18)] sm:w-auto"
                >
                  Join as a creator
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </motion.div>
              <motion.div whileHover={reduce ? undefined : { scale: 1.02 }} whileTap={reduce ? undefined : { scale: 0.98 }}>
                <a
                  href="#businesses"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/30 hover:bg-white/10 sm:w-auto"
                >
                  <Building className="h-4 w-4 text-accent-soft" />
                  I&apos;m a business
                </a>
              </motion.div>
            </motion.div>

            {/* Trust strip */}
            <motion.div
              variants={blurReveal(0.5)}
              initial="hidden"
              animate="visible"
              className="mt-12 grid grid-cols-3 gap-3 border-t border-white/10 pt-7"
            >
              {[
                { icon: CheckCircle, label: 'Zero upfront fees' },
                { icon: Globe, label: 'Any niche, any platform' },
                { icon: ShieldCheck, label: 'Hand-curated deals' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-accent/30 bg-accent/10">
                    <item.icon className="h-4 w-4 text-accent-soft" />
                  </div>
                  <span className="text-xs font-medium leading-tight text-white/80 sm:text-[13px]">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual: marketplace mock */}
          <motion.div
            style={
              reduce
                ? undefined
                : { scale: visualScale, y: visualY, rotateX, rotateY, perspective: 1200 }
            }
            onMouseMove={(e) => {
              if (reduce) return;
              const rect = e.currentTarget.getBoundingClientRect();
              mx.set((e.clientX - rect.left) / rect.width - 0.5);
              my.set((e.clientY - rect.top) / rect.height - 0.5);
            }}
            onMouseLeave={() => {
              mx.set(0);
              my.set(0);
            }}
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.35 }}
            className="relative mx-auto w-full max-w-lg"
          >
            {/* Floating chips */}
            {!reduce &&
              FLOATING_CHIPS.map((chip) => (
                <motion.div
                  key={chip.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + chip.delay * 0.5, duration: 0.6, ease: EASE }}
                  className={`absolute z-20 ${chip.className}`}
                >
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 4 + chip.delay,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: chip.delay,
                    }}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-3.5 py-2.5 backdrop-blur-md shadow-lg"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                      <chip.icon className="h-4 w-4 text-accent-soft" />
                    </div>
                    <div>
                      <p className="text-[10px] font-medium uppercase tracking-wider text-white/60">
                        {chip.label}
                      </p>
                      <p className="text-sm font-bold text-white">{chip.value}</p>
                    </div>
                  </motion.div>
                </motion.div>
              ))}

            {/* Main mock card */}
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/[0.06] shadow-[0_0_100px_rgba(29,158,117,0.15)] backdrop-blur-md">
              <div className="flex items-center gap-2 border-b border-white/10 px-5 py-3.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
                <span className="ml-3 truncate rounded-md bg-white/5 px-2.5 py-1 text-[10px] font-medium text-white/50">
                  deallink.co/marketplace
                </span>
                <span className="ml-auto rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-accent-soft">
                  Live
                </span>
              </div>

              <div className="space-y-4 p-5">
                {/* Creator card */}
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-primary-2 text-sm font-bold text-white">
                      SR
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        Sarah Reyes — Tech & SaaS
                      </p>
                      <p className="text-[11px] text-white/50">
                        YouTube · 142K subscribers
                      </p>
                    </div>
                    <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-[10px] font-bold text-accent-soft">
                      Matched
                    </span>
                  </div>
                </div>

                {/* Earnings bars */}
                <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-white/50">
                      Sponsor revenue — last 8 months
                    </p>
                    <span className="text-xs font-bold text-accent-soft">
                      +312%
                    </span>
                  </div>
                  <div className="flex h-24 items-end gap-2">
                    {EARNINGS_BARS.map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{
                          duration: 0.8,
                          delay: 0.8 + i * 0.08,
                          ease: EASE,
                        }}
                        className={`flex-1 rounded-t-md ${
                          i === EARNINGS_BARS.length - 1
                            ? 'bg-gradient-to-t from-accent to-accent-soft'
                            : 'bg-accent/25'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Match row */}
                <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/20">
                      <Zap className="h-4 w-4 text-accent-soft" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">
                        New deal matched
                      </p>
                      <p className="text-[10px] text-white/50">
                        Productivity SaaS · $2,400
                      </p>
                    </div>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300, delay: 1.6 }}
                    className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-primary"
                  >
                    <CheckCircle className="h-4 w-4" />
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
