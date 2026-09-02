'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  User,
  Mail,
  LinkIcon,
  BarChart2,
  Tag,
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import GoogleButton from '@/components/auth/GoogleButton';

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

export default function CreatorSignup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    channel_url: '',
    subscriber_count: '',
    niche: NICHES[0],
    bio: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [registeredCreator, setRegisteredCreator] = useState<any | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed.');
      }

      setEmailConfigured(Boolean(data.emailConfigured));
      setRegisteredCreator(data.creator);
    } catch (err: any) {
      setError(err.message || 'Something went wrong during sign-up.');
    } finally {
      setLoading(false);
    }
  };

  if (registeredCreator) {
    return (
      <AuthLayout
        bg="signup"
        title="You're in!"
        subtitle="Your profile is now part of DealLink's creator network."
        sideTitle="Welcome to the network."
        sidePoints={[
          'Your profile is live in the creator network',
          'Brands in your niche can now find you',
          "We'll email you as soon as a match lands",
        ]}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.15 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
          >
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </motion.div>

          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Welcome, {registeredCreator.name?.split(' ')[0]}!
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            We&apos;ll reach out as soon as we have a brand match for you in{' '}
            <span className="font-semibold text-foreground">{registeredCreator.niche}</span>.
          </p>

          {emailConfigured && (
            <div className="mt-5 rounded-xl border border-accent/25 bg-accent/5 p-4 text-left">
              <p className="flex items-start gap-2.5 text-sm text-muted">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>
                  We sent a verification link to{' '}
                  <strong className="text-foreground">{registeredCreator.email}</strong>.
                  Confirm your email to activate your profile.
                </span>
              </p>
            </div>
          )}

          {!emailConfigured && (
            <div className="mt-5 rounded-xl border border-warning/30 bg-warning/10 p-4 text-left">
              <p className="text-sm text-muted">
                Email delivery isn&apos;t configured yet — ask the admin to set up
                SMTP, or log in directly.
              </p>
            </div>
          )}

          {/* Profile summary */}
          <div className="mt-7 rounded-2xl bg-primary p-5 text-left text-white">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">{registeredCreator.name}</p>
                <p className="truncate text-xs text-white/50">{registeredCreator.email}</p>
              </div>
              <span className="ml-3 shrink-0 rounded-full border border-accent/40 bg-accent/15 px-2.5 py-1 text-xs font-semibold text-accent-soft">
                {registeredCreator.niche}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 text-xs">
              <div className="min-w-0">
                <span className="block font-semibold text-accent-soft">Channel link</span>
                <span className="mt-0.5 block truncate text-white/70">
                  {registeredCreator.channel_url}
                </span>
              </div>
              <div>
                <span className="block font-semibold text-accent-soft">Audience</span>
                <span className="mt-0.5 block font-bold text-white">
                  {Number(registeredCreator.subscriber_count).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/creator/login"
              className="btn-primary group flex-1 py-3.5"
            >
              Go to login
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link href="/" className="btn-ghost flex-1 py-3.5">
              Back to home
            </Link>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      bg="signup"
      title="Join the creator network"
      subtitle="Get matched with brands looking for authentic sponsorships in your niche. Open to all platforms. Zero upfront fees."
      sideTitle="Turn your audience into sponsorship revenue."
      sidePoints={[
        'Free registration in under 2 minutes',
        'Hand-curated brand matches, never spam',
        '100% creative control — always',
        'You get paid, then we get paid',
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

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="dl-label">
              Full name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                id="name"
                type="text"
                required
                placeholder="Alex Morgan"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="dl-input pl-11"
              />
            </div>
          </div>
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
                placeholder="alex@creator.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="dl-input pl-11"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <PasswordInput
            id="password"
            value={formData.password}
            onChange={(password) => setFormData({ ...formData, password })}
            placeholder="Min. 8 characters"
            autoComplete="new-password"
            label="Password"
          />
          <div>
            <label htmlFor="channel" className="dl-label">
              Channel / profile link
            </label>
            <div className="relative">
              <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                id="channel"
                type="url"
                required
                placeholder="https://youtube.com/@channel"
                value={formData.channel_url}
                onChange={(e) =>
                  setFormData({ ...formData, channel_url: e.target.value })
                }
                className="dl-input pl-11"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="subs" className="dl-label">
              Follower / subscriber count
            </label>
            <div className="relative">
              <BarChart2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <input
                id="subs"
                type="number"
                required
                min="0"
                placeholder="45000"
                value={formData.subscriber_count}
                onChange={(e) =>
                  setFormData({ ...formData, subscriber_count: e.target.value })
                }
                className="dl-input pl-11"
              />
            </div>
          </div>
          <div>
            <label htmlFor="niche" className="dl-label">
              Niche / category
            </label>
            <div className="relative">
              <Tag className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
              <select
                id="niche"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                className="dl-input appearance-none pl-11"
              >
                {NICHES.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="dl-label">
            Short bio / channel overview{' '}
            <span className="font-normal normal-case text-muted-2">(optional)</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3.5 h-4 w-4 text-muted-2" />
            <textarea
              id="bio"
              rows={3}
              placeholder="Briefly describe your content, primary platform, target audience, or past sponsorships..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="dl-input resize-none pl-11"
            />
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating your profile...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Join the network — it&apos;s free
            </>
          )}
        </button>
      </form>

      <GoogleButton />

      <div className="pt-1 text-center text-sm text-muted">
          Already registered?{' '}
          <Link
            href="/creator/login"
            className="font-semibold text-accent transition-colors hover:text-foreground"
          >
            Log in
          </Link>
        </div>
    </AuthLayout>
  );
}
