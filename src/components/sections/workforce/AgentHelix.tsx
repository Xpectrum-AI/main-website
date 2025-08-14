import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import Card from './Card';

const AgentHelix: React.FC = () => {
  const cards = [
    'Active Call', 'Onboarding Client', 'Query Resolution', 'Completed Task', 'Missed Call',
    'Follow-up Scheduled', 'Active Chat', 'Completed Onboarding', 'Query Escalated', 'Missed Follow-up',
    'Active Call', 'Onboarding Client', 'Query Resolution', 'Completed Task', 'Missed Call',
    'Follow-up Scheduled', 'Active Chat', 'Completed Onboarding', 'Query Escalated', 'Missed Follow-up',
  ];

  const helixRef = useRef<HTMLDivElement>(null);
  const rotationY = useMotionValue(0);

  useEffect(() => {
    const controls = animate(rotationY, 360, {
      duration: 40,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'linear',
    });
    return () => controls.stop();
  }, [rotationY]);

  return (
    <div ref={helixRef} className="relative w-full h-[500px] flex items-center justify-center" style={{ perspective: '1200px' }}>
      <motion.div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        style={{ y: '-20%', transformStyle: 'preserve-3d', rotateY: rotationY }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDrag={(event, info) => {
          rotationY.set(rotationY.get() + info.offset.x * 0.5);
        }}
      >
        {cards.map((title, i) => {
          const angle = (i / cards.length) * 360;
          const yPos = (i - cards.length / 2) * 60; // Vertical spacing
          const radius = 250; // Helix radius

          return (
            <motion.div
              key={i}
              className="absolute"
              style={{
                transform: `rotateY(${angle}deg) translateZ(${radius}px) translateY(${yPos}px)`,
                // backfaceVisibility: 'hidden',
              }}
            >
              <Card title={title} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default AgentHelix;
