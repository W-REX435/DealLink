'use client';
import { track } from '@vercel/analytics/react';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  CheckCircle,
  CircleDollarSign,
  PlayCircle,
  XCircle,
  Handshake,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { EASE } from '@/lib/motion';

type Deal = {
  id: string;
  product: string;
  company: string;
  niche: string;
  deliverables: string;
  budget: string;
  dealValue: number;
  paidAmount: number;
  status: string;
  creatorName: string;
  businessName: string;
  startedAt?: string;
  completedAt?: string;
  paidAt?: string;
  created_at: string;
};

const STAGES = ['proposed', 'active', 'completed', 'paid'];

const STATUS_BADGES: Record<string, { label: string; cls: string }> = {
  proposed: { label: 'Proposed', cls: 'border-accent/30 bg-accent/10 text-accent' },
  active: { label: 'Active', cls: 'border-primary-2/30 bg-primary-2/10 text-primary-2' },
  completed: { label: 'Completed', cls: 'border-warning/30 bg-warning/10 text-warning' },
  paid: { label: 'Paid', cls: 'border-success/30 bg-success/10 text-success' },
  cancelled: { label: 'Cancelled', cls: 'border-border bg-soft-2 text-muted-2' },
};

export default function DealsPanel({ role }: { role: 'creator' | 'business' }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionId, setActionId] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/deals');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load deals.');
      setDeals(data.deals || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const transition = async (id: string, action: string, amount?: string) => {
    setActionId(id);
    setError('');
    try {
      const res = await fetch(`/api/deals/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, amount: amount ? Number(amount) : undefined }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed.');
      track(`deal_${action}`);
      load();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setActionId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-accent" />
      </div>
    );
  }

  if (error && deals.length === 0) {
    return (
      <div className="rounded-2xl border border-danger/25 bg-danger/5 p-10 text-center text-sm font-medium text-danger">
        {error}
      </div>
    );
  }

  if (deals.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-12 text-center">
        <Handshake className="mx-auto h-8 w-8 text-muted-2" />
        <p className="mt-4 text-sm font-semibold text-foreground">No deals yet</p>
        <p className="mt-1 text-xs text-muted">
          {role === 'creator'
            ? 'Accept a brief from your Matches tab to start your first deal.'
            : 'Deals appear here when a creator accepts your brief.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-danger/25 bg-danger/5 p-4 text-sm font-medium text-danger">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <AnimatePresence>
        <div className="space-y-4">
          {deals.map((deal, i) => {
            const stageIndex = STAGES.indexOf(deal.status);
            return (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.45, ease: EASE, delay: i * 0.05 }}
                className="dl-card p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-tight text-foreground">
                      {deal.product}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-2">
                      {role === 'creator'
                        ? `with ${deal.company} · ${deal.deliverables}`
                        : `with ${deal.creatorName} · ${deal.deliverables}`}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full border px-2.5 py-1 text-[11px] font-bold capitalize ${
                      STATUS_BADGES[deal.status]?.cls || STATUS_BADGES.proposed.cls
                    }`}
                  >
                    {STATUS_BADGES[deal.status]?.label || deal.status}
                  </span>
                </div>

                {/* Value + dates */}
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted">
                  <span>
                    Deal value:{' '}
                    <strong className="text-foreground">
                      {deal.dealValue ? `$${deal.dealValue.toLocaleString()}` : 'TBD'}
                    </strong>
                  </span>
                  {deal.paidAmount > 0 && (
                    <span>
                      Paid:{' '}
                      <strong className="text-success">
                        ${deal.paidAmount.toLocaleString()}
                      </strong>
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(deal.created_at).toLocaleDateString()}
                  </span>
                </div>

                {/* Timeline */}
                <div className="mt-5 flex items-center gap-1.5">
                  {STAGES.map((stage, idx) => (
                    <div key={stage} className="flex flex-1 items-center gap-1.5">
                      <div
                        className={`h-1.5 flex-1 rounded-full ${
                          deal.status === 'cancelled'
                            ? 'bg-border'
                            : idx <= stageIndex
                            ? 'bg-gradient-to-r from-primary-2 to-accent'
                            : 'bg-border'
                        }`}
                      />
                      {idx < STAGES.length - 1 && (
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full ${
                            deal.status === 'cancelled'
                              ? 'bg-border'
                              : idx < stageIndex
                              ? 'bg-accent'
                              : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                {role === 'business' && deal.status === 'proposed' && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-2">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder="Agreed deal value"
                        value={amounts[deal.id] || ''}
                        onChange={(e) =>
                          setAmounts({ ...amounts, [deal.id]: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-soft-2 py-2.5 pl-8 pr-4 text-sm font-medium text-foreground placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                    <button
                      onClick={() => transition(deal.id, 'start', amounts[deal.id])}
                      disabled={actionId === deal.id}
                      className="btn-primary shrink-0 py-2.5"
                    >
                      {actionId === deal.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <PlayCircle className="h-4 w-4" />
                          Start deal
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => transition(deal.id, 'cancel')}
                      disabled={actionId === deal.id}
                      className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted transition-all hover:border-danger/40 hover:text-danger disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Cancel
                    </button>
                  </div>
                )}

                {role === 'business' && deal.status === 'completed' && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted-2">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        placeholder={deal.dealValue ? `Default $${deal.dealValue.toLocaleString()}` : 'Amount paid'}
                        value={amounts[deal.id] || ''}
                        onChange={(e) =>
                          setAmounts({ ...amounts, [deal.id]: e.target.value })
                        }
                        className="w-full rounded-xl border border-border bg-soft-2 py-2.5 pl-8 pr-4 text-sm font-medium text-foreground placeholder:text-muted-2 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    </div>
                    <button
                      onClick={() => transition(deal.id, 'pay', amounts[deal.id])}
                      disabled={actionId === deal.id}
                      className="btn-primary shrink-0 py-2.5"
                    >
                      {actionId === deal.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CircleDollarSign className="h-4 w-4" />
                          Mark paid
                        </>
                      )}
                    </button>
                  </div>
                )}

                {role === 'creator' && deal.status === 'active' && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                    <button
                      onClick={() => transition(deal.id, 'complete')}
                      disabled={actionId === deal.id}
                      className="btn-primary flex-1 py-2.5"
                    >
                      {actionId === deal.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          Mark content delivered
                        </>
                      )}
                    </button>
                  </div>
                )}

                {role === 'creator' && deal.status === 'proposed' && (
                  <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row">
                    <button
                      onClick={() => transition(deal.id, 'cancel')}
                      disabled={actionId === deal.id}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-muted transition-all hover:border-danger/40 hover:text-danger disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                      Withdraw
                    </button>
                  </div>
                )}

                {deal.status === 'paid' && (
                  <div className="mt-5 flex items-center gap-2 border-t border-border pt-5 text-sm font-semibold text-success">
                    <CheckCircle className="h-4 w-4" />
                    Deal paid in full — great work!
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
