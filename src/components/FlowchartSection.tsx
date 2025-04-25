import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar, ResponsiveContainer } from 'recharts';
import ReactDOM from 'react-dom';

const FlowchartSection: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFlow, setActiveFlow] = useState<number>(0);
  const [flowComplete, setFlowComplete] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<'agent' | 'analytics'>('agent');
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const clearSvgTimeout = useRef<NodeJS.Timeout | null>(null);
  const transitionTimer = useRef<NodeJS.Timeout | null>(null);

  const analyticsData = [
    {
      source: "HRMS Analytics",
      steps: [
        "Analyze query",
        "Retrieve Usefull Info",
        "Present Analytics"
      ],
      color: "#F59E0B", // Amber
      hoverColor: "#D97706",
      icon: "📊"
    },
    {
      source: "Insurance Analytics",
      steps: [
        "Analyze query",
        "Retrieve Usefull Info",
        "Present Analytics"
      ],
      color: "#F59E0B",
      hoverColor: "#D97706",
      icon: "📊"
    },
    {
      source: "Hospitality Analytics",
      steps: [
        "Analyze query",
        "Retrieve Usefull Info",
        "Present Analytics"
      ],
      color: "#F59E0B",
      hoverColor: "#D97706",
      icon: "📊"
    }
  ];

  const flowData = [
    {
      source: "HR AI Agent",
      steps: [
        "Employee Info",
        "Salary Details",
        "Tax Structure",
        "PTO Balance",
        "Daily Salary",
        "Salary Deduction"
      ],
      color: "#3B82F6", // Blue
      hoverColor: "#2563EB",
      icon: "👨‍💼"
    },
    {
      source: "Insurance AI Agent",
      steps: [
        "Validate Input",
        "Search most suitable plans",
        "Meet Requirements"
      ],
      color: "#10B981", // Green
      hoverColor: "#059669",
      icon: "🏥"
    },
    {
      source: "Hospitality AI Agent",
      steps: [
        "Validate Input",
        "Find Hotels",
        "Meet Requirements"
      ],
      color: "#6366F1", // Indigo
      hoverColor: "#4F46E5",
      icon: "🏨"
    }
  ];

  // Separate analytics flow data
  const analyticsFlow = {
    source: "Analytics",
    steps: [
      "Analyze query",
      "Retrieve Usefull Info",
      "Present Analytics"
    ],
    color: "#F59E0B", // Amber
    hoverColor: "#D97706",
    icon: "📊"
  };

  const resetSVG = () => {
    if (svgRef.current) {
      // Remove the old SVG element completely
      const oldSvg = svgRef.current;
      const parent = oldSvg.parentNode;
      if (parent) {
        // Create new SVG element
        const newSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        newSvg.setAttribute('class', 'w-full h-full');
        newSvg.style.transition = 'opacity 0.3s ease-in-out';
        newSvg.style.opacity = '0.7'; // Start with partial opacity instead of 0
        
        // Replace old SVG with new one
        parent.replaceChild(newSvg, oldSvg);
        svgRef.current = newSvg;

        // Force a reflow using getBoundingClientRect()
        void newSvg.getBoundingClientRect();
        
        // Fade in the new SVG
        setTimeout(() => {
          newSvg.style.opacity = '1';
        }, 50);
      }
    }
  };

  const cleanupTransition = () => {
    if (transitionTimer.current) {
      clearTimeout(transitionTimer.current);
      transitionTimer.current = null;
    }
  };

  const cleanupAnimations = () => {
    // Clear all timeouts
    if (animationTimer.current) {
      clearTimeout(animationTimer.current);
      animationTimer.current = null;
    }
    if (clearSvgTimeout.current) {
      clearTimeout(clearSvgTimeout.current);
      clearSvgTimeout.current = null;
    }
    cleanupTransition();

    setAnimating(false);
    setFlowComplete(false);
  };

  useEffect(() => {
    cleanupAnimations();
    resetSVG();
    
    // Reset to main workflow view when mounting
    if (!selectedNode) {
      setSelectedNode('agent');
    }
    
    const startTimeout = setTimeout(() => {
      startFlowAnimation();
    }, 100);

    return () => {
      clearTimeout(startTimeout);
      cleanupAnimations();
    };
  }, [activeFlow, selectedNode]);

  const getNextFlowIndex = (currentIndex: number) => {
    // HRMS (0) -> Insurance (1) -> Hospitality (2) -> HRMS (0)
    switch(currentIndex) {
      case 0: return 1;  // HRMS -> Insurance
      case 1: return 2;  // Insurance -> Hospitality
      case 2: return 0;  // Hospitality -> HRMS
      default: return 0;
    }
  };

  const handleFlowSelection = (index: number) => {
    cleanupTransition();
    setFlowComplete(false);
    if (index !== activeFlow) {
      cleanupAnimations();
      
      if (svgRef.current) {
        // Instead of setting opacity to 0, use a smoother transition
        svgRef.current.style.opacity = '0.7';
        clearSvgTimeout.current = setTimeout(() => {
          setSelectedNode('agent'); // Always set to main workflow when changing flows
          setActiveFlow(index);
          resetSVG();
          startFlowAnimation();
          // Fade back in smoothly
          if (svgRef.current) {
            svgRef.current.style.opacity = '1';
          }
        }, 150); // Reduced timeout for smoother transition
      }
    }
  };

  const handleNodeClick = (node: 'agent' | 'analytics') => {
    cleanupTransition();
    if (node !== selectedNode) {
      // Don't cleanup animations when switching to preserve state
      setSelectedNode(node);
      if (svgRef.current) {
        // Instead of fading out completely, reduce opacity slightly to show transition
        svgRef.current.style.opacity = '0.7';
        clearSvgTimeout.current = setTimeout(() => {
          // Preserve existing elements and just update their positions
          startFlowAnimation();
          // Fade back in
          if (svgRef.current) {
            svgRef.current.style.opacity = '1';
          }
        }, 150); // Reduced timeout for smoother transition
      }
    }
  };

  const startFlowAnimation = () => {
    if (!svgRef.current) return;
    const svg = svgRef.current;
    
    // Create defs element for gradients
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
    
    // Only reset SVG if it's a fresh start or flow change
    if (!animating) {
      // Setup SVG dimensions and viewBox
      svg.setAttribute('viewBox', '0 0 2000 800');
      
      // Create unique ID for this instance
      const uniqueId = `gradient-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create background gradient with unique ID
      const backgroundGradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      backgroundGradient.setAttribute('id', uniqueId);
      backgroundGradient.setAttribute('x1', '0%');
      backgroundGradient.setAttribute('y1', '0%');
      backgroundGradient.setAttribute('x2', '100%');
      backgroundGradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#1E293B');
      backgroundGradient.appendChild(stop1);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#0F172A');
      backgroundGradient.appendChild(stop2);
      
      defs.appendChild(backgroundGradient);

      // Create background
      const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      background.setAttribute('x', '0');
      background.setAttribute('y', '0');
      background.setAttribute('width', '2000');
      background.setAttribute('height', '1000');
      background.setAttribute('fill', `url(#${uniqueId})`);
      svg.appendChild(background);
    }
    
    // Adjust starting positions for better layout
    const startX = 120;
    const startY = 400;
    const engineX = 500;
    const engineY = startY;
    const chatX = 1500;
    const chatY = startY;
    const analyticsX = 120;
    const analyticsY = startY + 180;

    setAnimating(true);

    // Setup SVG dimensions and viewBox
    svg.setAttribute('viewBox', '0 0 2000 800');
    
    // Create subtle grid lines with animation
    for (let i = 0; i < 32; i++) {
      const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      horizontalLine.setAttribute('x1', '0');
      horizontalLine.setAttribute('y1', `${i * 40}`);
      horizontalLine.setAttribute('x2', '2000');
      horizontalLine.setAttribute('y2', `${i * 40}`);
      horizontalLine.setAttribute('stroke', 'rgba(99, 102, 241, 0.1)');
      horizontalLine.setAttribute('stroke-width', '1');
      horizontalLine.style.opacity = '0';
      horizontalLine.setAttribute('pointer-events', 'none'); // Prevent interaction with lines
      svg.insertBefore(horizontalLine, svg.firstChild); // Place lines behind other elements

      const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      verticalLine.setAttribute('x1', `${i * 70}`);
      verticalLine.setAttribute('y1', '0');
      verticalLine.setAttribute('x2', `${i * 70}`);
      verticalLine.setAttribute('y2', '800');
      verticalLine.setAttribute('stroke', 'rgba(99, 102, 241, 0.1)');
      verticalLine.setAttribute('stroke-width', '1');
      verticalLine.style.opacity = '0';
      verticalLine.setAttribute('pointer-events', 'none'); // Prevent interaction with lines
      svg.insertBefore(verticalLine, svg.firstChild); // Place lines behind other elements

      setTimeout(() => {
        horizontalLine.style.transition = 'opacity 0.5s ease-in-out';
        verticalLine.style.transition = 'opacity 0.5s ease-in-out';
        horizontalLine.style.opacity = '1';
        verticalLine.style.opacity = '1';
      }, i * 50);
    }

    // Current flow data
    const flow = selectedNode === 'analytics' ? analyticsData[activeFlow] : flowData[activeFlow];
    
    // Setup the animation timing
    const animationDelay = 600;
    const pathAnimationDuration = 800;
    
    // Display the flow title with enhanced styling
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '1000');
    title.setAttribute('y', '100');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial');
    title.setAttribute('font-size', '42');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', selectedNode === 'analytics' ? analyticsFlow.color : flowData[activeFlow].color);
    title.textContent = selectedNode === 'analytics' 
      ? `${flowData[activeFlow].source} Analytics Workflow`
      : `${flowData[activeFlow].source} Workflow`;
    title.style.filter = 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.3))';
    svg.appendChild(title);

    // MAJOR CHANGE: Create chat interface first with query message
    setTimeout(() => {
      createChatInterface(chatX, chatY, flow.color);
      
      // Show query message immediately
      setTimeout(() => {
        showQueryMessage(chatX, chatY, flow.color);
      }, 300);
    }, 500);

    // REORDERED: Start showing the main workflow components after query is shown
    setTimeout(() => {
      // Always create both nodes
      createSourceNode(flowData[activeFlow].source, startX, startY - 80, flowData[activeFlow].color, flowData[activeFlow].icon, false);
      createSourceNode("Analytics", analyticsX, analyticsY, analyticsFlow.color, analyticsFlow.icon, true);

      // Create workflow engine
      setTimeout(() => {
        createEngineContainer(engineX, engineY, selectedNode === 'analytics' ? analyticsFlow.color : flowData[activeFlow].color);
        
        setTimeout(() => {
          // Create connections based on selected node
          if (selectedNode === 'analytics') {
            // Only create analytics connection
            const analyticsPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            analyticsPath.setAttribute('d', `M${analyticsX + 140} ${analyticsY + 10} L${engineX - 120} ${analyticsY + 10}`);
            analyticsPath.setAttribute('stroke', analyticsFlow.color);
            analyticsPath.setAttribute('stroke-width', '4');
            analyticsPath.setAttribute('fill', 'none');
            analyticsPath.style.filter = 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.4))';
            svg.appendChild(analyticsPath);
            animatePath(analyticsPath);
          } else {
            // Only create main flow connection
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${startX + 140} ${startY - 80 + 10} L${engineX - 120} ${startY - 80 + 10}`);
            path.setAttribute('stroke', flowData[activeFlow].color);
            path.setAttribute('stroke-width', '4');
            path.setAttribute('fill', 'none');
            path.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))';
            svg.appendChild(path);
            animatePath(path);
          }

          // Begin workflow steps after path is animated
          setTimeout(() => {
            if (selectedNode === 'analytics') {
              // Show analytics workflow
              const centerX = engineX + 180;
              const stepsLayout = [
                { x: centerX, y: engineY - 140 },
                { x: centerX, y: engineY },
                { x: centerX, y: engineY + 140 }
              ];

              analyticsFlow.steps.forEach((step, index) => {
                setTimeout(() => {
                  createStepNode(step, stepsLayout[index].x, stepsLayout[index].y, analyticsFlow.color, index);
                  
                  if (index > 0) {
                    const prevStep = stepsLayout[index - 1];
                    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    path.setAttribute('d', `M${prevStep.x + 45} ${prevStep.y + 70} L${stepsLayout[index].x + 45} ${stepsLayout[index].y}`);
                    path.setAttribute('stroke', analyticsFlow.color);
                    path.setAttribute('stroke-width', '2');
                    path.setAttribute('fill', 'none');
                    svg.appendChild(path);
                    animatePath(path);
                  }

                  if (index === analyticsFlow.steps.length - 1) {
                    setTimeout(() => {
                      const finalPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                      finalPath.setAttribute('d', `M${stepsLayout[index].x + 80} ${stepsLayout[index].y + 35} C${stepsLayout[index].x + 160} ${stepsLayout[index].y + 35}, ${chatX - 280} ${chatY + 35}, ${chatX - 250} ${chatY + 35}`);
                      finalPath.setAttribute('stroke', analyticsFlow.color);
                      finalPath.setAttribute('stroke-width', '4');
                      finalPath.setAttribute('fill', 'none');
                      svg.appendChild(finalPath);
                      animatePath(finalPath);

                      setTimeout(() => {
                        showResponseMessage(chatX, chatY, analyticsFlow.color);
                      }, pathAnimationDuration + 200);
                    }, 800);
                  }
                }, index * animationDelay);
              });
            } else {
              // Show main workflow steps
              createAndAnimateWorkflowSteps(flowData[activeFlow], engineX, engineY, chatX, chatY);
            }
          }, pathAnimationDuration + 200);
        }, 500);
      }, 500);
    }, 2000); // Start main flow after query message is shown

    // Function to show query message with enhanced styling
    function showQueryMessage(x: number, y: number, color: string) {
      const groupMessages = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Query bubble with themed background color
      const messageBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      messageBg.setAttribute('x', `${x - 180}`);
      messageBg.setAttribute('y', `${y - 250}`);
      messageBg.setAttribute('width', '560');
      messageBg.setAttribute('height', selectedNode === 'analytics' ? '90' : '160');
      messageBg.setAttribute('rx', '20');
      messageBg.setAttribute('ry', '20');
      // Set background color based on active flow
      const bgColor = activeFlow === 0 
        ? '#3B82F6'  // Blue for HRMS
        : activeFlow === 1 
          ? '#10B981'  // Green for Insurance
          : '#6366F1'; // Violet/Indigo for Hospitality
      messageBg.setAttribute('fill', bgColor);
      messageBg.setAttribute('opacity', '0.95');
      messageBg.style.filter = 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))';
      groupMessages.appendChild(messageBg);

      // Add user profile logo circle - Outside container, right side
      const userCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      userCircle.setAttribute('cx', `${x + 440}`);
      userCircle.setAttribute('cy', `${y - 250 + (selectedNode === 'analytics' ? 90 : 160) / 2}`);
      userCircle.setAttribute('r', '20');
      userCircle.setAttribute('fill', activeFlow === 0 ? '#3B82F6' : activeFlow === 1 ? '#10B981' : '#6366F1');
      groupMessages.appendChild(userCircle);

      // Add profile icon - Outside container, right side
      const userIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      userIcon.setAttribute('x', `${x + 440}`);
      userIcon.setAttribute('y', `${y - 250 + (selectedNode === 'analytics' ? 90 : 160) / 2}`);
      userIcon.setAttribute('text-anchor', 'middle');
      userIcon.setAttribute('dominant-baseline', 'middle');
      userIcon.setAttribute('font-family', 'Arial');
      userIcon.setAttribute('font-size', '16');
      userIcon.setAttribute('fill', '#FFFFFF');
      userIcon.textContent = '👤';
      groupMessages.appendChild(userIcon);
      
      const messageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      messageText.setAttribute('x', `${x - 120}`);
      messageText.setAttribute('y', selectedNode === 'analytics' ? `${y - 210}` : `${y - 220}`);
      messageText.setAttribute('font-family', 'Arial');
      messageText.setAttribute('font-size', selectedNode === 'analytics' ? '24' : '15');
      messageText.setAttribute('fill', '#FFFFFF'); // Changed from #F97316 (orange) to #FFFFFF (white)
      messageText.style.filter = 'drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4))';
      
      const query = selectedNode === 'analytics' 
        ? "can you please tell me how to improve the employee experience"
        : activeFlow === 0 
          ? "Hey I'm thinking to take some vacation days leave around 35 days for coming May can you please check my PTO balance and let me know how much I need to take unpaid leave and if I take how much salary would be deducted from my account please let me know so my employee id is EM69514"
          : activeFlow === 1
            ? "I am 35 years old and currently exploring insurance plans. My primary goal is to ensure financial security for my family of three in the event that something unforeseen happens to me in the future. Could you please recommend a suitable plan from your offerings that would provide comprehensive coverage, ideally around $10 million?"
            : "Hey! I'm planning a trip to Dubai and looking to stay for 5 days starting from April 12th. My budget is up to $200 per night for two people. I'll be driving, so I need a hotel that offers parking, and I'll also be bringing my pets along, so it needs to be pet-friendly. Can you show me some good options that fit these requirements?";

      // Adjust maxWidth based on font size and view
      const maxWidth = selectedNode === 'analytics' ? 40 : 60;
      let line = '';
      let yOffset = 0;
      
      query.split(' ').forEach(word => {
        if ((line + word).length > maxWidth) {
          const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
          tspan.setAttribute('x', `${x - 120}`);
          tspan.setAttribute('dy', yOffset === 0 ? '0' : selectedNode === 'analytics' ? '32' : '22');
          tspan.textContent = line.trim();
          messageText.appendChild(tspan);
          line = word + ' ';
          yOffset += selectedNode === 'analytics' ? 32 : 22;
        } else {
          line += word + ' ';
        }
      });
      
      if (line.trim()) {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', `${x - 120}`);
        tspan.setAttribute('dy', yOffset === 0 ? '0' : selectedNode === 'analytics' ? '32' : '22');
        tspan.textContent = line.trim();
        messageText.appendChild(tspan);
      }
      
      groupMessages.appendChild(messageText);
      groupMessages.style.opacity = '0';
      svg.appendChild(groupMessages);
      
      fadeIn(groupMessages);
    }

    // Function to show response message with enhanced styling
    function showResponseMessage(x: number, y: number, color: string) {
      if (selectedNode === 'analytics') {
        const groupResponse = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const responseBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        responseBg.setAttribute('x', `${x - 180}`);
        responseBg.setAttribute('y', `${y - 70}`);
        responseBg.setAttribute('width', '600'); // Increased response width
        responseBg.setAttribute('height', '350');
        responseBg.setAttribute('rx', '20');
        responseBg.setAttribute('ry', '20');
        responseBg.setAttribute('fill', '#1E293B');
        responseBg.setAttribute('opacity', '0.95');
        responseBg.style.filter = 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))';
        groupResponse.appendChild(responseBg);

        // Add bot logo circle - Outside response container but inside chat container
        const botCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        botCircle.setAttribute('cx', `${x - 220}`);
        botCircle.setAttribute('cy', `${y - 90}`);
        botCircle.setAttribute('r', '24'); // Increased size
        botCircle.setAttribute('fill', activeFlow === 0 ? '#3B82F6' : activeFlow === 1 ? '#10B981' : '#6366F1');
        groupResponse.appendChild(botCircle);

        // Add bot icon - Outside response container but inside chat container
        const botIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        botIcon.setAttribute('x', `${x - 220}`);
        botIcon.setAttribute('y', `${y - 90}`);
        botIcon.setAttribute('text-anchor', 'middle');
        botIcon.setAttribute('dominant-baseline', 'middle');
        botIcon.setAttribute('font-family', 'Arial');
        botIcon.setAttribute('font-size', '20'); // Increased size
        botIcon.setAttribute('fill', '#FFFFFF');
        botIcon.textContent = '🤖';
        groupResponse.appendChild(botIcon);

        // Create a foreign object to embed React component with adjusted position
        const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        foreignObject.setAttribute('x', `${x - 160}`); // Adjusted to avoid overlap with bot icon
        foreignObject.setAttribute('y', `${y - 60}`);
        foreignObject.setAttribute('width', '580');
        foreignObject.setAttribute('height', '330');

        // Create div container for React component
        const div = document.createElement('div');
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.overflow = 'hidden';

        // Render appropriate dashboard based on activeFlow
        const dashboardComponent = activeFlow === 0 
          ? <ImprovedHRMSDashboard />
          : activeFlow === 1
            ? <ImprovedInsuranceDashboard />
            : <ImprovedHospitalityDashboard />;

        // Render React component into the div
        ReactDOM.render(dashboardComponent, div);
        foreignObject.appendChild(div);
        groupResponse.appendChild(foreignObject);

        svg.appendChild(groupResponse);
        groupResponse.style.opacity = '0';
        
        fadeIn(groupResponse, () => {
          setFlowComplete(true);
          setAnimating(false);
        });
        return;
      }
      const groupResponse = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      groupResponse.setAttribute('clip-path', 'url(#chat-clip)');
      
      // Response bubble with consistent dark background
      const responseBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      responseBg.setAttribute('x', `${x - 180}`);
      responseBg.setAttribute('y', `${y - 70}`);
      responseBg.setAttribute('width', '600'); // Increased response width
      responseBg.setAttribute('height', '450');
      responseBg.setAttribute('rx', '20');
      responseBg.setAttribute('ry', '20');
      responseBg.setAttribute('fill', '#1E293B');
      responseBg.setAttribute('opacity', '0.95');
      responseBg.style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.2))';
      groupResponse.appendChild(responseBg);

      // Add bot logo circle - Outside container, left side
      // Add bot logo circle - Inside container, left side
      const botCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      botCircle.setAttribute('cx', `${x - 210}`);
      botCircle.setAttribute('cy', `${y - 30}`);
      botCircle.setAttribute('r', '20');
      botCircle.setAttribute('fill', activeFlow === 0 ? '#3B82F6' : activeFlow === 1 ? '#10B981' : '#6366F1');
      groupResponse.appendChild(botCircle);

      // Add bot icon - Inside container
      const botIcon = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      botIcon.setAttribute('x', `${x - 210}`);
      botIcon.setAttribute('y', `${y - 30}`);
      botIcon.setAttribute('text-anchor', 'middle');
      botIcon.setAttribute('dominant-baseline', 'middle');
      botIcon.setAttribute('font-family', 'Arial');
      botIcon.setAttribute('font-size', '16');
      botIcon.setAttribute('fill', '#FFFFFF');
      botIcon.textContent = '🤖';
      groupResponse.appendChild(botIcon);

      // Add response text with improved formatting and adjusted position
      const responseText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      responseText.setAttribute('x', `${x - 100}`); // Adjusted from -120 to -100
      responseText.setAttribute('y', `${y - 30}`); // Adjusted from -40 to -30
      responseText.setAttribute('font-family', 'Arial');
      responseText.setAttribute('font-size', '14');
      responseText.setAttribute('fill', '#FFFFFF');
      responseText.style.filter = 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))';
      
      // Get response text based on active flow with enhanced formatting
      type ResponseLine = [string, boolean, string, string?];
      
      const responseLines: ResponseLine[] = activeFlow === 0 
        ? [
            ["PTO Balance", true, '24', color],
            ["Annual Leave: 17 days", false, '16', '#E2E8F0'],
            ["Sick Leave: 5 days", false, '16', '#E2E8F0'],
            ["", false, '14'],
            ["You currently have 17 days of annual leave available. To take a 35-day vacation,", false, '14', '#FFFFFF'],
            ["you would need an additional 18 days of unpaid leave.", false, '14', '#FFFFFF'],
            ["", false, '14'],
            ["Your daily salary for May is $227.00. With 18 days of unpaid leave:", true, '16', color],
            ["Unpaid Leave Days: 18", false, '14', '#E2E8F0'],
            ["Daily Salary: $227.00", false, '14', '#E2E8F0'],
            ["Total Deduction: $4,086.00", true, '16', '#FF6B6B'],
            ["", false, '14'],
            ["Additional information for the calculation of daily salary for May:", true, '16', color],
            ["Annual Base Salary: $98,116.94", false, '14', '#E2E8F0'],
            ["Annual Total Tax: $22,937.08", false, '14', '#E2E8F0'],
            ["Annual Insurance Premium: $1,989.36", false, '14', '#E2E8F0'],
            ["Annual 401k Contribution: $10,537.76", false, '14', '#E2E8F0'],
            ["Annual Net Salary: $62,652.74", true, '16', '#4ADE80'],
            ["", false, '14'],
            ["Monthly Net Salary: $5,221.06", true, '16', '#4ADE80'],
            ["Daily Net Salary: $227.00", true, '16', '#4ADE80']
          ]
        : activeFlow === 1
        ? [
            ["Available Insurance Plans", true, '24', color],
            ["For a 35-year-old", false, '16', '#E2E8F0'],
            ["", false, '14'],
            ["Lifetime Secure Plus", true, '18', color],
            ["Maximum Coverage: $1,000,000", false, '16', '#4ADE80'],
            ["Term Length: Up to 20 years", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["Secure Shield Term Plan", true, '18', color],
            ["Maximum Coverage: $750,000", false, '16', '#4ADE80'],
            ["Term Length: Up to 20 years", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["Elite Life Protector", true, '18', color],
            ["Maximum Coverage: $2,000,000", false, '16', '#4ADE80'],
            ["Term Length: Up to 25 years", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["Ultimate Shield", true, '18', color],
            ["Maximum Coverage: $5,000,000", false, '16', '#4ADE80'],
            ["Term Length: Up to 25 years", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["Whole Life Secure", true, '18', color],
            ["Maximum Coverage: $3,000,000", false, '16', '#4ADE80'],
            ["Term Length: 30 years", false, '14', '#E2E8F0']
          ]
        : [
            ["Available Hotels in Dubai", true, '24', color],
            ["April 12th - April 17th • 2 People • Pet-friendly", false, '16', '#E2E8F0'],
            ["", false, '14'],
            ["Fortune Grand Hotel Dubai", true, '18', color],
            ["Price: $38 per night", true, '16', '#4ADE80'],
            ["Check-in: 3:00 PM", false, '14', '#E2E8F0'],
            ["Check-out: 12:00 PM", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["SKY HOTEL APARTMENTS", true, '18', color],
            ["Price: $43 per night", true, '16', '#4ADE80'],
            ["Check-in: 2:00 PM", false, '14', '#E2E8F0'],
            ["Check-out: 12:00 PM", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["Mercure Gold Hotel Al Mina Road Dubai", true, '18', color],
            ["Price: $53 per night", true, '16', '#4ADE80'],
            ["Check-in: 2:00 PM", false, '14', '#E2E8F0'],
            ["Check-out: 12:00 PM", false, '14', '#E2E8F0'],
            ["", false, '14'],
            ["City Seasons Towers Hotel Dubai", true, '18', color],
            ["Price: $62 per night", true, '16', '#4ADE80'],
            ["Check-in: 3:00 PM", false, '14', '#E2E8F0'],
            ["Check-out: 12:00 PM", false, '14', '#E2E8F0']
          ];
      
      // Add lines with enhanced styling
      let yOffset = 0;
      responseLines.forEach(([line, isBold, fontSize, textColor = '#FFFFFF']) => {
        const tspan = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan.setAttribute('x', `${x - 160}`);
        tspan.setAttribute('dy', yOffset === 0 ? '0' : '24');
        tspan.setAttribute('font-size', fontSize);
        if (isBold) tspan.setAttribute('font-weight', 'bold');
        tspan.setAttribute('fill', textColor);
        tspan.textContent = line;
        responseText.appendChild(tspan);
        yOffset += 24;
      });
      
      groupResponse.appendChild(responseText);
      svg.appendChild(groupResponse);
      
      // Add typing animation dots
      const typingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const dots = [0, 1, 2].map(i => {
        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('cx', `${x - 170 + i * 15}`);
        dot.setAttribute('cy', `${y - 40}`);
        dot.setAttribute('r', '4');
        dot.setAttribute('fill', color);
        typingGroup.appendChild(dot);
        return dot;
      });
      
      svg.appendChild(typingGroup);
      
      // Animate typing dots
      let dotOpacity = 0;
      const dotInterval = setInterval(() => {
        dotOpacity = dotOpacity === 1 ? 0 : 1;
        dots.forEach((dot, i) => {
          setTimeout(() => {
            dot.setAttribute('opacity', dotOpacity.toString());
          }, i * 150);
        });
      }, 600);
      
      // Create response content but keep it hidden
      groupResponse.style.opacity = '0';
      
      // Modified timing for full response animation
      setTimeout(() => {
        clearInterval(dotInterval);
        svg.removeChild(typingGroup);
        fadeIn(groupResponse, () => {
          setFlowComplete(true);
          setAnimating(false);
        });
      }, 2400);
    }

    // Function to create and animate all workflow steps
    function createAndAnimateWorkflowSteps(flow: typeof flowData[0], engineX: number, engineY: number, chatX: number, chatY: number) {
      const stepStartY = engineY - 140;
      const stepStartX = engineX + 40;
      
      let stepsLayout: { x: number, y: number }[] = [];
      
      if (selectedNode === 'analytics') {
        // Vertical layout for analytics flow
        const centerX = engineX + 180;
        stepsLayout = [
          { x: centerX, y: stepStartY },
          { x: centerX, y: stepStartY + 140 },
          { x: centerX, y: stepStartY + 280 }
        ];
      } else if (activeFlow === 0) { // HRMS - restore original 2x3 grid layout
        stepsLayout = [
          // First row
          { x: stepStartX, y: stepStartY },
          { x: stepStartX + 220, y: stepStartY },
          // Second row
          { x: stepStartX, y: stepStartY + 140 },
          { x: stepStartX + 220, y: stepStartY + 140 },
          // Third row
          { x: stepStartX, y: stepStartY + 280 },
          { x: stepStartX + 220, y: stepStartY + 280 }
        ];
      } else if (activeFlow === 1) { // Insurance - 3 steps vertical
        const leftColX = stepStartX + 80;
        stepsLayout = [
          { x: leftColX, y: stepStartY },
          { x: leftColX, y: stepStartY + 140 },
          { x: leftColX, y: stepStartY + 280 }
        ];
      } else { // Hospitality - 3 steps vertical
        const leftColX = stepStartX + 80;
        stepsLayout = [
          { x: leftColX, y: stepStartY },
          { x: leftColX, y: stepStartY + 140 },
          { x: leftColX, y: stepStartY + 280 }
        ];
      }
      
      // Create and animate workflow steps
      const currentSteps = selectedNode === 'analytics' ? analyticsFlow.steps : flow.steps;
      currentSteps.forEach((step, stepIndex) => {
        const isLast = stepIndex === currentSteps.length - 1;
        const stepX = stepsLayout[stepIndex].x;
        const stepY = stepsLayout[stepIndex].y;
        
        setTimeout(() => {
          createStepNode(step, stepX, stepY, selectedNode === 'analytics' ? analyticsFlow.color : flow.color, stepIndex);
          
          if (stepIndex > 0) {
            const prevStepX = stepsLayout[stepIndex - 1].x;
            const prevStepY = stepsLayout[stepIndex - 1].y;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            
            if (selectedNode === 'analytics' || activeFlow !== 0) {
              // Vertical connections for analytics and 3-step flows
              path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 70} L${stepX + 45} ${stepY}`);
            } else {
              // HRMS grid connections
              if (stepIndex % 2 === 0) {
                // Vertical connection
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 70} L${stepX + 45} ${stepY}`);
              } else {
                // Horizontal connection
                path.setAttribute('d', `M${prevStepX + 90} ${prevStepY + 35} L${stepX} ${stepY + 35}`);
              }
            }
            
            path.setAttribute('stroke', selectedNode === 'analytics' ? analyticsFlow.color : flow.color);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.style.filter = 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.3))';
            svg.appendChild(path);
            
            animatePath(path);
          }
          
          if (isLast) {
            setTimeout(() => {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', `M${stepX + 80} ${stepY + 35} C${stepX + 160} ${stepY + 35}, ${chatX - 280} ${chatY + 35}, ${chatX - 250} ${chatY + 35}`);
              path.setAttribute('stroke', selectedNode === 'analytics' ? analyticsFlow.color : flow.color);
              path.setAttribute('stroke-width', '4');
              path.setAttribute('fill', 'none');
              path.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))';
              svg.appendChild(path);
              
              animatePath(path);
              
              setTimeout(() => {
                showResponseMessage(chatX, chatY, selectedNode === 'analytics' ? analyticsFlow.color : flow.color);
              }, pathAnimationDuration + 200);
            }, 800);
          }
        }, 500 + stepIndex * animationDelay);
      });
    }

    // Function to create source node with enhanced styling - INCREASED SIZE
    function createSourceNode(label: string, x: number, y: number, color: string, icon: string, isAnalytics: boolean = false) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create shadow effect
      const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shadow.setAttribute('x', `${x - 8}`);
      shadow.setAttribute('y', `${y - 60}`);
      shadow.setAttribute('width', '140');
      shadow.setAttribute('height', '140');
      shadow.setAttribute('rx', '25');
      shadow.setAttribute('ry', '25');
      shadow.setAttribute('fill', color);
      shadow.setAttribute('opacity', '0.3');
      shadow.style.filter = 'blur(8px)';
      group.appendChild(shadow);
      
      // Create main rectangle
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x}`);
      rect.setAttribute('y', `${y - 60}`);
      rect.setAttribute('width', '140');
      rect.setAttribute('height', '140');
      rect.setAttribute('rx', '25');
      rect.setAttribute('ry', '25');
      rect.setAttribute('fill', 'url(#sourceGradient)');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '4');
      group.appendChild(rect);
      
      // Add icon
      const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      iconText.setAttribute('x', `${x + 70}`);
      iconText.setAttribute('y', `${y}`);
      iconText.setAttribute('text-anchor', 'middle');
      iconText.setAttribute('dominant-baseline', 'middle');
      iconText.setAttribute('font-family', 'Arial');
      iconText.setAttribute('font-size', '32');
      iconText.setAttribute('fill', color);
      iconText.textContent = icon;
      group.appendChild(iconText);
      
      // Add label with two lines
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', `${x + 70}`);
      text.setAttribute('y', `${y + 30}`); // Adjusted y position for two lines
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('font-size', '20');
      text.setAttribute('fill', '#FFFFFF');
      
      // Split label into two lines
      const labelParts = label.split(' AI ');
      const firstLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      firstLine.setAttribute('x', `${x + 70}`);
      firstLine.setAttribute('dy', '0');
      firstLine.textContent = labelParts[0];
      text.appendChild(firstLine);
      
      const secondLine = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
      secondLine.setAttribute('x', `${x + 70}`);
      secondLine.setAttribute('dy', '25');
      secondLine.textContent = 'AI Agent';
      text.appendChild(secondLine);
      
      group.appendChild(text);
      
      // Add click handler
      const clickArea = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clickArea.setAttribute('x', `${x}`);
      clickArea.setAttribute('y', `${y - 60}`);
      clickArea.setAttribute('width', '140');
      clickArea.setAttribute('height', '140');
      clickArea.setAttribute('fill', 'transparent');
      clickArea.style.cursor = 'pointer';
      
      clickArea.onclick = () => {
        cleanupTransition();
        if (isAnalytics) {
          handleNodeClick('analytics');
        } else if (selectedNode === 'analytics') {
          handleNodeClick('agent');
        }
      };
      
      group.appendChild(clickArea);
      
      // Add visual feedback for selected state
      if ((isAnalytics && selectedNode === 'analytics') || (!isAnalytics && selectedNode === 'agent')) {
        rect.setAttribute('stroke-width', '6');
        rect.style.filter = 'drop-shadow(0 0 10px ' + color + ')';
      }
      
      svg.appendChild(group);
      
      // Animate appearance
      group.style.opacity = '0';
      group.style.transform = 'scale(0.8)';
      group.style.transformOrigin = `${x + 70}px ${y}px`;
      group.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      
      setTimeout(() => {
        group.style.opacity = '1';
        group.style.transform = 'scale(1)';
      }, 100);
    }

    // Function to create engine container with enhanced styling - INCREASED SIZE
    function createEngineContainer(x: number, y: number, color: string) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create container rectangle with gradient - Increased size
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x - 120}`);  // Increased left extension
      rect.setAttribute('y', `${y - 220}`);  // Increased top extension
      rect.setAttribute('width', '600');     // Increased width
      rect.setAttribute('height', '580');    // Increased height TO ACCOMMODATE ANALYTICS CONNECTION
      rect.setAttribute('rx', '30');
      rect.setAttribute('ry', '30');
      rect.setAttribute('fill', 'url(#engineGradient)');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '3');
      group.appendChild(rect);
      
      // Add gradient definition for engine
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'engineGradient');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', '#2D3748');
      gradient.appendChild(stop1);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', '#1E293B');
      gradient.appendChild(stop2);
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.appendChild(gradient);
      svg.appendChild(defs);
      
      // Add "Generative Workflow Engine" label with glow effect
      const engineLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      engineLabel.setAttribute('x', `${x + 190}`);
      engineLabel.setAttribute('y', `${y + 280}`); // Adjusted y position due to increased height
      engineLabel.setAttribute('text-anchor', 'middle');
      engineLabel.setAttribute('font-family', 'Arial');
      engineLabel.setAttribute('font-size', '20');
      engineLabel.setAttribute('font-weight', 'bold');
      engineLabel.setAttribute('fill', '#FFFFFF');
      engineLabel.style.filter = 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.3))';
      group.appendChild(engineLabel);
      
      svg.appendChild(group);
      
      // Animate appearance
      group.style.opacity = '0';
      group.style.transform = 'translateY(20px)';
      group.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        group.style.opacity = '1';
        group.style.transform = 'translateY(0)';
      }, 100);
    }

    // Function to create chat interface with proper clipping
    function createChatInterface(x: number, y: number, color: string) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create clip path for the entire chat interface
      const clipPathId = `chat-interface-clip-${Date.now()}`;
      const clipPath = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
      clipPath.setAttribute('id', clipPathId);
      
      const clipRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      clipRect.setAttribute('x', `${x - 250}`); // Moved left from -200 to -250
      clipRect.setAttribute('y', `${y - 280}`);
      clipRect.setAttribute('width', '730');
      clipRect.setAttribute('height', '680');
      clipRect.setAttribute('rx', '25');
      clipRect.setAttribute('ry', '25');
      clipPath.appendChild(clipRect);
      defs.appendChild(clipPath);
      
      // Create background rectangle with gradient
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x - 250}`); // Moved left from -200 to -250
      rect.setAttribute('y', `${y - 280}`);
      rect.setAttribute('width', '730');
      rect.setAttribute('height', '680');
      rect.setAttribute('rx', '25');
      rect.setAttribute('ry', '25');
      rect.setAttribute('fill', 'url(#chatGradient)');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '3');
      group.appendChild(rect);

      group.setAttribute('clip-path', `url(#${clipPathId})`);
      svg.appendChild(group);
    }

    // Function to create step node with enhanced styling - INCREASED SIZE
    function createStepNode(label: string, x: number, y: number, color: string, index: number) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create shadow effect with left-side offset
      const shadow = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      shadow.setAttribute('x', `${x - 8}`);  // Changed from +8 to -8 to move shadow to left
      shadow.setAttribute('y', `${y + 8}`);
      shadow.setAttribute('width', '90');
      shadow.setAttribute('height', '80');
      shadow.setAttribute('rx', '15');
      shadow.setAttribute('ry', '15');
      shadow.setAttribute('fill', color);
      shadow.setAttribute('opacity', '0.3');
      shadow.style.filter = 'blur(8px)';
      group.appendChild(shadow);
      
      // Create main rectangle with gradient and elevated position
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x}`);
      rect.setAttribute('y', `${y}`);
      rect.setAttribute('width', '90');
      rect.setAttribute('height', '80');
      rect.setAttribute('rx', '15');
      rect.setAttribute('ry', '15');
      rect.setAttribute('fill', `url(#stepGradient${index})`);
      rect.style.filter = 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))';
      group.appendChild(rect);
      
      // Add gradient definition for step with enhanced colors
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', `stepGradient${index}`);
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '100%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', color);
      stop1.setAttribute('stop-opacity', '1');
      gradient.appendChild(stop1);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', color);
      stop2.setAttribute('stop-opacity', '0.8');
      gradient.appendChild(stop2);
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.appendChild(gradient);
      svg.appendChild(defs);
      
      // Add label with enhanced text shadow
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', `${x + 45}`);
      text.setAttribute('y', `${y + 40}`);
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('font-size', '14');
      text.setAttribute('fill', 'white');
      text.style.filter = 'drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2))';
      
      // Handle multiline labels
      const words = label.split(' ');
      if (words.length === 1) {
        text.textContent = label;
      } else {
        const tspan1 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan1.setAttribute('x', `${x + 45}`);
        tspan1.setAttribute('dy', '-8');
        tspan1.textContent = words[0];
        text.appendChild(tspan1);
        
        const tspan2 = document.createElementNS('http://www.w3.org/2000/svg', 'tspan');
        tspan2.setAttribute('x', `${x + 45}`);
        tspan2.setAttribute('dy', '20');
        tspan2.textContent = words[1];
        text.appendChild(tspan2);
      }
      
      group.appendChild(text);
      
      svg.appendChild(group);
      
      // Enhanced pop-up animation that maintains elevation
      group.style.opacity = '0';
      group.style.transform = 'scale(0.6) translateY(20px)';
      group.style.transformOrigin = `${x + 45}px ${y + 40}px`;
      group.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      
      // Animate to popped-up state and maintain it
      setTimeout(() => {
        group.style.opacity = '1';
        group.style.transform = 'scale(1) translateY(-8px)'; // Maintain elevated position
      }, 50);
    }

    // Enhanced fade in animation
    function fadeIn(element: SVGElement, callback?: () => void) {
      element.style.opacity = '0';
      let opacity = 0;
      const interval = setInterval(() => {
        opacity += 0.05; // Slower fade for smoother animation
        element.style.opacity = opacity.toString();
        if (opacity >= 1) {
          clearInterval(interval);
          // Add small delay after fade completes
          setTimeout(() => {
            if (callback) callback();
          }, 200);
        }
      }, 30);
    }

    // Enhanced path animation with gradient effect
    function animatePath(path: SVGPathElement) {
      const length = path.getTotalLength();
      
      // Add gradient to stroke if it doesn't exist
      const gradientId = `gradient-${Math.random().toString(36).substring(2, 9)}`;
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', gradientId);
      gradient.setAttribute('gradientUnits', 'userSpaceOnUse');
      gradient.setAttribute('x1', '0%');
      gradient.setAttribute('y1', '0%');
      gradient.setAttribute('x2', '100%');
      gradient.setAttribute('y2', '0%');
      
      const stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', path.getAttribute('stroke') || '#000');
      stop1.setAttribute('stop-opacity', '0.3');
      gradient.appendChild(stop1);
      
      const stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop2.setAttribute('offset', '50%');
      stop2.setAttribute('stop-color', path.getAttribute('stroke') || '#000');
      stop2.setAttribute('stop-opacity', '1');
      gradient.appendChild(stop2);
      
      const stop3 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
      stop3.setAttribute('offset', '100%');
      stop3.setAttribute('stop-color', path.getAttribute('stroke') || '#000');
      stop3.setAttribute('stop-opacity', '0.3');
      gradient.appendChild(stop3);
      
      const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      defs.appendChild(gradient);
      svg.appendChild(defs);
      
      path.setAttribute('stroke', `url(#${gradientId})`);
      
      // Set up the starting position
      path.setAttribute('stroke-dasharray', length.toString());
      path.setAttribute('stroke-dashoffset', length.toString());
      
      // Define animation
      let start: number | null = null;
      
      function step(timestamp: number) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const percent = Math.min(progress / pathAnimationDuration, 1);
        const offset = length * (1 - percent);
        
        path.setAttribute('stroke-dashoffset', offset.toString());
        
        if (percent < 1) {
          requestAnimationFrame(step);
        }
      }
      
      requestAnimationFrame(step);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-warm-gradient">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center p-4 mt-8">
        <h1 className="text-4xl font-bold mb-12 mt-12 text-gray-800">Generative Workflow Visualization</h1>
        
        {/* Workflow Selection Buttons */}
        <div className="flex gap-4 mb-8">
          {flowData.map((flow, index) => (
            <button
              key={index}
              onClick={() => {
                cleanupTransition();
                handleFlowSelection(index);
              }}
              style={{
                backgroundColor: activeFlow === index ? flow.color : '#374151',
                borderColor: activeFlow === index ? flow.color : 'transparent',
                transform: `scale(${activeFlow === index ? 1.05 : 1})`,
              }}
              className={`
                px-6 py-3 rounded-lg text-lg font-semibold
                transition-all duration-300 transform
                border-2
                hover:scale-105
                ${activeFlow === index 
                  ? 'text-white shadow-lg ring-2 ring-offset-2 ring-offset-white/10'
                  : 'text-gray-300 hover:bg-gray-600'
                }
              `}
            >
              <span className="mr-2">{flow.icon}</span>
              {flow.source}
            </button>
          ))}
        </div>

        {/* Main Visualization Container */}
        <div 
          ref={containerRef}
          className="w-full max-w-[2000px] h-[600px] rounded-xl p-6 overflow-hidden bg-[#1E293B]"
          style={{
            background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)'
          }}
        >
          <svg 
            ref={svgRef} 
            className="w-full h-full"
            style={{
              transition: 'opacity 0.3s ease-in-out',
              opacity: 1
            }}
          ></svg>
        </div>
      </div>
    </div>
  );
};

