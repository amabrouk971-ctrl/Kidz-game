import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export const BubbleBackground: React.FC = () => {
  const [bubbles, setBubbles] = useState<{ id: number; left: number; size: number; delay: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate random bubbles
    const newBubbles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100, // percentage
      size: Math.random() * 40 + 10, // 10px to 50px
      delay: Math.random() * 5, // 0 to 5s
      duration: Math.random() * 10 + 10, // 10s to 20s
    }));
    setBubbles(newBubbles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 opacity-50" />
      {bubbles.map(bubble => (
        <motion.div
          key={bubble.id}
          className="absolute bottom-[-100px] rounded-full border-2 border-white/40 bg-white/10"
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
          }}
          animate={{
            y: [0, -window.innerHeight - 200],
            x: [0, Math.random() * 50 - 25, 0, Math.random() * 50 - 25, 0]
          }}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            delay: bubble.delay,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};
