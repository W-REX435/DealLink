import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Dashboard | DealLink',
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