// Add the dashboard components
const ImprovedHRMSDashboard = () => {
  const lineData = [
    { month: 'Jan', value: 65 },
    { month: 'Feb', value: 85 },
    { month: 'Mar', value: 75 },
    { month: 'Apr', value: 90 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 100 }
  ];
  
  const pieData = [
    { name: 'Satisfied', value: 70 },
    { name: 'Neutral', value: 20 },
    { name: 'Dissatisfied', value: 10 }
  ];
  const COLORS = ['#0088FE', '#3366CC', '#6699FF'];
  
  const barData = [
    { factor: 'W-L', value: 7.5 },
    { factor: 'Dev', value: 8.2 },
    { factor: 'Cul', value: 6.3 },
    { factor: 'Pay', value: 7.8 },
    { factor: 'Ben', value: 6.5 },
    { factor: 'Trn', value: 7.6 },
    { factor: 'Mgr', value: 8.5 }
  ];

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Dashboard</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={40} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 mr-1"></div>
                <span>Satisfied</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-700 mr-1"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <YAxis domain={[60, 105]} hide />
                  <XAxis hide />
                  <Line type="natural" dataKey="value" stroke="#000000" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-2 bg-gray-50 p-2 rounded">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="factor" tick={{fontSize: 10}} />
                <YAxis domain={[0, 10]} hide />
                <Bar dataKey="value" fill="#0066CC" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-blue-600 text-lg font-medium mb-2">August Insights</h2>
        <p className="text-sm">Employee engagement improved by 5%. New training program shows 12% higher satisfaction. Remote work policy received highest positive feedback.</p>
      </div> */}
    </div>
  );
};

