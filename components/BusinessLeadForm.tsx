'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Send, CheckCircle2, Loader2 } from 'lucide-react';

export default function BusinessLeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    website: '',
    promotion_needs: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong.');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit form.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl border border-white/15 bg-white/[0.06] p-10 text-center shadow-high backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/15"
        >
          <CheckCircle2 className="h-8 w-8 text-accent-soft" />
        </motion.div>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight text-white">
          Thank you!
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-white/60">
          Thanks — we&apos;ll be in touch with creators that match what
          you&apos;re looking for.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-7 text-sm font-semibold text-accent-soft transition-colors hover:text-white"
        >
          Submit another inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/15 bg-white/[0.06] p-6 shadow-high backdrop-blur-md sm:p-8">
      <div className="mb-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15">
            <Building2 className="h-5 w-5 text-accent-soft" />
          </div>
          <div>
            <h3 className="text-lg font-semibold tracking-tight text-white">
              Get matched with creators
            </h3>
            <p className="text-xs text-white/50">
              Tell us what you want to promote — we&apos;ll handle the rest.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-400/30 bg-red-500/10 p-3.5 text-sm font-medium text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Name
            </label>
            <input
              type="text"
              required
              placeholder="Jane Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 transition-all focus:border-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent-soft/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Company
            </label>
            <input
              type="text"
              required
              placeholder="Acme Inc."
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 transition-all focus:border-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent-soft/20"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="jane@acme.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 transition-all focus:border-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent-soft/20"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60">
              Website <span className="font-normal normal-case text-white/30">(optional)</span>
            </label>
            <input
              type="url"
              placeholder="https://acme.com"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 transition-all focus:border-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent-soft/20"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-white/60">
            What do you want to promote?
          </label>
          <textarea
            rows={4}
            required
            placeholder="We're launching a new product and looking for 3-5 creators in tech and productivity..."
            value={formData.promotion_needs}
            onChange={(e) =>
              setFormData({ ...formData, promotion_needs: e.target.value })
            }
            className="w-full resize-none rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white placeholder:text-white/30 transition-all focus:border-accent-soft/50 focus:outline-none focus:ring-2 focus:ring-accent-soft/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-primary shadow-[0_0_30px_rgba(255,255,255,0.08)] transition-all hover:shadow-[0_0_50px_rgba(255,255,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Get creator matches
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-white/40">
          No commitment. We reply within 1-2 business days.
        </p>
      </form>
    </div>
  );
}
