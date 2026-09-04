import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Marketplace | DealLink',
  description:
    'Browse vetted content creators across tech, gaming, finance, lifestyle, and more. Find the perfect creator for your brand sponsorship.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
