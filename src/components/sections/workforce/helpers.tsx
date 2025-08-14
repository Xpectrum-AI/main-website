
export const getIcon = (title: string) => {
  const firstWord = title.toLowerCase().split(' ')[0];
  switch (firstWord) {
    case 'active':
      return { icon: '📞', color: 'bg-blue-500/20 text-blue-300', glow: 'shadow-[0_0_15px_rgba(96,165,250,0.3)]' };
    case 'missed':
      return { icon: '🚫', color: 'bg-red-500/20 text-red-400', glow: 'shadow-[0_0_15px_rgba(248,113,113,0.3)]' };
    case 'completed':
      return { icon: '✅', color: 'bg-green-500/20 text-green-300', glow: 'shadow-[0_0_15px_rgba(74,222,128,0.3)]' };
    case 'onboarding':
      return { icon: '👋', color: 'bg-yellow-500/20 text-yellow-300', glow: 'shadow-[0_0_15px_rgba(250,204,21,0.3)]' };
    case 'query':
      return { icon: '❓', color: 'bg-purple-500/20 text-purple-300', glow: 'shadow-[0_0_15px_rgba(192,132,252,0.3)]' };
    case 'follow-up':
      return { icon: '🔄', color: 'bg-indigo-500/20 text-indigo-300', glow: 'shadow-[0_0_15px_rgba(129,140,248,0.3)]' };
    default:
      return { icon: 'ℹ️', color: 'bg-gray-500/20 text-gray-300', glow: 'shadow-[0_0_15px_rgba(156,163,175,0.3)]' };
  }
};
