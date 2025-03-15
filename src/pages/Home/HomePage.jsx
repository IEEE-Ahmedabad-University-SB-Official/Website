// src/pages/Home/HomePage.js
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DesktopNavbar from '../../components/common/DesktopNavbar';
import MobileNavbar from '../../components/common/MobileNavbar';
import Footer from '../../components/common/Footer';
import Hero from '../../components/homePage/Hero/Hero';
import About from '../../components/homePage/AboutUs';
import NumberData from '../../components/homePage/NumberData';
import WhyJoinUs from '../../components/homePage/WhyJoinUs';
import AuGlimpes from '../../components/homePage/AuGlimpes';
import UpComingEvents from '../../components/homePage/UpComingEvents';
import PastEvents from '../../components/homePage/PastEvents';
import ContactUs from '../../components/homePage/ContactUs';

function HomePage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      const element = document.getElementById(scrollTo);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className='min-h-screen overflow-x-hidden'>
      <DesktopNavbar />
      <MobileNavbar />
      <Hero />
      <About />
      <NumberData />
      <WhyJoinUs />
      <AuGlimpes />
      <UpComingEvents />
      <PastEvents />
      <ContactUs />
      <Footer />
    </div>
  );
}

export default HomePage;
