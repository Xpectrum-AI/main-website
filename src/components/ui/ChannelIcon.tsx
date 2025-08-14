import React from "react";
import type { LucideIcon } from "lucide-react";

interface ChannelIconProps {
  icon: LucideIcon;
  label: string;
}

const ChannelIcon: React.FC<ChannelIconProps> = ({ icon: Icon, label }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="flex items-center justify-center w-20 h-20 rounded-xl 
        bg-gradient-to-tr from-slate-200/15 via-slate-200/5 to-slate-200/25
        shadow-lg border border-white/40 backdrop-blur-sm">
        <Icon className="w-8 h-8 text-black/85" />
      </div>
      <div className="text-sm text-center text-black/75">{label}</div>
    </div>
  );
};

export default ChannelIcon;
