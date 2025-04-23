import React from 'react';
import { Globe, Brain, Building, CheckCircle } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string 
}) => {
  return (
    <div className="bg-[#FFF9E6] rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="bg-xpectrum-lightpurple rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4">
        <Icon size={24} className="text-xpectrum-purple" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50 bg-[#FFF9E6]">
      <div className="content-container">
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/2">
            <h4 className="text-xpectrum-purple font-semibold mb-2">About Us</h4>
            <h2 className="section-title">Pioneering Enterprise AI Solutions</h2>
            <p className="text-gray-600 mb-6">
              As a dynamic team of innovative professionals from Silicon Valley tech startups, 
              our leaders bring over 15 years of experience at Google. We are redefining 
              conversational AI with cutting-edge solutions that elevate customer engagement.
            </p>
            <p className="text-gray-600 mb-6">
              While we are a young company, our technology is built on forward-thinking expertise, 
              positioning us to serve enterprises across Retails, hotels, telecom, and HR sectors. 
              We are committed to delivering enterprise-grade AI solutions that drive efficiency, 
              enhance customer interactions, and create measurable business impact.
            </p>
            <p className="text-gray-600">
              Our vision is to empower leading organizations with the next generation of AI-driven conversations.
            </p>
          </div>
          
          <div className="lg:w-1/2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FeatureCard 
                icon={Globe}
                title="Global Reach" 
                description="Serving enterprises across multiple countries with tailored AI solutions." 
              />
              
              <FeatureCard 
                icon={Brain}
                title="AI Expertise" 
                description="Cutting-edge AI technology built by veterans with over 15 years experience." 
              />
              
              <FeatureCard 
                icon={Building}
                title="Industry Leaders" 
                description="Partnering with top organizations in retail, hospitality, and HRMS." 
              />
              
              <FeatureCard 
                icon={CheckCircle}
                title="Results Driven" 
                description="Focused on creating measurable business impact and ROI for our clients." 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
