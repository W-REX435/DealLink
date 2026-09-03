'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Check } from 'lucide-react';

interface SubmitButtonProps {
  loading: boolean;
  success: boolean;
  label: React.ReactNode;
  loadingLabel?: string;
  successLabel?: string;
  disabled?: boolean;
  className?: string;
}

/** Submit button with morphing states: idle → loading → success. */
export default function SubmitButton({
  loading,
  success,
  label,
  loadingLabel = 'Please wait...',
  successLabel = 'Done!',
  disabled,
  className = 'btn-primary w-full py-3.5',
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading || success}
      className={className}
    >
      <AnimatePresence mode="wait" initial={false}>
        {success ? (
          <motion.span
            key="success"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 18 }}
            className="inline-flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            {successLabel}
          </motion.span>
        ) : loading ? (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="inline-flex items-center justify-center gap-2"
          >
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingLabel}
          </motion.span>
        ) : (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="inline-flex items-center justify-center gap-2"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}
