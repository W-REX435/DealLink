import Logo from '@/components/Logo';

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background">
      <div className="animate-pulse">
        <Logo size="lg" iconOnly />
      </div>
      <div className="h-0.5 w-40 overflow-hidden rounded-full bg-border">
        <div className="h-full w-1/2 animate-loading-bar rounded-full bg-gradient-to-r from-primary-2 to-accent" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">
        Loading DealLink
      </p>
    </div>
  );
}
