import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const CaseStudyCard = ({ 
  title, 
  description,
  index
}: { 
  title: string, 
  description: string,
  index: number
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden animate-fade-in-up" 
      style={{ animationDelay: `${index * 150}ms` }}>
      <div className="p-6">
        <div className="text-sm font-medium text-xpectrum-purple mb-2">
          Case Study
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        
        <p className="text-gray-700 mb-4">{description}</p>
        
        <div className="flex gap-2">
          <Button variant="outline" className="group border-xpectrum-purple text-xpectrum-purple hover:bg-xpectrum-purple hover:text-white">
            See Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const CaseStudies = () => {
  const caseStudies = [
    {
      title: "Optimizing Claims Processing for a Leading Insurer",
      description: "A major insurance provider utilized our AI-powered platform to automate claims intake and assessment. By implementing intelligent document processing and fraud detection, they significantly reduced processing times and improved accuracy, leading to enhanced customer satisfaction and lower operational costs."
    },
    // Add more case studies here if needed. They will use the CaseStudyCard component.
    // {
    //   title: "Another Case Study",
    //   description: "Description for the second case study..."
    // }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });
    
    return () => {
      document.querySelectorAll('.animate-on-scroll').forEach((el) => {
        observer.unobserve(el);
      });
    };
  }, []);

  return (
    <>
      <Navbar />
      <section className="pt-24 pb-20 bg-warm-gradient from-white to-gray-50">
        <div className="content-container">
          <div className="text-center mb-12">
            <h4 className="text-xpectrum-purple font-semibold mb-2 animate-slide-in">Case Studies</h4>
            <h2 className="section-title animate-slide-in" style={{ animationDelay: '100ms' }}>
              Empower Your Organization
            </h2>
          </div>
          
          <div className="space-y-12">
            {caseStudies.map((study, index) => {
              if (index === 0) {
                return (
                  <div 
                    key={index} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white rounded-lg shadow-md overflow-hidden p-10 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div>
                      <div className="text-sm font-medium text-xpectrum-purple mb-2">
                        Case Study
                      </div>
                      <h3 className="text-xl font-bold mb-2">{study.title}</h3>
                      <p className="text-gray-700 mb-4">{study.description}</p>
                      <Button variant="outline" className="group border-xpectrum-purple text-xpectrum-purple hover:bg-xpectrum-purple hover:text-white">
                        See Details <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>

                    <div className="relative aspect-video rounded-lg overflow-hidden shadow-lg">
                       <video 
                         controls 
                         className="absolute top-0 left-0 w-full h-full object-cover"
                         src="/AI Employee.mp4"
                         poster="/path/to/your/video-poster.jpg"
                       >
                         Your browser does not support the video tag.
                       </video>
                    </div>
                  </div>
                );
              } else {
                return (
                  <CaseStudyCard 
                    key={index}
                    index={index}
                    title={study.title}
                    description={study.description}
                  />
                );
              }
            })}
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudies;
