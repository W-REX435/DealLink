import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import SiteBackground from '@/components/ui/SiteBackground';
import Preloader from '@/components/ui/Preloader';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL || 'https://deallink.co'),
  title: {
    default: 'DealLink | Creators meet brands',
    template: '%s',
  },
  description:
    'DealLink is the platform connecting content creators with businesses looking for authentic sponsorships, real audience reach, and performance-backed results.',
  openGraph: {
    title: 'DealLink | Creators meet brands',
    description:
      'The bridge between creators and the brands that need them. Authentic sponsorships, real audience reach, performance-backed results.',
    siteName: 'DealLink',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DealLink | Creators meet brands',
    description:
      'The bridge between creators and the brands that need them.',
  },
};

const themeScript = `
(function () {
  try {
    var stored = localStorage.getItem('dl-theme');
    var dark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (dark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} min-h-screen flex flex-col bg-background font-sans antialiased`}
        suppressHydrationWarning
      >
        <SiteBackground />
        {children}
        <Preloader />
        <Analytics />
      </body>
    </html>
  );
}
