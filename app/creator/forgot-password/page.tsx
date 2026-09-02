'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyRound, Loader2, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/creators/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send reset email.');
      }

      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle={
        sent
          ? 'Check your inbox for the reset link.'
          : 'Enter your email and we&apos;ll send you a secure link to reset your password.'
      }
      sideTitle="We&apos;ve got you."
      sidePoints={[
        'Reset links expire after 1 hour',
        'Use a strong, unique password',
        'Need help? Contact support anytime',
      ]}
    >
      {sent ? (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
          >
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </motion.div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            Email sent
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            If an account exists for <strong className="text-foreground">{email}</strong>,
            you&apos;ll receive a password reset link shortly.
          </p>
          <Link href="/creator/login" className="btn-ghost mt-7 w-full">
            Back to login
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-danger/25 bg-danger/5 p-3.5 text-sm font-medium text-danger"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="dl-label">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@channel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dl-input pl-11"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending reset link...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Send reset link
                </>
              )}
            </button>
          </form>

          <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
            Remembered your password?{' '}
            <Link
              href="/creator/login"
              className="font-semibold text-accent transition-colors hover:text-foreground"
            >
              Log in
            </Link>
          </div>
        </>
      )}
    </AuthLayout>
  );
}
