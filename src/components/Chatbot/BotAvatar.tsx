import { useEffect, useState } from 'react';
import { BotState } from './types';
import { Bot } from 'lucide-react';

interface BotAvatarProps {
  state: BotState;
  onClick: () => void;
}

export const BotAvatar = ({ state, onClick }: BotAvatarProps) => {
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    switch (state) {
      case 'waving':
        setAnimationClass('animate-wave');
        break;
      case 'talking':
        setAnimationClass('animate-talk');
        break;
      case 'thinking':
        setAnimationClass('animate-think');
        break;
      default:
        setAnimationClass('animate-idle');
    }
  }, [state]);

  return (
    <button
      onClick={onClick}
      className="relative w-16 h-16 rounded-full bg-primary hover:bg-primary/90 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl cursor-pointer group"
      aria-label="Open chatbot"
    >
      <Bot 
        className={`w-8 h-8 text-primary-foreground transition-transform duration-300 ${animationClass}`} 
      />
      {state === 'thinking' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
      )}
    </button>
  );
};