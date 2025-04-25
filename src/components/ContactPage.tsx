import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from './Navbar';

const ContactPage = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen pt-24 pb-16 px-4 bg-warm-gradient from-white to-xpectrum-lightpurple">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold text-xpectrum-dark mb-3 animate-fade-in">Contact Us</h1>
          <div className="w-20 h-1 bg-xpectrum-purple mx-auto mb-8"></div>
          <p className="text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
            We're ready to help you implement AI solutions that drive results. Reach out to discuss how we can work together.
          </p>
        </div>

        <div className="bg-warm-gradient rounded-xl shadow-lg p-8 md:p-12 mb-12 animate-scale-in">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-xpectrum-lightpurple rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
              <Mail size={32} className="text-xpectrum-purple" />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-semibold text-xpectrum-dark mb-6">
              Adapt our AI solution into your industry and improve the experience and revenue
            </h2>
            
            <div className="flex flex-col items-center justify-center">
              <a 
                href="mailto:ask@xpectrum-ai.com" 
                className="text-lg md:text-xl font-medium text-xpectrum-purple hover:text-xpectrum-darkpurple transition-colors duration-300 flex items-center gap-2 mb-8"
              >
                <Mail size={20} className="animate-float" />
                ask@xpectrum-ai.com
              </a>
              
              <Button 
                className="bg-xpectrum-purple hover:bg-xpectrum-darkpurple text-white px-8 py-6 h-auto text-lg group"
                onClick={() => window.location.href = "mailto:ask@xpectrum-ai.com"}
              >
                <Mail size={18} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                Send us an email
              </Button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mt-12 text-center">
            <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-xpectrum-dark mb-2">Strategy Consultation</h3>
              <p className="text-gray-600">Book a strategy call to discuss your unique challenges</p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-xpectrum-dark mb-2">Partnership Inquiries</h3>
              <p className="text-gray-600">Interested in partnering with xpectrum? Let's talk</p>
            </div>
            
            <div className="p-6 rounded-lg bg-gray-50 hover:shadow-md transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-xpectrum-dark mb-2">Custom Solutions</h3>
              <p className="text-gray-600">Need a tailored AI solution? Contact our experts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ContactPage;