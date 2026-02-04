import { useEffect, lazy, Suspense } from 'react';
import FeatureCards from '../components/landing/FeatureCards/FeatureCards';
import Sponsors from '../components/landing/Sponsors/Sponsors';
import StartBuilding from '../components/landing/StartBuilding/StartBuilding';
import Announcement from '../components/common/Misc/Announcement';
import Footer from '../components/landing/Footer/Footer';
import Hero from '../components/landing/Hero/Hero';
import heroImage from '../assets/common/hero.webp';

// Lazy load heavy components
const PlasmaWaveV2 = lazy(() => import('../components/landing/PlasmaWave/PlasmaWaveV2'));
const ToolsShowcase = lazy(() => import('../components/landing/ToolsShowcase/ToolsShowcase'));
const Testimonials = lazy(() => import('../components/landing/Testimonials/Testimonials'));

const LandingPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="landing-wrapper">
      <title>React Bits - Animated UI Components For React</title>

      <Announcement />

      <div className="mobile-hero-background-container">
        <img src={heroImage} alt="Hero background" className="mobile-hero-background-image" />
      </div>

      <Suspense fallback={null}>
        <PlasmaWaveV2 yOffset={0} xOffset={40} rotationDeg={-45} scrollPauseThreshold={400} />
      </Suspense>

      <Hero />
      <FeatureCards />
      <ToolsShowcase />
      <Testimonials />
      <Sponsors />
      <StartBuilding />
      <Footer />
    </section>
  );
};

export default LandingPage;
