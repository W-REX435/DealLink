import Navbar from '@/components/Navbar';
import Hero from '@/components/landing/Hero';
import NicheMarquee from '@/components/landing/NicheMarquee';
import HowItWorks from '@/components/landing/HowItWorks';
import ForCreators from '@/components/landing/ForCreators';
import MarketplacePreview from '@/components/landing/MarketplacePreview';
import ForBusinesses from '@/components/landing/ForBusinesses';
import Testimonials from '@/components/landing/Testimonials';
import Faq from '@/components/landing/Faq';
import CTABanner from '@/components/landing/CTABanner';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
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
