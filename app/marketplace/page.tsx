'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Search,
  SlidersHorizontal,
  BadgeCheck,
  Youtube,
  Instagram,
  Music2,
  Twitter,
  Linkedin,
  Loader2,
  ArrowRight,
  Users,
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { EASE } from '@/lib/motion';

const NICHES = [
  'All niches',
  'Tech & SaaS',
  'Gaming & Esports',
  'Finance & Investing',
  'Lifestyle & Vlogs',
  'Productivity & Business',
  'Fitness & Health',
  'Education & Learning',
  'Beauty & Fashion',
  'Entertainment & Comedy',
];

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

function SocialIcons({ socialAccounts }: { socialAccounts: Record<string, string> }) {
  const icons: { key: string; Icon: any; color: string }[] = [
    { key: 'youtube', Icon: Youtube, color: 'text-red-500' },
    { key: 'instagram', Icon: Instagram, color: 'text-pink-500' },
    { key: 'tiktok', Icon: Music2, color: 'text-foreground' },
    { key: 'twitter', Icon: Twitter, color: 'text-sky-500' },
    { key: 'linkedin', Icon: Linkedin, color: 'text-blue-600' },
  ];
  const active = icons.filter((i) => socialAccounts?.[i.key]);
  if (!active.length) return null;
  return (
    <div className="mt-2 flex items-center gap-2">
      {active.map(({ key, Icon, color }) => (
        <span key={key} className={`${color} opacity-75`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      ))}
    </div>
  );
}

function CreatorCardSkeleton() {
  return (
    <div className="dl-card p-5">
      <div className="flex items-center gap-3.5">
        <div className="h-12 w-12 animate-pulse rounded-xl bg-border" />
        <div className="flex-1 space-y-2">
          <div className="h-3.5 w-28 animate-pulse rounded bg-border" />
          <div className="h-3 w-20 animate-pulse rounded bg-border" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
        <div className="h-3 w-14 animate-pulse rounded bg-border" />
      </div>
    </div>
  );
}

export default function Marketplace() {
  const [creators, setCreators] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [q, setQ] = useState('');
  const [niche, setNiche] = useState('All niches');
  const [sort, setSort] = useState('recent');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [debouncedQ, setDebouncedQ] = useState('');

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedQ(q), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [q]);

  const load = useCallback(
    async (pageNum: number, append: boolean) => {
      append ? setLoadingMore(true) : setLoading(true);
      setError('');
      try {
        const params = new URLSearchParams({
          page: String(pageNum),
          sort,
        });
        if (debouncedQ) params.set('q', debouncedQ);
        if (niche !== 'All niches') params.set('niche', niche);

        const res = await fetch(`/api/creators?${params.toString()}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || 'Failed to load creators.');
          return;
        }

        setCreators((prev) => (append ? [...prev, ...(data.creators || [])] : data.creators || []));
        setTotal(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch {
        setError('Failed to load creators.');
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [debouncedQ, niche, sort]
  );

  useEffect(() => {
    setPage(1);
    load(1, false);
  }, [load]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    load(next, true);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto mb-10 max-w-2xl text-center"
          >
            <span className="dl-badge">Marketplace</span>
            <h1 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              The creators <span className="text-gradient-accent">brands are hiring</span>
            </h1>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              {total > 0 ? `${total} vetted creators` : 'A vetted network'} — search by niche,
              platform, and audience size.
            </p>
          </motion.div>

          {/* Search + sort */}
          <div className="mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                placeholder="Search creators, niches..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm font-medium text-foreground shadow-soft transition-all placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-muted-2" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground shadow-soft focus:border-accent/50 focus:outline-none"
              >
                <option value="recent">Newest</option>
                <option value="audience">Largest audience</option>
                <option value="name">Name A–Z</option>
              </select>
            </div>
          </div>

          {/* Niche chips */}
          <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
            {NICHES.map((n) => (
              <button
                key={n}
                onClick={() => setNiche(n)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  niche === n
                    ? 'bg-primary-2 text-white shadow-mid'
                    : 'border border-border bg-surface text-muted hover:border-accent/40 hover:text-foreground'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          {error && (
            <div className="mx-auto mb-8 max-w-md rounded-xl border border-danger/25 bg-danger/5 p-4 text-center text-sm font-medium text-danger">
              {error}
            </div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <CreatorCardSkeleton key={i} />
              ))}
            </div>
          ) : creators.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-14 text-center text-sm text-muted">
              No creators found. Try a different search or niche.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creators.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: (i % 6) * 0.05 }}
                    whileHover={{ y: -4 }}
                  >
                    <Link href={`/creators/${c.id}`} className="block h-full">
                      <div className="dl-card group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-mid hover:-translate-y-1">
                        {/* Card Banner Header */}
                        <div className="relative h-24 w-full overflow-hidden bg-gradient-to-r from-primary-2 via-primary to-accent/30">
                          {c.coverImage ? (
                            <img src={c.coverImage} alt={c.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          ) : (
                            <div className="absolute inset-0 bg-dot-grid opacity-30" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Media count pills */}
                          <div className="absolute top-2 right-2 flex items-center gap-1">
                            {Array.isArray(c.media) && c.media.length > 0 && (
                              <span className="rounded-full bg-black/60 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
                                {c.media.length} Photos
                              </span>
                            )}
                            {Array.isArray(c.videos) && c.videos.length > 0 && (
                              <span className="rounded-full bg-accent/80 backdrop-blur-sm px-2 py-0.5 text-[10px] font-semibold text-white">
                                {c.videos.length} Videos
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col pt-0">
                          {/* Avatar Overlapping Banner */}
                          <div className="relative -mt-8 mb-3 flex items-end justify-between">
                            <div className="relative">
                              {c.profileImage ? (
                                <div className="h-16 w-16 overflow-hidden rounded-2xl border-2 border-surface shadow-soft">
                                  <Image
                                    src={c.profileImage}
                                    alt={c.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div
                                  className={`flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-surface bg-gradient-to-br ${
                                    NICHE_GRADS[c.niche] || NICHE_GRADS['Other Niche']
                                  } text-lg font-bold text-white shadow-soft`}
                                >
                                  {(c.name || '?')[0]}
                                </div>
                              )}
                              {c.verified && (
                                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-white shadow">
                                  <BadgeCheck className="h-3.5 w-3.5" />
                                </span>
                              )}
                            </div>

                            <span className="rounded-full border border-border bg-soft-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
                              {c.niche}
                            </span>
                          </div>

                          <div className="min-w-0">
                            <p className="flex items-center gap-1.5 truncate text-base font-bold text-foreground">
                              {c.name}
                              {c.verified && (
                                <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                              )}
                            </p>
                            {c.tagline && (
                              <p className="text-xs font-medium text-muted truncate mt-0.5">{c.tagline}</p>
                            )}
                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-2 mt-1">
                              <span className="flex items-center gap-1 font-semibold text-foreground">
                                <Users className="h-3 w-3 text-accent" />
                                {Number(c.subscriber_count).toLocaleString()} audience
                              </span>
                              {c.location && (
                                <span>· {c.location}</span>
                              )}
                            </div>
                            <div className="mt-2">
                              <SocialIcons socialAccounts={c.socialAccounts || {}} />
                            </div>
                          </div>

                          <p className="mt-3 line-clamp-2 flex-1 text-xs leading-relaxed text-muted">
                            {c.bio || 'Professional content creator on DealLink.'}
                          </p>

                          <div className="mt-4 flex items-center justify-between border-t border-border pt-3.5">
                            <span className="text-[11px] font-semibold text-muted">
                              {c.pricingRate ? `From $${Number(c.pricingRate).toLocaleString()}` : 'Available for briefs'}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-accent transition-all group-hover:gap-1.5">
                              View Profile
                              <ArrowRight className="h-3 w-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {page < totalPages && (
                <div className="mt-10 text-center">
                  <button onClick={loadMore} disabled={loadingMore} className="btn-ghost">
                    {loadingMore ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more creators'
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {/* CTA */}
          <div className="mx-auto mt-16 max-w-xl text-center">
            <p className="text-sm text-muted">
              Are you a creator?{' '}
              <Link
                href="/creator/signup"
                className="font-semibold text-accent underline-offset-4 hover:text-foreground hover:underline"
              >
                Join the network free
              </Link>{' '}
              · Brand?{' '}
              <Link
                href="/business/apply"
                className="font-semibold text-accent underline-offset-4 hover:text-foreground hover:underline"
              >
                Apply for access
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
