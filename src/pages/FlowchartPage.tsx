import React, { useEffect, useRef, useState } from 'react';
import Navbar from '../components/Navbar';

const FlowchartPage: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeFlow, setActiveFlow] = useState<number>(0);
  const [flowComplete, setFlowComplete] = useState<boolean>(false);
  const [animating, setAnimating] = useState<boolean>(false);
  const [autoTransition, setAutoTransition] = useState<boolean>(true);
  const animationTimer = useRef<NodeJS.Timeout | null>(null);
  const clearSvgTimeout = useRef<NodeJS.Timeout | null>(null);
  const transitionTimer = useRef<NodeJS.Timeout | null>(null);

  const flowData = [
    {
      source: "HRMS",
      steps: [
        "Parse Request",
        "Access HR DB",
        "Generate Form",
        "Check Policy",
        "Find Template",
        "Send Details"
      ],
      color: "#3B82F6", // Blue
      hoverColor: "#2563EB",
      icon: "👥"
    },
    {
      source: "Insurance",
      steps: [
        "Classify Claim",
        "Run Analysis",
        "Check Coverage",
        "Extract Details",
        "Verify History",
        "Generate Report"
      ],
      color: "#10B981", // Green
      hoverColor: "#059669",
      icon: "🏥"
    },
    {
      source: "Hospitality",
      steps: [
        "Identify Guest",
        "Check System",
        "Verify Options",
        "Update Record",
        "Check Schedule",
        "Confirm Request"
      ],
      color: "#6366F1", // Indigo
      hoverColor: "#4F46E5",
      icon: "🏨"
    }
  ];

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
        newSvg.style.opacity = '0';
        
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
    
    const startTimeout = setTimeout(() => {
      startFlowAnimation();
    }, 100);

    return () => {
      clearTimeout(startTimeout);
      cleanupAnimations();
    };
  }, [activeFlow]);

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
    if (index !== activeFlow) {
      cleanupAnimations();
      
      if (svgRef.current) {
        svgRef.current.style.opacity = '0';
        
        clearSvgTimeout.current = setTimeout(() => {
          setActiveFlow(index);
        }, 300);
      } else {
        setActiveFlow(index);
      }
    }
  };

  const startFlowAnimation = () => {
    if (!svgRef.current) return;

    const svg = svgRef.current;
    
    // Setup SVG dimensions and viewBox
    svg.setAttribute('viewBox', '0 0 1600 800');
    
    // Create fresh gradient definitions
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    
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
    svg.appendChild(defs);

    // Create background
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    background.setAttribute('x', '0');
    background.setAttribute('y', '0');
    background.setAttribute('width', '1600');
    background.setAttribute('height', '800');
    background.setAttribute('fill', `url(#${uniqueId})`);
    svg.appendChild(background);

    setAnimating(true);

    // Setup SVG dimensions and viewBox
    svg.setAttribute('viewBox', '0 0 1600 800');
    
    // Create subtle grid lines with animation
    for (let i = 0; i < 32; i++) {
      const horizontalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      horizontalLine.setAttribute('x1', '0');
      horizontalLine.setAttribute('y1', `${i * 40}`);
      horizontalLine.setAttribute('x2', '1600');
      horizontalLine.setAttribute('y2', `${i * 40}`);
      horizontalLine.setAttribute('stroke', 'rgba(99, 102, 241, 0.1)');
      horizontalLine.setAttribute('stroke-width', '1');
      horizontalLine.style.opacity = '0';
      svg.appendChild(horizontalLine);

      const verticalLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      verticalLine.setAttribute('x1', `${i * 70}`);
      verticalLine.setAttribute('y1', '0');
      verticalLine.setAttribute('x2', `${i * 70}`);
      verticalLine.setAttribute('y2', '800');
      verticalLine.setAttribute('stroke', 'rgba(99, 102, 241, 0.1)');
      verticalLine.setAttribute('stroke-width', '1');
      verticalLine.style.opacity = '0';
      svg.appendChild(verticalLine);

      setTimeout(() => {
        horizontalLine.style.transition = 'opacity 0.5s ease-in-out';
        verticalLine.style.transition = 'opacity 0.5s ease-in-out';
        horizontalLine.style.opacity = '1';
        verticalLine.style.opacity = '1';
      }, i * 50);
    }

    // Current flow data
    const flow = flowData[activeFlow];
    
    // Setup the animation timing
    const animationDelay = 600;
    const pathAnimationDuration = 800;
    
    // Calculate positions
    const startX = 160;
    const startY = 400;
    const engineX = 550;
    const engineY = startY;
    const chatX = 1200;
    const chatY = startY;
    
    // Display the flow title with enhanced styling
    const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    title.setAttribute('x', '800');
    title.setAttribute('y', '100');
    title.setAttribute('text-anchor', 'middle');
    title.setAttribute('font-family', 'Arial');
    title.setAttribute('font-size', '42');
    title.setAttribute('font-weight', 'bold');
    title.setAttribute('fill', flow.color);
    title.textContent = `${flow.source} Workflow`;
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
      // Create source node (left box)
      createSourceNode(flow.source, startX, startY, flow.color, flow.icon);
      
      // After source is created, create workflow engine
      setTimeout(() => {
        createEngineContainer(engineX, engineY, flow.color);
        
        // Create connection from source to engine after engine is shown
        setTimeout(() => {
          const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          
          // Straight horizontal line from container edge
          path.setAttribute('d', `M${startX + 140} ${startY + 10} L${engineX - 120} ${startY + 10}`);
          path.setAttribute('stroke', flow.color);
          path.setAttribute('stroke-width', '4');
          path.setAttribute('fill', 'none');
          path.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))';
          svg.appendChild(path);
          
          animatePath(path);
          
          // Begin workflow steps after path is animated
          setTimeout(() => {
            createAndAnimateWorkflowSteps(flow, engineX, engineY, chatX, chatY);
          }, pathAnimationDuration + 200);
        }, 500);
      }, 500);
    }, 2000); // Start main flow after query message is shown

    // Function to show query message first
    function showQueryMessage(x: number, y: number, color: string) {
      const groupMessages = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const messageBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      messageBg.setAttribute('x', `${x}`);
      messageBg.setAttribute('y', `${y - 60}`);
      messageBg.setAttribute('width', '200');
      messageBg.setAttribute('height', '50');
      messageBg.setAttribute('rx', '12');
      messageBg.setAttribute('ry', '12');
      messageBg.setAttribute('fill', '#374151');
      messageBg.style.filter = 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))';
      groupMessages.appendChild(messageBg);
      
      // Add sample text
      const messageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      messageText.setAttribute('x', `${x + 15}`);
      messageText.setAttribute('y', `${y - 30}`);
      messageText.setAttribute('font-family', 'Arial');
      messageText.setAttribute('font-size', '14');
      messageText.setAttribute('fill', '#FFFFFF');
      messageText.textContent = 'Query message...';
      groupMessages.appendChild(messageText);
      
      groupMessages.style.opacity = '0';
      svg.appendChild(groupMessages);
      
      fadeIn(groupMessages);
    }

    // Function to show response message after workflow animation is complete
    function showResponseMessage(x: number, y: number, color: string) {
      // Add response bubble
      const groupResponse = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const responseBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      responseBg.setAttribute('x', `${x}`);
      responseBg.setAttribute('y', `${y + 10}`);
      responseBg.setAttribute('width', '200');
      responseBg.setAttribute('height', '70');
      responseBg.setAttribute('rx', '12');
      responseBg.setAttribute('ry', '12');
      responseBg.setAttribute('fill', color);
      responseBg.setAttribute('opacity', '0.25');
      responseBg.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))';
      groupResponse.appendChild(responseBg);
      
      // Add sample response text
      const responseText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      responseText1.setAttribute('x', `${x + 15}`);
      responseText1.setAttribute('y', `${y + 40}`);
      responseText1.setAttribute('font-family', 'Arial');
      responseText1.setAttribute('font-size', '14');
      responseText1.setAttribute('fill', '#FFFFFF');
      responseText1.textContent = 'Response line 1';
      groupResponse.appendChild(responseText1);
      
      const responseText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      responseText2.setAttribute('x', `${x + 15}`);
      responseText2.setAttribute('y', `${y + 60}`);
      responseText2.setAttribute('font-family', 'Arial');
      responseText2.setAttribute('font-size', '14');
      responseText2.setAttribute('fill', '#FFFFFF');
      responseText2.textContent = 'Response line 2';
      groupResponse.appendChild(responseText2);
      
      groupResponse.style.opacity = '0';
      svg.appendChild(groupResponse);
      
      // Add typing animation dots before showing response
      const typingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot1.setAttribute('cx', `${x + 15}`);
      dot1.setAttribute('cy', `${y + 40}`);
      dot1.setAttribute('r', '3');
      dot1.setAttribute('fill', color);
      typingGroup.appendChild(dot1);
      
      const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot2.setAttribute('cx', `${x + 25}`);
      dot2.setAttribute('cy', `${y + 40}`);
      dot2.setAttribute('r', '3');
      dot2.setAttribute('fill', color);
      typingGroup.appendChild(dot2);
      
      const dot3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot3.setAttribute('cx', `${x + 35}`);
      dot3.setAttribute('cy', `${y + 40}`);
      dot3.setAttribute('r', '3');
      dot3.setAttribute('fill', color);
      typingGroup.appendChild(dot3);
      
      svg.appendChild(typingGroup);
      
      // Animate typing dots
      let dotOpacity = 0;
      const dotInterval = setInterval(() => {
        dotOpacity = dotOpacity === 1 ? 0 : 1;
        dot1.setAttribute('opacity', dotOpacity.toString());
        
        setTimeout(() => {
          dot2.setAttribute('opacity', dotOpacity.toString());
        }, 150);
        
        setTimeout(() => {
          dot3.setAttribute('opacity', dotOpacity.toString());
        }, 300);
      }, 600);
      
      // Show response after typing animation
      setTimeout(() => {
        clearInterval(dotInterval);
        svg.removeChild(typingGroup);
        fadeIn(groupResponse, () => {
          // Set flow complete and handle transition
          setFlowComplete(true);
          setAnimating(false);

          // Schedule next transition
          if (autoTransition) {
            cleanupTransition();
            transitionTimer.current = setTimeout(() => {
              const nextFlowIndex = getNextFlowIndex(activeFlow);
              handleFlowSelection(nextFlowIndex);
            }, 2000);
          }
        });
      }, 1800);
    }

    // Function to create and animate all workflow steps
    function createAndAnimateWorkflowSteps(flow: typeof flowData[0], engineX: number, engineY: number, chatX: number, chatY: number) {
      const stepStartY = engineY - 140;
      const stepStartX = engineX + 40;
      
      // Generate different layouts for different flows
      let stepsLayout: { x: number, y: number }[] = [];
      
      if (activeFlow === 0) { // HRMS - 2x3 grid with increased spacing
        stepsLayout = flow.steps.map((_, index) => ({
          x: stepStartX + (index % 2) * 220,  // Increased from 160 to 220 for horizontal spacing
          y: stepStartY + Math.floor(index / 2) * 140  // Increased from 100 to 140 for vertical spacing
        }));
      } else if (activeFlow === 1) { // Insurance - structured layout moved left
        const leftColX = stepStartX - 20;  // Move left column more to the left
        const rightColX = leftColX + 220;  // Right column with proper spacing
        
        const layout = [
          // Classify Claim - top left
          { x: leftColX, y: stepStartY - 40 }, 
          // Run Analysis - below Classify
          { x: leftColX, y: stepStartY + 100 }, 
          // Check Coverage - below Run Analysis
          { x: leftColX, y: stepStartY + 240 }, 
          // Extract Details - right of Check Coverage
          { x: rightColX, y: stepStartY + 240 }, 
          // Verify History - right column middle
          { x: rightColX, y: stepStartY + 100 }, 
          // Generate Report - right column top
          { x: rightColX, y: stepStartY - 40 }
        ];
        stepsLayout = layout;
      } else { // Hospitality - increased spacing between elements
        const leftColX = stepStartX - 20;   // Left column position
        const rightColX = leftColX + 220;   // Increased spacing between columns
        
        stepsLayout = [
          // Identify Guest - top center
          { x: leftColX, y: stepStartY - 40 }, 
          // Check System - below Identify Guest with more space
          { x: leftColX, y: stepStartY + 100 },
          // Verify Options - right side with more space
          { x: rightColX, y: stepStartY + 40 },
          // Update Record - right side below Verify Options with more space
          { x: rightColX, y: stepStartY + 180 },
          // Check Schedule - left side with more space
          { x: leftColX, y: stepStartY + 240 },
          // Confirm Request - right bottom with more space
          { x: rightColX, y: stepStartY + 320 }
        ];
      }
      
      // Create and animate workflow steps
      flow.steps.forEach((step, stepIndex) => {
        const isLast = stepIndex === flow.steps.length - 1;
        const stepX = stepsLayout[stepIndex].x;
        const stepY = stepsLayout[stepIndex].y;
        
        // Create step node after delay
        setTimeout(() => {
          createStepNode(step, stepX, stepY, flow.color, stepIndex);
          
          // Connect step to previous step or to source for first step
          if (stepIndex > 0) {
            const prevStepX = stepsLayout[stepIndex - 1].x;
            const prevStepY = stepsLayout[stepIndex - 1].y;
            
            let path;
            if (activeFlow === 0) { // HRMS flow
              if (stepIndex % 2 === 0) {
                // Connect to step above with a curved path
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 40} ${prevStepY + 50} C${prevStepX + 40} ${prevStepY + 70}, ${stepX + 40} ${stepY - 20}, ${stepX + 40} ${stepY}`);
              } else {
                // Connect horizontally
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 80} ${prevStepY + 35} L${stepX} ${stepY + 35}`);
              }
            } else if (activeFlow === 1) { // Insurance flow - structured connections
              if (stepIndex === 1) { // Classify Claim to Run Analysis (vertical down)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 50} L${prevStepX + 45} ${stepY}`);
              } else if (stepIndex === 2) { // Run Analysis to Check Coverage (vertical down)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 50} L${prevStepX + 45} ${stepY}`);
              } else if (stepIndex === 3) { // Check Coverage to Extract Details (horizontal right)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 80} ${prevStepY + 35} L${stepX} ${prevStepY + 35}`);
              } else if (stepIndex === 4) { // Extract Details to Verify History (vertical up)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY} L${prevStepX + 45} ${stepY + 50}`);
              } else if (stepIndex === 5) { // Verify History to Generate Report (vertical up)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY} L${prevStepX + 45} ${stepY + 50}`);
              } else if (stepIndex === 6) { // Classify Claim to Generate Report (horizontal right)
                path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                path.setAttribute('d', `M${prevStepX + 80} ${prevStepY + 35} L${stepX} ${stepY + 35}`);
              }
            } else { // Hospitality flow - specific connection paths
              path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              
              if (stepIndex === 1) { // Identify Guest to Check System (vertical down)
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 70} L${stepX + 45} ${stepY}`);
              } 
              else if (stepIndex === 2) { // Check System to Verify Options (diagonal right-up)
                path.setAttribute('d', `M${prevStepX + 90} ${prevStepY + 35} L${stepX} ${stepY + 35}`);
              } 
              else if (stepIndex === 3) { // Verify Options to Update Record (vertical down)
                path.setAttribute('d', `M${prevStepX + 45} ${prevStepY + 70} L${stepX + 45} ${stepY}`);
              } 
              else if (stepIndex === 4) { // Update Record to Check Schedule (horizontal left)
                path.setAttribute('d', `M${prevStepX} ${prevStepY + 35} L${stepX + 90} ${stepY + 35}`);
              } 
              else if (stepIndex === 5) { // Check Schedule to Confirm Request (diagonal right-down)
                path.setAttribute('d', `M${prevStepX + 90} ${prevStepY + 35} L${stepX} ${stepY + 35}`);
              }
            }
            
            path.setAttribute('stroke', flow.color);
            path.setAttribute('stroke-width', '2');
            path.setAttribute('fill', 'none');
            path.style.filter = 'drop-shadow(0 0 4px rgba(99, 102, 241, 0.3))';
            svg.appendChild(path);
            
            animatePath(path);
          }
          
          // If it's the last step, connect to chat interface after a delay
          if (isLast) {
            setTimeout(() => {
              const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
              path.setAttribute('d', `M${stepX + 80} ${stepY + 35} C${stepX + 160} ${stepY + 35}, ${chatX - 160} ${chatY + 35}, ${chatX - 40} ${chatY + 35}`);
              path.setAttribute('stroke', flow.color);
              path.setAttribute('stroke-width', '4');
              path.setAttribute('fill', 'none');
              path.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.5))';
              svg.appendChild(path);
              
              animatePath(path);
              
              // After workflow completes, show response message
              setTimeout(() => {
                showResponseMessage(chatX, chatY, flow.color);
              }, pathAnimationDuration + 200);
            }, 800);
          }
        }, 500 + stepIndex * animationDelay);
      });
    }

    // Function to create source node with enhanced styling - INCREASED SIZE
    function createSourceNode(label: string, x: number, y: number, color: string, icon: string) {
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
      
      // Create main rectangle with gradient
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
      
      // Add icon with animation - centered in container
      const iconText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      iconText.setAttribute('x', `${x + 70}`);
      iconText.setAttribute('y', `${y}`); // Adjusted y position to be in center
      iconText.setAttribute('text-anchor', 'middle');
      iconText.setAttribute('dominant-baseline', 'middle');
      iconText.setAttribute('font-family', 'Arial');
      iconText.setAttribute('font-size', '32');
      iconText.setAttribute('fill', color);
      iconText.textContent = icon;
      group.appendChild(iconText);
      
      // Add label - positioned below icon
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', `${x + 70}`);
      text.setAttribute('y', `${y + 30}`); // Adjusted y position to be below icon
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-family', 'Arial');
      text.setAttribute('font-size', '20');
      text.setAttribute('fill', '#FFFFFF');
      text.textContent = label;
      group.appendChild(text);
      
      svg.appendChild(group);
      
      // Animate appearance with bounce effect
      group.style.opacity = '0';
      group.style.transform = 'scale(0.8)';
      group.style.transformOrigin = `${x + 70}px ${y + 70}px`;
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
      rect.setAttribute('height', '480');    // Increased height
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
      engineLabel.setAttribute('y', `${y + 180}`);
      engineLabel.setAttribute('text-anchor', 'middle');
      engineLabel.setAttribute('font-family', 'Arial');
      engineLabel.setAttribute('font-size', '20');
      engineLabel.setAttribute('font-weight', 'bold');
      engineLabel.setAttribute('fill', '#FFFFFF');
      // engineLabel.textContent = 'Generative Workflow Engine';
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

    // Function to create chat interface with enhanced styling - INCREASED SIZE
    function createChatInterface(x: number, y: number, color: string) {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      // Create container rectangle with gradient
      const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      rect.setAttribute('x', `${x - 40}`);
      rect.setAttribute('y', `${y - 140}`);
      rect.setAttribute('width', '320');
      rect.setAttribute('height', '280');
      rect.setAttribute('rx', '25');
      rect.setAttribute('ry', '25');
      rect.setAttribute('fill', 'url(#chatGradient)');
      rect.setAttribute('stroke', color);
      rect.setAttribute('stroke-width', '3');
      group.appendChild(rect);
      
      // Add gradient definition for chat
      const gradient = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
      gradient.setAttribute('id', 'chatGradient');
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
      
      svg.appendChild(group);
      
      // Animate appearance
      group.style.opacity = '0';
      group.style.transform = 'translateX(20px)';
      group.style.transition = 'all 0.6s ease-out';
      
      setTimeout(() => {
        group.style.opacity = '1';
        group.style.transform = 'translateX(0)';
      }, 100);
    }
    
    // Function to animate chat messages with enhanced styling
    function animateChatMessages(x: number, y: number, color: string) {
      // Add message bubble
      const groupMessages = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const messageBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      messageBg.setAttribute('x', `${x}`);
      messageBg.setAttribute('y', `${y - 60}`);
      messageBg.setAttribute('width', '200');
      messageBg.setAttribute('height', '50');
      messageBg.setAttribute('rx', '12');
      messageBg.setAttribute('ry', '12');
      messageBg.setAttribute('fill', '#374151');
      messageBg.style.filter = 'drop-shadow(0 0 4px rgba(0, 0, 0, 0.2))';
      groupMessages.appendChild(messageBg);
      
      // Add sample text
      const messageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      messageText.setAttribute('x', `${x + 15}`);
      messageText.setAttribute('y', `${y - 30}`);
      messageText.setAttribute('font-family', 'Arial');
      messageText.setAttribute('font-size', '14');
      messageText.setAttribute('fill', '#FFFFFF');
      messageText.textContent = 'Query message...';
      groupMessages.appendChild(messageText);
      
      groupMessages.style.opacity = '0';
      svg.appendChild(groupMessages);
      
      fadeIn(groupMessages, () => {
        // After query appears, show response
        setTimeout(() => {
          // Add response bubble
          const groupResponse = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          
          const responseBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
          responseBg.setAttribute('x', `${x}`);
          responseBg.setAttribute('y', `${y + 10}`);
          responseBg.setAttribute('width', '200');
          responseBg.setAttribute('height', '70');
          responseBg.setAttribute('rx', '12');
          responseBg.setAttribute('ry', '12');
          responseBg.setAttribute('fill', color);
          responseBg.setAttribute('opacity', '0.25');
          responseBg.style.filter = 'drop-shadow(0 0 8px rgba(99, 102, 241, 0.3))';
          groupResponse.appendChild(responseBg);
          
          // Add sample response text
          const responseText1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          responseText1.setAttribute('x', `${x + 15}`);
          responseText1.setAttribute('y', `${y + 40}`);
          responseText1.setAttribute('font-family', 'Arial');
          responseText1.setAttribute('font-size', '14');
          responseText1.setAttribute('fill', '#FFFFFF');
          responseText1.textContent = 'Response line 1';
          groupResponse.appendChild(responseText1);
          
          const responseText2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
          responseText2.setAttribute('x', `${x + 15}`);
          responseText2.setAttribute('y', `${y + 60}`);
          responseText2.setAttribute('font-family', 'Arial');
          responseText2.setAttribute('font-size', '14');
          responseText2.setAttribute('fill', '#FFFFFF');
          responseText2.textContent = 'Response line 2';
          groupResponse.appendChild(responseText2);
          
          groupResponse.style.opacity = '0';
          svg.appendChild(groupResponse);
          
          // Add typing animation dots before showing response
          const typingGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
          
          const dot1 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot1.setAttribute('cx', `${x + 15}`);
          dot1.setAttribute('cy', `${y + 40}`);
          dot1.setAttribute('r', '3');
          dot1.setAttribute('fill', color);
          typingGroup.appendChild(dot1);
          
          const dot2 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot2.setAttribute('cx', `${x + 25}`);
          dot2.setAttribute('cy', `${y + 40}`);
          dot2.setAttribute('r', '3');
          dot2.setAttribute('fill', color);
          typingGroup.appendChild(dot2);
          
          const dot3 = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot3.setAttribute('cx', `${x + 35}`);
          dot3.setAttribute('cy', `${y + 40}`);
          dot3.setAttribute('r', '3');
          dot3.setAttribute('fill', color);
          typingGroup.appendChild(dot3);
          
          svg.appendChild(typingGroup);
          
          // Animate typing dots
          let dotOpacity = 0;
          const dotInterval = setInterval(() => {
            dotOpacity = dotOpacity === 1 ? 0 : 1;
            dot1.setAttribute('opacity', dotOpacity.toString());
            
            setTimeout(() => {
              dot2.setAttribute('opacity', dotOpacity.toString());
            }, 150);
            
            setTimeout(() => {
              dot3.setAttribute('opacity', dotOpacity.toString());
            }, 300);
          }, 600);
          
          // Show response after typing animation
          setTimeout(() => {
            clearInterval(dotInterval);
            svg.removeChild(typingGroup);
            fadeIn(groupResponse, () => {
              // Set flow complete and handle transition
              setFlowComplete(true);
              setAnimating(false);

              // Schedule next transition
              if (autoTransition) {
                cleanupTransition();
                transitionTimer.current = setTimeout(() => {
                  const nextFlowIndex = getNextFlowIndex(activeFlow);
                  handleFlowSelection(nextFlowIndex);
                }, 2000);
              }
            });
          }, 1800);
        }, 500);
      });
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
        opacity += 0.1;
        element.style.opacity = opacity.toString();
        if (opacity >= 1) {
          clearInterval(interval);
          if (callback) callback();
        }
      }, 40);
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

  // Add effect to start auto-transition when component mounts
  useEffect(() => {
    setAutoTransition(true);  // Enable auto-transition by default
    return () => {
      cleanupAnimations();
    };
  }, []);

  // Modify button click handler to disable auto-transition
  const handleButtonClick = (index: number) => {
    setAutoTransition(false);  // Disable auto-transition when manually clicking
    handleFlowSelection(index);
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
              onClick={() => handleButtonClick(index)}
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
          className="w-full max-w-[1600px] h-[800px] bg-white rounded-xl p-6 shadow-2xl border border-gray-100 overflow-hidden"
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

export default FlowchartPage; 