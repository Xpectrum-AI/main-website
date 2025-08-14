import React from 'react';
import { getIcon } from './helpers';

interface CardProps {
  title: string;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, className = '' }) => {
  const [mainText, ...contextWords] = title.split(' ');
  const context = contextWords.join(' ');
  const { icon, color, glow } = getIcon(title);

  return (
    <div
      className={`p-4 bg-slate-900/50 backdrop-blur-md rounded-xl shadow-lg border border-white/10 transition-all duration-300 ${glow} ${className}`}
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 ${color} rounded-lg flex items-center justify-center mr-3 flex-shrink-0`}>
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-200 leading-tight truncate">{mainText}</h3>
          {context && <p className="text-xs text-gray-400 truncate mt-0.5">{context}</p>}
        </div>
      </div>
    </div>
  );
};

export default Card;
