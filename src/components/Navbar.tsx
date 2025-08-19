import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const XpectrumLogo = () => (
  <div className="inline-flex flex-col items-center">
    <img src="/logo.png" alt="Xpectrum AI Logo" className="h-12 w-auto" />
    {/* <p className="font-lexend text-base text-gray-800 text-center w-full tracking-[0.18em]">
          Think<span className="text-greenish text-glow-greenish">Unthinkable</span>  
    </p> */}
  </div>
);


const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Define active link styles
  const activeLinkClass = "text-xpectrum-purple font-medium";
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav
    className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] 
      left-1/2 -translate-x-1/2
      ${isScrolled
        ? 'top-5 w-[60%] bg-white/95 rounded-full shadow-xl py-2 px-6'
        : 'top-0 w-[90%] bg-transparent rounded-xl py-4 px-8 shadow-none'
      }`}
  >
    <div className="flex justify-between items-center">
      <div className="flex-shrink-0">
        <Link to="/" className="flex items-center">
          <XpectrumLogo />
        </Link>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-8">
        <Link
          to="/"
          className={`nav-link ${isActive('/') ? activeLinkClass : 'text-gray-800 hover:text-xpectrum-purple'}`}
        >
          Home
        </Link>
        <Link
          to="/services"
          className={`nav-link ${isActive('/services') ? activeLinkClass : 'text-gray-800 hover:text-xpectrum-purple'}`}
        >
          Products
        </Link>
        <Link
          to="/about"
          className={`nav-link ${isActive('/about') ? activeLinkClass : 'text-gray-800 hover:text-xpectrum-purple'}`}
        >
          About
        </Link>
        <Link
          to="/case-studies"
          className={`nav-link ${isActive('/case-studies') ? activeLinkClass : 'text-gray-800 hover:text-xpectrum-purple'}`}
        >
          Case Studies
        </Link>
        <Link
          to="/contact"
          className="bg-xpectrum-purple hover:bg-xpectrum-darkpurple text-white px-4 py-2 rounded-md flex items-center gap-2 group transition-all duration-300"
        >
          <Mail size={16} className="group-hover:scale-110 transition-transform duration-300" />
          <span>Contact Us</span>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          type="button"
          className="text-gray-800 hover:text-xpectrum-purple focus:outline-none transition-all duration-300 p-2 rounded-lg bg-white/80 backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </div>
  </nav>

  );
};

export default Navbar;