const ImprovedInsuranceDashboard = () => {
  const lineData = [
    { month: 'Jan', value: 60 },
    { month: 'Feb', value: 75 },
    { month: 'Mar', value: 68 },
    { month: 'Apr', value: 85 },
    { month: 'May', value: 80 },
    { month: 'Jun', value: 95 }
  ];
  
  const pieData = [
    { name: 'Claims', value: 45 },
    { name: 'Service', value: 35 },
    { name: 'New', value: 20 }
  ];
  const COLORS = ['#1d8f53', '#25ba6b', '#4ae89e'];
  
  const barData = [
    { day: 'Mon', value: 7 },
    { day: 'Tue', value: 9 },
    { day: 'Wed', value: 4 },
    { day: 'Thu', value: 8 },
    { day: 'Fri', value: 6 },
    { day: 'Sat', value: 8 },
    { day: 'Sun', value: 10 }
  ];

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Dashboard</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={40} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-700 mr-1"></div>
                <span>Claims</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 mr-1"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <YAxis domain={[55, 100]} hide />
                  <XAxis hide />
                  <Line type="natural" dataKey="value" stroke="#000000" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-2 bg-gray-50 p-2 rounded">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="day" tick={{fontSize: 10}} />
                <YAxis domain={[0, 12]} hide />
                <Bar dataKey="value" fill="#25ba6b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-green-600 text-lg font-medium mb-2">August Insights</h2>
        <p className="text-sm">Claims processing time reduced by 15%. Digital policy sales grew 23%. Customer satisfaction increased to 92% from 87%.</p>
      </div> */}
    </div>
  );
};

