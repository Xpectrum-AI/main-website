import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Link } from 'react-router-dom';
import { ArrowRight, Building, Users, Computer, Bot, Lightbulb } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

const ServiceCard = ({ 
  icon: Icon, 
  title, 
  description, 
  color, 
  imageIndex,
  delay,
  linkTo
}: { 
  icon: LucideIcon, 
  title: string, 
  description: string, 
  color: string,
  imageIndex: number,
  delay: number,
  linkTo: string
}) => {
  return (
    <Link 
      to={linkTo}
      className="service-card group block animate-fade-in-up relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
      style={{ 
        backgroundImage: `url(https://images.unsplash.com/photo-148${imageIndex}-0ad4aaf24ca7)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animationDelay: `${delay}ms`
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-xpectrum-purple via-xpectrum-magenta to-xpectrum-blue opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
      
      <div className="absolute top-3 right-4 bg-gradient-to-r from-xpectrum-purple to-xpectrum-blue text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm border border-white/30">
        Try Now
      </div>
      <div className="relative z-10 p-6 flex flex-col h-full">
        <div className={`${color} rounded-full p-2 w-12 h-12 flex items-center justify-center mb-4 shadow-inner`}>
          <Icon size={24} className="text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90 mb-4 flex-grow">{description}</p>
        <div className="flex justify-end mt-auto">
          <span className="text-white flex items-center group-hover:underline">
            Try Yourself <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const Services = () => {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    
    // Add animation to elements as they appear in viewport
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
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title animate-slide-in">
              Supercharge your customer operations
            </h2>
            <p className="text-lg text-gray-600 animate-slide-in" style={{ animationDelay: '200ms' }}>
              Integrate AI at the core of your organization
            </p>
          </div>
          
          {/* Superintelligent Xpectrum Section */}
          
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ServiceCard 
              icon={Building}
              title="HRMS" 
              description="Expctrum HRMS Service Agent to streamline your human resources management" 
              color="bg-xpectrum-purple"
              imageIndex={7058792}
              delay={0}
              linkTo="/hrms"
            />
            
            <ServiceCard 
              icon={Users}
              title="Insurance" 
              description="Insurance Service Support Agent delivering fast and accurate service" 
              color="bg-xpectrum-magenta"
              imageIndex={8590528}
              delay={100}
              linkTo="/insurance"
            />
            
            <ServiceCard 
              icon={Computer}
              title="Hospitality" 
              description="Hospitality Support AI Agent enhancing guest experiences" 
              color="bg-xpectrum-blue"
              imageIndex={1749280}
              delay={200}
              linkTo="/hospitality"
            />
            
            {/* <ServiceCard 
              icon={Bot}
              title="Retail" 
              description="Retail Service AI Agent improving retail operations and customer experience" 
              color="bg-xpectrum-darkpurple"
              imageIndex={5827404}
              delay={300}
              linkTo="/retail"
            /> */}
          </div>
          
          <div className="mt-16 max-w-3xl mx-auto text-center animate-on-scroll">
            <p className="text-lg text-gray-700">
              Our core offering is a quantitative digital expert that seamlessly integrates into your organization, 
              providing unparalleled support across various functions. Whether it's customer service, IT management, 
              or decision-making, Xpectrum's solutions empower your teams to deliver exceptional outcomes, consistently.
            </p>
          </div>

          <div className="bg-gradient-to-r from-xpectrum-purple to-xpectrum-darkpurple p-8 rounded-lg mt-16 shadow-lg animate-fade-in">
            <div className="flex flex-col md:flex-row items-center">
              <div className="md:w-1/6 flex justify-center mb-6 md:mb-0">
                <div className="bg-white/20 rounded-full p-4 w-20 h-20 flex items-center justify-center">
                  <Lightbulb size={32} className="text-white" />
                </div>
              </div>
              <div className="md:w-5/6 text-white">
                <h2 className="text-2xl md:text-3xl font-bold mb-3">Hire a superintelligent Xpectrum</h2>
                <p className="text-lg opacity-90">
                  Xpectrum is at the forefront of AI-driven innovation, offering a suite of advanced digital solutions designed to enhance customer service and deliver superior results to stakeholders.
                </p>
                <div className="mt-4">
                  <Link to="/contact" className="inline-flex items-center bg-white text-xpectrum-darkpurple px-6 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors">
                    Get started <ArrowRight size={16} className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;