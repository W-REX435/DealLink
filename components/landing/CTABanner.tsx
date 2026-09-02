'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

export default function CTABanner() {
  const reduce = useReducedMotion();

  return (
    <section className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-br from-primary via-primary to-primary-2 px-6 py-16 text-center shadow-high sm:px-12 md:py-20">
            <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-[300px] w-[500px] -translate-x-1/2 rounded-full bg-accent/20 blur-[100px]" />

            <div className="relative z-10">
              <motion.span
                initial={reduce ? undefined : { opacity: 0, y: 14 }}
                whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-soft"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Free to join
              </motion.span>

              <h2 className="mx-auto mt-6 max-w-2xl text-balance text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
                Your next sponsorship deal is one{' '}
                <span className="text-gradient-accent">profile</span> away
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Join the DealLink network today and let pre-qualified brands
                come to you — free, in under 2 minutes.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-3.5 sm:flex-row">
                <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
                  <Link
                    href="/creator/signup"
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-semibold text-primary shadow-[0_0_30px_rgba(255,255,255,0.12)] transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.25)] sm:w-auto"
                  >
                    Join as a creator
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
                <motion.div whileHover={reduce ? undefined : { scale: 1.03 }} whileTap={reduce ? undefined : { scale: 0.97 }}>
                  <a
                    href="#businesses"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/40 hover:bg-white/10 sm:w-auto"
                  >
                    Find creators for my brand
                  </a>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
