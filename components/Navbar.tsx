'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Youtube, Menu, X, UserCheck } from 'lucide-react';
import Logo from './Logo';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedInCreator, setLoggedInCreator] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/creators/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.creator) {
          setLoggedInCreator(data.creator.name);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <header className="bg-[#04342C] text-white border-b border-[#0F6E56] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="group">
          <Logo size="md" variant="color" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/#how-it-works" className="text-emerald-100 hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="/#for-creators" className="text-emerald-100 hover:text-white transition-colors">
            For creators
          </Link>
          <Link href="/#for-businesses" className="text-emerald-100 hover:text-white transition-colors">
            For businesses
          </Link>
          <Link href="/#contact" className="text-emerald-100 hover:text-white transition-colors">
            Contact
          </Link>
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-4 min-h-[40px]">
          {mounted && loggedInCreator ? (
            <Link
              href="/creator/dashboard"
              className="inline-flex items-center gap-2 bg-[#0F6E56] text-white text-sm font-medium px-4 py-2.5 rounded-lg border border-[#1D9E75] hover:bg-[#1D9E75] transition-all"
            >
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>Dashboard ({loggedInCreator.split(' ')[0]})</span>
            </Link>
          ) : (
            <>
              <Link
                href="/creator/login"
                className="text-sm font-medium text-emerald-100 hover:text-white px-3 py-2 transition-colors"
              >
                Creator Log in
              </Link>
              <Link
                href="/creator/signup"
                className="inline-flex items-center gap-2 bg-[#0F6E56] text-white text-sm font-semibold px-5 py-2.5 rounded-lg border border-[#1D9E75] hover:bg-[#1D9E75] shadow-sm transition-all"
              >
                <Youtube className="w-4 h-4 text-emerald-300" />
                <span>Join as a creator</span>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-emerald-100 hover:text-white p-2"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#04342C] border-b border-[#0F6E56] px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            How it works
          </Link>
          <Link
            href="/#for-creators"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            For creators
          </Link>
          <Link
            href="/#for-businesses"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            For businesses
          </Link>
          <Link
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-emerald-100 hover:text-white py-2"
          >
            Contact
          </Link>
          <div className="pt-2 border-t border-[#0F6E56] flex flex-col gap-2">
            {mounted && loggedInCreator ? (
              <Link
                href="/creator/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center bg-[#0F6E56] text-white py-2.5 rounded-lg font-medium"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/creator/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center border border-[#0F6E56] text-emerald-100 py-2.5 rounded-lg font-medium"
                >
                  Creator Log in
                </Link>
                <Link
                  href="/creator/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center bg-[#0F6E56] text-white py-2.5 rounded-lg font-semibold"
                >
                  Join as a creator
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
