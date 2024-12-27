import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaCalendarDays, FaUsers, FaPhone, FaCaretDown } from 'react-icons/fa6';
import { FaHome } from "react-icons/fa";
import './DesktopNavbar.css';
import { LuSun } from "react-icons/lu";
import { IoMoonOutline } from "react-icons/io5";
import { TbPercentage50 } from "react-icons/tb";
import ieee_white from "../assets/Images/IEEE-LOGO-WHITE.png";
import ieee_blue from "../assets/Images/Logo.png";

const DesktopNavbar = () => {
  const [scrollClass, setScrollClass] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (isDarkTheme) {
        if (window.scrollY > 0 && window.scrollY < 760) {
          setScrollClass('scrolled scrolledwhite');
        } else if (window.scrollY >= 760) {
          setScrollClass('scrolled');
        } else {
          setScrollClass('');
        }
      } else {
        if (window.scrollY >= 200 && window.scrollY < 760) {
          setScrollClass('scrolledwhite');
        } else if (window.scrollY >= 760) {
          setScrollClass('scrolled');
        } else {
          setScrollClass('');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDarkTheme]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleThemeClick = (theme, e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDarkTheme(theme === 'dark');
    document.body.classList.toggle('darkTheme', theme === 'dark');
  };

  const isLinkActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <div className={`navSection ${scrollClass}`} id="navBar">
      <nav>
        <div className="navClass" id="IEEE-LOGO">
          <Link to="/">
            <img 
              src={ieee_white} 
              alt="ieee-logo" 
              id="default-logo"
              style={{ display: scrollClass.includes('scrolled') && !isDarkTheme ? 'none' : 'block' }}
            />
            <img 
              src={ieee_blue}
              alt="ieee-logo" 
              id="scrolled-logo"
              style={{ display: scrollClass.includes('scrolled') && !isDarkTheme ? 'block' : 'none' }}
            />
          </Link>
        </div>

        <div className="navAnchors">
          <Link 
            className={`flex flex-row items-center gap-1 ${isLinkActive('/') ? 'active' : ''}`} 
            to="/"
          >
            <FaHome />Home
          </Link>
          <Link 
            className={`flex flex-row items-center gap-1 ${isLinkActive('/events') ? 'active' : ''}`} 
            to="/events"
          >
            <FaCalendarDays />Events
          </Link>
          <Link 
            className={`flex flex-row items-center gap-1 ${isLinkActive('/committee') ? 'active' : ''}`} 
            to="/committee"
          >
            <FaUsers />Committee
          </Link>
          <Link 
            className={`flex flex-row items-center gap-1 ${isLinkActive('/contact') ? 'active' : ''}`} 
            to="/contact"
          >
            <FaPhone />Contact Us
          </Link>
          
          <div className="dropdown">
            <button 
              className="dropbtn" 
              id="theme-button"
              onClick={handleDropdownClick}
            >
              <TbPercentage50 className="theme-icon" />
              <span id="theme-text">Theme</span>
              <FaCaretDown className="fa-caret-down" />
            </button>
            <div 
              className="dropdown-content" 
              id="theme-dropdown" 
              style={{ display: isDropdownOpen ? 'flex' : 'none' }}
            >
              <a 
                href="#" 
                id="dark-theme"
                onClick={(e) => handleThemeClick('dark', e)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <IoMoonOutline style={{ width: '16px', height: '16px' }} />
                  <p>Dark</p>
                </div>
                <span className={`tick-mark ${isDarkTheme ? 'show' : ''}`} id="tick-dark">✓</span>
              </a>
              <a 
                href="#" 
                id="light-theme"
                onClick={(e) => handleThemeClick('light', e)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <LuSun style={{ width: '16px', height: '16px' }} />
                  Light
                </div>
                <span className={`tick-mark ${!isDarkTheme ? 'show' : ''}`} id="tick-light">✓</span>
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default DesktopNavbar;