'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, KeyRound, ArrowRight } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrength from '@/components/auth/PasswordStrength';
import SubmitButton from '@/components/auth/SubmitButton';
import Magnetic from '@/components/ui/Magnetic';

function SetPasswordInner() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState<{ email: string; company: string } | null>(null);

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
      const res = await fetch('/api/business/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Failed to activate account.');

      setAccount({ email: data.email, company: data.company });
      setSuccess(true);

      const login = await signIn('credentials', {
        email: data.email,
        password,
        redirect: false,
      });
      if (!login?.error) {
        router.push('/business/dashboard');
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to activate account.');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <AuthLayout
        bg="login"
        title="Invalid invite"
        subtitle="This invite link is missing a token."
        sideTitle="Invites are personal."
        sidePoints={[
          'Invite links expire after 7 days',
          'Request a new one from our team',
          'Each invite works exactly once',
        ]}
      >
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
            <AlertCircle className="h-8 w-8 text-danger" />
          </div>
          <p className="mt-5 text-sm text-muted">
            This invite link is invalid. Contact us to get a new one.
          </p>
          <Link href="/business/apply" className="btn-primary mt-7 w-full">
            Apply again
          </Link>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      bg="login"
      title="Activate your business account"
      subtitle="You're approved! Choose a password to enter the marketplace."
      sideTitle="Welcome to the inside."
      sidePoints={[
        'Browse the vetted creator network',
        'Submit campaign briefs in minutes',
        'Get hand-curated creator matches',
      ]}
    >
      {account && (
        <div className="mb-5 rounded-xl border border-accent/25 bg-accent/5 p-3.5 text-sm text-muted">
          <CheckCircle2 className="mr-2 inline h-4 w-4 text-accent" />
          <strong className="text-foreground">{account.company}</strong> account activated —{' '}
          {account.email}
        </div>
      )}

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
          <PasswordInput
            id="password"
            value={password}
            onChange={setPassword}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            label="Choose a password"
          />
          <PasswordStrength password={password} />
        </div>

        <PasswordInput
          id="confirm"
          value={confirm}
          onChange={setConfirm}
          placeholder="Repeat your password"
          autoComplete="new-password"
          label="Confirm password"
        />

        <Magnetic strength={0.15}>
          <SubmitButton
            loading={loading}
            success={success}
            label={
              <>
                <KeyRound className="h-4 w-4" />
                Activate account
              </>
            }
            loadingLabel="Activating..."
            successLabel="Activated!"
            className="btn-primary w-full py-3.5"
          />
        </Magnetic>
      </form>

      {success && (
        <p className="mt-4 text-center text-sm text-muted">
          Taking you to your dashboard{' '}
          <ArrowRight className="inline h-3.5 w-3.5 text-accent" />
        </p>
      )}
    </AuthLayout>
  );
}

export default function SetPasswordPage() {
  return (
    <Suspense
      fallback={
        <AuthLayout
          bg="login"
          title="Activate your business account"
          subtitle="Loading..."
          sideTitle="Welcome to the inside."
          sidePoints={[
            'Browse the vetted creator network',
            'Submit campaign briefs in minutes',
            'Get hand-curated creator matches',
          ]}
        >
          <div className="flex justify-center py-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
              className="h-8 w-8 rounded-full border-2 border-border border-t-accent"
            />
          </div>
        </AuthLayout>
      }
    >
      <SetPasswordInner />
    </Suspense>
  );
}
