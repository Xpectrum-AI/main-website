import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CaseStudyCard = ({ title, description }: { title: string, description: string }) => {
  return (
    <div className="case-study-card bg-white">
      <div className="mb-4">
        <span className="text-sm text-xpectrum-purple font-medium">Case Study</span>
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <Button variant="outline" className="group border-xpectrum-purple text-xpectrum-purple hover:bg-xpectrum-purple hover:text-white">
        See Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
      </Button>
    </div>
  );
};

const CaseStudiesSection = () => {
  return (
    <section id="cases" className="py-20 bg-[#FFF9E6]">
      <div className="content-container">
        <div className="text-center mb-16">
          <h4 className="text-xpectrum-purple font-semibold mb-2">Case Studies</h4>
          <h2 className="section-title">Empower Your Organization</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            At Xpectrum, our solutions have transformed the operations of leading companies across various industries. 
            Our innovative AI-driven products have enabled these organizations to streamline processes, enhance customer 
            experiences, and achieve remarkable results. Below are some of the standout examples of how our technology 
            is making a difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <CaseStudyCard 
            title="Transforming Global HR Operations" 
            description="A multinational corporation leveraged our HRMS solution to streamline recruitment, onboarding, 
            and performance management. By integrating a digital HR assistant, they reduced administrative overhead and 
            boosted employee engagement across global offices."
          />
          
          <CaseStudyCard 
            title="Revolutionizing Insurance Claims" 
            description="A leading insurance provider implemented our AI solution to automate claims processing and 
            enhance customer service. This led to 70% faster claim resolutions, a 45% reduction in operational costs, 
            and significantly improved customer satisfaction scores."
          />
          
          <CaseStudyCard 
            title="Revolutionizing Guest Experiences in Hospitality" 
            description="A premier hospitality chain utilized our platform to enhance guest check-in processes, 
            automate room service, and streamline reservations. Real-time analytics enabled staff to deliver 
            personalized experiences, resulting in higher guest loyalty."
          />
        </div>
      </div>
    </section>
  );
};

export default CaseStudiesSection;
