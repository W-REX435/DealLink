'use client';

import Link from 'next/link';
import { Mail, Shield, Youtube, Twitter, Linkedin } from 'lucide-react';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-border bg-primary text-white/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="grid gap-12 pb-12 md:grid-cols-12">
          {/* Brand */}
          <div className="space-y-5 md:col-span-5">
            <Link href="/" className="inline-block">
              <Logo size="md" variant="light" />
            </Link>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              The bridge between content creators and the brands that need
              them. Authentic sponsorships, real audience reach, and
              performance-backed results — in any niche, on any platform.
            </p>
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-soft" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-accent-soft">
                Accepting new creators
              </span>
            </div>
          </div>

          {/* Platform */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Platform
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/#how-it-works" className="transition-colors hover:text-white">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="/#creators" className="transition-colors hover:text-white">
                  For creators
                </Link>
              </li>
              <li>
                <Link href="/#marketplace" className="transition-colors hover:text-white">
                  Marketplace
                </Link>
              </li>
              <li>
                <Link href="/#businesses" className="transition-colors hover:text-white">
                  For businesses
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div className="md:col-span-2">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Account
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/creator/signup" className="transition-colors hover:text-white">
                  Join as creator
                </Link>
              </li>
              <li>
                <Link href="/creator/login" className="transition-colors hover:text-white">
                  Creator login
                </Link>
              </li>
              <li>
                <Link href="/creator/dashboard" className="transition-colors hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-white/40">
              Contact & connect
            </h4>
            <a
              href="mailto:contact@deallink.co"
              className="flex items-center gap-2.5 text-sm transition-colors hover:text-white"
            >
              <Mail className="h-4 w-4 text-accent-soft" />
              contact@deallink.co
            </a>
            <div className="mt-5 flex items-center gap-2.5">
              {[
                { icon: Twitter, label: 'Twitter' },
                { icon: Youtube, label: 'YouTube' },
                { icon: Linkedin, label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={`https://${social.label.toLowerCase()}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 transition-all hover:border-accent/40 hover:text-white"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row">
          <p>© {new Date().getFullYear()} DealLink Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="transition-colors hover:text-white/70">Privacy Policy</span>
            <span className="transition-colors hover:text-white/70">Terms of Service</span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-white/50 transition-colors hover:text-white"
            >
              <Shield className="h-3.5 w-3.5 text-accent-soft" />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
