import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const XpectrumLogo = () => (
  <img src="/logo.png" alt="Xpectrum AI Logo" className="h-12 w-auto" />
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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
              className={`nav-link ${isActive('/') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`nav-link ${isActive('/services') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Products
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              About
            </Link>
            <Link 
              to="/case-studies" 
              className={`nav-link ${isActive('/case-studies') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Case Studies
            </Link>
            <Link
              to="/flowchart"
              className={`nav-link ${isActive('/flowchart') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Flowchart
            </Link>
            {/* <Link 
              to="/partners" 
              className={`nav-link ${isActive('/partners') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Partners
            </Link> */}
            <Link 
              to="/contact"
              className={`bg-xpectrum-purple hover:bg-xpectrum-darkpurple text-white px-4 py-2 rounded-md ml-4 flex items-center gap-2 group transition-all duration-300`}
            >
              <Mail size={16} className="group-hover:scale-110 transition-transform duration-300" />
              <span>Contact Us</span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-700 hover:text-xpectrum-purple focus:outline-none transition-all duration-300"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} className="animate-fade-in-permanent" /> : <Menu size={24} className="animate-fade-in-permanent" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
            <Link 
              to="/"
              className={`block px-3 py-2 ${isActive('/') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className={`block px-3 py-2 ${isActive('/services') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className={`block px-3 py-2 ${isActive('/about') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              About
            </Link>
            <Link 
              to="/case-studies" 
              className={`block px-3 py-2 ${isActive('/case-studies') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Case Studies
            </Link>
            <Link
              to="/flowchart"
              className={`block px-3 py-2 ${isActive('/flowchart') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Flowchart
            </Link>
            <Link 
              to="/partners" 
              className={`block px-3 py-2 ${isActive('/partners') ? activeLinkClass : 'text-gray-700 hover:text-xpectrum-purple'}`}
            >
              Partners
            </Link>
            <div className="mt-2 px-3 py-2">
              <a href="mailto:ask@xpectrum-ai.com" className="text-gray-700 hover:text-xpectrum-purple flex items-center gap-2">
                <Mail size={16} />
                <span>ask@xpectrum-ai.com</span>
              </a>
            </div>
            <Link 
              to="/contact"
              className="bg-xpectrum-purple hover:bg-xpectrum-darkpurple text-white mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md"
            >
              <Mail size={16} />
              <span>Contact Us</span>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;