'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, UserCheck, ArrowRight } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ui/ThemeToggle';
import { EASE } from '@/lib/motion';

const LINKS = [
  { href: '/#how-it-works', label: 'How it works' },
  { href: '/#creators', label: 'For creators' },
  { href: '/#marketplace', label: 'Marketplace' },
  { href: '/#businesses', label: 'For businesses' },
  { href: '/#faq', label: 'FAQ' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [loggedInCreator, setLoggedInCreator] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    fetch('/api/creators/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.creator) {
          setLoggedInCreator(data.creator.name);
        }
      })
      .catch(() => {});
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      className={`sticky top-0 z-50 border-b border-border backdrop-blur-xl transition-all duration-300 ${
        scrolled || mobileMenuOpen ? 'bg-background/95 shadow-soft' : 'bg-background/80'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-[72px]">
        <Link href="/" className="group">
          <Logo size="md" variant="dark" />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-mint hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {mounted && loggedInCreator ? (
            <Link
              href="/creator/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-primary-2 hover:shadow-mid"
            >
              <UserCheck className="h-4 w-4 text-accent-soft" />
              <span>Dashboard</span>
            </Link>
          ) : (
            <>
              <Link
                href="/creator/login"
                className="rounded-xl px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                href="/creator/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-2 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary hover:shadow-mid"
              >
                <span>Join as creator</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-mint-2 text-foreground"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="overflow-hidden border-t border-border bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ x: -16, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3, ease: EASE }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-medium text-muted transition-colors hover:bg-mint hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col gap-2 border-t border-border pt-3">
                {mounted && loggedInCreator ? (
                  <Link
                    href="/creator/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white"
                  >
                    <UserCheck className="h-4 w-4 text-accent-soft" />
                    <span>Go to Dashboard</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/creator/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-2 px-4 py-3 text-sm font-semibold text-white"
                    >
                      Join as creator
                    </Link>
                    <Link
                      href="/creator/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex items-center justify-center rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground"
                    >
                      Creator Log in
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
