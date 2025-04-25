import React from 'react';
import { Card } from '@/components/ui/card';
import { ArrowRight, Building, Users, Computer, Bot } from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  imageIndex,
  linkTo
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string, 
  color: string,
  imageIndex: number,
  linkTo: string
}) => {
  return (
    <Link 
      to={linkTo}
      className="service-card group block relative overflow-hidden rounded-xl"
      style={{ 
        backgroundImage: `url(https://images.unsplash.com/photo-148${imageIndex}-0ad4aaf24ca7)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div 
        className="absolute top-2 right-2 z-20"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(255, 165, 0, 0.5))'
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 blur-md opacity-50"></div>
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold relative">
            Try Now
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
      <div className="relative z-10 p-6 flex flex-col h-full min-h-[260px]">
        <div className={`${color} rounded-full p-3 w-14 h-14 flex items-center justify-center mb-4 shadow-lg`}>
          <Icon size={26} className="text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
        <p className="text-white/90 mb-6 flex-grow">{description}</p>
        <div className="flex justify-end mt-auto">
          <span className="text-white flex items-center text-lg font-medium group-hover:underline">
            Try Yourself <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const ServicesSection = () => {
  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="content-container">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="section-title">
            Supercharge your customer operations
          </h2>
          <p className="text-lg text-gray-600">
            Integrate AI at the core of your organization
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ServiceCard 
            icon={Building}
            title="HRMS" 
            description="Expctrum HRMS Service Agent to streamline your human resources management" 
            color="bg-xpectrum-purple"
            imageIndex={7058792}
            linkTo="/hrms"
          />
          
          <ServiceCard 
            icon={Users}
            title="Insurance" 
            description="Insurance Service Support Agent delivering fast and accurate service" 
            color="bg-xpectrum-magenta"
            imageIndex={8590528}
            linkTo="/insurance"
          />
          
          <ServiceCard 
            icon={Computer}
            title="Hospitality" 
            description="Hospitality Support AI Agent enhancing guest experiences" 
            color="bg-xpectrum-blue"
            imageIndex={1749280}
            linkTo="/hospitality"
          />
          
          {/* <ServiceCard 
            icon={Bot}
            title="Retail" 
            description="Retail Service AI Agent improving retail operations and customer experience"
            color="bg-xpectrum-darkpurple"
            imageIndex={5827404}
          /> */}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <p className="text-lg text-gray-700">
            Our core offering is a quantitative digital expert that seamlessly integrates into your organization, 
            providing unparalleled support across various functions. Whether it's customer service, IT management, 
            or decision-making, Xpectrum's solutions empower your teams to deliver exceptional outcomes, consistently.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
