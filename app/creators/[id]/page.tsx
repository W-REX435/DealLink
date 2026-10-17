'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BadgeCheck,
  ExternalLink,
  Users,
  ArrowLeft,
  Loader2,
  Building,
  ArrowRight,
  AlertCircle,
  MapPin,
  Mail,
  Play,
  Image as ImageIcon,
  Video,
  CheckCircle2,
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

      <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/marketplace"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition-colors hover:text-foreground"
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
              className="space-y-6"
            >
              {/* Profile Card with Cover Banner */}
              <div className="dl-card overflow-hidden">
                {/* Hero Banner */}
                <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-gradient-to-r from-primary via-primary-2 to-accent/30">
                  {creator.coverImage ? (
                    <img
                      src={creator.coverImage}
                      alt={creator.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-dot-grid opacity-30" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                <div className="p-6 sm:p-8">
                  {/* Creator Identity overlapping banner */}
                  <div className="relative -mt-20 sm:-mt-24 mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex items-end gap-4">
                      <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-surface bg-gradient-to-br from-primary-2 to-accent text-3xl font-bold text-white shadow-xl shrink-0">
                        {creator.profileImage ? (
                          <img
                            src={creator.profileImage}
                            alt={creator.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          (creator.name || '?')[0]
                        )}
                        {creator.verified && (
                          <span className="absolute bottom-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white shadow">
                            <BadgeCheck className="h-4 w-4" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 pb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                            {creator.name}
                          </h1>
                          {creator.verified && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs font-bold text-green-500">
                              <CheckCircle2 className="h-3 w-3" />
                              Verified Creator
                            </span>
                          )}
                        </div>
                        {creator.tagline && (
                          <p className="text-sm font-medium text-muted mt-0.5">
                            {creator.tagline}
                          </p>
                        )}
                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-2">
                          {creator.location && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-3.5 w-3.5 text-accent" />
                              {creator.location}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                            <Users className="h-3.5 w-3.5 text-accent" />
                            {Number(creator.subscriber_count || 0).toLocaleString()} Total Audience
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1 text-xs font-semibold text-accent">
                        {creator.niche}
                      </span>
                      <a
                        href={`mailto:${creator.email}?subject=DealLink%20Sponsorship%20Proposal`}
                        className="btn-primary py-2 px-4 text-xs font-bold"
                      >
                        <Mail className="h-3.5 w-3.5" />
                        Contact Creator
                      </a>
                    </div>
                  </div>

                  {/* Social Media Follower Badges (like in screenshot) */}
                  <div className="border-t border-border pt-5 pb-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-2 block mb-3">
                      Social Accounts & Platforms
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {['youtube', 'instagram', 'tiktok', 'twitter', 'linkedin', 'twitch'].map((platform) => {
                        const url = creator.socialAccounts?.[platform];
                        if (!url) return null;
                        return (
                          <a
                            key={platform}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-xs font-semibold capitalize text-foreground transition-all hover:border-accent/40 hover:text-accent shadow-soft"
                          >
                            <span>{platform === 'twitter' ? 'X / Twitter' : platform}</span>
                            <ExternalLink className="h-3 w-3 text-muted-2" />
                          </a>
                        );
                      })}
                      {!Object.values(creator.socialAccounts || {}).some(Boolean) && (
                        <span className="text-xs text-muted-2">No social accounts connected.</span>
                      )}
                    </div>
                  </div>

                  {/* About Bio */}
                  <div className="border-t border-border pt-5">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-2 block mb-2">
                      About
                    </span>
                    <p className="text-sm leading-relaxed text-muted whitespace-pre-line">
                      {creator.bio || 'This creator hasn’t added a detailed bio yet.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Showcase Photos Gallery (like reference screenshot with 3 showcase photos side by side!) */}
              {Array.isArray(creator.media) && creator.media.length > 0 && (
                <div className="dl-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-accent" />
                      Portfolio & Showcase Photos
                    </h3>
                    <span className="text-xs font-semibold text-muted">
                      {creator.media.length} Photos
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {creator.media.map((imgUrl: string, idx: number) => (
                      <div
                        key={idx}
                        className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-border group shadow-soft"
                      >
                        <img
                          src={imgUrl}
                          alt={`Showcase ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Showcase Videos */}
              {Array.isArray(creator.videos) && creator.videos.length > 0 && (
                <div className="dl-card p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                      <Video className="h-4 w-4 text-accent" />
                      Featured Videos
                    </h3>
                    <span className="text-xs font-semibold text-muted">
                      {creator.videos.length} Videos
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {creator.videos.map((vid: any, idx: number) => (
                      <a
                        key={idx}
                        href={vid.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3.5 rounded-xl border border-border bg-surface hover:border-accent/40 transition-colors shadow-soft"
                      >
                        <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center text-accent shrink-0">
                          <Play className="h-4 w-4 fill-current" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {vid.title || `Featured Video ${idx + 1}`}
                          </p>
                          <p className="text-[11px] text-muted-2 truncate">{vid.url}</p>
                        </div>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-2 shrink-0" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Collaboration CTA */}
              <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-accent/25 bg-gradient-to-r from-accent/10 via-primary/5 to-transparent p-6 sm:flex-row">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent shrink-0">
                    <Building className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      Ready to collaborate with {creator.name}?
                    </h4>
                    <p className="text-xs text-muted">
                      Reach out directly to propose a sponsorship or custom campaign deliverable.
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${creator.email}?subject=DealLink%20Brand%20Partnership`}
                  className="btn-primary group shrink-0 py-3 px-6"
                >
                  <Mail className="h-4 w-4" />
                  Send Proposal
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          ) : null}
        </div>
      </main>

      <Footer />
    </div>
  );
}
