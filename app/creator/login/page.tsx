'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogIn, Loader2, Mail, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import GoogleButton from '@/components/auth/GoogleButton';

export default function CreatorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError('Invalid email or password.');
        return;
      }

      router.push('/creator/dashboard');
      router.refresh();
    } catch {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      bg="login"
      title="Welcome back"
      subtitle="Log in to manage your profile, track matches, and accept new brand deals."
      sideTitle="Your sponsorships are waiting."
      sidePoints={[
        'New brand matches curated for your niche',
        'Zero fees — you keep the full deal value',
        'Full creative control on every sponsorship',
      ]}
    >
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

      <form onSubmit={handleLogin} className="space-y-5">
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

        <PasswordInput
          id="password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
        />

        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-border-strong accent-primary-2"
            />
            Remember me
          </label>
          <Link
            href="/creator/forgot-password"
            className="text-sm font-semibold text-accent transition-colors hover:text-foreground"
          >
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-3.5"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              Log in to dashboard
            </>
          )}
        </button>
      </form>

      <GoogleButton />

      <div className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">
        Don&apos;t have a creator account yet?{' '}
        <Link
          href="/creator/signup"
          className="font-semibold text-accent transition-colors hover:text-foreground"
        >
          Join free
        </Link>
      </div>
    </AuthLayout>
  );
}
