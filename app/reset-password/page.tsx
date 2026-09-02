'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  KeyRound,
  ArrowRight,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to reset password.');
      }

      setDone(true);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        title="Invalid link"
        subtitle="This password reset link is missing a token."
        sideTitle="Reset links expire."
        sidePoints={[
          'Reset links expire after 1 hour',
          'Request a new link anytime',
          'Keep your account secure',
        ]}
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
            <AlertCircle className="h-8 w-8 text-danger" />
          </div>
          <p className="mt-5 text-sm text-muted">
            This reset link is invalid. Request a new one from the login page.
          </p>
          <Link href="/creator/forgot-password" className="btn-primary mt-7 w-full">
            Request a new link
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title={done ? 'Password updated' : 'Choose a new password'}
      subtitle={
        done
          ? 'Your password has been changed successfully.'
          : 'Enter a new password for your DealLink account.'
      }
      sideTitle="Almost there."
      sidePoints={[
        'Use at least 8 characters',
        'Mix letters, numbers, and symbols',
        'Never reuse an old password',
      ]}
    >
      {done ? (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
          >
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </motion.div>
          <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
            You&apos;re all set
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Log in with your new password to get back to your dashboard.
          </p>
          <Link href="/creator/login" className="btn-primary group mt-7 w-full">
            Log in
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
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
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              label="New password"
            />
            <PasswordInput
              id="confirm"
              value={confirm}
              onChange={setConfirm}
              placeholder="Repeat your new password"
              autoComplete="new-password"
              label="Confirm password"
            />

            <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Updating password...
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" />
                  Update password
                </>
              )}
            </button>
          </form>
        </>
      )}
    </AuthLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title="Choose a new password"
          subtitle="Loading..."
          sideTitle="Almost there."
          sidePoints={[
            'Use at least 8 characters',
            'Mix letters, numbers, and symbols',
            'Never reuse an old password',
          ]}
        >
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </AuthLayout>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
