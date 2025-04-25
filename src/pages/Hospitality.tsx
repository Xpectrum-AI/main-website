import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { CheckCircle, Home, LineChart, Star, Clock, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ChatComponent from '@/components/ChatComponent';

interface MetricCardProps {
  value: string;
  label: string;
  delay: number;
}

const MetricCard: React.FC<MetricCardProps> = ({ value, label, delay }) => (
  <div 
    className="text-center animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="text-4xl font-bold text-xpectrum-purple mb-2">{value}</div>
    <div className="text-gray-600">{label}</div>
  </div>
);

interface FeatureCardProps {
  title: string;
  description: React.ReactNode;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, delay }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <h3 className="text-xl font-bold mb-3 text-xpectrum-darkpurple">{title}</h3>
    {description}
  </div>
);

interface OfferingCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const OfferingCard: React.FC<OfferingCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="flex gap-4 mb-8 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex-shrink-0">
      <div className="bg-xpectrum-lightpurple rounded-full p-3 w-14 h-14 flex items-center justify-center">
        {icon}
      </div>
    </div>
    <div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  </div>
);

interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const BenefitCard: React.FC<BenefitCardProps> = ({ icon, title, description, delay }) => (
  <div 
    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 animate-fade-in-up" 
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center mb-4">
      <div className="bg-xpectrum-lightpurple rounded-full p-2 mr-3">
        {icon}
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
    </div>
    <p className="text-gray-600">{description}</p>
  </div>
);

