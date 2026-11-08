import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { playSound } from '../../utils/audio';

interface Props {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ParentGate: React.FC<Props> = ({ onSuccess, onCancel }) => {
  const [progress, setProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            playSound('success');
            onSuccess();
            return 100;
          }
          return prev + 2; // Takes ~2.5 seconds (50 * 50ms)
        });
      }, 50);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [isPressing, onSuccess]);

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/90 backdrop-blur-sm flex items-center justify-center p-4 rtl">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[40px] p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
        <button onClick={onCancel} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl">✕</button>
        
        <Shield size={64} className="mx-auto text-indigo-500 mb-6" />
        <h2 className="text-3xl font-black text-gray-800 mb-4">منطقة الأهل</h2>
        <p className="text-xl text-gray-600 mb-8 font-medium">اضغط باستمرار لمدة 3 ثواني للدخول</p>

        <div className="relative mb-4">
          <button
            onPointerDown={() => setIsPressing(true)}
            onPointerUp={() => setIsPressing(false)}
            onPointerLeave={() => setIsPressing(false)}
            className={`w-40 h-40 rounded-full mx-auto border-8 transition-colors select-none ${isPressing ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'}`}
            style={{ touchAction: 'none' }}
          >
            <span className="text-5xl select-none block mt-2">👆</span>
          </button>
          
          <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 pointer-events-none transform -rotate-90">
            <circle cx="80" cy="80" r="76" stroke="transparent" strokeWidth="8" fill="none" />
            <circle 
              cx="80" cy="80" r="76" 
              stroke="#6366f1" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray="477.5"
              strokeDashoffset={477.5 - (477.5 * progress) / 100}
              className="transition-all duration-75 ease-linear"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
};
