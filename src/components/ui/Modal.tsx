import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { BigButton } from './BigButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="relative bg-white rounded-[40px] shadow-2xl p-8 max-w-2xl w-full border-8 border-blue-200 overflow-hidden"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 left-4 bg-red-100 text-red-600 p-3 rounded-full hover:bg-red-200 transition-colors"
            >
              <X size={24} strokeWidth={3} />
            </button>
            
            <h2 className="text-4xl font-black text-center text-blue-600 mb-8">{title}</h2>
            
            <div className="max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export const ParentGate: React.FC<{ onSuccess: () => void, onCancel: () => void }> = ({ onSuccess, onCancel }) => {
  const [progress, setProgress] = useState(0);

  const handlePointerDown = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        onSuccess();
      }
    }, 150); // Takes 3 seconds (100 / 5 * 150ms = 3000ms)

    const handlePointerUp = () => {
      clearInterval(interval);
      setProgress(0);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-900/90 text-white p-8">
      <h2 className="text-4xl font-bold mb-4">للأهل فقط</h2>
      <p className="text-2xl mb-12 text-gray-300 text-center">اضغط مطولاً لمدة 3 ثواني للدخول</p>
      
      <div 
        className="w-48 h-48 rounded-full border-8 border-gray-600 flex items-center justify-center relative cursor-pointer overflow-hidden touch-none select-none"
        onPointerDown={handlePointerDown}
      >
        <div 
          className="absolute bottom-0 left-0 w-full bg-blue-500 transition-all duration-150 ease-linear"
          style={{ height: `${progress}%` }}
        />
        <span className="relative z-10 text-xl font-bold pointer-events-none text-white mix-blend-difference">
          اضغط هنا
        </span>
      </div>
      
      <button 
        onClick={onCancel}
        className="mt-12 text-xl underline text-gray-400 hover:text-white"
      >
        رجوع
      </button>
    </div>
  );
};
