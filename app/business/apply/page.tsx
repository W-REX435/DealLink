'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Mail,
  User,
  Globe,
  Wallet,
  CalendarClock,
  Target,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
} from 'lucide-react';
import AuthLayout from '@/components/auth/AuthLayout';
import SubmitButton from '@/components/auth/SubmitButton';
import Magnetic from '@/components/ui/Magnetic';
import { EASE } from '@/lib/motion';

const BUDGETS = ['Under $500', '$500 – $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000+'];
const TIMELINES = ['ASAP', 'Within 2 weeks', 'Within a month', 'Within 3 months', 'Flexible'];

const slideVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir * -60 }),
};

export default function BusinessApply() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState({
    contactName: '',
    email: '',
    company: '',
    website: '',
    budgetRange: BUDGETS[1],
    timeline: TIMELINES[1],
    goals: '',
  });

  const validateStep = (): boolean => {
    const errs: Record<string, string> = {};
    if (step === 0) {
      if (!formData.contactName.trim()) errs.contactName = 'Your name is required.';
      if (!/^\S+@\S+\.\S+$/.test(formData.email)) errs.email = 'Enter a valid email address.';
      if (!formData.company.trim()) errs.company = 'Your company name is required.';
    }
    if (step === 1) {
      if (formData.goals.trim().length < 10)
        errs.goals = 'Tell us a little more about what you want to promote (min 10 characters).';
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 0) {
      if (!validateStep()) return;
      setError('');
      setDir(1);
      setStep(1);
      return;
    }
    if (!validateStep()) return;

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/business/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit application.');
      setSuccess(true);
      setTimeout(() => setDone(true), 900);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <AuthLayout
        bg="login"
        title="Application received!"
        subtitle="Our team will review your application shortly."
        sideTitle="One step closer to your creator campaign."
        sidePoints={[
          'We review every application by hand',
          'Approved brands get full marketplace access',
          "You'll hear back within 1-2 business days",
        ]}
      >
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 0.1 }}
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent/10"
          >
            <Target className="h-8 w-8 text-accent" />
          </motion.div>
          <h3 className="mt-6 text-2xl font-semibold tracking-tight text-foreground">
            Thanks, {formData.contactName.split(' ')[0]}!
          </h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
            We&apos;ll email <strong className="text-foreground">{formData.email}</strong> with
            your approval and an invite to set up your business account.
          </p>
          <Link href="/" className="btn-ghost mt-7 w-full">
            Back to home
          </Link>
        </div>
      </AuthLayout>
    );
  }

  const fieldClass = (field: string) =>
    `dl-input ${fieldErrors[field] ? 'border-danger/50 focus:border-danger/60 focus:ring-danger/20' : ''}`;

  return (
    <AuthLayout
      bg="login"
      title="Apply for marketplace access"
      subtitle="Tell us about your brand and campaign. We review every application by hand."
      sideTitle="Put your brand in front of creators who matter."
      sidePoints={[
        'Hand-curated creator matches',
        'Transparent, performance-aligned pricing',
        'Approval within 1-2 business days',
      ]}
    >
      {/* Progress rail */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase tracking-wider text-muted">
            Step {step + 1} of 2
          </span>
          <span className="font-semibold text-accent">
            {step === 0 ? 'About you' : 'Your campaign'}
          </span>
        </div>
        <div className="flex gap-2">
          {[0, 1].map((i) => (
            <div key={i} className="h-1.5 flex-1 overflow-hidden rounded-full bg-border">
              <motion.div
                initial={false}
                animate={{
                  scaleX: i < step ? 1 : i === step ? 0.5 : 0,
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
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                  <label htmlFor="contactName" className="dl-label">
                    Your name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="contactName"
                      type="text"
                      placeholder="Jane Doe"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className={`${fieldClass('contactName')} pl-11`}
                    />
                  </div>
                  {fieldErrors.contactName && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.contactName}</p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                  <label htmlFor="email" className="dl-label">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="email"
                      type="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`${fieldClass('email')} pl-11`}
                    />
                  </div>
                  {fieldErrors.email && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.email}</p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                  <label htmlFor="company" className="dl-label">
                    Company
                  </label>
                  <div className="relative">
                    <Building className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="company"
                      type="text"
                      placeholder="Acme Inc."
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className={`${fieldClass('company')} pl-11`}
                    />
                  </div>
                  {fieldErrors.company && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.company}</p>
                  )}
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                  <label htmlFor="website" className="dl-label">
                    Website{' '}
                    <span className="font-normal normal-case text-muted-2">(optional)</span>
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <input
                      id="website"
                      type="url"
                      placeholder="https://acme.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="dl-input pl-11"
                    />
                  </div>
                </motion.div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                  <label htmlFor="budget" className="dl-label">
                    Budget range
                  </label>
                  <div className="relative">
                    <Wallet className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <select
                      id="budget"
                      value={formData.budgetRange}
                      onChange={(e) => setFormData({ ...formData, budgetRange: e.target.value })}
                      className="dl-input appearance-none pl-11"
                    >
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                  <label htmlFor="timeline" className="dl-label">
                    Timeline
                  </label>
                  <div className="relative">
                    <CalendarClock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-2" />
                    <select
                      id="timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="dl-input appearance-none pl-11"
                    >
                      {TIMELINES.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
                  <label htmlFor="goals" className="dl-label">
                    What do you want to promote?
                  </label>
                  <div className="relative">
                    <Target className="absolute left-4 top-3.5 h-4 w-4 text-muted-2" />
                    <textarea
                      id="goals"
                      rows={4}
                      placeholder="We're launching a new product and looking for 3-5 creators in tech and productivity to demo it..."
                      value={formData.goals}
                      onChange={(e) => setFormData({ ...formData, goals: e.target.value })}
                      className={`${fieldClass('goals')} resize-none pl-11`}
                    />
                  </div>
                  {fieldErrors.goals && (
                    <p className="mt-1.5 text-xs font-medium text-danger">{fieldErrors.goals}</p>
                  )}
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-7 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={() => {
                setError('');
                setFieldErrors({});
                setDir(-1);
                setStep(0);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3.5 text-sm font-semibold text-muted transition-all hover:border-border-strong hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}

          <Magnetic strength={0.15} className={step > 0 ? 'flex-1' : 'w-full'}>
            {step === 0 ? (
              <button type="submit" className="btn-primary w-full py-3.5">
                Continue
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <SubmitButton
                loading={loading}
                success={success}
                label="Submit application"
                loadingLabel="Submitting..."
                successLabel="Received!"
                className="btn-primary w-full py-3.5"
              />
            )}
          </Magnetic>
        </div>
      </form>

      <div className="pt-5 text-center text-sm text-muted">
        Already approved?{' '}
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
