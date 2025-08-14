import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import AgentHelix from './AgentHelix';

const WorkforceSection: React.FC = () => {
  const workforceRef = useRef<HTMLDivElement>(null);
  const isWorkforceInView = useInView(workforceRef, { once: true, amount: 0.2 });

  return (
    <div
      ref={workforceRef}
      className="w-full min-h-screen py-20 sm:py-24 px-4 sm:px-6 md:px-12 relative z-10 bg-[#ffffff] text-white overflow-hidden flex items-center"
    >
      {/* Background Aurora/Gradient Effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_rgba(129,140,248,0.25)_0%,_rgba(10,8,20,0)_50%)]"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom,_rgba(192,132,252,0.15)_0%,_rgba(10,8,20,0)_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <motion.div
          className="text-center lg:text-left"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: isWorkforceInView ? 1 : 0, x: isWorkforceInView ? 0 : -30 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
        >
          <h3 className="text-black font-semibold tracking-wider uppercase mb-4 text-sm">WHY HIRE XPECTRUM</h3>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-slate-400 to-slate-900 mb-6 leading-tight">
            A truly autonomous workforce.
          </h1>
          <p className="text-slate-800 text-lg mb-10 max-w-xl mx-auto lg:mx-0">
            Our universal agentic AI bots act as true digital employees—capable of reasoning, decision-making,
            and executing complex, end-to-end workflows.
          </p>
          <motion.button
            className="bg-gradient-to-r from-slate-800 to-purple-95000 text-white py-3.5 px-10 rounded-full font-bold text-base shadow-lg shadow-blue-500/20 hover:shadow-slate-500/40 focus:outline-none focus:ring-4 focus:ring-blue-300/50 transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Integrations
          </motion.button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isWorkforceInView ? 1 : 0, scale: isWorkforceInView ? 1 : 0.8 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 1, 0.5, 1] }}
        >
          <AgentHelix />
        </motion.div>
      </div>
    </div>
  );
};

export default WorkforceSection;
