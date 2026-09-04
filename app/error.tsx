'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-background px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-danger/10">
        <AlertCircle className="h-8 w-8 text-danger" />
      </div>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm leading-relaxed text-muted">
        An unexpected error occurred. Try again, or head back home.
      </p>
      <div className="flex gap-3">
        <button onClick={reset} className="btn-primary">
          <RotateCw className="h-4 w-4" />
          Try again
        </button>
        <Link href="/" className="btn-ghost">
          <Home className="h-4 w-4" />
          Go home
        </Link>
      </div>
    </div>
  );
}
