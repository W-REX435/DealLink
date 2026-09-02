'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Logo from '@/components/Logo';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { EASE } from '@/lib/motion';

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  sideTitle: string;
  sidePoints: string[];
  footer?: React.ReactNode;
  children: React.ReactNode;
}

export default function AuthLayout({
  title,
  subtitle,
  sideTitle,
  sidePoints,
  footer,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="group flex items-center gap-2">
            <Logo size="md" variant="dark" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline-flex"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-2 lg:gap-16">
        {/* Brand panel */}
        <motion.aside
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative hidden overflow-hidden rounded-3xl bg-primary p-10 text-white lg:flex lg:flex-col lg:justify-between"
        >
          <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
          <div className="pointer-events-none absolute -top-24 right-[-20%] h-[360px] w-[360px] rounded-full bg-accent/20 blur-[110px]" />
          <div className="pointer-events-none absolute bottom-[-10%] left-[-20%] h-[300px] w-[300px] rounded-full bg-accent/10 blur-[100px]" />

          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-soft">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-soft" />
              </span>
              Creator network
            </span>

            <h1 className="mt-6 text-balance text-3xl font-semibold leading-tight tracking-tight xl:text-4xl">
              {sideTitle}
            </h1>

            <ul className="mt-8 space-y-4">
              {sidePoints.map((point, i) => (
                <motion.li
                  key={point}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/15">
                    <CheckCircle className="h-4 w-4 text-accent-soft" />
                  </span>
                  <span className="text-sm text-white/80">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.6 }}
            className="relative z-10 mt-10 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
          >
            <p className="text-sm leading-relaxed text-white/70">
              &ldquo;DealLink landed me three sponsorships in my first two
              months — all in my niche, all brands my audience actually cared
              about.&rdquo;
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-c-tech to-c-education text-xs font-bold text-white">
                AR
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Alex Rivera</p>
                <p className="text-xs text-white/50">Tech Reviews HQ · 85K subscribers</p>
              </div>
            </div>
          </motion.div>
        </motion.aside>

        {/* Form panel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
          className="flex flex-col justify-center"
        >
          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p>
          </div>

          <div className="dl-card p-6 shadow-mid sm:p-8">{children}</div>

          {footer && <div className="mt-5">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}
