import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Creator Login | DealLink',
  description: 'Log in to your DealLink creator account to manage your profile and matches.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
