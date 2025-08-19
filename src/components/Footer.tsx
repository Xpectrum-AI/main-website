import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-xpectrum-darkpurple to-xpectrum-purple text-[#333333] py-8 sm:py-12" aria-label="Footer">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 text-center sm:text-left">
           
          {/* Brand Section */}
          <div className="animate-fade-in-up sm:max-w-xs mx-auto sm:mx-0">
            <h3 className="text-xl md:text-2xl font-bold mb-3">Xpectrum</h3>
            <p className="text-[#333333] text-sm md:text-base mb-4">
              Advanced AI solutions for enterprise customer service and operations.
            </p>
            <p className="text-[#333333] text-xs md:text-sm">
              © {new Date().getFullYear()} Xpectrum. All rights reserved.
            </p>
          </div>

          {/* Solutions */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h4 className="text-base md:text-lg font-semibold mb-3">Solutions</h4>
            <ul className="space-y-2">
              <li><Link to="/HRMS" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">HRMS Services</Link></li>
              <li><Link to="/insurance" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">Insurance Services</Link></li>
              <li><Link to="/hospitality" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">Hospitality Services</Link></li>
              {/* <li><Link to="/retail" className="text-[#333333] hover:text-white transition-colors">Retail Services</Link></li> */}
            </ul>
          </div>

          {/* Company */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-base md:text-lg font-semibold mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link to="/partners" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">Partners</Link></li>
              <li><a href="#" className="text-sm md:text-base text-[#333333] hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h4 className="text-base md:text-lg font-semibold mb-3">Contact</h4>
            <p className="text-[#333333] text-sm md:text-base mb-4">
              Have questions or want to book a demo? Reach out to our team.
            </p>
            <a 
              href="mailto:ask@xpectrum-ai.com" 
              className="inline-flex items-center text-xpectrum-lightpurple hover:text-xpectrum-magenta transition-colors group"
            >
              <Mail size={16} className="mr-2" />
              <span className="text-sm md:text-base">ask@xpectrum-ai.com</span>
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
