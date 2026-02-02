import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaTrophy, FaCalendarDays, FaUsers, FaPhone } from 'react-icons/fa6';
import { FaHome } from 'react-icons/fa';
import './MobileNavbar.css';

const MobileNavbar = () => {
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Add effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleNavigation = (path, isContact = false) => (e) => {
    e.preventDefault();
    if (isContact) {
      if (location.pathname === '/') {
        document.getElementById('contactUs')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/?scrollTo=contactUs');
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    { path: '/', icon: <FaHome />, label: 'Home' },
    // { path: '/achievements', icon: <FaTrophy />, label: 'Achievements' },
    { path: '/events', icon: <FaCalendarDays />, label: 'Events' },
    { path: '/committee', icon: <FaUsers />, label: 'Committee' },
    { path: '/', icon: <FaPhone />, label: 'Contact', isContact: true },
  ];

  return (
    <nav className={`mobile-navbar ${visible ? 'visible' : 'hidden'}`}>
      {navItems.map((item) => (
        <a
          key={item.path + item.label}
          href={item.path}
          onClick={handleNavigation(item.path, item.isContact)}
          className={`nav-item ${location.pathname === item.path && !item.isContact ? 'active' : ''}`}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
        </a>
      ))}
    </nav>
  );
};

export default MobileNavbar;