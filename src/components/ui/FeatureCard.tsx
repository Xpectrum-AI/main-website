import React from "react";
import { motion, MotionProps } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  delay?: number;
  iconWrapperClasses?: string;
  iconHover?: MotionProps["whileHover"];
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  subtitle,
  delay = 0,
  iconWrapperClasses = "",
  iconHover,
}) => {
  return (
    <motion.button
      type="button"
      aria-label={typeof title === "string" ? title : "feature card"}
      className="group relative w-full max-w-xs mx-auto bg-white/30 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col items-center gap-3 text-left transition-transform will-change-transform hover:-translate-y-2 focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, delay }}
    >
      <motion.span
        className={`w-16 h-16 flex items-center justify-center rounded-full mb-1 ${iconWrapperClasses}`}
        whileHover={iconHover}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        style={{ boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}
      >
        <Icon className="w-8 h-8 text-white" />
      </motion.span>

      <div className="w-full">
        <div className="text-gray-900 text-lg font-semibold leading-tight">
          {title}
        </div>
        {subtitle && (
          <div className="mt-1 text-sm text-gray-700/90">
            {subtitle}
          </div>
        )}
      </div>

      {/* accent underline */}
      <span className="absolute left-6 right-6 bottom-4 h-0.5 bg-gradient-to-r from-green-300 to-transparent opacity-60 rounded" />
    </motion.button>
  );
};

export default FeatureCard;
