import React, { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';
import { CheckCircle, Users, LineChart, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react';
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

const HRMS = () => {
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
                <h1 className="text-4xl font-bold mb-4 text-xpectrum-darkpurple">HRMS</h1>
                <h2 className="text-2xl mb-6 text-xpectrum-purple">Xpectrum Human Resources Management Agent</h2>
                <p className="text-gray-600 mb-8">
                  Introducing our comprehensive HRMS solution—powered by advanced AI—that revolutionizes HR processes. 
                  Streamline recruitment, onboarding, payroll, and performance management while enhancing employee 
                  engagement and organizational efficiency.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
                  <MetricCard value="98%" label="Employee Engagement" delay={100} />
                  <MetricCard value="500+" label="Clients Worldwide" delay={200} />
                  <MetricCard value="12" label="Industries Served" delay={300} />
                  <MetricCard value="$500M" label="Payroll Processed" delay={400} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 animate-fade-in-up">
                <div className="space-y-4">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f" alt="HR Team" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.2s" }}>
                    <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf" alt="Digital Analytics" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-4 mt-8">
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.4s" }}>
                    <img src="https://images.unsplash.com/photo-1519389950473-47ba0277781c" alt="Workplace" className="w-full h-full object-cover" />
                  </div>
                  <div className="bg-xpectrum-lightpurple rounded-lg h-48 overflow-hidden animate-float" style={{ animationDelay: "0.6s" }}>
                    <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0" alt="Team Meeting" className="w-full h-full object-cover" />
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
                title="Employee Onboarding and Records Management" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Simplify employee lifecycle management from hire to retirement</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Update employee records, manage contracts, and process role transitions</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Track application statuses and automate onboarding workflows</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Ensure compliance with labor laws and company policies</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={100}
              />
              
              <FeatureCard 
                title="Attendance and Time Tracking" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Optimize workforce scheduling and productivity</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Enable employee clock-in/clock-out and remote attendance logging</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Manage leave requests, overtime, and shift swaps</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Generate real-time attendance reports for payroll integration</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={200}
              />
              
              <FeatureCard 
                title="Performance Management" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Empower employees and managers with continuous feedback</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Set and track SMART goals aligned with organizational objectives</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Facilitate real-time performance reviews and 360-degree feedback</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Identify skill gaps and recommend training programs</span>
                      </li>
                    </ul>
                  </div>
                }
                delay={300}
              />
              
              <FeatureCard 
                title="Benefits and Compensation" 
                description={
                  <div>
                    <p className="mb-3 text-gray-600">Streamline rewards and employee well-being programs</p>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Administer benefits enrollment (health insurance, retirement plans, etc.)</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Provide real-time visibility into compensation structures and bonuses</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle size={18} className="text-xpectrum-purple mr-2 mt-1 flex-shrink-0" />
                        <span>Resolve payroll discrepancies and tax-related queries</span>
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
                <h2 className="text-3xl font-bold mb-8 animate-slide-in">Key HRMS Offerings:</h2>
                
                <OfferingCard 
                  icon={<Users size={28} className="text-xpectrum-purple" />}
                  title="Digital HR Assistant"
                  description="An AI-powered assistant that streamlines HR tasks like onboarding, leave management, and employee queries."
                  delay={100}
                />
                
                <OfferingCard 
                  icon={<Briefcase size={28} className="text-xpectrum-purple" />}
                  title="Recruitment & Talent Management"
                  description="Automate candidate screening, interview scheduling, and onboarding to attract and retain top talent."
                  delay={200}
                />
                
                <OfferingCard 
                  icon={<LineChart size={28} className="text-xpectrum-purple" />}
                  title="Performance Analytics & Insights"
                  description="Leverage AI to monitor employee performance, deliver actionable insights, and drive continuous improvement."
                  delay={300}
                />
              </div>
              
              <div className="animate-fade-in-up flex items-center" style={{ animationDelay: "400ms" }}>
                <div className="bg-xpectrum-lightpurple rounded-lg overflow-hidden w-full h-[400px]">
                  <img 
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978" 
                    alt="HR Digital Transformation" 
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-slide-in">Optimize your workforce</h2>
              <h3 className="text-2xl mb-6 animate-slide-in" style={{ animationDelay: "100ms" }}>Transform Your Human Resource Management with Xpectrum AI</h3>
              <p className="text-white/90 mb-10 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                The HRMS Powered by Xpectrum AI revolutionizes workforce management through intelligent automation, 
                employee engagement tools, and data-driven decision making. Our AI-driven platform streamlines hiring 
                processes, enhances employee experience, and provides real-time analytics to optimize talent management 
                while ensuring compliance with labor regulations and maintaining strict data security protocols.
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
                icon={<Users size={24} className="text-xpectrum-purple" />}
                title="Talent Retention"
                description="Reduce employee turnover with predictive attrition models and personalized engagement strategies"
                delay={100}
              />
              
              <BenefitCard 
                icon={<ShieldCheck size={24} className="text-xpectrum-purple" />}
                title="Data Compliance"
                description="Automated compliance with GDPR, labor laws, and industry-specific regulations across global operations"
                delay={200}
              />
              
              <BenefitCard 
                icon={<LineChart size={24} className="text-xpectrum-purple" />}
                title="Workforce Analytics"
                description="Real-time dashboards tracking productivity, engagement metrics, and skills development progress"
                delay={300}
              />
              
              <BenefitCard 
                icon={<Users size={24} className="text-xpectrum-purple" />}
                title="Employee Self-Service"
                description="24/7 access to payslips, benefits management, and AI-powered career development tools"
                delay={400}
              />
              
              <BenefitCard 
                icon={<Briefcase size={24} className="text-xpectrum-purple" />}
                title="Smart Recruitment"
                description="AI-driven candidate matching and automated interview scheduling for high-volume hiring"
                delay={500}
              />
              
              <BenefitCard 
                icon={<GraduationCap size={24} className="text-xpectrum-purple" />}
                title="Skills Development"
                description="Personalized learning paths and competency gap analysis powered by machine learning"
                delay={600}
              />
            </div>
          </div>
        </section>
      </main>
      {/* Chat Component Integrated */}
      <ChatComponent assistantName="HRMS Assistant" />
    </>
  );
};

export default HRMS;
