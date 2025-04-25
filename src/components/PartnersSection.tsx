import React from 'react';
import { Button } from '@/components/ui/button';
import { Handshake, Link, Users } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const PartnerFeature = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-shrink-0">
        <div className="bg-xpectrum-lightpurple rounded-full p-2 w-12 h-12 flex items-center justify-center">
          <Icon size={24} className="text-xpectrum-purple" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

const PartnersSection = () => {
  return (
    <section className="bg-[#FFF9E6] py-20">
      <div className="content-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h4 className="text-xpectrum-purple font-semibold mb-2">Become a Partner</h4>
            <h2 className="section-title">Make a Difference</h2>
            <p className="text-gray-600 mb-8">
              We invite you to join our growing network of partners and be part of a transformative journey in 
              AI-powered business solutions. At Xpectrum, we believe in the power of collaboration and are always 
              looking for new partners who share our vision of innovation and excellence.
            </p>
            
            <div className="space-y-6">
              <PartnerFeature 
                icon={Handshake}
                title="Collaborative Approach" 
                description="Work together with our team to create integrated solutions that deliver value." 
              />
              
              <PartnerFeature 
                icon={Link}
                title="Technology Integration" 
                description="Seamlessly connect your existing systems with our AI platform." 
              />
              
              <PartnerFeature 
                icon={Users}
                title="Growing Ecosystem" 
                description="Join a network of industry leaders driving innovation across sectors." 
              />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-4">Expand Your Business</h3>
            <p className="text-gray-600 mb-6">
              As an Xpectrum partner, you will have access to our state-of-the-art AI technology, 
              comprehensive training and resources, and a global community of like-minded professionals. 
              Whether you are a technology provider, reseller, system integrator, or consultant, partnering 
              with Xpectrum offers you the opportunity to expand your business, enhance your service offerings, 
              and deliver exceptional value to your clients.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h4 className="text-xl font-bold mb-3">Start the transformation of your company</h4>
              <p className="mb-4">Let's talk. Contact us to book a demo with our team.</p>
              <p className="text-xpectrum-purple font-medium">ask@xpectrum-ai.com</p>
            </div>
            
            <Button className="w-full bg-xpectrum-purple hover:bg-xpectrum-darkpurple">
              Become a Partner
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
