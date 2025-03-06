import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarDays, FaUsers, FaPhone } from 'react-icons/fa6';
import { FaHome, FaAdjust } from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import ieee_white from "../../assets/Images/IEEE-LOGO-WHITE.png";
import ieee_blue from "../../assets/Images/Logo.png";

const DesktopNavbar = () => {
  const [navState, setNavState] = useState('top'); // 'top', 'scrolled', 'past-hero'
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to dark
    return localStorage.getItem('ieee-website-theme') || 'dark';
  });
  const location = useLocation();

  // Initialize theme on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('ieee-website-theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setNavState('top');
      } else if (window.scrollY < window.innerHeight - 80) {
        setNavState('scrolled');
      } else {
        setNavState('past-hero');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isLinkActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  const getNavStyles = () => {
    switch (navState) {
      case 'top':
        return 'bg-transparent';
      case 'scrolled':
        return 'bg-white/30 backdrop-blur-md';
      case 'past-hero':
        return 'bg-white shadow-md';
      default:
        return 'bg-transparent';
    }
  };

  const getLinkStyles = () => {
    if (navState === 'past-hero') {
      return 'text-gray-800';
    }
    return 'text-white';
  };

  const toggleTheme = (selectedTheme) => {
    setTheme(selectedTheme);
    localStorage.setItem('ieee-website-theme', selectedTheme);
    document.documentElement.classList.toggle('dark', selectedTheme === 'dark');
    setIsThemeOpen(false);
  };

  const linkClasses = `relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200
    before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-0 before:left-1/2 
    before:transition-all before:duration-300 hover:before:w-[calc(100%-32px)] hover:before:left-4 
    ${navState === 'past-hero' 
      ? 'text-gray-800 before:bg-blue-600' 
      : 'text-white before:bg-white'
    }`;

  const activeLinkClasses = `after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-32px)] after:h-0.5 after:bg-blue-600`;

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${getNavStyles()} hidden md:block`}>
      <nav className="w-full px-6 lg:px-12">
        <div className="w-full flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img 
                src={navState === 'past-hero' ? ieee_blue : ieee_white} 
                alt="ieee-logo" 
                className="h-14 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            <Link 
              to="/"
              className={`${linkClasses} ${isLinkActive('/') && activeLinkClasses}`}
            >
              <FaHome className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <Link 
              to="/events"
              className={`${linkClasses} ${isLinkActive('/events') && activeLinkClasses}`}
            >
              <FaCalendarDays className="h-4 w-4" />
              <span>Events</span>
            </Link>
            <Link 
              to="/committee"
              className={`${linkClasses} ${isLinkActive('/committee') && activeLinkClasses}`}
            >
              <FaUsers className="h-4 w-4" />
              <span>Committee</span>
            </Link>
            <Link 
              to="/contact"
              className={`${linkClasses} ${isLinkActive('/contact') && activeLinkClasses}`}
            >
              <FaPhone className="h-4 w-4" />
              <span>Contact Us</span>
            </Link>

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className={linkClasses}
              >
                <FaAdjust className="h-4 w-4" />
                <span>Theme</span>
                <IoMdArrowDropdown className="h-5 w-5" />
              </button>

              {isThemeOpen && (
                <div className="absolute left-0 mt-2 w-48 rounded-lg shadow-lg bg-white/90 backdrop-blur-sm border border-gray-200">
                  <div className="py-2">
                    <button
                      onClick={() => toggleTheme('light')}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <IoSunnyOutline className="h-5 w-5" />
                        <span>Light Theme</span>
                      </div>
                      {theme === 'light' && (
                        <span className="text-blue-600 text-lg">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => toggleTheme('dark')}
                      className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <div className="flex items-center space-x-3">
                        <IoMoonOutline className="h-5 w-5" />
                        <span>Dark Theme</span>
                      </div>
                      {theme === 'dark' && (
                        <span className="text-blue-600 text-lg">✓</span>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;