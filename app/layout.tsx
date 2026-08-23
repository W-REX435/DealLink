import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealLink | Connecting creators with brands that need real reach',
  description: 'DealLink is the premier platform connecting tech & SaaS content creators with businesses looking for authentic sponsorships and real audience reach.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-[#E1F5EE] text-[#2C2C2A] min-h-screen flex flex-col antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
