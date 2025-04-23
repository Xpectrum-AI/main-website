import React from 'react';
import { ArrowRight, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-xpectrum-darkpurple to-xpectrum-purple text-white py-12">
      <div className="content-container px-6 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="animate-fade-in-up">
            <h3 className="text-xl font-bold mb-4">Xpectrum</h3>
            <p className="text-gray-300 mb-4">
              Advanced AI solutions for enterprise customer service and operations.
            </p>
            <p className="text-gray-300">
              © {new Date().getFullYear()} Xpectrum. All rights reserved.
            </p>
          </div>

          {/* Solutions */}
          <div className="animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h4 className="text-lg font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              <li><Link to="/HRMS" className="text-gray-300 hover:text-white transition-colors">HRMS Services</Link></li>
              <li><Link to="/insurance" className="text-gray-300 hover:text-white transition-colors">Insurance Services</Link></li>
              <li><Link to="/hospitality" className="text-gray-300 hover:text-white transition-colors">Hospitality Services</Link></li>
              {/* <li><Link to="/retail" className="text-gray-300 hover:text-white transition-colors">Retail Services</Link></li> */}
            </ul>
          </div>

          {/* Company */}
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/case-studies" className="text-gray-300 hover:text-white transition-colors">Case Studies</Link></li>
              <li><Link to="/partners" className="text-gray-300 hover:text-white transition-colors">Partners</Link></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <p className="text-gray-300 mb-4">
              Have questions or want to book a demo? Reach out to our team.
            </p>
            <a 
              href="mailto:ask@xpectrum-ai.com" 
              className="inline-flex items-center text-xpectrum-lightpurple hover:text-xpectrum-magenta transition-colors group"
            >
              <Mail size={16} className="mr-2" />
              ask@xpectrum-ai.com 
              <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </a>
          </div>
          
        </div>
      </div>
    </footer>
  );
};

export default Footer;
