'use client';

import {
  Cpu,
  Gamepad2,
  LineChart,
  Rocket,
  Camera,
  Dumbbell,
  Gem,
  GraduationCap,
} from 'lucide-react';
import Reveal from '@/components/ui/Reveal';

const NICHES = [
  { label: 'Tech & SaaS', icon: Cpu, color: 'text-c-tech', bg: 'bg-c-tech/10', border: 'border-c-tech/25' },
  { label: 'Gaming & Esports', icon: Gamepad2, color: 'text-c-gaming', bg: 'bg-c-gaming/10', border: 'border-c-gaming/25' },
  { label: 'Finance & Investing', icon: LineChart, color: 'text-c-finance', bg: 'bg-c-finance/10', border: 'border-c-finance/25' },
  { label: 'Productivity & Business', icon: Rocket, color: 'text-c-productivity', bg: 'bg-c-productivity/10', border: 'border-c-productivity/25' },
  { label: 'Lifestyle & Vlogs', icon: Camera, color: 'text-c-lifestyle', bg: 'bg-c-lifestyle/10', border: 'border-c-lifestyle/25' },
  { label: 'Fitness & Health', icon: Dumbbell, color: 'text-c-fitness', bg: 'bg-c-fitness/10', border: 'border-c-fitness/25' },
  { label: 'Beauty & Fashion', icon: Gem, color: 'text-c-beauty', bg: 'bg-c-beauty/10', border: 'border-c-beauty/25' },
  { label: 'Education & Learning', icon: GraduationCap, color: 'text-c-education', bg: 'bg-c-education/10', border: 'border-c-education/25' },
];

export default function NicheMarquee() {
  const row = [...NICHES, ...NICHES];
  return (
    <section className="border-b border-border bg-surface/80 py-10">
      <Reveal className="mx-auto mb-6 max-w-7xl px-4 sm:px-6" y={12}>
        <p className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-2">
          Every niche. Every platform.
        </p>
      </Reveal>
      <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-3 px-3">
          {row.map((niche, i) => (
            <div
              key={`${niche.label}-${i}`}
              className={`flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-2.5 ${niche.bg} ${niche.border}`}
            >
              <niche.icon className={`h-4 w-4 ${niche.color}`} />
              <span className="text-sm font-semibold text-foreground">
                {niche.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
