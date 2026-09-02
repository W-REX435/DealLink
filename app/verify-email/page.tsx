'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';

type Status = 'loading' | 'success' | 'error';

function VerifyEmailInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    let cancelled = false;

    fetch('/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Verification failed.');
        if (!cancelled) setStatus('success');
      })
      .catch((err) => {
        if (!cancelled) {
          setStatus('error');
          setMessage(err.message);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <AuthLayout
      title="Email verification"
      subtitle="Confirming your DealLink email address..."
      sideTitle="One step closer to your first deal."
      sidePoints={[
        'Verified profiles get priority matching',
        'Brands trust verified creators more',
        'Takes less than 10 seconds',
      ]}
    >
      <div className="text-center">
        {status === 'loading' && (
          <div className="py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="mx-auto flex h-14 w-14 items-center justify-center"
            >
              <Loader2 className="h-10 w-10 text-accent" />
            </motion.div>
            <p className="mt-5 text-sm text-muted">Verifying your email...</p>
          </div>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
            >
              <CheckCircle2 className="h-8 w-8 text-accent" />
            </motion.div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
              Email verified!
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              Your DealLink creator profile is now active. Log in to manage your
              profile and start receiving brand matches.
            </p>
            <Link href="/creator/login" className="btn-primary group mt-7 w-full">
              Log in to your dashboard
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10"
            >
              {message.includes('expired') ? (
                <AlertCircle className="h-8 w-8 text-danger" />
              ) : (
                <XCircle className="h-8 w-8 text-danger" />
              )}
            </motion.div>
            <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">
              Verification failed
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {message || 'This verification link is invalid or has expired.'}
            </p>
            <div className="mt-7 space-y-3">
              <Link href="/creator/login" className="btn-ghost w-full">
                Back to login
              </Link>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          title="Email verification"
          subtitle="Loading..."
          sideTitle="One step closer to your first deal."
          sidePoints={[
            'Verified profiles get priority matching',
            'Brands trust verified creators more',
            'Takes less than 10 seconds',
          ]}
        >
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        </AuthLayout>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
