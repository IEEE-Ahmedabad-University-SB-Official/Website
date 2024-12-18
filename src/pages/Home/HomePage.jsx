// src/pages/Home/HomePage.js
import React from 'react';
import DesktopNavbar from '../../components/DesktopNavbar';
import MobileNavbar from '../../components/MobileNavbar';
import Footer from '../../components/Footer';

function HomePage() {
  return (
    <div className='h-[2000px] bg-red-500'>
      <h1>Welcome to the HomePage</h1>
      <p>This is the homepage content.</p>
      <DesktopNavbar />
      <MobileNavbar />

      <Footer />
    </div>
  );
}

export default HomePage;
