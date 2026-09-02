'use client';

import { Building, BarChart, Target, ShieldCheck } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import BusinessLeadForm from '@/components/BusinessLeadForm';

const BENEFITS = [
  {
    icon: BarChart,
    title: 'More cost-effective than digital ads',
    description:
      'Get long-tail organic views and lasting video/podcast back-catalog exposure without per-click inflation.',
  },
  {
    icon: Target,
    title: 'High-intent niche audiences',
    description:
      'Connect directly with buyers, decision-makers, and dedicated followers who trust creator recommendations.',
  },
  {
    icon: ShieldCheck,
    title: 'Hand-curated creator matches',
    description:
      'Our team selects verified creators that fit your specific product niche and audience targets.',
  },
];

export default function ForBusinesses() {
  return (
    <section id="businesses" className="relative overflow-hidden bg-primary/95 py-20 text-white md:py-28">
      <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
      <div className="pointer-events-none absolute -left-32 top-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-start gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Copy */}
          <div className="lg:col-span-6">
            <Reveal>
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-accent-soft">
                <Building className="h-4 w-4" />
                For brands & companies
              </span>
              <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
                Reach targeted, engaged audiences through{' '}
                <span className="text-gradient-accent">trusted creators</span>
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
                Traditional ad networks suffer from ad-blockers and banner
                fatigue. DealLink gives your brand direct exposure inside
                authentic content produced by trusted creators across any niche.
              </p>
            </Reveal>

            <div className="mt-9 space-y-6">
              {BENEFITS.map((benefit, i) => (
                <Reveal key={benefit.title} delay={i * 0.12}>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-accent/30 bg-accent/10">
                      <benefit.icon className="h-5 w-5 text-accent-soft" />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-white">
                        {benefit.title}
                      </h4>
                      <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Lead form */}
          <Reveal delay={0.15} className="lg:col-span-6">
            <BusinessLeadForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
