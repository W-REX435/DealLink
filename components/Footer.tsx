'use client';

import Link from 'next/link';
import { Mail, Shield, Youtube, Twitter, Linkedin } from 'lucide-react';
import { useState, useEffect } from 'react';
import Logo from './Logo';

export default function Footer() {
  const [year, setYear] = useState<number>(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-[#042C53] text-emerald-100 border-t border-[#0F6E56] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#0F6E56]/40">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <Logo size="md" variant="color" />
            </Link>
            <p className="text-emerald-200/80 text-sm max-w-md leading-relaxed">
              Connecting tech and SaaS content creators with businesses looking for authentic sponsorships, high engagement, and real audience reach.
            </p>
            <div className="pt-2 text-xs text-emerald-300 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1D9E75]"></span>
              <span>Professional B2B Creator Marketplace</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm text-emerald-200/80">
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">How it works</Link>
              </li>
              <li>
                <Link href="/#for-creators" className="hover:text-white transition-colors">For Tech Creators</Link>
              </li>
              <li>
                <Link href="/#for-businesses" className="hover:text-white transition-colors">For Businesses & SaaS</Link>
              </li>
              <li>
                <Link href="/creator/signup" className="hover:text-white transition-colors font-medium text-emerald-300">Creator Registration</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div id="contact" className="space-y-3">
            <h4 className="text-white text-sm font-semibold uppercase tracking-wider">Contact & Connect</h4>
            <div className="text-sm space-y-2">
              <a href="mailto:contact@deallink.co" className="flex items-center gap-2 text-emerald-200 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-[#1D9E75]" />
                <span>contact@deallink.co</span>
              </a>
              <div className="flex items-center gap-3 pt-2 text-emerald-300">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#04342C] hover:bg-[#0F6E56] transition-colors" aria-label="Twitter">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#04342C] hover:bg-[#0F6E56] transition-colors" aria-label="YouTube">
                  <Youtube className="w-4 h-4" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-[#04342C] hover:bg-[#0F6E56] transition-colors" aria-label="LinkedIn">
                  <Linkedin className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-200/60">
          <p>© {year} DealLink Inc. All rights reserved.</p>
          
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            {/* Internal Admin portal link for Rex */}
            <Link href="/admin" className="inline-flex items-center gap-1 text-emerald-400 hover:text-white transition-colors">
              <Shield className="w-3.5 h-3.5 text-[#1D9E75]" />
              <span>Internal Admin View</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