const ImprovedHospitalityDashboard = () => {
  const lineData = [
    { month: 'Jan', value: 70 },
    { month: 'Feb', value: 60 },
    { month: 'Mar', value: 75 },
    { month: 'Apr', value: 90 },
    { month: 'May', value: 80 },
    { month: 'Jun', value: 95 }
  ];
  
  const pieData = [
    { name: 'Rooms', value: 55 },
    { name: 'F&B', value: 30 },
    { name: 'Events', value: 15 }
  ];
  const COLORS = ['#8A2BE2', '#9370DB', '#BA55D3'];
  
  const barData = [
    { day: 'Mon', value: 6 },
    { day: 'Tue', value: 8 },
    { day: 'Wed', value: 5 },
    { day: 'Thu', value: 7 },
    { day: 'Fri', value: 6 },
    { day: 'Sat', value: 9 },
    { day: 'Sun', value: 10 }
  ];

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-2">Dashboard</h2>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={40} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-700 mr-1"></div>
                <span>Rooms</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 mr-1"></div>
                <span>Other</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-2 rounded">
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData}>
                  <YAxis domain={[55, 100]} hide />
                  <XAxis hide />
                  <Line type="natural" dataKey="value" stroke="#000000" strokeWidth={2} dot={false} activeDot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="mt-2 bg-gray-50 p-2 rounded">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="day" tick={{fontSize: 10}} />
                <YAxis domain={[0, 12]} hide />
                <Bar dataKey="value" fill="#9370DB" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-purple-600 text-lg font-medium mb-2">August Insights</h2>
        <p className="text-sm">Occupancy rate increased to 85%. Weekend packages drove 27% more revenue. Guest satisfaction score improved to 4.7/5.</p>
      </div> */}
    </div>
  );
};

export default FlowchartSection; 