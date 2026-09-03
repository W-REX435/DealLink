import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import Connection from '@/components/landing/Connection';
import NicheMarquee from '@/components/landing/NicheMarquee';
import HowItWorks from '@/components/landing/HowItWorks';
import ForCreators from '@/components/landing/ForCreators';
import MarketplacePreview from '@/components/landing/MarketplacePreview';
import ForBusinesses from '@/components/landing/ForBusinesses';
import Testimonials from '@/components/landing/Testimonials';
import Faq from '@/components/landing/Faq';
import CTABanner from '@/components/landing/CTABanner';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ui/ScrollProgress';
import CursorGlow from '@/components/ui/CursorGlow';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col overflow-x-clip">
      <ScrollProgress />
      <CursorGlow />
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Connection />
        <NicheMarquee />
        <HowItWorks />
        <ForCreators />
        <MarketplacePreview />
        <ForBusinesses />
        <Testimonials />
        <Faq />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
