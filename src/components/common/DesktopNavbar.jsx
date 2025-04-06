import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaCalendarDays, FaUsers, FaPhone } from 'react-icons/fa6';
import { FaHome } from "react-icons/fa";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { IoMdArrowDropdown } from "react-icons/io";
import ieee_white from "../../assets/Images/IEEE-LOGO-WHITE.png";
import ieee_blue from "../../assets/Images/Logo.png";
import { useTheme } from '../../context/ThemeContext';

const DesktopNavbar = () => {
  const [navState, setNavState] = useState('top');
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';

  // Add effect to scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isHomePage) return;

      if (window.scrollY === 0) {
        setNavState('top');
      } else if (window.scrollY < window.innerHeight - 80) {
        setNavState('scrolled');
      } else {
        setNavState('past-hero');
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
      setNavState('other-page');
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleNavigation = (path, onClick) => (e) => {
    if (onClick) {
      onClick(e);
    } else {
      e.preventDefault();
      navigate(path);
    }
  };

  const isLinkActive = (path) => {
    return path === '/' ? location.pathname === '/' : location.pathname === path;
  };

  const getNavStyles = () => {
    if (!isHomePage) {
      return theme === 'dark' 
        ? 'bg-[#1c1c1c] shadow-lg' 
        : 'bg-white shadow-md';
    }

    switch (navState) {
      case 'top':
        return 'bg-transparent';
      case 'scrolled':
        return theme === 'dark' 
          ? 'bg-[#1c1c1c]/30 backdrop-blur-md' 
          : 'bg-white/30 backdrop-blur-md';
      case 'past-hero':
        return theme === 'dark' 
          ? 'bg-[#1c1c1c] shadow-lg' 
          : 'bg-white shadow-md';
      default:
        return 'bg-transparent';
    }
  };

  const getLinkStyles = (isActive) => {
    if (!isHomePage || navState === 'past-hero') {
      if (theme === 'dark') {
        return `text-white before:bg-white ${isActive ? 'after:bg-white' : ''}`;
      }
      return `text-gray-800 before:bg-[#0088cc] ${isActive ? 'after:bg-[#0088cc]' : ''}`;
    }
    return `text-white before:bg-white ${isActive ? 'after:bg-white' : ''}`;
  };

  const handleThemeChange = (selectedTheme) => {
    toggleTheme(selectedTheme);
    setIsThemeOpen(false);
  };

  const linkClasses = `relative flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-all duration-200
    before:content-[''] before:absolute before:w-0 before:h-0.5 before:bottom-0 before:left-1/2 
    before:transition-all before:duration-300 hover:before:w-[calc(100%-32px)] hover:before:left-4`;

  const activeLinkClasses = `after:absolute after:bottom-0 after:left-4 after:w-[calc(100%-32px)] after:h-0.5`;

  const getLogoSrc = () => {
    if (isHomePage) {
      if (navState === 'past-hero') {
        return theme === 'dark' ? ieee_white : ieee_blue;
      }
      return ieee_white;
    }
    return theme === 'dark' ? ieee_white : ieee_blue;
  };

  return (
    <div className={`fixed w-full z-50 transition-all duration-300 ${getNavStyles()} hidden md:block`}>
      <nav className="w-full px-6 lg:px-12">
        <div className="w-full flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <a 
              href="/"
              onClick={handleNavigation('/')} 
              className="flex items-center"
            >
              <img 
                src={getLogoSrc()} 
                alt="ieee-logo" 
                className="h-14 w-auto transition-all duration-300"
              />
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {[
              { path: '/', icon: FaHome, label: 'Home' },
              { path: '/events', icon: FaCalendarDays, label: 'Events' },
              { path: '/committee', icon: FaUsers, label: 'Committee' },
              { 
                path: '/', 
                hash: 'contactUs',
                icon: FaPhone, 
                label: 'Contact Us',
                onClick: (e) => {
                  e.preventDefault();
                  if (location.pathname === '/') {
                    document.getElementById('contactUs')?.scrollIntoView({ behavior: 'smooth' });
                  } else {
                    navigate('/?scrollTo=contactUs');
                  }
                }
              }
            ].map(({ path, icon: Icon, label, onClick }) => (
              <a 
                key={path + label}
                href={path}
                onClick={handleNavigation(path, onClick)}
                className={`${linkClasses} ${getLinkStyles(isLinkActive(path))} ${isLinkActive(path) ? activeLinkClasses : ''}`}
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </a>
            ))}

            {/* Theme Selector */}
            <div className="relative">
              <button
                onClick={() => setIsThemeOpen(!isThemeOpen)}
                className={`${linkClasses} ${getLinkStyles(false)}`}
              >
                {theme === 'dark' ? 
                  <IoMoonOutline className="h-4 w-4" /> : 
                  <IoSunnyOutline className="h-4 w-4" />
                }
                <span>Theme</span>
                <IoMdArrowDropdown className="h-5 w-5" />
              </button>

              {isThemeOpen && (
                <div className={`absolute left-0 mt-2 w-48 rounded-lg shadow-lg ${
                  theme === 'dark' ? 'bg-[#2f2f2f]/90' : 'bg-white/90'
                } backdrop-blur-sm border ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <div className="py-2">
                    <button
                      onClick={() => handleThemeChange('light')}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                        theme === 'dark' ? 'text-white hover:bg-[#404040]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IoSunnyOutline className="h-5 w-5" />
                        <span>Light Theme</span>
                      </div>
                      {theme === 'light' && (
                        <span className="text-[#0088cc] text-lg">✓</span>
                      )}
                    </button>
                    <button
                      onClick={() => handleThemeChange('dark')}
                      className={`flex items-center justify-between w-full px-4 py-3 text-sm ${
                        theme === 'dark' ? 'text-white hover:bg-[#404040]' : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <IoMoonOutline className="h-5 w-5" />
                        <span>Dark Theme</span>
                      </div>
                      {theme === 'dark' && (
                        <span className="text-[#0088cc] text-lg">✓</span>
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