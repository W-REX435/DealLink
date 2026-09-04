'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Users,
  Building2,
  Lock,
  Mail,
  ExternalLink,
  Search,
  RefreshCw,
  X,
  CheckCircle2,
  ClipboardList,
  Handshake,
  Inbox,
  Loader2,
  Sparkles,
} from 'lucide-react';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import { EASE } from '@/lib/motion';

type Tab = 'creators' | 'businesses' | 'applications' | 'briefs' | 'deals' | 'leads';

const DEAL_BADGES: Record<string, string> = {
  proposed: 'border-accent/30 bg-accent/10 text-accent',
  active: 'border-primary-2/30 bg-primary-2/10 text-primary-2',
  completed: 'border-warning/30 bg-warning/10 text-warning',
  paid: 'border-success/30 bg-success/10 text-success',
  cancelled: 'border-border bg-soft-2 text-muted-2',
};

const BRIEF_STATUSES = ['submitted', 'reviewing', 'matched'];

export default function AdminPage() {
  const [passcode, setPasscode] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [data, setData] = useState<any>({
    creators: [],
    businesses: [],
    applications: [],
    briefs: [],
    deals: [],
    matches: [],
    leads: [],
    stats: {},
  });
  const [dataLoading, setDataLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<Tab>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<any | null>(null);

  const [actionId, setActionId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState('');

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/admin/data');
      const json = await res.json();
      if (res.ok && json.authenticated) {
        setAuthenticated(true);
        setData(json);
      } else {
        setAuthenticated(false);
      }
    } catch {
      setAuthenticated(false);
    } finally {
      setAuthLoading(false);
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passcode.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Incorrect admin passcode.');
      fetchData();
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleApplicationAction = async (id: string, action: 'approve' | 'reject') => {
    setActionId(id);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionMessage(json.error || 'Action failed.');
      } else {
        setActionMessage(
          action === 'approve'
            ? json.emailConfigured
              ? 'Approved — invite email sent.'
              : 'Approved — email not configured, no invite sent.'
            : 'Application rejected.'
        );
        fetchData();
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Action failed.');
    } finally {
      setActionId(null);
    }
  };

  const handleBriefStatus = async (id: string, status: string) => {
    setActionId(id);
    setActionMessage('');
    try {
      const res = await fetch('/api/admin/briefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (!res.ok) {
        setActionMessage(json.error || 'Failed to update brief.');
      } else {
        setActionMessage('Brief status updated.');
        fetchData();
      }
    } catch (err: any) {
      setActionMessage(err.message || 'Failed to update brief.');
    } finally {
      setActionId(null);
    }
  };

  const filterBySearch = (items: any[], fields: string[]) => {
    const q = searchQuery.toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      fields.some((f) => String(item[f] ?? '').toLowerCase().includes(q))
    );
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <p className="text-sm font-semibold">Verifying admin access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="w-full max-w-sm"
          >
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-accent-soft">
                <Shield className="h-6 w-6" />
              </div>
              <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
                Admin portal
              </h1>
              <p className="mt-1 text-sm text-muted">
                Enter the passcode to manage the network.
              </p>
            </div>

            <div className="dl-card mt-7 p-6 shadow-mid sm:p-8">
              {loginError && (
                <div className="mb-5 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-sm font-medium text-danger">
                  {loginError}
                </div>
              )}
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <div>
                  <label className="dl-label">
                    <Lock className="mr-1.5 inline h-3.5 w-3.5 text-accent" />
                    Admin passcode
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Enter passcode"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="dl-input"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn-primary w-full py-3.5"
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Unlock admin view
                    </>
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const stats = data.stats || {};

  const statCards = [
    { label: 'Creators', value: stats.totalCreators || 0, icon: Users },
    { label: 'Businesses', value: stats.totalBusinesses || 0, icon: Building2 },
    { label: 'Pending applications', value: stats.pendingApplications || 0, icon: ClipboardList },
    { label: 'Campaign briefs', value: stats.totalBriefs || 0, icon: Inbox },
    { label: 'Deals', value: stats.totalDeals || 0, icon: Handshake },
    { label: 'Matches', value: stats.totalMatches || 0, icon: Sparkles },
  ];

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: 'creators', label: 'Creators', count: data.creators?.length || 0 },
    { id: 'businesses', label: 'Businesses', count: data.businesses?.length || 0 },
    { id: 'applications', label: 'Applications', count: (data.applications || []).filter((a: any) => a.status === 'pending').length },
    { id: 'briefs', label: 'Briefs', count: data.briefs?.length || 0 },
    { id: 'deals', label: 'Deals', count: data.deals?.length || 0 },
    { id: 'leads', label: 'Leads', count: data.leads?.length || 0 },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
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
                <span className="inline-flex items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-accent-soft">
                  <Shield className="h-3.5 w-3.5" />
                  Internal admin
                </span>
                <h1 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                  DealLink network overview
                </h1>
                <p className="mt-1 text-sm text-white/60">
                  Creators, businesses, applications, briefs, and deals.
                </p>
              </div>
              <button
                onClick={fetchData}
                disabled={dataLoading}
                className="inline-flex items-center gap-2 self-start rounded-xl border border-white/15 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white/90 backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${dataLoading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                className="dl-card p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-2">
                    {stat.label}
                  </span>
                  <stat.icon className="h-3.5 w-3.5 text-accent" />
                </div>
                <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Tabs + search */}
          <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                    activeTab === t.id
                      ? 'bg-primary-2 text-white shadow-mid'
                      : 'border border-border bg-surface/70 text-muted hover:border-border-strong hover:text-foreground'
                  }`}
                >
                  {t.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      activeTab === t.id ? 'bg-white/20 text-white' : 'bg-soft-2 text-muted-2'
                    }`}
                  >
                    {t.count}
                  </span>
                </button>
              ))}
            </div>
            <div className="relative w-full lg:w-72">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-4 text-sm font-medium text-foreground shadow-soft transition-all placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
            </div>
          </div>

          {actionMessage && (
            <div className="mb-5 rounded-xl border border-accent/30 bg-accent/10 p-4 text-sm font-semibold text-accent">
              {actionMessage}
            </div>
          )}

          {dataLoading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-accent" />
            </div>
          )}

          {/* CREATORS */}
          {!dataLoading && activeTab === 'creators' && (
            <div className="dl-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">Creator</th>
                      <th className="px-4 py-3.5 font-bold">Niche</th>
                      <th className="px-4 py-3.5 font-bold">Audience</th>
                      <th className="px-4 py-3.5 font-bold">Verified</th>
                      <th className="px-4 py-3.5 font-bold">Joined</th>
                      <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filterBySearch(data.creators || [], ['name', 'email', 'niche', 'bio']).map((c: any) => (
                      <tr key={c.id} className="transition-colors hover:bg-soft-2/60">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-foreground">{c.name}</p>
                          <p className="text-xs text-muted-2">{c.email}</p>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="rounded-full border border-border bg-soft-2 px-2.5 py-1 text-xs font-semibold text-muted">
                            {c.niche}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-foreground">
                          {Number(c.subscriber_count).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5">
                          {c.emailVerified ? (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          ) : (
                            <X className="h-4 w-4 text-muted-2" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">
                          {new Date(c.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCreator(c)}
                              className="rounded-lg border border-border bg-soft-2 px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:border-accent/40"
                            >
                              View bio
                            </button>
                            <a
                              href={`mailto:${c.email}?subject=DealLink%20Sponsorship%20Opportunity`}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-primary-2 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary"
                            >
                              <Mail className="h-3 w-3" />
                              Contact
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filterBySearch(data.creators || [], ['name', 'email', 'niche', 'bio']).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                          No creators found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* BUSINESSES */}
          {!dataLoading && activeTab === 'businesses' && (
            <div className="dl-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">Business</th>
                      <th className="px-4 py-3.5 font-bold">Contact</th>
                      <th className="px-4 py-3.5 font-bold">Verified</th>
                      <th className="px-4 py-3.5 font-bold">Joined</th>
                      <th className="px-4 py-3.5 text-right font-bold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filterBySearch(data.businesses || [], ['name', 'company', 'email']).map((b: any) => (
                      <tr key={b.id} className="transition-colors hover:bg-soft-2/60">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-foreground">{b.company}</p>
                          <p className="text-xs text-muted-2">{b.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">{b.email}</td>
                        <td className="px-4 py-3.5">
                          {b.emailVerified ? (
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                          ) : (
                            <X className="h-4 w-4 text-muted-2" />
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">
                          {new Date(b.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={`mailto:${b.email}?subject=DealLink`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-2 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary"
                          >
                            <Mail className="h-3 w-3" />
                            Contact
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filterBySearch(data.businesses || [], ['name', 'company', 'email']).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                          No approved businesses yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* APPLICATIONS */}
          {!dataLoading && activeTab === 'applications' && (
            <div className="space-y-4">
              {(data.applications || []).length === 0 ? (
                <div className="dl-card p-12 text-center text-sm text-muted">
                  No business applications yet.
                </div>
              ) : (
                data.applications.map((a: any, i: number) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                    className="dl-card p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-bold text-foreground">{a.company}</span>
                          <span
                            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold capitalize ${
                              a.status === 'pending'
                                ? 'border-warning/30 bg-warning/10 text-warning'
                                : a.status === 'approved'
                                ? 'border-accent/30 bg-accent/10 text-accent'
                                : 'border-danger/30 bg-danger/10 text-danger'
                            }`}
                          >
                            {a.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-2">
                          {a.contactName} · {a.email}
                          {a.website ? (
                            <>
                              {' · '}
                              <a
                                href={a.website.startsWith('http') ? a.website : `https://${a.website}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-accent underline"
                              >
                                {a.website}
                              </a>
                            </>
                          ) : null}
                        </p>
                        <p className="text-xs text-muted">
                          <strong>Budget:</strong> {a.budgetRange} · <strong>Timeline:</strong>{' '}
                          {a.timeline}
                        </p>
                        <p className="max-w-2xl text-sm leading-relaxed text-muted">{a.goals}</p>
                        <p className="text-[11px] text-muted-2">
                          Submitted {new Date(a.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      {a.status === 'pending' && (
                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            onClick={() => handleApplicationAction(a.id, 'approve')}
                            disabled={actionId === a.id}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-primary-2 px-4 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary disabled:opacity-50"
                          >
                            {actionId === a.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleApplicationAction(a.id, 'reject')}
                            disabled={actionId === a.id}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-danger/25 bg-danger/5 px-4 py-2.5 text-xs font-bold text-danger transition-colors hover:bg-danger/10 disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* BRIEFS */}
          {!dataLoading && activeTab === 'briefs' && (
            <div className="space-y-4">
              {(data.briefs || []).length === 0 ? (
                <div className="dl-card p-12 text-center text-sm text-muted">
                  No campaign briefs yet.
                </div>
              ) : (
                data.briefs.map((b: any, i: number) => (
                  <motion.div
                    key={b.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: i * 0.04 }}
                    className="dl-card p-6"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-foreground">{b.product}</p>
                        <p className="mt-0.5 text-xs text-muted-2">
                          {b.company} · {b.niche} · {b.budget} · {b.deliverables}
                        </p>
                        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
                          {b.description}
                        </p>
                      </div>
                      <div className="flex shrink-0 flex-col items-start gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                            b.status === 'matched'
                              ? 'border-accent/30 bg-accent/10 text-accent'
                              : b.status === 'reviewing'
                              ? 'border-warning/30 bg-warning/10 text-warning'
                              : 'border-border bg-soft-2 text-muted-2'
                          }`}
                        >
                          {b.status}
                        </span>
                        <select
                          value={b.status}
                          onChange={(e) => handleBriefStatus(b.id, e.target.value)}
                          disabled={actionId === b.id}
                          className="rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-semibold text-foreground focus:border-accent/50 focus:outline-none disabled:opacity-50"
                        >
                          {BRIEF_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* DEALS */}
          {!dataLoading && activeTab === 'deals' && (
            <div className="dl-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">Product</th>
                      <th className="px-4 py-3.5 font-bold">Business</th>
                      <th className="px-4 py-3.5 font-bold">Creator</th>
                      <th className="px-4 py-3.5 font-bold">Value</th>
                      <th className="px-4 py-3.5 font-bold">Status</th>
                      <th className="px-4 py-3.5 font-bold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {(data.deals || []).map((d: any) => (
                      <tr key={d.id} className="transition-colors hover:bg-soft-2/60">
                        <td className="px-4 py-3.5 font-semibold text-foreground">{d.product}</td>
                        <td className="px-4 py-3.5 text-muted">{d.company}</td>
                        <td className="px-4 py-3.5 text-muted">{d.creatorName}</td>
                        <td className="px-4 py-3.5 font-bold text-foreground">
                          {d.dealValue ? `$${Number(d.dealValue).toLocaleString()}` : 'TBD'}
                        </td>
                        <td className="px-4 py-3.5">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                              DEAL_BADGES[d.status] || DEAL_BADGES.proposed
                            }`}
                          >
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">
                          {new Date(d.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {(data.deals || []).length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-sm text-muted">
                          No deals yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* LEADS */}
          {!dataLoading && activeTab === 'leads' && (
            <div className="dl-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-primary text-white uppercase text-[11px] tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5 font-bold">Company</th>
                      <th className="px-4 py-3.5 font-bold">Contact</th>
                      <th className="px-4 py-3.5 font-bold">What they want</th>
                      <th className="px-4 py-3.5 font-bold">Date</th>
                      <th className="px-4 py-3.5 text-right font-bold">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filterBySearch(data.leads || [], ['name', 'company', 'email', 'promotion_needs']).map((l: any) => (
                      <tr key={l.id} className="transition-colors hover:bg-soft-2/60">
                        <td className="px-4 py-3.5">
                          <p className="font-semibold text-foreground">{l.company}</p>
                          <p className="text-xs text-muted-2">{l.name}</p>
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">{l.email}</td>
                        <td className="max-w-xs px-4 py-3.5 text-xs leading-relaxed text-muted">
                          {l.promotion_needs}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-muted">
                          {new Date(l.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <a
                            href={`mailto:${l.email}?subject=DealLink`}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-primary-2 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-primary"
                          >
                            <Mail className="h-3 w-3" />
                            Reply
                          </a>
                        </td>
                      </tr>
                    ))}
                    {filterBySearch(data.leads || [], ['name', 'company', 'email', 'promotion_needs']).length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted">
                          No leads yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Creator bio modal */}
      {selectedCreator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-surface shadow-high"
          >
            <div className="flex items-center justify-between bg-primary p-6 text-white">
              <div>
                <h3 className="text-lg font-semibold">{selectedCreator.name}</h3>
                <p className="text-xs text-white/60">{selectedCreator.email}</p>
              </div>
              <button
                onClick={() => setSelectedCreator(null)}
                className="rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 p-6 text-sm">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                    Audience
                  </span>
                  <p className="text-xl font-bold text-foreground">
                    {Number(selectedCreator.subscriber_count).toLocaleString()}
                  </p>
                </div>
                <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                  {selectedCreator.niche}
                </span>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                  Channel
                </span>
                <div className="mt-1">
                  {selectedCreator.channel_url ? (
                    <a
                      href={selectedCreator.channel_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-semibold text-accent hover:text-foreground"
                    >
                      <span className="truncate">{selectedCreator.channel_url}</span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-muted-2">No channel linked.</span>
                  )}
                </div>
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-muted-2">
                  Bio
                </span>
                <p className="mt-1 rounded-xl bg-soft-2 p-3.5 text-xs leading-relaxed text-muted">
                  {selectedCreator.bio || 'No bio provided.'}
                </p>
              </div>
              <div className="flex items-center justify-end border-t border-border pt-4">
                <a
                  href={`mailto:${selectedCreator.email}?subject=DealLink%20Sponsorship%20Opportunity`}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-primary-2 px-5 py-2.5 text-xs font-bold text-white transition-colors hover:bg-primary"
                >
                  <Mail className="h-3.5 w-3.5" />
                  Email creator
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
