'use client';

import dynamic from 'next/dynamic';
import Footer from '@/components/Footer';
import BusinessLeadForm from '@/components/BusinessLeadForm';
import Logo from '@/components/Logo';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Users,
  CheckCircle,
  ShieldCheck,
  Zap,
  DollarSign,
  ArrowRight,
  Sparkles,
  Building,
  Target,
  BarChart,
  Clock,
  Globe,
  Layers
} from 'lucide-react';

// Dynamic import with ssr: false completely eliminates React hydration mismatches
const Navbar = dynamic(() => import('@/components/Navbar'), {
  ssr: false,
  loading: () => (
    <header className="bg-[#04342C] text-white border-b border-[#0F6E56] h-20 flex items-center sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center justify-between">
        <Logo size="md" variant="color" />
        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          <span className="text-emerald-100">How it works</span>
          <span className="text-emerald-100">For creators</span>
          <span className="text-emerald-100">For businesses</span>
        </div>
        <div className="w-32 h-10 bg-[#0F6E56] rounded-lg animate-pulse"></div>
      </div>
    </header>
  ),
});

export default function Home() {
  const [creatorCount, setCreatorCount] = useState<number>(5);

  useEffect(() => {
    fetch('/api/stats')
      .then((res) => res.json())
      .then((data) => {
        if (data.creatorCount) {
          setCreatorCount(data.creatorCount);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#E1F5EE]">
      <Navbar />

      {/* Hero Section */}
      <section className="bg-[#04342C] text-white pt-20 pb-24 border-b border-[#0F6E56] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            
            {/* Brand Logo Emblem */}
            <div className="flex justify-center">
              <Logo size="lg" variant="color" />
            </div>

            {/* Polished Distinct Pill Badge */}
            <div className="inline-flex items-center gap-2.5 bg-[#042C53]/90 border border-[#1D9E75]/60 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-white shadow-lg backdrop-blur-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1D9E75] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#1D9E75]"></span>
              </span>
              <Users className="w-4 h-4 text-[#1D9E75]" />
              <span>
                <strong className="text-white font-bold">{creatorCount} creators</strong> already in the DealLink network
              </span>
            </div>

            {/* Main Headline with Generous Breathing Room */}
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15] max-w-3xl mx-auto">
              The bridge between creators and the brands that need them.
            </h1>

            {/* High Contrast Subheadline */}
            <p className="text-lg sm:text-xl text-white font-normal leading-relaxed max-w-2xl mx-auto opacity-95">
              DealLink connects content creators of any niche with businesses looking for authentic sponsorships, real audience reach, and performance-backed results.
            </p>

            {/* Refined CTAs */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/creator/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold px-8 py-4 rounded-xl border border-[#1D9E75] shadow-md text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <span>Join as a creator</span>
              </Link>

              <a
                href="#for-businesses"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#042C53] hover:bg-[#042C53]/80 text-white font-bold px-8 py-4 rounded-xl border border-[#0F6E56] shadow-md text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Building className="w-5 h-5 text-[#1D9E75]" />
                <span>I&apos;m a business</span>
              </a>
            </div>

            {/* Refined 3 Feature Badges at Hero Bottom */}
            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#0F6E56]/50 text-left">
              
              <div className="flex items-center gap-3.5 bg-[#042C53]/40 p-3.5 rounded-xl border border-[#0F6E56]/40">
                <div className="w-10 h-10 rounded-lg bg-[#0F6E56] border border-[#1D9E75]/60 flex items-center justify-center text-[#1D9E75] shrink-0">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white leading-tight">
                  Zero upfront fees for creators
                </span>
              </div>

              <div className="flex items-center gap-3.5 bg-[#042C53]/40 p-3.5 rounded-xl border border-[#0F6E56]/40">
                <div className="w-10 h-10 rounded-lg bg-[#0F6E56] border border-[#1D9E75]/60 flex items-center justify-center text-[#1D9E75] shrink-0">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white leading-tight">
                  Any niche, any platform
                </span>
              </div>

              <div className="flex items-center gap-3.5 bg-[#042C53]/40 p-3.5 rounded-xl border border-[#0F6E56]/40">
                <div className="w-10 h-10 rounded-lg bg-[#0F6E56] border border-[#1D9E75]/60 flex items-center justify-center text-[#1D9E75] shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-semibold text-white leading-tight">
                  Hand-curated brand deals
                </span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#E1F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-14">
            <h2 className="text-xs uppercase tracking-widest text-[#0F6E56] font-bold">Process</h2>
            <h3 className="text-3xl font-extrabold text-[#04342C]">How DealLink Works</h3>
            <p className="text-[#5A6561] text-base">
              A simple, transparent 3-step model designed to make sponsorships seamless and profitable for every creator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Step 1 */}
            <div className="deal-card p-8 bg-white border border-[#CBDED7] space-y-4 hover:border-[#1D9E75] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#04342C] text-white flex items-center justify-center font-bold text-xl border border-[#0F6E56]">
                1
              </div>
              <h4 className="text-xl font-bold text-[#04342C]">Create your creator profile</h4>
              <p className="text-sm text-[#2C2C2A] leading-relaxed">
                Register your channel or social profile link, follower count, and niche in under 2 minutes. No upfront cost or commitment required.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#0F6E56] flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#1D9E75]" />
                <span>Immediate inclusion in creator network</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="deal-card p-8 bg-white border border-[#CBDED7] space-y-4 hover:border-[#1D9E75] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#0F6E56] text-white flex items-center justify-center font-bold text-xl border border-[#1D9E75]">
                2
              </div>
              <h4 className="text-xl font-bold text-[#04342C]">We match you with the right brand</h4>
              <p className="text-sm text-[#2C2C2A] leading-relaxed">
                Our team directly pairs your content with relevant brands looking for authentic sponsorships aligned with your audience interest.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#0F6E56] flex items-center gap-1.5">
                <Target className="w-4 h-4 text-[#1D9E75]" />
                <span>Targeted audience alignment</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="deal-card p-8 bg-white border border-[#CBDED7] space-y-4 hover:border-[#1D9E75] transition-colors">
              <div className="w-12 h-12 rounded-xl bg-[#042C53] text-white flex items-center justify-center font-bold text-xl border border-[#0F6E56]">
                3
              </div>
              <h4 className="text-xl font-bold text-[#04342C]">Deal happens & Success cut</h4>
              <p className="text-sm text-[#2C2C2A] leading-relaxed">
                You maintain 100% creative control over your content. DealLink only takes a success cut when a paid sponsorship is closed.
              </p>
              <div className="pt-2 text-xs font-semibold text-[#0F6E56] flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-[#1D9E75]" />
                <span>Performance-aligned incentives</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* For Creators Section */}
      <section id="for-creators" className="py-20 bg-[#04342C] text-white border-y border-[#0F6E56]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#0F6E56]/60 border border-[#1D9E75] px-3.5 py-1 rounded-full text-xs font-semibold text-white uppercase tracking-wider">
                <Layers className="w-4 h-4 text-[#1D9E75]" />
                <span>Built for Creators on Any Platform</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Turn your audience into recurring sponsorship revenue.
              </h2>

              <p className="text-white text-base sm:text-lg leading-relaxed opacity-95">
                Stop wasting time emailing unresponsive marketing managers. DealLink brings pre-qualified sponsors directly to you, with deals tailored to your exact audience and content niche.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center text-white shrink-0 mt-0.5 border border-[#1D9E75]">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">No upfront fees or hidden charges</h5>
                    <p className="text-sm text-emerald-100/90">Signing up is completely free. We only earn when you get paid.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center text-white shrink-0 mt-0.5 border border-[#1D9E75]">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">Sponsors matched to your niche</h5>
                    <p className="text-sm text-emerald-100/90">Whether you cover tech, lifestyle, gaming, finance, fitness, or education, we pair you with products your viewers actually care about.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-7 h-7 rounded-lg bg-[#0F6E56] flex items-center justify-center text-white shrink-0 mt-0.5 border border-[#1D9E75]">
                    <CheckCircle className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-white text-base">Full creative control</h5>
                    <p className="text-sm text-emerald-100/90">You decide how to present the sponsorship so it stays authentic to your content style and brand voice.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/creator/signup"
                  className="inline-flex items-center gap-2.5 bg-[#0F6E56] hover:bg-[#1D9E75] text-white font-bold px-8 py-4 rounded-xl border border-[#1D9E75] transition-all text-base shadow-md"
                >
                  <span>Join as a creator now</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right Card Callout */}
            <div className="bg-[#042C53] p-8 rounded-2xl border border-[#0F6E56] space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#1D9E75]" />
                <span>Why creators join DealLink</span>
              </h3>

              <div className="space-y-4 divide-y divide-[#0F6E56]/60">
                <div className="pt-3">
                  <div className="text-sm font-bold text-emerald-300">Instant Network Inclusion</div>
                  <p className="text-xs text-white/80 mt-1">Your channel or profile is added to Rex&apos;s active outreach directory immediately upon registration.</p>
                </div>
                <div className="pt-3">
                  <div className="text-sm font-bold text-emerald-300">Transparent Matchmaking</div>
                  <p className="text-xs text-white/80 mt-1">No automated spam. Hand-checked sponsorships that respect your audience.</p>
                </div>
                <div className="pt-3">
                  <div className="text-sm font-bold text-emerald-300">Fast Creator Registration</div>
                  <p className="text-xs text-white/80 mt-1">Simple sign-up form with instant profile access and editing privileges.</p>
                </div>
              </div>

              <div className="pt-2 bg-[#04342C] p-4 rounded-xl border border-[#0F6E56] text-xs text-white">
                <strong className="text-emerald-300">Current Network Stats:</strong> Over {creatorCount} registered creators across YouTube, Instagram, TikTok, Podcasts, and Newsletters.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* For Businesses Section + Lead Form */}
      <section id="for-businesses" className="py-20 bg-[#E1F5EE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#E1F5EE] border border-[#1D9E75] px-3.5 py-1 rounded-full text-xs font-semibold text-[#0F6E56] uppercase tracking-wider">
                <Building className="w-4 h-4 text-[#1D9E75]" />
                <span>For Brands & Companies</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#04342C] leading-tight">
                Reach targeted, engaged audiences through trusted creators.
              </h2>

              <p className="text-[#2C2C2A] text-base leading-relaxed">
                Traditional ad networks suffer from ad-blockers and banner fatigue. DealLink gives your brand direct exposure inside authentic content produced by trusted creators across any niche.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#CBDED7] flex items-center justify-center text-[#0F6E56] shrink-0 font-bold">
                    <BarChart className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#04342C]">More cost-effective than digital ads</h5>
                    <p className="text-xs sm:text-sm text-[#5A6561]">Get long-tail organic views and lasting video/podcast back-catalog exposure without per-click inflation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#CBDED7] flex items-center justify-center text-[#0F6E56] shrink-0 font-bold">
                    <Target className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#04342C]">High-intent niche audiences</h5>
                    <p className="text-xs sm:text-sm text-[#5A6561]">Connect directly with buyers, decision-makers, and dedicated followers who trust creator recommendations.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-[#CBDED7] flex items-center justify-center text-[#0F6E56] shrink-0 font-bold">
                    <ShieldCheck className="w-4 h-4 text-[#1D9E75]" />
                  </div>
                  <div>
                    <h5 className="font-bold text-[#04342C]">Hand-curated creator matches</h5>
                    <p className="text-xs sm:text-sm text-[#5A6561]">Rex and the DealLink team select verified creators that fit your specific product niche and audience targets.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Lead Capture Form */}
            <div className="lg:col-span-6">
              <BusinessLeadForm />
            </div>

          </div>
        </div>
      </section>

      {/* Trust & Case Studies Section (Coming Soon) */}
      <section className="py-16 bg-white border-t border-[#CBDED7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <h3 className="text-2xl font-bold text-[#04342C]">Proof & Case Studies</h3>
            <p className="text-xs sm:text-sm text-[#5A6561]">
              We are actively matching top content creators with leading brands. Full case studies coming soon.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Block 1 */}
            <div className="p-6 rounded-xl bg-[#E1F5EE]/50 border border-dashed border-[#1D9E75]/40 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-[#0F6E56] rounded-md text-[11px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#1D9E75]" />
                <span>Coming Soon</span>
              </div>
              <h4 className="font-bold text-[#04342C] text-sm">Dedicated Video Campaign</h4>
              <p className="text-xs text-[#5A6561]">
                Detailed breakdown of a multi-creator integration campaign yielding 250k+ views and 4.8% conversion rate.
              </p>
            </div>

            {/* Block 2 */}
            <div className="p-6 rounded-xl bg-[#E1F5EE]/50 border border-dashed border-[#1D9E75]/40 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-[#0F6E56] rounded-md text-[11px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#1D9E75]" />
                <span>Coming Soon</span>
              </div>
              <h4 className="font-bold text-[#04342C] text-sm">Consumer App Launch</h4>
              <p className="text-xs text-[#5A6561]">
                Case study showcasing how lifestyle and tech creators generated 2,500+ trial signups in 14 days.
              </p>
            </div>

            {/* Block 3 */}
            <div className="p-6 rounded-xl bg-[#E1F5EE]/50 border border-dashed border-[#1D9E75]/40 text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100 text-[#0F6E56] rounded-md text-[11px] font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-[#1D9E75]" />
                <span>Coming Soon</span>
              </div>
              <h4 className="font-bold text-[#04342C] text-sm">B2B SaaS & Tools Sponsorship</h4>
              <p className="text-xs text-[#5A6561]">
                Detailed campaign report on targeted creator demo sponsorships driving enterprise leads.
              </p>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
