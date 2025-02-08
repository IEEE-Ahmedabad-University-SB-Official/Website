// src/pages/Home/HomePage.js
import React from 'react';
import DesktopNavbar from '../../components/DesktopNavbar'
import MobileNavbar from '../../components/MobileNavbar'
import Footer from '../../components/Footer';
import styles from './EventPage.module.css';

function EventPage() {
  return (
    <div className='bg-yellow-300 h-[1000vh]'>
      <DesktopNavbar />
      <MobileNavbar />

      <Footer />
    </div>
  );
}

export default EventPage;
