import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Terms of Service | DealLink',
  description: 'The terms governing your use of the DealLink platform.',
};

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-14 sm:px-6">
        <article className="mx-auto max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Legal</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Terms of Service
          </h1>
          <p className="mt-2 text-xs text-muted-2">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="mt-8 space-y-6 text-sm leading-relaxed text-muted">
            <p>
              By using DealLink, you agree to these terms. DealLink connects content creators with
              businesses for sponsorship opportunities and charges a success cut only on closed
              deals.
            </p>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">1. Creator accounts</h2>
              <p>
                Creator accounts are free. You confirm that the audience and channel information you
                provide is accurate. You keep 100% creative control over sponsored content and are
                responsible for complying with disclosure laws in your jurisdiction.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">2. Business accounts</h2>
              <p>
                Business access is application-based and granted at our discretion. Approved
                businesses may browse the marketplace and submit campaign briefs. You agree to pay
                creators the agreed deal value on completion.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">3. Our cut</h2>
              <p>
                DealLink takes a success cut on closed sponsorships. We only earn when a paid deal
                closes — if you never get paid, we never get paid.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">4. Acceptable use</h2>
              <p>
                Don&apos;t misrepresent your audience, spam other members, or promote illegal
                products. We may suspend or terminate accounts that violate these terms.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-base font-semibold text-foreground">5. Liability</h2>
              <p>
                DealLink is a marketplace, not a party to individual sponsorship agreements.
                Creators and businesses transact directly and are responsible for their own
                contractual obligations.
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