const Hospitality = () => {
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
    <div className="min-h-screen bg-warm-gradient">
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 bg-warm-gradient from-white to-gray-50">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="animate-slide-in">
                <h1 className="text-4xl font-bold mb-4 text-xpectrum-darkpurple">Hospitality</h1>
                <h2 className="text-2xl mb-6 text-xpectrum-purple">Xpectrum Hospitality Management Agent</h2>
                <p className="text-gray-600 mb-8">
                  Introducing our comprehensive hospitality solution—powered by advanced AI—that revolutionizes guest experiences 
                  and operational management. Streamline reservations, guest services, housekeeping, and performance monitoring 
                  while enhancing service quality and overall efficiency.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  <MetricCard value="95%" label="Guest Satisfaction" delay={100} />
                  <MetricCard value="300+" label="Hotels Worldwide" delay={200} />
                  <MetricCard value="1000+" label="Rooms Managed" delay={300} />
                  <MetricCard value="$1B" label="Annual Revenue" delay={400} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                <div className="space-y-4">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float">
                    <img src="https://images.unsplash.com/photo-1566073771259-6a8506099945" alt="Hotel Lobby" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.2s" }}>
                    <img src="https://images.unsplash.com/photo-1551918120-9739cb430c6d" alt="Hotel Room" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.4s" }}>
                    <img src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4" alt="Hotel Reception" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.6s" }}>
                    <img src="https://images.unsplash.com/photo-1469631423273-6995642a6a40?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fGhvc3BpdGFsaXR5fGVufDB8fDB8fHww" alt="Hotel Service" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Functions & Capabilities Section */}
        <section className="py-16 bg-warm-gradient">
          <div className="content-container">
            <h2 className="text-3xl font-bold mb-12 text-center animate-slide-in">Key Functions & Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FeatureCard 
                title="Guest Check-In & Reservation Management" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Streamline guest arrivals and simplify reservation processes</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Enable digital check-in and quick registration at arrival</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Manage guest profiles and preferences for personalized service</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate reservations with room allocation for seamless transitions</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={100}
              />
              
              <FeatureCard 
                title="Housekeeping & Maintenance Scheduling" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Optimize room service and facility upkeep for an exceptional stay</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Automate room cleaning and maintenance schedules</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Coordinate service requests and track task progress</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Ensure timely responses to guest requests and facility issues</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={200}
              />
              
              <FeatureCard 
                title="Guest Feedback & Service Quality" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Capture insights to continuously enhance the guest experience</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Collect real-time feedback through digital channels</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Facilitate immediate service recovery and resolution</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Analyze trends to improve overall service standards</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={300}
              />
              
              <FeatureCard 
                title="Loyalty & Rewards Management" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Boost guest retention with personalized loyalty programs</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Manage reward points and guest incentives seamlessly</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Personalize offers based on guest history and preferences</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate loyalty programs with CRM for targeted marketing</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={400}
              />
            </div>
          </div>
        </section>
        
        {/* Offerings Section */}
        <section className="py-16 bg-warm-gradient">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold mb-8 animate-slide-in">Key Hospitality Offerings:</h2>
                
                <OfferingCard 
                  icon={<Home size={28} className="text-xpectrum-purple" />}
                  title="Digital Concierge Assistant"
                  description="An AI-powered assistant that streamlines guest check-in, concierge services, and inquiry management for a personalized experience."
                  delay={100}
                />
                
                <OfferingCard 
                  icon={<MapPin size={28} className="text-xpectrum-purple" />}
                  title="Reservation & Guest Management"
                  description="Automate booking processes, manage guest profiles, and coordinate room allocations to ensure a seamless stay from arrival to departure."
                  delay={200}
                />
                
                <OfferingCard 
                  icon={<LineChart size={28} className="text-xpectrum-purple" />}
                  title="Service Analytics & Insights"
                  description="Leverage AI to monitor service performance, track guest feedback, and deliver actionable insights for continuous operational improvement."
                  delay={300}
                />
              </div>
              
              <div className="animate-fade-in-up flex items-center" style={{ animationDelay: "400ms" }}>
                <div className="bg-xpectrum-lightpurple rounded-lg overflow-hidden w-full h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1551882547-ff40c63fe5fa" 
                    alt="Hospitality Management" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-20 bg-xpectrum-darkpurple text-white">
          <div className="content-container">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in">Optimize Your Hospitality Services</h2>
              <h3 className="text-2xl mb-6 animate-slide-in" style={{ animationDelay: "100ms" }}>Transform Your Hospitality Management with Xpectrum AI</h3>
              <p className="text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                The Hospitality Management System Powered by Xpectrum AI revolutionizes guest experiences, operations, and service delivery 
                through intelligent automation, real-time analytics, and personalized engagement. Our AI-driven platform streamlines booking 
                processes, enhances customer service, and provides actionable insights for superior hospitality management while ensuring 
                robust data security.
              </p>
              
              <Button className="bg-white text-xpectrum-darkpurple hover:bg-xpectrum-lightpurple animate-pulse-slow">
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>
        
        {/* Benefits Grid */}
        <section className="py-16 bg-warm-gradient">
          <div className="content-container">
            <h2 className="text-3xl font-bold mb-12 text-center animate-slide-in">Advanced Capabilities</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <BenefitCard 
                icon={<Star size={24} className="text-xpectrum-purple" />}
                title="Guest Experience"
                description="Enhance guest satisfaction with personalized service recommendations and tailored engagement."
                delay={100}
              />
              
              <BenefitCard 
                icon={<Clock size={24} className="text-xpectrum-purple" />}
                title="Operational Efficiency"
                description="Automate routine tasks and optimize resource management to reduce operational costs."
                delay={200}
              />
              
              <BenefitCard 
                icon={<LineChart size={24} className="text-xpectrum-purple" />}
                title="Real-Time Analytics"
                description="Access live dashboards tracking occupancy rates, guest feedback, and revenue performance."
                delay={300}
              />
              
              <BenefitCard 
                icon={<Home size={24} className="text-xpectrum-purple" />}
                title="Customer Self-Service"
                description="Provide 24/7 access to booking details, room service requests, and personalized concierge services."
                delay={400}
              />
              
              <BenefitCard 
                icon={<MapPin size={24} className="text-xpectrum-purple" />}
                title="Smart Booking"
                description="Leverage AI-driven reservation systems to ensure optimal room allocation and seamless check-in processes."
                delay={500}
              />
              
              <BenefitCard 
                icon={<Star size={24} className="text-xpectrum-purple" />}
                title="Service Innovation"
                description="Utilize data-driven insights to create innovative services and stay competitive in the dynamic hospitality industry."
                delay={600}
              />
            </div>
          </div>
        </section>
      </main>
      {/* Chat Component Integrated */}
      <ChatComponent assistantName="Hospitality Assistant" />
    </div>
  );
};

export default Hospitality;
