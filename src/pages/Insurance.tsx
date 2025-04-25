import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { CheckCircle, Shield, LineChart, FileCheck, CreditCard, Users } from 'lucide-react';
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

const Insurance = () => {
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
      <main>
        {/* Hero Section */}
        <section className="pt-28 pb-16 bg-warm-gradient from-white to-gray-50">
          <div className="content-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="animate-slide-in">
                <h1 className="text-4xl font-bold mb-4 text-xpectrum-darkpurple">Insurance</h1>
                <h2 className="text-2xl mb-6 text-xpectrum-purple">Xpectrum Insurance Management Agent</h2>
                <p className="text-gray-600 mb-8">
                  Introducing our comprehensive Insurance Management solution—powered by advanced AI—that revolutionizes insurance processes. 
                  Streamline policy underwriting, claims processing, risk assessment, and customer engagement while optimizing operational 
                  efficiency and ensuring regulatory compliance.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  <MetricCard value="97%" label="Policyholder Satisfaction" delay={100} />
                  <MetricCard value="400+" label="Clients Insured" delay={200} />
                  <MetricCard value="15" label="Products Offered" delay={300} />
                  <MetricCard value="$750M" label="Claims Processed" delay={400} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                <div className="space-y-4">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float">
                    <img src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85" alt="Insurance Agent" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.2s" }}>
                    <img src="https://images.unsplash.com/photo-1601597111158-2fceff292cdc" alt="Policy Documents" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.4s" }}>
                    <img src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" alt="Customer Service" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.6s" }}>
                    <img src="https://images.unsplash.com/photo-1579621970795-87facc2f976d" alt="Digital Insurance" className="w-full h-full object-cover" />
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
                title="Policy Administration & Underwriting" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Simplify policy lifecycle management from issuance to renewal</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Manage policy details, endorsements, and renewals</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Automate risk evaluation and underwriting workflows</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Ensure compliance with regulatory standards and industry best practices</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={100}
              />
              
              <FeatureCard 
                title="Claims Processing & Settlement" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Accelerate claims management from submission to resolution</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Digitize claim submissions and streamline validation processes</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Track claim progress and expedite settlement approvals</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate with external data sources for comprehensive claims assessment</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={200}
              />
              
              <FeatureCard 
                title="Risk Assessment & Fraud Detection" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Utilize AI to evaluate risk profiles and identify fraudulent activities</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Analyze historical data to predict risk factors</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Deploy machine learning models for anomaly detection</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Enhance decision making with real-time risk insights</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={300}
              />
              
              <FeatureCard 
                title="Customer Engagement & Self-Service" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Empower policyholders with digital tools for seamless interactions</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Provide 24/7 access to policy details and claim status updates</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Offer personalized recommendations through AI-driven support</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Integrate CRM to improve customer satisfaction and retention</span>
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
                <h2 className="text-3xl font-bold mb-8 animate-slide-in">Key Insurance Offerings:</h2>
                
                <OfferingCard 
                  icon={<Shield size={28} className="text-xpectrum-purple" />}
                  title="Digital Insurance Assistant"
                  description="An AI-powered assistant that streamlines insurance tasks like claims processing, policy management, and customer inquiries."
                  delay={100}
                />
                
                <OfferingCard 
                  icon={<FileCheck size={28} className="text-xpectrum-purple" />}
                  title="Policy Underwriting & Risk Assessment"
                  description="Automate risk evaluation, streamline policy underwriting, and manage customer portfolios to offer tailored insurance coverage."
                  delay={200}
                />
                
                <OfferingCard 
                  icon={<LineChart size={28} className="text-xpectrum-purple" />}
                  title="Claims Analytics & Insights"
                  description="Leverage AI to monitor claims processing, detect fraudulent activity, and deliver actionable insights for continuous improvement in risk management."
                  delay={300}
                />
              </div>
              
              <div className="animate-fade-in-up flex items-center" style={{ animationDelay: "400ms" }}>
                <div className="bg-xpectrum-lightpurple rounded-lg overflow-hidden w-full h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1591696205602-2f950c417cb9" 
                    alt="Insurance Digital Transformation" 
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in">Optimize Your Insurance Processes</h2>
              <h3 className="text-2xl mb-6 animate-slide-in" style={{ animationDelay: "100ms" }}>Transform Your Insurance Management with Xpectrum AI</h3>
              <p className="text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                The Insurance Management System Powered by Xpectrum AI revolutionizes risk assessment, claims processing, and customer 
                service through intelligent automation, real-time analytics, and regulatory compliance. Our AI-driven platform streamlines 
                policy administration, enhances customer experience, and delivers actionable insights for improved risk management while 
                ensuring robust data security.
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
                icon={<LineChart size={24} className="text-xpectrum-purple" />}
                title="Risk Assessment"
                description="Leverage predictive models to evaluate risk and tailor coverage solutions efficiently."
                delay={100}
              />
              
              <BenefitCard 
                icon={<CheckCircle size={24} className="text-xpectrum-purple" />}
                title="Regulatory Compliance"
                description="Ensure adherence to insurance regulations and industry standards automatically."
                delay={200}
              />
              
              <BenefitCard 
                icon={<LineChart size={24} className="text-xpectrum-purple" />}
                title="Claims Analytics"
                description="Access real-time dashboards for claim trends, fraud detection, and settlement insights."
                delay={300}
              />
              
              <BenefitCard 
                icon={<Users size={24} className="text-xpectrum-purple" />}
                title="Customer Self-Service"
                description="Provide 24/7 access to policy details, claims status, and personalized coverage recommendations."
                delay={400}
              />
              
              <BenefitCard 
                icon={<Shield size={24} className="text-xpectrum-purple" />}
                title="Smart Underwriting"
                description="Utilize AI-driven insights for rapid, accurate policy underwriting and risk evaluation."
                delay={500}
              />
              
              <BenefitCard 
                icon={<CreditCard size={24} className="text-xpectrum-purple" />}
                title="Personalized Policies"
                description="Tailor insurance products to individual needs with data-driven customization and adaptive pricing strategies."
                delay={600}
              />
            </div>
          </div>
        </section>
      </main>
      {/* Chat Component Integrated */}
      <ChatComponent assistantName="Insurance Assistant" />
    </>
  );
};

export default Insurance;
