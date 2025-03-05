// src/pages/Home/HomePage.js
import React from 'react';
import DesktopNavbar from '../../components/common/DesktopNavbar';
import MobileNavbar from '../../components/common/MobileNavbar';
import Footer from '../../components/common/Footer';
import Hero from '../../components/homePage/Hero/Hero';
import About from '../../components/homePage/AboutUs/AboutUs';
import styles from  './HomePage.module.css';
import NumberData from '../../components/homePage/NumberData/NumberData';
import WhyJoinUs from '../../components/homePage/WhyJoinUs/WhyJoinUs';
import AuGlimpes from '../../components/homePage/AuGlimpes/AuGlimpes';

function HomePage() {
  return (
    <div className='h-screen'>
      {/* <DesktopNavbar /> */}
      <MobileNavbar />
      <Hero />
      <About />
      <NumberData />
      <WhyJoinUs />
      <AuGlimpes />
      {/* <Footer /> */}
    </div>
  );
}

export default HomePage;
