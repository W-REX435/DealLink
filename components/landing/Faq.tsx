'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import Reveal from '@/components/ui/Reveal';
import { EASE } from '@/lib/motion';

const FAQS = [
  {
    q: 'What does it cost to join as a creator?',
    a: 'Nothing. Signing up is 100% free with no upfront fees or hidden charges. DealLink only earns a success cut when a paid sponsorship is actually closed — if you never get paid, we never get paid.',
  },
  {
    q: 'Which platforms and niches does DealLink support?',
    a: 'All of them. YouTube, Instagram, TikTok, podcasts, newsletters, Twitch — if you have an engaged audience, we can find sponsors for it. We work with tech, gaming, finance, lifestyle, fitness, beauty, education, and everything in between.',
  },
  {
    q: 'How does matching work?',
    a: 'Our team hand-curates every match. When a brand comes to us with a campaign, we review our creator network and select profiles whose audience, niche, and content style genuinely fit the product. No automated spam — ever.',
  },
  {
    q: 'How much can I earn as a creator?',
    a: 'Deal values vary by niche, audience size, and engagement. Our creators typically earn between $500 and $5,000 per sponsorship, with rates scaling as your audience grows. You always approve the terms before accepting a deal.',
  },
  {
    q: 'Do I keep creative control over sponsored content?',
    a: 'Absolutely. You decide how the sponsorship fits into your content style and brand voice. Authenticity is what makes creator sponsorships work, and we protect it.',
  },
  {
    q: 'What happens after I submit a business inquiry?',
    a: 'Our team reviews your product and promotion goals, then curates a shortlist of matching creators from the network. You&apos;ll hear back within 1-2 business days with recommended profiles and next steps.',
  },
  {
    q: 'How does DealLink make money?',
    a: 'We take a success cut on closed sponsorships between creators and brands. That means our incentives are fully aligned with yours — we only succeed when you do.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-background/75 py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <Reveal className="mb-12 text-center">
          <span className="dl-badge">FAQ</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Questions,{' '}
            <span className="text-gradient-accent">answered</span>
          </h2>
        </Reveal>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={faq.q} delay={i * 0.05} y={16}>
                <div
                  className={`overflow-hidden rounded-2xl border transition-colors duration-300 ${
                    isOpen
                      ? 'border-accent/30 bg-surface shadow-mid'
                      : 'border-border bg-surface/60 hover:border-border-strong'
                  }`}
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                  >
                    <span className="text-base font-semibold tracking-tight text-foreground">
                      {faq.q}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors ${
                        isOpen ? 'bg-accent text-white' : 'bg-soft-2 text-muted'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: EASE }}
                      >
                        <p className="px-6 pb-6 text-sm leading-relaxed text-muted">
                          {faq.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
