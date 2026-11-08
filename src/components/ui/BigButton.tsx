import React from 'react';
import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';
import { speak, playSound } from '../../utils/audio';

interface BigButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'purple' | 'pink';
  icon?: React.ReactNode;
  audioText?: string;
  pulse?: boolean;
}

const colorClasses = {
  primary: 'bg-[radial-gradient(circle_at_center,_#60A5FA_0%,_#3B82F6_100%)] text-white hover:brightness-110',
  secondary: 'bg-[radial-gradient(circle_at_center,_#2DD4BF_0%,_#0D9488_100%)] text-white hover:brightness-110',
  success: 'bg-[radial-gradient(circle_at_center,_#4ADE80_0%,_#16A34A_100%)] text-white hover:brightness-110',
  warning: 'bg-[radial-gradient(circle_at_center,_#FDBA74_0%,_#EA580C_100%)] text-white hover:brightness-110',
  purple: 'bg-[radial-gradient(circle_at_center,_#C084FC_0%,_#9333EA_100%)] text-white hover:brightness-110',
  pink: 'bg-[radial-gradient(circle_at_center,_#F472B6_0%,_#DB2777_100%)] text-white hover:brightness-110',
};

export const BigButton: React.FC<BigButtonProps> = ({ 
  children, 
  color = 'primary', 
  icon, 
  audioText, 
  pulse, 
  onClick, 
  className = '', 
  ...props 
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playSound('click');
    if (audioText) speak(audioText);
    if (onClick) onClick(e);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={pulse ? { scale: [1, 1.05, 1] } : undefined}
      transition={pulse ? { repeat: Infinity, duration: 2 } : undefined}
      onClick={handleClick}
      className={`relative flex items-center justify-center gap-3 px-8 py-5 rounded-full font-black text-2xl shadow-xl border-4 border-white active:scale-95 transition-all ${colorClasses[color]} ${className}`}
      {...props}
    >
      {icon && <span className="text-3xl">{icon}</span>}
      {children}
      {audioText && (
        <div className="absolute top-2 right-2 bg-white/30 rounded-full p-1" onClick={(e) => { e.stopPropagation(); speak(audioText); }}>
          <Volume2 size={16} />
        </div>
      )}
    </motion.button>
  );
};
