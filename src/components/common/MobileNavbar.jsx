import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTrophy, FaCalendarDays, FaUsers, FaPhone } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import './MobileNavbar.css';

const MobileNavbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      
      // Calculate scroll direction and distance
      const scrollDistance = Math.abs(currentScrollPos - prevScrollPos);
      const isScrollingDown = currentScrollPos > prevScrollPos;

      // Only trigger hide/show for significant scroll amounts
      if (scrollDistance > 10) {
        setVisible(!isScrollingDown || currentScrollPos < 10);
        setPrevScrollPos(currentScrollPos);
      }
    };

    // Throttle scroll event for better performance
    let timeoutId;
    const throttledScroll = () => {
      if (timeoutId) return;
      timeoutId = setTimeout(() => {
        handleScroll();
        timeoutId = null;
      }, 100);
    };

    window.addEventListener('scroll', throttledScroll);
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [prevScrollPos]);

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    // { path: '/achievements', icon: <FaTrophy />, label: 'Achievements' },
    { path: '/events', icon: <FaCalendarDays />, label: 'Events' },
    { path: '/committee', icon: <FaUsers />, label: 'Committee' },
    { path: '/contact', icon: <FaPhone />, label: 'Contact' },
  ];

  return (
    <nav className={`mobile-navbar ${visible ? 'visible' : 'hidden'} block md:hidden`}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
};

export default MobileNavbar;