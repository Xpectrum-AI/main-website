import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useAnimation } from 'framer-motion';
import { ArrowRight, Bot, Building, Users, Computer, Lightbulb, Shield, Target, RefreshCw, FileText, ShieldCheck, Briefcase, BedDouble, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import FlowchartSection from './FlowchartSection';
import { cn } from '@/lib/utils';
import ChatComponentXpectrumDemo from './ChatComponentXpectrumDemo';

// Company logos for carousel - ensure these paths are correct
const companyLogos = [
  "/company1.webp",
  "/company2.webp",
  "/company3.webp",
  "/company4.webp",
  "/company5.webp",
  "/company6.webp",
  "/company7.webp",
  "/company8.webp",
  "/company9.webp",
  "/company10.webp",
];

// Deployment messages for the typing animation
const deploymentMessages = [
  "Seamless Deployment.",
  "Deploy on Cloud.",
  "Run On-Premises.",
  "Go Hybrid with Confidence.",
  "Your Infrastructure, Your Rules.",
  "We Handle the Complexity.",
  "Tailored Deployments for You.",
  "Start Anywhere, Scale Everywhere.",
  "Built for Flexibility.",
  "Enterprise-Ready from Day One.",
  "Choose Where, We'll Handle How."
];

// Define additional icons first
const Database = Computer; // For database operations
const Search = Target; // For search operations
const Clock = RefreshCw; // For time-related operations
const CheckCircle = Lightbulb; // For confirmation/success operations

// Define interface for workflow steps to ensure type safety
interface WorkflowStep {
  title: string;
  position: { row: number; col: number };
  icon?: React.ElementType;
  variant: WorkflowStepVariant; // Ensure variant is properly typed
}

// --- Data for Dynamic Workflow Chart ---
const serviceWorkflows = [
  {
    name: "HRMS",
    icon: Briefcase,
    color: "#1a763a", // Changed from purple to green
    roles: [
      { title: "Recruiting Specialist", icon: Users },
      { title: "Onboarding Assistant", icon: FileText },
      { title: "Benefits Coordinator", icon: ShieldCheck },
      { title: "HR Analyst", icon: Lightbulb }
    ],
    chatExample: { 
      user: "How do I enroll in the new healthcare plan?", 
      bot: "Hi [Name], I've found the enrollment form and pre-filled some details for you. Please review and submit." 
    },
    // Custom workflow steps for HRMS with proper typing
    workflowSteps: [
      { title: "Parse Request", position: { row: 1, col: 1 }, icon: Computer, variant: "input" as WorkflowStepVariant },
      { title: "Access HR DB", position: { row: 1, col: 2 }, icon: Database, variant: "database" as WorkflowStepVariant },
      { title: "Generate Form", position: { row: 1, col: 3 }, icon: FileText, variant: "output" as WorkflowStepVariant },
      { title: "Check Policy", position: { row: 2, col: 2 }, icon: ShieldCheck, variant: "verify" as WorkflowStepVariant },
      { title: "Find Template", position: { row: 2, col: 1 }, icon: Search, variant: "search" as WorkflowStepVariant },
      { title: "Send Details", position: { row: 2, col: 3 }, icon: RefreshCw, variant: "action" as WorkflowStepVariant }
    ] as WorkflowStep[]
  },
  {
    name: "Insurance",
    icon: ShieldCheck,
    color: "#4CAF50", // Changed from indigo to green
    roles: [
      { title: "Claims Adjuster", icon: FileText }, 
      { title: "Underwriting Asst.", icon: Computer }, 
      { title: "Policy Advisor", icon: Users },
      { title: "Fraud Detection", icon: Shield }
    ],
    chatExample: { 
      user: "I need to file a claim for a minor car accident.", 
      bot: "Okay, I can start the claims process. Please provide the date, location, and a brief description of the incident." 
    },
    // Custom workflow steps for Insurance
    workflowSteps: [
      { title: "Classify Claim", position: { row: 1, col: 1 }, icon: FileText, variant: "input" as WorkflowStepVariant },
      { title: "Run Analysis", position: { row: 1, col: 2 }, icon: Lightbulb, variant: "process" as WorkflowStepVariant },
      { title: "Check Coverage", position: { row: 1, col: 3 }, icon: ShieldCheck, variant: "verify" as WorkflowStepVariant },
      { title: "Extract Details", position: { row: 2, col: 2 }, icon: Computer, variant: "database" as WorkflowStepVariant },
      { title: "Verify History", position: { row: 2, col: 1 }, icon: Clock, variant: "search" as WorkflowStepVariant },
      { title: "Generate Report", position: { row: 2, col: 3 }, icon: FileText, variant: "output" as WorkflowStepVariant }
    ] as WorkflowStep[]
  },
  {
    name: "Hospitality",
    icon: BedDouble,
    color: "#155e2e", // Changed from pink to dark green
    roles: [
      { title: "Booking Agent", icon: Computer },
      { title: "Guest Concierge", icon: Users },
      { title: "Event Planner", icon: FileText },
      { title: "Service Optimizer", icon: Lightbulb }
    ],
    chatExample: { 
      user: "I'd like to request a late checkout for room 502.", 
      bot: "Certainly! I've checked availability and can extend your checkout time to 1 PM. Enjoy your stay!" 
    },
    // Custom workflow steps for Hospitality
    workflowSteps: [
      { title: "Identify Guest", position: { row: 1, col: 1 }, icon: Users, variant: "input" as WorkflowStepVariant },
      { title: "Check System", position: { row: 1, col: 2 }, icon: Computer, variant: "database" as WorkflowStepVariant },
      { title: "Verify Options", position: { row: 1, col: 3 }, icon: ShieldCheck, variant: "verify" as WorkflowStepVariant },
      { title: "Update Record", position: { row: 2, col: 2 }, icon: RefreshCw, variant: "process" as WorkflowStepVariant },
      { title: "Check Schedule", position: { row: 2, col: 1 }, icon: Clock, variant: "search" as WorkflowStepVariant },
      { title: "Confirm Request", position: { row: 2, col: 3 }, icon: CheckCircle, variant: "output" as WorkflowStepVariant }
    ] as WorkflowStep[]
  }
];

// --- Helper Components for Workflow Chart ---

type IconType = React.ElementType;

// Define WorkflowStepVariant type to ensure type safety
type WorkflowStepVariant = 'input' | 'process' | 'database' | 'output' | 'verify' | 'search' | 'action';

interface WorkflowBlockProps {
  title: string;
  icon?: IconType; 
  delay: number;
  color?: 'primary' | 'dark' | 'inactive'; // Updated for consistent theming
  className?: string;
  IconComponent?: React.ReactNode;
  onClick?: () => void;
  isSelected?: boolean;
  is3D?: boolean;
  id?: string; // Add id prop
  variant?: WorkflowStepVariant; // Use the defined type
  isAnimating?: boolean; // Add prop to indicate if this block is currently in the active flow
}

const WorkflowBlock: React.FC<WorkflowBlockProps> = ({ 
  title, 
  icon: Icon = Bot, 
  delay, 
  color = 'dark', 
  className = '', 
  IconComponent, 
  onClick, 
  isSelected,
  is3D = true,
  id,
  variant,
  isAnimating
}) => {
  // Use passed IconComponent if available, otherwise use icon prop
  const DisplayIcon = IconComponent || <Icon size={22} className="text-gray-900" />; 
  
  // Theme-consistent colors
  const getBgColor = () => {
    if (color === 'primary' || isSelected) return 'bg-xpectrum-purple';
    if (color === 'dark') return 'bg-gray-100';
    return 'bg-gray-100';
  };
  
  const getTextColor = () => {
    if (color === 'primary' || isSelected) return 'text-white';
    return 'text-gray-700';
  };
  
  const getShadowStyle = () => {
    if (!is3D) return '';
    if (isAnimating) return 'shadow-lg shadow-xpectrum-purple/30'; // Stronger shadow for animating blocks
    if (color === 'primary' || isSelected) 
      return 'shadow-sm shadow-xpectrum-purple/20';
    return 'shadow-sm shadow-gray-300/50';
  };
  
  const get3DStyle = () => {
    if (!is3D) return '';
    if (color === 'primary' || isSelected) 
      return 'border-b-2 border-r-2 border-xpectrum-darkpurple';
    return 'border-b-2 border-r-2 border-gray-200';
  };
  
  // Get variant-specific styles
  const getVariantStyle = () => {
    if (!variant) return '';
    
    switch (variant) {
      case 'input':
        return 'border-l-4 border-blue-400';
      case 'process':
        return 'border-l-4 border-purple-400';
      case 'database':
        return 'border-l-4 border-green-400';
      case 'output':
        return 'border-l-4 border-orange-400';
      case 'verify':
        return 'border-l-4 border-red-400';
      case 'search':
        return 'border-l-4 border-yellow-400';
      case 'action':
        return 'border-l-4 border-indigo-400';
      default:
        return '';
    }
  };
  
  // Get icon background color based on variant
  const getIconBgColor = () => {
    if (!variant) return 'bg-white/30';
    
    switch (variant) {
      case 'input':
        return 'bg-blue-100';
      case 'process':
        return 'bg-purple-100';
      case 'database':
        return 'bg-green-100';
      case 'output':
        return 'bg-orange-100';
      case 'verify':
        return 'bg-red-100';
      case 'search':
        return 'bg-yellow-100';
      case 'action':
        return 'bg-indigo-100';
      default:
        return 'bg-white/30';
    }
  };
  
  const cursorStyle = onClick ? 'cursor-pointer' : '';
  
  // Animation for when a block is part of the active flow
  const animatingStyle = isAnimating ? 'scale-105 -translate-y-1' : '';

  return (
    <motion.div 
      id={id}
      className={`p-3 rounded-lg ${getBgColor()} ${getTextColor()} ${cursorStyle} ${getShadowStyle()} ${get3DStyle()} ${getVariantStyle()} ${className} transition-all duration-300 flex flex-col justify-between text-center w-[100px] h-[100px] items-center ${animatingStyle}`}
      initial={{ opacity: 0, y: 5 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} 
      transition={{ duration: 0.2, delay: delay }}
      onClick={onClick}
      whileHover={onClick ? { scale: 1.05, y: -2 } : {}}
      animate={isAnimating ? { 
        boxShadow: ['0px 4px 12px rgba(123, 104, 238, 0.2)', '0px 6px 16px rgba(123, 104, 238, 0.4)', '0px 4px 12px rgba(123, 104, 238, 0.2)'],
        y: [0, -4, 0]
      } : {}}
    >
      <div className={`w-10 h-10 ${getIconBgColor()} rounded-lg flex items-center justify-center mx-auto mb-2 text-gray-900`}>
        {DisplayIcon}
      </div>
      <span className="font-medium text-[14px] text-center leading-tight">{title}</span>
    </motion.div>
  );
};

interface ChatExampleProps {
  delay: number;
  userMessage: string;
  botMessage: string;
  serviceColor?: string; // Add service color prop
  id?: string; // Add id prop
}

const ChatExample: React.FC<ChatExampleProps> = ({ delay, userMessage, botMessage, serviceColor = 'bg-xpectrum-purple', id }) => (
  <motion.div 
    id={id} // Assign id to the div
    className="bg-white rounded-xl shadow-sm p-4 w-72 h-auto border border-gray-100 min-h-[220px] flex flex-col" 
    initial={{ opacity: 0, x: 15 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.3, delay: delay }}
  >
    {/* Chat header with user icon */}
    <div className="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
      <div className="flex items-center">
        <div className={`w-7 h-7 rounded-full ${serviceColor} flex items-center justify-center`}>
          <Bot size={16} className="text-white" />
        </div>
        <span className="text-gray-700 font-medium ml-2 text-[14px]">Assistant</span>
      </div>
      <div className="flex space-x-1">
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
        <div className="w-2 h-2 rounded-full bg-gray-200"></div>
      </div>
    </div>
    
    {/* Chat messages */}
    <div className="space-y-3 flex-grow"> 
      <div className="flex justify-end mb-2">
        <div className="bg-gray-100 rounded-t-lg rounded-bl-lg px-3 py-2 max-w-[85%]">
          <p className="text-[14px] text-gray-700">{userMessage}</p>
        </div>
      </div>
      
      <div className="flex justify-start items-start">
        <div className={`w-6 h-6 rounded-full ${serviceColor} flex items-center justify-center mr-2`}>
          <Bot size={14} className="text-white" />
        </div>
        <div className={`${serviceColor} rounded-t-lg rounded-br-lg px-3 py-2 max-w-[85%]`}>
          <p className="text-[14px] text-white">{botMessage}</p>
        </div>
      </div>
    </div>
    
    {/* Dashboard visualization */}
    <div className="mt-3 bg-white rounded-lg p-2 h-28 border border-gray-100">
      <div className="text-[14px] font-medium text-gray-700 mb-2">Dashboard</div>
      <div className="grid grid-cols-2 gap-2 h-[calc(100%-24px)]">
        <div className="bg-gray-50 rounded p-1 flex items-center justify-center">
          <div className="w-full h-full relative">
            <div className="absolute inset-0">
              <div className={`h-full w-3/4 ${serviceColor} rounded-sm`}></div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded p-1">
          <div className={`h-2 ${serviceColor} rounded-sm w-full mb-1`}></div>
          <div className="h-2 bg-xpectrum-magenta/70 rounded-sm w-2/3 mb-1"></div>
          <div className="h-2 bg-xpectrum-blue/70 rounded-sm w-1/2"></div>
        </div>
        <div className="col-span-2 bg-gray-50 rounded p-1 flex items-end space-x-0.5">
          <div className={`${serviceColor} h-3/5 w-full rounded-sm`}></div>
          <div className="bg-xpectrum-magenta/70 h-4/5 w-full rounded-sm"></div>
          <div className="bg-xpectrum-blue/70 h-2/5 w-full rounded-sm"></div>
          <div className={`${serviceColor} h-3/5 w-full rounded-sm`}></div>
          <div className="bg-xpectrum-blue/70 h-2/5 w-full rounded-sm"></div>
          <div className="bg-xpectrum-magenta/70 h-4/5 w-full rounded-sm"></div>
        </div>
      </div>
    </div>
  </motion.div>
);

interface ConnectionProps {
  from: string;
  to: string;
  delay: number;
  path?: string;
  isActive?: boolean;
  serviceColor?: string; // Add service color prop
}

const Connection: React.FC<ConnectionProps> = ({ from, to, delay, path, isActive = false, serviceColor = '#7b68ee' }) => {
  return (
    <motion.div 
      className="absolute pointer-events-none z-10"
      style={{ 
        left: 0, 
        top: 0, 
        right: 0, 
        bottom: 0 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: delay }}
    >
      <svg className="absolute w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={`gradient-${from}-${to}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={isActive ? serviceColor : "#d1d5db"} />
            <stop offset="100%" stopColor={isActive ? serviceColor : "#d1d5db"} />
          </linearGradient>
          
          {/* Add a glow filter for the active paths */}
          <filter id={`glow-${from}-${to}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        
        {/* Wider background path for better visibility */}
        <path
          d={path}
          stroke={isActive ? `${serviceColor}20` : "#e5e7eb"}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Animated path */}
        <path
          d={path}
          stroke={isActive ? `url(#gradient-${from}-${to})` : "#d1d5db"}
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1000"
          strokeDashoffset="1000"
          filter={isActive ? `url(#glow-${from}-${to})` : ""}
          style={{
            transition: "all 0.5s ease"
          }}
        >
          <animate 
            attributeName="stroke-dashoffset" 
            from="1000" 
            to="0" 
            dur="1s" 
            begin={`${delay}s`} 
            fill="freeze" 
          />
        </path>
        
        {/* Animated dot */}
        {isActive && (
          <>
            {/* Larger glow behind the dot */}
            <circle r="6" fill={`${serviceColor}30`}>
              <animateMotion
                path={path}
                begin={`${delay + 0.2}s`}
                dur="2s"
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
            
            {/* Main dot */}
            <circle r="3" fill={serviceColor}>
              <animateMotion
                path={path}
                begin={`${delay + 0.2}s`}
                dur="2s"
                repeatCount="indefinite"
                keyPoints="0;1"
                keyTimes="0;1"
                calcMode="linear"
              />
            </circle>
          </>
        )}
      </svg>
    </motion.div>
  );
};

// --- Helper function to calculate smooth curve path ---
interface Position { 
  x: number; 
  y: number; 
  width?: number; // Make width optional
  height?: number; // Make height optional
}

function calculateSmoothCurvePath(startPos: Position | null, endPos: Position | null, curveOffset = 50): string {
    if (!startPos || !endPos) return '';
    
    // Calculate center points of the elements for connection
    const startX = startPos.x + (startPos.width ? startPos.width / 2 : 50);
    const startY = startPos.y + (startPos.height ? startPos.height / 2 : 50);
    const endX = endPos.x + (endPos.width ? endPos.width / 2 : 50);
    const endY = endPos.y + (endPos.height ? endPos.height / 2 : 50);
    
    // Calculate connection direction
    const dx = endX - startX;
    const dy = endY - startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Adjust control points based on distance and position
    let cx1, cy1, cx2, cy2;
    
    // Determine if this is a left-to-right, right-to-left, or vertical connection
    const isHorizontal = Math.abs(dx) > Math.abs(dy);
    const isLeftToRight = dx > 0;
    
    if (isHorizontal) {
        // For left-to-right or right-to-left connections
        const controlPointOffset = Math.min(Math.abs(dx) * 0.5, distance * 0.3);
        
        if (isLeftToRight) {
            // Left to right (role to step or step to step)
            cx1 = startX + controlPointOffset;
            cy1 = startY;
            cx2 = endX - controlPointOffset;
            cy2 = endY;
        } else {
            // Right to left (unusual case)
            cx1 = startX - controlPointOffset;
            cy1 = startY;
            cx2 = endX + controlPointOffset;
            cy2 = endY;
        }
    } else {
        // For more vertical connections
        const controlPointOffset = Math.min(Math.abs(dy) * 0.5, distance * 0.3);
        
        cx1 = startX;
        cy1 = startY + (dy > 0 ? controlPointOffset : -controlPointOffset);
        cx2 = endX;
        cy2 = endY + (dy > 0 ? -controlPointOffset : controlPointOffset);
    }
    
    // Return SVG cubic bezier path
    return `M ${startX},${startY} C ${cx1},${cy1} ${cx2},${cy2} ${endX},${endY}`;
}

// --- HomePage Component ---

const HomePage = () => {
  // Refs for animations and measurements
  const titleRef = useRef(null);
  const leftContentRef = useRef(null);
  const rightContentRef = useRef(null);
  const heroRef = useRef(null);
  const accurateRef = useRef(null);
  const universalRef = useRef(null);
  const workforceRef = useRef(null);
  const observerRef = useRef(null);

  // Animation states with memoized values
  const [leftHeight, setLeftHeight] = useState(0);
  const [rightHeight, setRightHeight] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // State for typing animation
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedMessage, setDisplayedMessage] = useState(deploymentMessages[0]);

  // InView hooks for scroll animations - with reduced sensitivity
  const isHeroInView = useInView(heroRef, { once: false, amount: 0.2 });
  const isAccurateInView = useInView(accurateRef, { once: true, amount: 0.2 });
  const isUniversalInView = useInView(universalRef, { once: true, amount: 0.2 });
  const isWorkforceInView = useInView(workforceRef, { once: true, amount: 0.2 });

  // Scroll animations with reduced complexity
  const { scrollYProgress } = useScroll({
    layoutEffect: false // Use useEffect instead of layoutEffect for better performance
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.5]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  // Typing animation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % deploymentMessages.length);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setDisplayedMessage(deploymentMessages[currentMessageIndex]);
  }, [currentMessageIndex]);

  // Measure heights after the component mounts
  const measureHeights = useCallback(() => {
    if (leftContentRef.current) {
      setLeftHeight(leftContentRef.current.scrollHeight / 2);
    }
    if (rightContentRef.current) {
      setRightHeight(rightContentRef.current.scrollHeight / 2);
    }
  }, []);

  useEffect(() => {
    // Scroll to top only on initial load
    if (!isLoaded) {
      window.scrollTo(0, 0);
      setIsLoaded(true);
    }

    // Measure heights with debouncing
    const timeoutId = setTimeout(measureHeights, 500);

    // Handle resize with debouncing
    const handleResize = () => {
      clearTimeout(timeoutId);
      setTimeout(measureHeights, 300);
    };

    window.addEventListener('resize', handleResize);

    // Add animation to elements - optimized observer
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-visible');
          observerRef.current.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '50px' });

    const elementsToObserve = document.querySelectorAll('.animate-on-scroll');
    elementsToObserve.forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => {
      // Cleanup
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);

      if (observerRef.current) {
        elementsToObserve.forEach((el) => {
          observerRef.current.unobserve(el);
        });
      }
    };
  }, [isLoaded, measureHeights]);

  // Define roles for the workforce section
  const leftContent = [
    "Sales Development Rep",
    "Data Analytics Lead",
    "Clinical Assistant Pro",
    "Recruiting Specialist",
    "Sales Intelligence AI",
    "AI Support Expert"
  ];

  const rightContent = [
    "Airlines Service Rep",
    "Legal Assistant Pro",
    "Onboarding Expert",
    "AI Chatbot System",
    "Contract Analysis AI",
    "Claims Assessment Pro"
  ];

  const services = [
    { name: "HRMS Service", icon: "/HRMS.png" },
    // { name: "Retail Service", icon: "/Retail.png" },
    { name: "Hospitality Service", icon: "/Hospitality.png" },
    { name: "Insurance Service", icon: "/Insurance.png" },
    { name: "Airlines Service", icon: "/Airlines.png" },
  ];

  // Get icons based on role name - memoized
  const getIcon = useCallback((title) => {
    if (title.includes("Sales")) return "📈";
    if (title.includes("Data")) return "📊";
    if (title.includes("Recruiting")) return "👥";
    if (title.includes("Legal")) return "⚖️";
    if (title.includes("Proposal")) return "📝";
    if (title.includes("Clinician")) return "🩺";
    if (title.includes("Onboarding")) return "🚀";
    if (title.includes("Chatbot")) return "💬";
    if (title.includes("Contracts")) return "📑";
    if (title.includes("Claims")) return "🔍";
    if (title.includes("Support")) return "🛠️";
    if (title.includes("Intelligence")) return "🧠";
    return "✨";
  }, []);

  // Card component with memoization
  const Card = useCallback(({ title, className = '' }) => {
    // Split the title into main text and context if it contains spaces
    const [mainText, ...contextWords] = title.split(' ');
    const context = contextWords.join(' ');

    return (
      <div className={`p-4 sm:p-6 m-2 bg-white rounded-xl shadow-md border border-gray-50 transition-all duration-300 hover:shadow-lg ${className}`}>
        <div className="flex items-start mb-3 sm:mb-4">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-xpectrum-purple/20 rounded-lg flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
            <span className="text-lg sm:text-xl">{getIcon(title)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-lg font-semibold leading-tight sm:leading-relaxed">
              <span className="block truncate">{mainText}</span>
              {context && (
                <span className="block text-xs sm:text-base font-medium text-gray-600 truncate mt-0.5">
                  {context}
                </span>
              )}
            </h3>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          <div className="h-2 sm:h-2.5 bg-gray-100 rounded w-4/5"></div>
          <div className="h-2 sm:h-2.5 bg-gray-100 rounded w-3/5"></div>
        </div>
      </div>
    );
  }, [getIcon]);

  // Animation variants with optimized transition values
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05, // Reduced from 0.1
        duration: 0.4 // Faster transition
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4 // Faster transition
      }
    }
  };

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % services.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [services.length]);

  const [showInfoContainer, setShowInfoContainer] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Animation controls for scroll-reveal
  const sectionControls = useAnimation();
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, { once: true, amount: 0.2 });
  useEffect(() => {
    if (sectionInView) sectionControls.start('visible');
  }, [sectionInView, sectionControls]);

  // Shimmer effect for CTA button
  const Shimmer = () => (
    <motion.div
      className="absolute inset-0 rounded-xl pointer-events-none overflow-hidden"
      initial={{ x: '-100%' }}
      animate={{ x: ['-100%', '100%'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      style={{ background: 'linear-gradient(120deg, transparent 60%, rgba(255,255,255,0.4) 80%, transparent 100%)' }}
    />
  );

  const heroVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.7, ease: 'easeOut' }
    })
  };

  return (
    <div
      className="min-h-screen overflow-x-hidden relative background-gradient-container"
    >
      {/* Animated Gradient Background - REMOVED Fixed container */}
      {/* <div
        className="fixed inset-0 z-[-1] background-gradient-container"
        style={backgroundStyle}
      ></div> */}

      <Navbar />
      
      {/* Floating Info Container */}
      <AnimatePresence>
        {showInfoContainer && (
          <motion.div 
            className="fixed top-20 sm:top-24 md:top-28 right-4 sm:right-4 md:right-4 z-40 bg-white rounded-xl shadow-lg border border-gray-100 p-4 xs:p-5 sm:p-6 w-[90vw] xs:w-80 sm:w-96 md:w-[340px] max-w-[340px]"
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ 
              opacity: 1, 
              x: 0,
              y: [0, -8, 0],
              transition: {
                y: {
                  repeat: Infinity,
                  repeatType: "reverse",
                  duration: 3,
                  ease: "easeInOut"
                }
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.9,
              y: -20,
              transition: { duration: 0.3 }
            }}
            whileHover={{ 
              scale: 1.05, 
              boxShadow: "0 10px 25px rgba(26, 118, 58, 0.2)",
              backgroundColor: "#f0fdf4",
              borderColor: "#1a763a"
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-lg xs:text-xl text-[#1a763a] mb-3 sm:mb-4">In Progress:</h3>
            <ul className="space-y-3 xs:space-y-4">
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5, color: "#1a763a" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Bot size={20} className="text-[#1a763a]" />
                </motion.div>
                <div className="flex-1">
                  <span className="text-sm xs:text-base text-gray-800 font-medium block">End-to-end Agentic AI chatbot</span>
                  <span className="text-xs xs:text-sm text-gray-600 block mt-0.5">with voice and video avatar experience</span>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5, color: "#1a763a" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Users size={20} className="text-[#1a763a]" />
                </motion.div>
                <div className="flex-1">
                  <span className="text-sm xs:text-base text-gray-800 font-medium block">FaceTime-style interaction</span>
                  <span className="text-xs xs:text-sm text-gray-600 block mt-0.5">powered by an Agentic AI chatbot</span>
                </div>
              </motion.li>
              <motion.li 
                className="flex items-start"
                whileHover={{ x: 5, color: "#1a763a" }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  className="w-10 h-10 bg-[#e6f4ea] rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Shield size={20} className="text-[#1a763a]" />
                </motion.div>
                <div className="flex-1">
                  <span className="text-sm xs:text-base text-gray-800 font-medium block">Customer-as-a-Service (CaaS)</span>
                  <span className="text-xs xs:text-sm text-gray-600 block mt-0.5">seamless integration of voice, video, and AI</span>
                </div>
              </motion.li>
            </ul>
            
            {/* Close button for all screens */}
            <button 
              className="absolute top-3 right-3 text-[#1a763a] bg-white rounded-full shadow hover:bg-[#e6f4ea] z-50 p-1"
              aria-label="Close Info Container"
              onClick={() => setShowInfoContainer(false)}
            >
              <X size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.section
        ref={heroRef}
        className="w-full min-h-screen flex flex-col items-start justify-center px-4 sm:px-6 md:px-8 font-sans mt-12 sm:mt-16 lg:mt-20 mb-16 sm:mb-24 relative apply-grid-pattern"
        initial="hidden"
        animate="visible"
        variants={heroVariants}
      >
        <div className="w-full max-w-5xl ml-40 mt-8 sm:mt-16 sm:mb-10 flex flex-col items-start">
          <div className="flex items-start justify-between w-full">
            <div className="relative">
              {/* Animated gradient headline */}
              <motion.h1
                className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 leading-tight text-left px-2 sm:px-4 md:px-6 relative"
                initial="hidden"
                animate="visible"
                variants={heroVariants}
                custom={0}
              >
                <div className="absolute -inset-4 sm:-inset-6 md:-inset-8 bg-white/80 rounded-2xl shadow-xl -z-10 border border-xpectrum-purple/10" />
                <motion.div
                  className="h-12 xs:h-16 sm:h-20 relative text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold flex items-center justify-start w-full overflow-visible"
                  initial="hidden"
                  animate="visible"
                  variants={heroVariants}
                  custom={1}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={deploymentMessages[currentMessageIndex]}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-start w-full gap-2 sm:gap-4 md:gap-6 min-h-[1.5rem] sm:min-h-[2rem] md:min-h-[2.5rem] py-1 sm:py-2 md:py-3"
                    >
                      <span className="bg-gradient-to-r from-[#1a763a] to-[#4CAF50] bg-clip-text text-transparent leading-normal text-left max-w-[300px] xs:max-w-[400px] sm:max-w-none animate-gradient-move">
                        <span className="sm:hidden whitespace-pre-line text-base xs:text-lg leading-tight">
                          {displayedMessage
                            .replace(/ with | Your | the | for | from | and /, '$&\n')
                            .replace(/Scale |Ready |Handle /, '\n$&')}
                        </span>
                        <span className="hidden sm:inline whitespace-nowrap">
                          {displayedMessage}
                        </span>
                      </span>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                <motion.span
                  className="block mt-1 sm:mt-2 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl leading-tight sm:leading-normal text-dark text-left font-extrabold drop-shadow"
                  initial="hidden"
                  animate="visible"
                  variants={heroVariants}
                  custom={2}
                >
                  Xpectrum on Cloud,<br className="sm:hidden" /> On-Premises, or Hybrid
                </motion.span>
                <motion.span
                  className="block mt-0.5 sm:mt-1 text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl text-gray-600 leading-tight sm:leading-normal text-left font-bold drop-shadow-sm"
                  initial="hidden"
                  animate="visible"
                  variants={heroVariants}
                  custom={3}
                >
                  Your Choice,<br className="sm:hidden" /> Our Expertise
                </motion.span>
              </motion.h1>
            </div>
            {/* Animated Bot Icon */}
            <motion.div 
              className={cn(
                "cursor-pointer transition-all duration-300 hidden sm:block mr-20 mt-40 relative",
                isHovered && "scale-110"
              )}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              animate={{
                y: [0, -16, 0],
                rotate: [0, 3, 0, -3, 0],
                scale: [1, 1.08, 1]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.12 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <Bot 
                  size={140} 
                  className="text-[#1a763a] hover:text-[#4CAF50] filter drop-shadow-2xl"
                />
              </motion.div>
              {/* Enhanced glow effect */}
              <div 
                className="absolute inset-0 bg-[#1a763a] opacity-30 blur-3xl rounded-full -z-10 scale-150"
                style={{
                  animation: "glow 3s ease-in-out infinite alternate"
                }}
              />
            </motion.div>
          </div>
        </div>
        <div className="max-w-5xl ml-40 w-full flex flex-col items-start px-2 sm:px-4">
          <motion.div
            className="w-full max-w-xl space-y-4 sm:space-y-6 flex flex-col items-start relative"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            custom={4}
          >
            <div className="h-10 sm:h-12 md:h-16 lg:h-20 relative text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#1a763a] flex items-center justify-start w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={services[index].name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="flex items-center justify-start w-full gap-2 sm:gap-4"
                >
                  <span className="flex-shrink-0 whitespace-nowrap text-left">{services[index].name}</span>
                  <img
                    src={services[index].icon}
                    alt={services[index].name}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain flex-shrink-0"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg text-left px-0 mt-0.5 whitespace-nowrap mb-24">
              Transform financial services processes across every function with Agentic AI.
            </p>
            <motion.button
              className="bg-gradient-to-r from-[#1a763a] to-[#4CAF50] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold shadow-xl hover:from-[#4CAF50] hover:to-[#1a763a] transition duration-300 w-full sm:w-auto text-left flex items-center gap-2 overflow-hidden relative"
              whileHover={{ scale: 1.08, boxShadow: "0 8px 32px rgba(26, 118, 58, 0.18)" }}
              whileTap={{ scale: 0.97 }}
              initial="hidden"
              animate="visible"
              variants={heroVariants}
              custom={5}
            >
              <Bot size={20} className="text-white" /> Hire Xpectrum
              <Shimmer />
            </motion.button>
          </motion.div>
        </div>
        {/* Icons Section */}
        <motion.div
          className="w-full py-8 sm:py-12 mt-8 sm:mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center px-4">
            {/* Feature Card 1 */}
            <motion.div
              className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:bg-green-50 cursor-pointer border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-[#1a763a] group-hover:bg-[#4CAF50] transition-colors duration-300"
                whileHover={{ rotate: 20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <RefreshCw size={32} className="text-white" />
              </motion.div>
              <p className="text-gray-900 text-lg font-medium mt-2">
                One platform to automate<br />many workflows
              </p>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:bg-green-50 cursor-pointer border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-[#4CAF50] group-hover:bg-[#1a763a] transition-colors duration-300"
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Shield size={32} className="text-white" />
              </motion.div>
              <p className="text-gray-900 text-lg font-medium mt-2">
                Compliant with leading<br />industry standards
              </p>
            </motion.div>

            {/* Feature Card 3 */}
            <motion.div
              className="group bg-white rounded-2xl shadow-md p-8 flex flex-col items-center transition-all duration-300 hover:shadow-xl hover:bg-green-50 cursor-pointer border border-gray-100"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.6, delay: 0.45 }}
            >
              <motion.div
                className="w-16 h-16 flex items-center justify-center rounded-full mb-4 bg-[#cce3d4] group-hover:bg-[#4CAF50] transition-colors duration-300"
                whileHover={{ rotate: -20 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              >
                <Target size={32} className="text-[#1a763a] group-hover:text-white transition-colors duration-300" />
              </motion.div>
              <p className="text-gray-900 text-lg font-medium mt-2">
                Above human-level accuracy
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Add FlowchartSection */}
        {/* <FlowchartSection /> */}
      </motion.section>

      {/* Scroll-reveal for main sections */}
      <motion.div
        ref={sectionRef}
        initial="hidden"
        animate={sectionControls}
        variants={{
          hidden: { opacity: 0, y: 40 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
        }}
      >
        {/* Multiply Workforce Section - Optimized Animation */}
        <div
          ref={workforceRef}
          className="w-full py-12 sm:py-16 px-4 sm:px-6 md:px-12 relative z-10 apply-grid-pattern"
        >
          <motion.div
            className="text-center mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isWorkforceInView ? 1 : 0, y: isWorkforceInView ? 0 : 20 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-xpectrum-purple font-medium tracking-wide uppercase mb-2 text-sm sm:text-base">WHY HIRE XPECTRUM</h3>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
              Multiply your workforce<br />in minutes
            </h1>
          </motion.div>

          <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 px-4">
            <motion.div
              className="w-full md:w-2/5"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: isWorkforceInView ? 1 : 0, x: isWorkforceInView ? 0 : -30 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 mr-4 text-[#1a763a]">
                  <motion.svg
                    viewBox="0 0 100 100"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                  >
                    <motion.circle
                      cx="50" cy="50" r="40"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                      transition={{ duration: 1 }}
                    />
                    <motion.path
                      d="M30,50 L45,65 L70,35"
                      stroke="currentColor"
                      strokeWidth="6"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: isWorkforceInView ? 1 : 0 }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </motion.svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#1a763a]">Solution</h2>
              </div>

              <p className="text-gray-700 text-base sm:text-lg mb-6">
                At Xpectrum, we are building a cutting-edge Multimodal LLM Agentic System designed to go beyond traditional AI. Our platform understands deep sentiment, maintains contextual memory, and executes tasks autonomously—transforming how enterprises operate by eliminating manual dependencies and enabling intelligent automation at scale.
              </p>

              <motion.button
                className="bg-[#1a763a] hover:bg-[#4CAF50] text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full font-medium transition duration-300 w-full sm:w-auto"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore integrations
              </motion.button>
            </motion.div>

            <motion.div
              className="w-full md:w-3/5 flex overflow-hidden h-[20rem] sm:h-[24rem] md:h-[32rem]"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: isWorkforceInView ? 1 : 0, x: isWorkforceInView ? 0 : 30 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="w-1/2 overflow-hidden relative h-full px-1 sm:px-2">
                <motion.div
                  ref={leftContentRef}
                  className="absolute w-full"
                  animate={{
                    y: [0, -leftHeight || -800]
                  }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear"
                    }
                  }}
                >
                  {[...leftContent, ...leftContent].map((item, index) => (
                    <Card key={`left-${index}`} title={item} className="mb-3 sm:mb-4" />
                  ))}
                </motion.div>
              </div>

              <div className="w-1/2 overflow-hidden relative h-full px-1 sm:px-2">
                <motion.div
                  ref={rightContentRef}
                  className="absolute w-full"
                  animate={{
                    y: [-rightHeight || -800, 0]
                  }}
                  transition={{
                    y: {
                      repeat: Infinity,
                      repeatType: "loop",
                      duration: 30,
                      ease: "linear"
                    }
                  }}
                >
                  {[...rightContent, ...rightContent].map((item, index) => (
                    <Card key={`right-${index}`} title={item} className="mb-3 sm:mb-4" />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Universal AI Employee Section - Optimized Animation */}
      <div
        ref={universalRef}
        className="flex flex-col md:flex-row items-center w-full py-12 sm:py-16 px-4 sm:px-6 relative z-10 apply-grid-pattern"
      >
        <motion.div
          className="w-full md:w-1/2 md:ml-12 lg:ml-24 md:pr-8 text-center md:text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUniversalInView ? 1 : 0, y: isUniversalInView ? 0 : 20 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-[#1a763a] text-xl sm:text-2xl font-medium mb-2">Xpectrum</p>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-dark leading-tight mb-6 sm:mb-8">
            Your Universal AI<br />Employee
          </h1>
          <motion.button
            className="bg-[#1a763a] hover:bg-[#4CAF50] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium text-base sm:text-lg transition duration-300 w-full sm:w-auto"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Hire Xpectrum today
          </motion.button>
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 mt-8 sm:mt-10 md:mt-0 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isUniversalInView ? 1 : 0, y: isUniversalInView ? 0 : 20 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div className="relative w-full max-w-[280px] sm:max-w-lg aspect-square">
            <motion.div
              className="absolute inset-0 bg-[#1a763a] rounded-full flex items-center justify-center overflow-hidden"
              animate={{
                scale: [1, 1.03, 1],
                boxShadow: [
                  "0 0 0 rgba(26, 118, 58, 0.4)",
                  "0 0 15px rgba(26, 118, 58, 0.5)",
                  "0 0 0 rgba(26, 118, 58, 0.4)"
                ]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ rotate: 360 }}
                transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
              >
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full border border-white rounded-full"
                    style={{ width: `${100 - i * 10}%`, height: `${100 - i * 10}%` }}
                  />
                ))}
              </motion.div>

              <div className="text-white text-center px-4 sm:px-8 text-xl sm:text-2xl md:text-3xl font-medium leading-tight z-10">
                Think the<br /><span className="text-[#4CAF50]">Unthinkable</span><br />with us
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* === REMOVED How Xpectrum Works Section (Dynamic) === */}
      {/* <motion.div ... > ... </motion.div> */}

      {/* Global styles */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s forwards;
        }
        
        .animate-fade-in-permanent {
          opacity: 0;
          animation: fade-in 0.8s forwards;
        }
        
        .animate-visible {
          opacity: 1;
          transform: translateY(0);
          transition: opacity 0.6s, transform 0.6s;
        }
        
        .animate-on-scroll {
          opacity: 0;
          transform: translateY(20px);
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        html {
          scroll-behavior: smooth;
        }
        
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(26, 118, 58, 0.6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(26, 118, 58, 0.8);
        }

        /* Enhanced Background Styles */
        .background-gradient-container {
          --gradient-color-1: #FFF9E6; /* Warm cream */
          --gradient-color-2: #FFFFFF; /* White */
          --gradient-color-3: #FFF9E6; /* Warm cream */
          --gradient-color-4: #FFFFFF; /* White */

          background: linear-gradient(
            -45deg,
            var(--gradient-color-1),
            var(--gradient-color-2),
            var(--gradient-color-3),
            var(--gradient-color-4)
          );
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
          overflow: hidden;
          position: relative;
        }

        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Enhanced Noise Overlay */
        .background-gradient-container::after {
          content: "";
          position: absolute;
          inset: -100%;
          background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)"/></svg>');
          opacity: 0.04; /* Slightly increased noise intensity */
          pointer-events: none;
          animation: noiseAnim 0.5s infinite steps(1);
          z-index: 0;
        }
        
        @keyframes noiseAnim {
          0% { transform: translate(2px, 3px); }
          10% { transform: translate(-2px, -3px); }
          20% { transform: translate(3px, -2px); }
          30% { transform: translate(-3px, 2px); }
          40% { transform: translate(2px, 2px); }
          50% { transform: translate(-2px, -2px); }
          60% { transform: translate(3px, 3px); }
          70% { transform: translate(-3px, -3px); }
          80% { transform: translate(2px, -3px); }
          90% { transform: translate(-2px, 3px); }
          100% { transform: translate(3px, -2px); }
        }

        /* Floating particles */
        @keyframes float-particle {
          0%, 100% { transform: translate(0, 0); }
          25% { transform: translate(5px, 5px); }
          50% { transform: translate(10px, 0); }
          75% { transform: translate(5px, -5px); }
        }

        /* Grid Pattern */
        .apply-grid-pattern::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(to right, rgba(26, 118, 58, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(26, 118, 58, 0.08) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        
        /* Ensure content sections with backgrounds appear above the fixed background */
        nav { z-index: 50; }

        /* Extra small screen support */
        @media (max-width: 360px) {
          .xs\\:text-lg {
            font-size: 1.125rem;
          }
          .xs\\:text-base {
            font-size: 1rem;
          }
          .xs\\:max-w-\\[400px\\] {
            max-width: 280px;
          }
          .xs\\:h-28 {
            height: 5rem;
          }
        }

        /* Better line height control for mobile */
        .leading-tight {
          line-height: 1.3;
        }

        .truncate {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @keyframes glow {
          0% {
            transform: scale(0.8);
            opacity: 0.2;
          }
          100% {
            transform: scale(1.2);
            opacity: 0.3;
          }
        }

        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradientMove 3s linear infinite alternate;
        }
      `}</style>
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {Array.from({ length: 15 }).map((_, index) => (
          <div 
            key={index}
            className="absolute rounded-full"
            style={{
              width: `${Math.random() * 5 + 2}px`,
              height: `${Math.random() * 5 + 2}px`,
              background: `rgba(26, 118, 58, ${Math.random() * 0.15 + 0.05})`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-particle ${Math.random() * 10 + 10}s infinite alternate ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              filter: "blur(1px)",
              transform: "translate3d(0,0,0)"
            }}
          />
        ))}
      </div>

      
      {/* Chat Modal Overlay and ChatComponent */}
      {!isChatOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center">
          <div onClick={e => e.stopPropagation()}>
            <ChatComponentXpectrumDemo />
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;