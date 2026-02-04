import { useEffect } from 'react';
import { Box, Text } from '@chakra-ui/react';

import FadeContent from '../content/Animations/FadeContent/FadeContent';
import Footer from '../components/landing/Footer/Footer';

import '../css/showcase.css';
import Aurora from '@/content/Backgrounds/Aurora/Aurora';

const ShowcasePage = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const showcaseItems = [
    {
      name: 'Oscar',
      url: 'https://oscarhernandez.vercel.app',
      using: '<LetterGlitch />',
      image: '/assets/showcase/showcase-oscar.webp'
    },
    {
      name: 'Izadoesdev',
      url: 'https://app.databuddy.cc/login',
      using: '<Iridescence />',
      image: '/assets/showcase/showcase-izadoesdev.webp'
    },
    {
      name: 'Dominik Koch',
      url: 'https://app.usenotra.com/login',
      using: '<PixelBlast />',
      image: '/assets/showcase/showcase-dominik.webp'
    },
    {
      name: 'Afaq',
      url: 'https://www.evolvion.io/',
      using: '<SpotlightCard />',
      image: '/assets/showcase/showcase-afaq.webp'
    },
    {
      name: 'Deepraj',
      url: 'https://www.architech-dev.tech/',
      using: '<CardSwap />',
      image: '/assets/showcase/showcase-deepraj.webp'
    },
    {
      name: 'Devraj',
      url: 'https://devrajchatribin.com/about',
      using: '<CountUp />',
      image: '/assets/showcase/showcase-devraj.webp'
    }
  ];

  return (
    <>
      <section className="showcase-wrapper">
        <Box position="fixed" top={0} left={0} right={0} bottom={0} zIndex={0} opacity={0.5} pointerEvents="none">
          <Aurora colorStops={['#3A0CA3', '#7209B7', '#4C1D95']} amplitude={0.5} blend={0.5} />
        </Box>
        <title>React Bits - Showcase 🎉</title>

        <div className="showcase-header">
          <h1 className="showcase-title">Community Showcase</h1>
          <p className="showcase-subtitle">
            See how developers around the world are using React Bits in their projects
          </p>
          <FadeContent blur delay={500}>
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSdlzugJovfr5HPon3YAi8YYSSRuackqX8XIXSeeQmSQypNc7w/viewform?usp=dialog"
              target="_blank"
              rel="noreferrer"
              className="landing-button"
            >
              <span>Submit Your Project</span>
              <div className="button-arrow-circle">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M6 12L10 8L6 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </a>
          </FadeContent>
        </div>

        <FadeContent blur duration={1000} threshold={0} className="fade-grid">
          <div className="grid-container">
            {showcaseItems.map(item => (
              <Box as="a" href={item.url} rel="noreferrer" target="_blank" className="grid-item" key={item.url}>
                <div className="showcase-img-wrapper">
                  <img
                    className="showcase-img"
                    src={item.image}
                    alt={`Showcase website submitted by: ${item.name ? item.name : 'Anonymous'}`}
                  />
                </div>
                <div className="showcase-info">
                  {item.name && <Text className="author">{item.name}</Text>}
                  <Text className="using">Using {item.using}</Text>
                </div>
              </Box>
            ))}
          </div>
        </FadeContent>
      </section>

      <Footer />
    </>
  );
};

export default ShowcasePage;
