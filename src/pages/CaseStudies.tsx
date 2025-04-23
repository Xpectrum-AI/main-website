import React, { useEffect, useState, useRef } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { ArrowRight, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Add styles for fullscreen mode
const fullscreenStyles = `
  video:fullscreen {
    background: transparent !important;
  }
  
  video:-webkit-full-screen {
    background: transparent !important;
  }
  
  video:-ms-fullscreen {
    background: transparent !important;
  }

  *:fullscreen > * {
    display: none !important;
  }

  *:-webkit-full-screen > * {
    display: none !important;
  }

  *:-ms-fullscreen > * {
    display: none !important;
  }

  video:fullscreen, 
  video:-webkit-full-screen,
  video:-ms-fullscreen {
    display: block !important;
  }
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.innerText = fullscreenStyles;
  document.head.appendChild(styleSheet);
}

const CaseStudyCard = ({ 
  title, 
  description,
  index
}: { 
  title: string, 
  description: string,
  index: number
}) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleFullscreen = () => {
    const videoEl = videoRef.current;
    if (videoEl) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoEl.requestFullscreen();
      }
    }
  };

  return (
    <>
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
            {index === 0 && (
              <Button 
                variant="outline" 
                className="group border-xpectrum-purple text-xpectrum-purple hover:bg-xpectrum-purple hover:text-white relative overflow-hidden"
                onClick={() => setShowVideo(true)}
              >
                <span className="relative z-10 flex items-center">
                  Watch Video <Play size={16} className="ml-2 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-xpectrum-purple/20 to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setShowVideo(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden shadow-2xl max-w-4xl w-full mx-4 border border-white/10"
            >
              <motion.div
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative pt-[56.25%] group"
              >
                <video 
                  ref={videoRef}
                  controls 
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src="/AI Employee.mp4"
                >
                  Your browser does not support the video tag.
                </video>

                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-white font-medium">AI Employee Demo</h3>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={handleFullscreen}
                      className="text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                        <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                      </svg>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => setShowVideo(false)}
                      className="text-white hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X size={20} />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const CaseStudies = () => {
  // Sample case studies data
  const caseStudies = [
    {
      title: "Transforming Global HR Operations",
      description: "A multinational corporation leveraged our HRMS solution to streamline recruitment, onboarding, and performance management. By integrating a digital HR assistant, they reduced administrative overhead and boosted employee engagement across global offices."
    }
  ];

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
          <div className="text-center mb-12">
            <h4 className="text-xpectrum-purple font-semibold mb-2 animate-slide-in">Case Studies</h4>
            <h2 className="section-title animate-slide-in" style={{ animationDelay: '100ms' }}>
              Empower Your Organization
            </h2>
            
            {/* <p className="max-w-3xl mx-auto text-gray-600 animate-slide-in" style={{ animationDelay: '200ms' }}>
              At Xpectrum, our solutions have transformed the operations of leading companies across various industries. 
              Our innovative AI-driven products have enabled these organizations to streamline processes, enhance customer 
              experiences, and achieve remarkable results. Below are some of the standout examples of how our technology 
              is making a difference.
            </p> */}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {caseStudies.map((study, index) => (
              <CaseStudyCard 
                key={index}
                index={index}
                title={study.title}
                description={study.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default CaseStudies;
