'use client';
import { track } from '@vercel/analytics/react';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { motion } from 'framer-motion';
import { LogIn, Mail, AlertCircle } from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import GoogleButton from '@/components/auth/GoogleButton';
import SubmitButton from '@/components/auth/SubmitButton';
import Magnetic from '@/components/ui/Magnetic';

export default function CreatorLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [shake, setShake] = useState(0);

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
        setShake((s) => s + 1);
        return;
      }

      setSuccess(true);
      track('login');

      let role = 'creator';
      try {
        const me = await fetch('/api/creators/me');
        const meData = await me.json();
        if (meData.authenticated && meData.creator?.role) {
          role = meData.creator.role;
        }
      } catch {}

      setTimeout(() => {
        router.push(role === 'business' ? '/business/dashboard' : '/creator/dashboard');
        router.refresh();
      }, 700);
    } catch {
      setError('Failed to log in. Please try again.');
      setShake((s) => s + 1);
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

      {/* Shake wrapper */}
      <motion.div
        key={shake}
        animate={shake > 0 ? { x: [0, -10, 10, -6, 6, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.45, ease: 'easeInOut' }}
      >
        <form onSubmit={handleLogin} className="space-y-5">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <PasswordInput
              id="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex items-center justify-between"
          >
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
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Magnetic strength={0.15} className="w-full">
              <SubmitButton
                loading={loading}
                success={success}
                label={
                  <>
                    <LogIn className="h-4 w-4" />
                    Log in to dashboard
                  </>
                }
                loadingLabel="Logging in..."
                successLabel="Welcome back!"
                className="btn-primary w-full py-3.5"
              />
            </Magnetic>
          </motion.div>
        </form>
      </motion.div>

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
