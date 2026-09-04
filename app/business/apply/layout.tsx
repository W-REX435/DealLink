import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Apply for Marketplace Access | DealLink',
  description:
    'Apply to join the DealLink creator marketplace. Get access to vetted creators and hand-curated matches for your brand campaigns.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
