'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  ExternalLink,
  Calendar,
  Users,
  ArrowLeft,
  Loader2,
  Building,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EASE } from '@/lib/motion';

const NICHE_GRADS: Record<string, string> = {
  'Tech & SaaS': 'from-c-tech to-c-education',
  'Gaming & Esports': 'from-c-gaming to-c-beauty',
  'Finance & Investing': 'from-c-finance to-accent',
  'Lifestyle & Vlogs': 'from-c-lifestyle to-c-productivity',
  'Productivity & Business': 'from-c-productivity to-c-lifestyle',
  'Fitness & Health': 'from-c-fitness to-c-finance',
  'Education & Learning': 'from-c-education to-c-tech',
  'Beauty & Fashion': 'from-c-beauty to-c-gaming',
  'Entertainment & Comedy': 'from-c-gaming to-c-fitness',
  'Other Niche': 'from-primary-2 to-accent',
};

export default function CreatorProfile() {
  const params = useParams();
  const id = params.id as string;

  const [creator, setCreator] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    fetch(`/api/creators/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.creator) throw new Error(data.error || 'Creator not found.');
        setCreator(data.creator);
      })
      .catch((err) => setError(err.message || 'Failed to load creator.'))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/marketplace"
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to marketplace
          </Link>

          {loading ? (
            <div className="flex flex-col items-center gap-3 py-24">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
              <p className="text-sm font-semibold text-muted">Loading profile...</p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-danger/25 bg-danger/5 p-10 text-center">
              <AlertCircle className="mx-auto h-8 w-8 text-danger" />
              <p className="mt-4 text-sm font-medium text-danger">{error}</p>
              <Link href="/marketplace" className="btn-ghost mt-6">
                Browse marketplace
              </Link>
            </div>
          ) : creator ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              {/* Profile header */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-primary-2 p-7 text-white shadow-high sm:p-10">
                <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
                <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-[90px]" />

                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center">
                  <div
                    className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${
                      NICHE_GRADS[creator.niche] || NICHE_GRADS['Other Niche']
                    } text-2xl font-bold text-white shadow-high`}
                  >
                    {(creator.name || '?')[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                      {creator.name}
                      {creator.emailVerified && (
                        <BadgeCheck className="h-5 w-5 shrink-0 text-accent-soft" />
                      )}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-white/70">
                      <span className="rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 font-semibold text-accent-soft">
                        {creator.niche}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5" />
                        {Number(creator.subscriber_count).toLocaleString()} audience
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        Joined{' '}
                        {new Date(creator.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div className="dl-card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-2">
                    About
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {creator.bio || 'This creator hasn&apos;t added a bio yet.'}
                  </p>
                </div>

                <div className="dl-card p-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-2">
                    Channel
                  </h3>
                  {creator.channel_url ? (
                    <a
                      href={creator.channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-foreground"
                    >
                      <span className="truncate">{creator.channel_url}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    <p className="mt-3 text-sm text-muted-2">No channel linked.</p>
                  )}
                </div>
              </div>

              {/* CTA */}
              <div className="mt-5 flex flex-col items-center justify-between gap-4 rounded-2xl border border-accent/25 bg-accent/5 p-6 sm:flex-row">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                    <Building className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Want to work with {creator.name.split(' ')[0]}?
                    </p>
                    <p className="text-xs text-muted">
                      Brands can apply for marketplace access and submit a campaign brief.
                    </p>
                  </div>
                </div>
                <Link
                  href="/business/apply"
                  className="btn-primary group shrink-0"
                >
                  Apply as a brand
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
