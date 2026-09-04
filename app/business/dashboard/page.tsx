'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Users,
  Send,
  BadgeCheck,
  Search,
  ExternalLink,
  LayoutDashboard,
  Sparkles,
  ClipboardList,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
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

const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000+'];
const DELIVERABLES = ['1 dedicated video', '1 video + social posts', 'Podcast segment', 'Newsletter feature', 'Full campaign (3+ creators)'];

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

const STATUS_BADGES: Record<string, string> = {
  submitted: 'bg-accent/10 text-accent border-accent/30',
  reviewing: 'bg-warning/10 text-warning border-warning/30',
  matched: 'bg-primary-2/10 text-primary-2 border-primary-2/30',
};

export default function BusinessDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [tab, setTab] = useState<'overview' | 'browse' | 'briefs'>('overview');

  const [creators, setCreators] = useState<any[]>([]);
  const [creatorsTotal, setCreatorsTotal] = useState(0);
  const [q, setQ] = useState('');
  const [niche, setNiche] = useState('All niches');
  const [briefs, setBriefs] = useState<any[]>([]);
  const [briefsLoading, setBriefsLoading] = useState(false);

  const [briefForm, setBriefForm] = useState({
    product: '',
    niche: NICHES[1],
    minAudience: '',
    budget: BUDGETS[2],
    deliverables: DELIVERABLES[0],
    description: '',
  });
  const [briefSubmitting, setBriefSubmitting] = useState(false);
  const [briefError, setBriefError] = useState('');
  const [briefDone, setBriefDone] = useState(false);

  useEffect(() => {
    fetch('/api/creators/me')
      .then((res) => res.json())
      .then((data) => {
        if (!data.authenticated || !data.creator) {
          router.push('/creator/login');
          return;
        }
        if (data.creator.role !== 'business') {
          router.push('/creator/dashboard');
          return;
        }
        setUser(data.creator);
      })
      .catch(() => router.push('/creator/login'))
      .finally(() => setLoading(false));
  }, [router]);

  const loadCreators = useCallback(async () => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (niche !== 'All niches') params.set('niche', niche);
    const res = await fetch(`/api/creators?${params.toString()}`);
    const data = await res.json();
    if (res.ok) {
      setCreators(data.creators || []);
      setCreatorsTotal(data.pagination?.total || 0);
    }
  }, [q, niche]);

  const loadBriefs = useCallback(async () => {
    setBriefsLoading(true);
    try {
      const res = await fetch('/api/business/briefs');
      const data = await res.json();
      if (res.ok) setBriefs(data.briefs || []);
    } catch {
    } finally {
      setBriefsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadCreators();
  }, [user, loadCreators]);

  useEffect(() => {
    if (user && tab === 'briefs') loadBriefs();
  }, [user, tab, loadBriefs]);

  const submitBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setBriefSubmitting(true);
    setBriefError('');
    try {
      const res = await fetch('/api/business/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(briefForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit brief.');
      setBriefDone(true);
      setBriefForm({
        product: '',
        niche: NICHES[1],
        minAudience: '',
        budget: BUDGETS[2],
        deliverables: DELIVERABLES[0],
        description: '',
      });
      loadBriefs();
      setTimeout(() => setBriefDone(false), 4000);
    } catch (err: any) {
      setBriefError(err.message);
    } finally {
      setBriefSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm font-semibold">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative mb-8 overflow-hidden rounded-2xl bg-primary p-6 text-white shadow-high sm:p-8"
          >
            <div className="bg-dot-grid bg-dot-grid-fade absolute inset-0 opacity-40" />
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/20 blur-[90px]" />
            <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-soft">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Approved business
                </span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome, {user?.company || user?.name}
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Browse vetted creators and launch your next campaign.
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <LogOut className="h-3.5 w-3.5" />
                Log out
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {(
              [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'browse', label: 'Browse creators', icon: Users },
                { id: 'briefs', label: 'My campaigns', icon: ClipboardList },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  tab === t.id
                    ? 'bg-primary-2 text-white shadow-mid'
                    : 'border border-border bg-surface/70 text-muted hover:border-border-strong hover:text-foreground'
                }`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </button>
            ))}
          </div>

          {/* OVERVIEW */}
          {tab === 'overview' && (
            <div className="grid gap-5 sm:grid-cols-3">
              {[
                { label: 'Creators in network', value: creatorsTotal, icon: Users },
                { label: 'My campaign briefs', value: briefs.length || '—', icon: ClipboardList },
                { label: 'Account status', value: 'Approved', icon: BadgeCheck },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                  className="dl-card p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                      {stat.label}
                    </span>
                    <stat.icon className="h-4 w-4 text-accent" />
                  </div>
                  <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </motion.div>
              ))}
            </div>
          )}

          {/* BROWSE */}
          {tab === 'browse' && (
            <div>
              <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                  <input
                    type="text"
                    placeholder="Search creators..."
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    className="w-full rounded-xl border border-border bg-surface py-3 pl-11 pr-4 text-sm font-medium text-foreground shadow-soft transition-all placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                </div>
                <select
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-foreground shadow-soft focus:border-accent/50 focus:outline-none"
                >
                  {NICHES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {creators.map((c, i) => (
                  <motion.div
                    key={c.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                    className="dl-card p-5 transition-shadow duration-300 hover:shadow-mid"
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${
                          NICHE_GRADS[c.niche] || NICHE_GRADS['Other Niche']
                        } text-sm font-bold text-white shadow-soft`}
                      >
                        {(c.name || '?')[0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="flex items-center gap-1.5 truncate text-sm font-semibold text-foreground">
                          {c.name}
                          {c.emailVerified && (
                            <BadgeCheck className="h-4 w-4 shrink-0 text-accent" />
                          )}
                        </p>
                        <p className="truncate text-xs text-muted-2">
                          {Number(c.subscriber_count).toLocaleString()} audience
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                      <span className="rounded-full border border-border bg-soft-2 px-2.5 py-1 text-[11px] font-semibold text-muted">
                        {c.niche}
                      </span>
                      {c.channel_url && (
                        <a
                          href={c.channel_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-foreground"
                        >
                          Channel
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
                {creators.length === 0 && (
                  <div className="col-span-full rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted">
                    No creators found. Try a different search or niche.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* BRIEFS */}
          {tab === 'briefs' && (
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Brief form */}
              <div className="dl-card h-fit p-6 sm:p-7">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                  <Plus className="h-5 w-5 text-accent" />
                  New campaign brief
                </h3>
                <p className="mt-1 text-xs text-muted">
                  Tell us what you want — we&apos;ll match creators that fit.
                </p>

                {briefDone && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-sm font-medium text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    Brief submitted — our team is on it!
                  </div>
                )}
                {briefError && (
                  <div className="mt-4 flex items-center gap-2 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-sm font-medium text-danger">
                    <AlertCircle className="h-4 w-4" />
                    {briefError}
                  </div>
                )}

                <form onSubmit={submitBrief} className="mt-5 space-y-4">
                  <div>
                    <label className="dl-label">Product / service</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Northwind CRM"
                      value={briefForm.product}
                      onChange={(e) => setBriefForm({ ...briefForm, product: e.target.value })}
                      className="dl-input"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="dl-label">Target niche</label>
                      <select
                        value={briefForm.niche}
                        onChange={(e) => setBriefForm({ ...briefForm, niche: e.target.value })}
                        className="dl-input appearance-none"
                      >
                        {NICHES.filter((n) => n !== 'All niches').map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="dl-label">Min audience</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="e.g. 20000"
                        value={briefForm.minAudience}
                        onChange={(e) =>
                          setBriefForm({ ...briefForm, minAudience: e.target.value })
                        }
                        className="dl-input"
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="dl-label">Budget</label>
                      <select
                        value={briefForm.budget}
                        onChange={(e) => setBriefForm({ ...briefForm, budget: e.target.value })}
                        className="dl-input appearance-none"
                      >
                        {BUDGETS.map((b) => (
                          <option key={b} value={b}>
                            {b}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="dl-label">Deliverables</label>
                      <select
                        value={briefForm.deliverables}
                        onChange={(e) =>
                          setBriefForm({ ...briefForm, deliverables: e.target.value })
                        }
                        className="dl-input appearance-none"
                      >
                        {DELIVERABLES.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="dl-label">Brief description</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="What should creators know about your product and goals?"
                      value={briefForm.description}
                      onChange={(e) =>
                        setBriefForm({ ...briefForm, description: e.target.value })
                      }
                      className="dl-input resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={briefSubmitting}
                    className="btn-primary w-full py-3.5"
                  >
                    {briefSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit brief
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Brief list */}
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight text-foreground">
                  <Sparkles className="h-5 w-5 text-accent" />
                  Your briefs
                </h3>
                {briefsLoading ? (
                  <div className="flex justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-accent" />
                  </div>
                ) : briefs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted">
                    No briefs yet. Submit your first campaign brief and we&apos;ll match
                    creators for you.
                  </div>
                ) : (
                  <AnimatePresence>
                    {briefs.map((b, i) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, ease: EASE, delay: i * 0.06 }}
                        className="dl-card p-5"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-foreground">
                              {b.product}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-2">
                              {b.niche} · {b.deliverables} · {b.budget}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                              STATUS_BADGES[b.status] || STATUS_BADGES.submitted
                            }`}
                          >
                            {b.status}
                          </span>
                        </div>
                        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted">
                          {b.description}
                        </p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
