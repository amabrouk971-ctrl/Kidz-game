import React, { useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Star, Sparkles } from 'lucide-react';
import { audioManager } from '../../lib/audio/AudioManager';

interface Particle {
  id: number;
  type: 'heart' | 'star' | 'sparkle' | 'greeting';
  icon: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  size: number; // px
  rotation: number;
  delay: number;
  duration: number;
  color: string;
}

interface Props {
  show?: boolean;
  message?: string;
  subMessage?: string;
  duration?: number; // duration before auto-hide (if provided)
  onComplete?: () => void;
  fullScreen?: boolean;
  theme?: 'politeness' | 'greeting' | 'general';
}

const GREETING_ICONS = ['❤️', '💖', '⭐', '🌟', '✨', '🤝', '👏', '🌸', '💕', '🥰', '🕊️'];

export const triggerPoliteConfetti = () => {
  // Fire confetti in heart & golden star colors
  try {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#FB7185', '#FDA4AF', '#F59E0B', '#FCD34D', '#10B981', '#38BDF8'],
    });

    setTimeout(() => {
      confetti({
        particleCount: 30,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#EC4899', '#F43F5E', '#FBBF24'],
      });
      confetti({
        particleCount: 30,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#EC4899', '#F43F5E', '#FBBF24'],
      });
    }, 200);
  } catch (err) {
    console.warn('Confetti effect failed', err);
  }
};

export const CelebratoryHeartsAndStars: React.FC<Props> = ({
  show = true,
  message = 'ما شاء الله! سلوك مهذب وتحية رائعة! 💖',
  subMessage = 'الأدب واحترام الآخرين صفات الأبطال الصغار ✨',
  duration = 3200,
  onComplete,
  fullScreen = true,
  theme = 'politeness',
}) => {
  // Generate random floating particles
  const particles: Particle[] = useMemo(() => {
    return Array.from({ length: 24 }).map((_, i) => {
      const isHeart = i % 2 === 0;
      const icon = GREETING_ICONS[i % GREETING_ICONS.length];
      return {
        id: i,
        type: isHeart ? 'heart' : 'star',
        icon,
        x: Math.random() * 90 + 5, // 5% to 95%
        y: Math.random() * 40 + 50, // 50% to 90%
        size: Math.floor(Math.random() * 26) + 32, // 32px to 58px
        rotation: Math.floor(Math.random() * 60) - 30,
        delay: Math.random() * 0.4,
        duration: Math.random() * 1.5 + 1.8,
        color: isHeart ? '#F43F5E' : '#F59E0B',
      };
    });
  }, []);

  useEffect(() => {
    if (show) {
      triggerPoliteConfetti();
      // Play celebratory applause sound effect & cheering
      audioManager.playApplause();

      if (duration && duration > 0) {
        const timer = setTimeout(() => {
          if (onComplete) onComplete();
        }, duration);
        return () => clearTimeout(timer);
      }
    }
  }, [show, duration, onComplete]);

  if (!show) return null;

  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-40'} pointer-events-none flex flex-col items-center justify-center overflow-hidden rtl`}>
      {/* Radiant glow backdrop */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.7, 0.4], scale: [0.8, 1.1, 1] }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-t from-rose-500/20 via-amber-400/15 to-transparent pointer-events-none"
      />

      {/* Floating particles (Hearts, Stars, Sparkles, Greetings, Clapping) */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            opacity: 0,
            y: 100,
            x: 0,
            scale: 0.3,
            rotate: p.rotation,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [-20, -180 - Math.random() * 100],
            x: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 80],
            scale: [0.3, 1.2, 1, 0.8],
            rotate: [p.rotation, p.rotation + (Math.random() > 0.5 ? 40 : -40)],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
          }}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            bottom: `${p.y * 0.5}%`,
            fontSize: `${p.size}px`,
          }}
          className="select-none drop-shadow-[0_4px_12px_rgba(244,63,94,0.4)]"
        >
          {p.icon}
        </motion.div>
      ))}

      {/* Center Celebration Banner Badge */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className="pointer-events-auto relative mx-4 max-w-lg rounded-[32px] border-4 border-rose-300 bg-white/95 p-6 md:p-8 text-center shadow-[0_10px_40px_rgba(244,63,94,0.35)] backdrop-blur-md"
      >
        {/* Decorative corner stars & hearts */}
        <div className="absolute -top-6 left-6 animate-bounce text-4xl">⭐</div>
        <div className="absolute -top-6 right-6 animate-bounce text-4xl" style={{ animationDelay: '0.2s' }}>💖</div>
        <div className="absolute -bottom-5 left-8 text-3xl">🌸</div>
        <div className="absolute -bottom-5 right-8 text-3xl">✨</div>

        {/* Big pulsing heart, star, greeting & clapping hands group */}
        <div className="flex items-center justify-center gap-2.5 mb-3 flex-wrap">
          <motion.div
            animate={{ scale: [1, 1.2, 1], rotate: [-6, 6, -6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 border-2 border-rose-300 shadow-inner text-rose-500"
          >
            <Heart size={32} fill="#F43F5E" />
          </motion.div>
          <motion.div
            animate={{ scale: [1.2, 1, 1.2], rotate: [6, -6, 6] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 border-2 border-amber-300 shadow-inner text-amber-500"
          >
            <Star size={32} fill="#F59E0B" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 border-2 border-emerald-300 shadow-inner text-emerald-600 text-2xl"
          >
            🤝
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [-10, 10, -10] }}
            transition={{ repeat: Infinity, duration: 0.9 }}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-pink-100 border-2 border-pink-300 shadow-inner text-pink-600 text-2xl"
          >
            👏
          </motion.div>
        </div>

        {/* Applause notice pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-sm font-black mb-2">
          <span>👏</span>
          <span>تصفيق حار للبطل المؤدب!</span>
          <span>👏</span>
        </div>

        {/* Message Title */}
        <h3 className="text-2xl md:text-3xl font-black text-rose-800 drop-shadow-sm leading-snug mb-2">
          {message}
        </h3>

        {/* Sub-message */}
        {subMessage && (
          <p className="text-lg md:text-xl font-bold text-slate-700 bg-rose-50 py-2 px-4 rounded-2xl border border-rose-200 inline-block">
            {subMessage}
          </p>
        )}
      </motion.div>
    </div>
  );
};
