'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  User,
  Mail,
  LinkIcon,
  BarChart2,
  Tag,
  FileText,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import PasswordInput from '@/components/auth/PasswordInput';
import PasswordStrength from '@/components/auth/PasswordStrength';
import GoogleButton from '@/components/auth/GoogleButton';
import SubmitButton from '@/components/auth/SubmitButton';
import Magnetic from '@/components/ui/Magnetic';
import { EASE } from '@/lib/motion';

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

const STEPS = ['Account', 'Channel', 'Niche'];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
};

function Burst() {
  const particles = [
    { x: 0, y: -46 }, { x: 33, y: -33 }, { x: 46, y: 0 }, { x: 33, y: 33 },
    { x: 0, y: 46 }, { x: -33, y: 33 }, { x: -46, y: 0 }, { x: -33, y: -33 },
    { x: 20, y: -12 }, { x: -20, y: -12 }, { x: 22, y: 20 }, { x: -22, y: 20 },
  ];
  return (
    <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{ x: p.x, y: p.y, opacity: 0, scale: 0.3 }}
          transition={{ duration: 0.7, delay: 0.15 + i * 0.02, ease: 'easeOut' }}
          className={`absolute h-1.5 w-1.5 rounded-full ${
            i % 3 === 0 ? 'bg-accent' : i % 3 === 1 ? 'bg-primary-2' : 'bg-accent-soft'
          }`}
        />
      ))}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
      >
        <CheckCircle2 className="h-8 w-8 text-accent" />
      </motion.div>
    </div>
  );
}

export default function CreatorSignup() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

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
  const [success, setSuccess] = useState(false);
  const [registeredCreator, setRegisteredCreator] = useState<any | null>(null);
  const [emailConfigured, setEmailConfigured] = useState(false);

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!formData.name.trim()) errs.name = 'Your name is required.';
      if (!/^\S+@\S+\.\S+$/.test(formData.email))
        errs.email = 'Enter a valid email address.';
      if (formData.password.length < 8)
        errs.password = 'Use at least 8 characters.';
    }
    if (step === 1) {
      if (!formData.channel_url.trim())
        errs.channel_url = 'Paste your channel or profile link.';
      else if (!/^https?:\/\/.+/.test(formData.channel_url))
        errs.channel_url = 'Link must start with https://';
      if (!formData.subscriber_count || Number(formData.subscriber_count) < 0)
        errs.subscriber_count = 'Enter your audience size.';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (!validateStep()) return;
    setError('');
    setDir(1);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const back = () => {
    setError('');
    setFieldErrors({});
    setDir(-1);
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      next();
      return;
    }
    if (!validateStep()) return;

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

      setSuccess(true);
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
          <Burst />

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
            <Link href="/creator/login" className="btn-primary group flex-1 py-3.5">
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

  const fieldClass = (field: string) =>
    `dl-input ${fieldErrors[field] ? 'border-danger/50 focus:border-danger/60 focus:ring-danger/20' : ''}`;

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
      {/* Progress rail */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted">
            Step {step + 1} of {STEPS.length}
          </span>
          <span className="font-semibold text-accent">{STEPS[step]}</span>
        </div>
        <div className="flex gap-2">
          {STEPS.map((label, i) => (
            <div key={label} className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={false}
                animate={{
                  scaleX: i < step ? 1 : i === step ? 0.45 : 0,
                  opacity: i <= step ? 1 : 0,
                }}
                transition={{ duration: 0.35, ease: EASE }}
                className="h-full w-full origin-left rounded-full bg-gradient-to-r from-primary-2 to-accent"
              />
            </div>
          ))}
        </div>
      </div>

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

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait" custom={dir} initial={false}>
          <motion.div
            key={step}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.35, ease: EASE }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <label htmlFor="name" className="dl-label">
                    Full name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="name"
                      type="text"
                      placeholder="Alex Morgan"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`${fieldClass('name')} pl-11`}
                    />
                  </div>
                  {fieldErrors.name && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.name}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label htmlFor="email" className="dl-label">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="alex@creator.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${fieldClass('email')} pl-11`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.email}</p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.24 }}
                >
                  <PasswordInput
                    id="password"
                    value={formData.password}
                    onChange={(password) => setFormData({ ...formData, password })}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    label="Password"
                  />
                  {fieldErrors.password ? (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.password}</p>
                  ) : (
                    <PasswordStrength password={formData.password} />
                  )}
                </motion.div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
                  <label htmlFor="channel" className="dl-label">
                    Channel / profile link
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="channel"
                      type="url"
                      placeholder="https://youtube.com/@channel"
                      value={formData.channel_url}
                      onChange={(e) =>
                        setFormData({ ...formData, channel_url: e.target.value })
                      }
                      className={`${fieldClass('channel_url')} pl-11`}
                    />
                  </div>
                  {fieldErrors.channel_url && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {fieldErrors.channel_url}
                    </p>
                  )}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label htmlFor="subs" className="dl-label">
                    Follower / subscriber count
                  </label>
                  <div className="relative">
                    <BarChart2 className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="subs"
                      type="number"
                      min="0"
                      placeholder="45000"
                      value={formData.subscriber_count}
                      onChange={(e) =>
                        setFormData({ ...formData, subscriber_count: e.target.value })
                      }
                      className={`${fieldClass('subscriber_count')} pl-11`}
                    />
                  </div>
                  {fieldErrors.subscriber_count && (
                    <p className="mt-1.5 text-xs font-medium text-danger">
                      {fieldErrors.subscriber_count}
                    </p>
                  )}
                </motion.div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 }}
                >
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
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16 }}
                >
                  <label htmlFor="bio" className="dl-label">
                    Short bio / channel overview{' '}
                    <span className="font-normal normal-case text-muted-2">(optional)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-3.5 h-4 w-4 text-muted-2" />
                    <textarea
                      id="bio"
                      rows={4}
                      placeholder="Briefly describe your content, primary platform, target audience, or past sponsorships..."
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="dl-input resize-none pl-11"
                    />
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="mt-7 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-semibold text-muted transition-all hover:border-border-strong hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <Magnetic strength={0.15} className={step > 0 ? 'flex-1' : 'w-full'}>
            {step < STEPS.length - 1 ? (
              <button
                type="submit"
                className="btn-primary w-full py-3.5"
              >
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <SubmitButton
                loading={loading}
                success={success}
                label="Join the network — it's free"
                loadingLabel="Creating your profile..."
                successLabel="You're in!"
                className="btn-primary w-full py-3.5"
              />
            )}
          </Magnetic>
        </div>
      </form>

      {step === 0 && <GoogleButton />}

      <div className="pt-5 text-center text-sm text-muted">
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
