'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';

const LEVELS = [
  { label: 'Too weak', bar: 'bg-danger', text: 'text-danger' },
  { label: 'Weak', bar: 'bg-danger', text: 'text-danger' },
  { label: 'Okay', bar: 'bg-warning', text: 'text-warning' },
  { label: 'Strong', bar: 'bg-accent', text: 'text-accent' },
  { label: 'Very strong', bar: 'bg-accent', text: 'text-accent' },
];

export default function PasswordStrength({ password }: { password: string }) {
  const score = useMemo(() => {
    if (!password) return 0;
    let s = 0;
    if (password.length >= 8) s++;
    if (password.length >= 12) s++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) s++;
    if (/\d/.test(password)) s++;
    if (/[^A-Za-z0-9]/.test(password)) s++;
    return Math.min(s, 5);
  }, [password]);

  if (!password) return null;

  const level = LEVELS[Math.min(Math.max(score, 1), 5) - 1];

  return (
    <div className="mt-2">
      <div className="flex gap-1.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-1 flex-1 overflow-hidden rounded-full bg-border">
            <motion.div
              initial={false}
              animate={{ scaleX: i < score ? 1 : 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className={`h-full w-full origin-left rounded-full ${level.bar}`}
            />
          </div>
        ))}
      </div>
      <p className={`mt-1.5 text-[11px] font-semibold ${level.text}`}>{level.label}</p>
    </div>
  );
}
