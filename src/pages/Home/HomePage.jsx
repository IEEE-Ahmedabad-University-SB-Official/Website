// src/pages/Home/HomePage.js
import React from 'react';
import DesktopNavbar from '../../components/DesktopNavbar';
import MobileNavbar from '../../components/MobileNavbar';
import Footer from '../../components/Footer';
import Hero from '../../components/homePage/Hero/Hero';
import styles from  './HomePage.module.css';

function HomePage() {
  return (
    <div className='h-screen'>
      <DesktopNavbar />
      <MobileNavbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default HomePage;
