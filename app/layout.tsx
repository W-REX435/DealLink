import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DealLink | Connecting creators with brands that need real reach',
  description:
    'DealLink is the platform connecting content creators with businesses looking for authentic sponsorships, real audience reach, and performance-backed results.',
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
        {children}
        <Analytics />
      </body>
    </html>
  );
}
