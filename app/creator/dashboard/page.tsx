'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCheck,
  Edit3,
  Save,
  LogOut,
  ExternalLink,
  CheckCircle,
  FileText,
  Mail,
  Calendar,
  Sparkles,
  Handshake,
  LayoutDashboard,
  Inbox,
  Users,
  BadgeCheck,
  Loader2,
  X,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import SubmitButton from '@/components/auth/SubmitButton';
import DealsPanel from '@/components/deals/DealsPanel';
import { EASE } from '@/lib/motion';

const NICHES = [
  'Tech & SaaS',
  'Gaming & Esports',
  'Finance & Investing',
  'Lifestyle & Vlogs',
  'Productivity & Business',
  'Fitness & Health',
  'Education & Learning',
  'Beauty & Fashion',
  'Entertainment & Comedy',
  'Other Niche',
];

const MATCH_STATUS: Record<string, { label: string; cls: string }> = {
  accepted: { label: 'Accepted', cls: 'border-accent/30 bg-accent/10 text-accent' },
  declined: { label: 'Declined', cls: 'border-border bg-soft-2 text-muted-2' },
  matched: { label: 'Matched', cls: 'border-accent/30 bg-accent/10 text-accent' },
};

export default function CreatorDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [creator, setCreator] = useState<any | null>(null);
  const [tab, setTab] = useState<'overview' | 'edit' | 'matches' | 'deals'>('overview');

  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [error, setError] = useState('');

  const [editForm, setEditForm] = useState({
    name: '',
    channel_url: '',
    subscriber_count: '',
    niche: '',
    bio: '',
  });

  const [inbox, setInbox] = useState<any[]>([]);
  const [decided, setDecided] = useState<any[]>([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesMessage, setMatchesMessage] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/creators/me');
      const data = await res.json();
      if (!data.authenticated || !data.creator) {
        router.push('/creator/login');
        return;
      }
      if (data.creator.role === 'business') {
        router.push('/business/dashboard');
        return;
      }
      setCreator(data.creator);
      setEditForm({
        name: data.creator.name || '',
        channel_url: data.creator.channel_url || '',
        subscriber_count: String(data.creator.subscriber_count || 0),
        niche: data.creator.niche || NICHES[0],
        bio: data.creator.bio || '',
      });
    } catch {
      setError('Failed to load creator profile.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const loadMatches = useCallback(async () => {
    setMatchesLoading(true);
    try {
      const res = await fetch('/api/creators/matches');
      const data = await res.json();
      if (res.ok) {
        setInbox(data.inbox || []);
        setDecided(data.decided || []);
      }
    } catch {
    } finally {
      setMatchesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (creator && tab === 'matches') loadMatches();
  }, [creator, tab, loadMatches]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);
    setSaveMessage('');
    setError('');

    try {
      const res = await fetch('/api/creators/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editForm.name,
          channel_url: editForm.channel_url,
          subscriber_count: Number(editForm.subscriber_count) || 0,
          niche: editForm.niche,
          bio: editForm.bio,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save changes.');

      setCreator(data.creator);
      setSaveSuccess(true);
      setSaveMessage('Profile updated!');
      setTimeout(() => {
        setSaveSuccess(false);
        setIsEditing(false);
        setTab('overview');
      }, 900);
    } catch (err: any) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleMatchAction = async (briefId: string, action: 'accept' | 'decline') => {
    setActionId(briefId);
    setMatchesMessage('');
    try {
      const res = await fetch('/api/creators/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ briefId, action }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMatchesMessage(data.error || 'Action failed.');
      } else {
        setMatchesMessage(
          action === 'accept'
            ? 'Deal accepted! The brand will reach out to you.'
            : 'Brief declined.'
        );
        loadMatches();
      }
    } catch (err: any) {
      setMatchesMessage(err.message || 'Action failed.');
    } finally {
      setActionId(null);
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
                <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent-soft">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-soft opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-soft" />
                  </span>
                  Active network member
                </span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Welcome back, {creator?.name}
                </h1>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-white/60">
                  <Calendar className="h-3.5 w-3.5" />
                  Member since{' '}
                  {new Date(creator?.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                  })}
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

          {saveMessage && !error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-accent">
              <CheckCircle className="h-4 w-4" />
              {saveMessage}
            </div>
          )}
          {error && (
            <div className="mb-6 flex items-center gap-2 rounded-xl border border-danger/25 bg-danger/5 p-4 text-sm font-medium text-danger">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}

          {/* Tabs */}
          <div className="mb-8 flex flex-wrap gap-2">
            {(
              [
                { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                { id: 'edit', label: 'Edit profile', icon: Edit3 },
                { id: 'matches', label: `Matches (${inbox.length})`, icon: Inbox },
                { id: 'deals', label: 'Deals', icon: Handshake },
              ] as const
            ).map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setIsEditing(t.id === 'edit');
                }}
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
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-5 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      label: 'Audience',
                      value: Number(creator?.subscriber_count || 0).toLocaleString(),
                      icon: Users,
                    },
                    { label: 'Niche', value: creator?.niche, icon: Sparkles },
                    {
                      label: 'Matches waiting',
                      value: inbox.length,
                      icon: Inbox,
                    },
                  ].map((stat, i) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, ease: EASE, delay: i * 0.08 }}
                      className="dl-card p-5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                          {stat.label}
                        </span>
                        <stat.icon className="h-4 w-4 text-accent" />
                      </div>
                      <p className="mt-3 truncate text-2xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Profile card */}
                <div className="dl-card p-6">
                  <div className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary-2 to-accent text-lg font-bold text-white">
                        {(creator?.name || '?')[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-lg font-semibold tracking-tight text-foreground">
                          {creator?.name}
                          {creator?.emailVerified && (
                            <BadgeCheck className="h-4 w-4 text-accent" />
                          )}
                        </p>
                        <p className="flex items-center gap-1 text-xs text-muted-2">
                          <Mail className="h-3 w-3" />
                          {creator?.email}
                        </p>
                      </div>
                    </div>
                    <span className="self-start rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                      {creator?.niche}
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-2">
                        <FileText className="h-3.5 w-3.5" />
                        Bio
                      </span>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {creator?.bio || 'No bio yet — add one so brands understand your content.'}
                      </p>
                    </div>
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                        Channel
                      </span>
                      <div className="mt-2">
                        {creator?.channel_url ? (
                          <a
                            href={creator.channel_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-foreground"
                          >
                            <span className="truncate">{creator.channel_url}</span>
                            <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-2">No channel linked.</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setTab('edit');
                      setIsEditing(true);
                    }}
                    className="btn-ghost mt-6"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit profile
                  </button>
                </div>
              </div>

              {/* Status sidebar */}
              <div className="space-y-5">
                <div className="rounded-2xl bg-primary p-6 text-white">
                  <h3 className="flex items-center gap-2 font-semibold">
                    <UserCheck className="h-5 w-5 text-accent-soft" />
                    Account status
                  </h3>
                  <div className="mt-4 space-y-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <span className="font-bold text-accent-soft">Active in network</span>
                      <p className="mt-1 leading-relaxed text-white/60">
                        Your profile is visible to approved businesses in the marketplace.
                      </p>
                    </div>
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3.5">
                      <span className="font-bold text-accent-soft">Next match step</span>
                      <p className="mt-1 leading-relaxed text-white/60">
                        Brand briefs in your niche appear in Matches — accept the ones you like.
                      </p>
                    </div>
                  </div>
                </div>

                {inbox.length > 0 && (
                  <div className="dl-card p-5">
                    <p className="text-sm font-semibold text-foreground">
                      {inbox.length} brief{inbox.length > 1 ? 's' : ''} waiting for you
                    </p>
                    <button
                      onClick={() => setTab('matches')}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-foreground"
                    >
                      Open matches
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EDIT */}
          {tab === 'edit' && (
            <div className="dl-card mx-auto max-w-2xl p-6 sm:p-8">
              <h3 className="mb-6 flex items-center gap-2 border-b border-border pb-4 text-lg font-semibold tracking-tight text-foreground">
                <Edit3 className="h-5 w-5 text-accent" />
                Update profile
              </h3>
              <form onSubmit={handleSave} className="space-y-5">
                <div>
                  <label className="dl-label">Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="dl-input"
                  />
                </div>
                <div>
                  <label className="dl-label">Channel / profile link</label>
                  <input
                    type="url"
                    required
                    value={editForm.channel_url}
                    onChange={(e) => setEditForm({ ...editForm, channel_url: e.target.value })}
                    className="dl-input"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="dl-label">Audience size</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.subscriber_count}
                      onChange={(e) =>
                        setEditForm({ ...editForm, subscriber_count: e.target.value })
                      }
                      className="dl-input"
                    />
                  </div>
                  <div>
                    <label className="dl-label">Niche</label>
                    <select
                      value={editForm.niche}
                      onChange={(e) => setEditForm({ ...editForm, niche: e.target.value })}
                      className="dl-input appearance-none"
                    >
                      {NICHES.map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="dl-label">Bio</label>
                  <textarea
                    rows={4}
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="dl-input resize-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <SubmitButton
                    loading={saveLoading}
                    success={saveSuccess}
                    label={
                      <>
                        <Save className="h-4 w-4" />
                        Save changes
                      </>
                    }
                    loadingLabel="Saving..."
                    successLabel="Saved!"
                    className="btn-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setTab('overview');
                    }}
                    className="btn-ghost"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MATCHES */}
          {tab === 'matches' && (
            <div className="mx-auto max-w-3xl">
              {matchesMessage && (
                <div className="mb-5 flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-accent">
                  <CheckCircle className="h-4 w-4" />
                  {matchesMessage}
                </div>
              )}

              {matchesLoading ? (
                <div className="flex justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-accent" />
                </div>
              ) : inbox.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border p-12 text-center">
                  <Inbox className="mx-auto h-8 w-8 text-muted-2" />
                  <p className="mt-4 text-sm font-semibold text-foreground">
                    No briefs in your niche right now
                  </p>
                  <p className="mt-1 text-xs text-muted">
                    Keep your profile fresh — new briefs in {creator?.niche} will appear here.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  <div className="space-y-4">
                    {inbox.map((b, i) => (
                      <motion.div
                        key={b.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.45, ease: EASE, delay: i * 0.06 }}
                        className="dl-card p-6"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-base font-semibold tracking-tight text-foreground">
                              {b.product}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-2">
                              {b.company} · {b.budget} · {b.deliverables}
                            </p>
                          </div>
                          <span className="shrink-0 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-accent">
                            New
                          </span>
                        </div>
                        <p className="mt-3 text-sm leading-relaxed text-muted">{b.description}</p>
                        <div className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5 sm:flex-row">
                          <button
                            onClick={() => handleMatchAction(b.id, 'accept')}
                            disabled={actionId === b.id}
                            className="btn-primary flex-1 py-2.5"
                          >
                            {actionId === b.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4" />
                                Accept deal
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => handleMatchAction(b.id, 'decline')}
                            disabled={actionId === b.id}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-border px-6 py-2.5 text-sm font-semibold text-muted transition-all hover:border-danger/40 hover:text-danger disabled:opacity-50"
                          >
                            <X className="h-4 w-4" />
                            Decline
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              )}

              {decided.length > 0 && (
                <div className="mt-10">
                  <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-muted-2">
                    Your decisions
                  </h3>
                  <div className="space-y-2.5">
                    {decided.map((d) => (
                      <div
                        key={`${d.id}-${d.status}`}
                        className="flex items-center justify-between rounded-xl border border-border bg-surface/60 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-foreground">
                            {d.product}
                          </p>
                          <p className="truncate text-xs text-muted-2">{d.company}</p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                            MATCH_STATUS[d.status]?.cls || MATCH_STATUS.declined.cls
                          }`}
                        >
                          {MATCH_STATUS[d.status]?.label || d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DEALS */}
          {tab === 'deals' && <DealsPanel role="creator" />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
