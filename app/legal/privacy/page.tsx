import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy | DealLink',
  description: 'How DealLink collects, uses, and protects your data.',
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-14 sm:px-6">
        <article className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="mt-2 text-xs text-muted-2">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
            <p>
              DealLink Inc. (&ldquo;DealLink&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) helps connect
              content creators with businesses for sponsorship opportunities. This policy explains
              what data we collect and how we use it.
            </p>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">1. Data we collect</h2>
              <p>
                Account data (name, email, password hash), creator profile data (channel links,
                audience size, niche, bio), business application data (company, website, budget,
                campaign goals), campaign briefs, matches, and deal records. We also collect basic
                analytics (page views, events) via Vercel Analytics.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">2. How we use it</h2>
              <p>
                We use your data to operate the marketplace: match creators with brands, deliver
                transactional emails (verification, resets, invites, deal updates), and improve the
                product. We never sell your personal data.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">3. Email</h2>
              <p>
                We send transactional emails only — email verification, password resets, business
                invites, and deal notifications. You can delete your account at any time by
                contacting support.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">4. Security</h2>
              <p>
                Passwords are hashed with bcrypt. Sessions use signed JWT cookies. We apply rate
                limiting to authentication endpoints and validate all inputs.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">5. Contact</h2>
              <p>
                Questions about this policy? Email{' '}
                <a href="mailto:contact@deallink.co" className="font-semibold text-accent hover:underline">
                  contact@deallink.co
                </a>
                .
              </p>
            </section>
          </div>

          <p className="mt-10 text-sm text-muted">
            <Link href="/" className="font-semibold text-accent hover:underline">
              ← Back home
            </Link>
          </p>
        </article>
      </main>
      <Footer />
    </div>
  );
}
